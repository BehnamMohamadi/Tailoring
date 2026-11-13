import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { DatabaseSync } from "node:sqlite";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const normalizeDigits = (value) =>
  String(value).replace(/[۰-۹٠-٩]/g, (c) =>
    String(
      "۰۱۲۳۴۵۶۷۸۹".indexOf(c) >= 0
        ? "۰۱۲۳۴۵۶۷۸۹".indexOf(c)
        : "٠١٢٣٤٥٦٧٨٩".indexOf(c),
    ),
  );
const allowedServices = new Set([
  "دوخت زنانه",
  "لباس مجلسی ساده",
  "تعمیرات زنانه",
  "تعمیرات مردانه",
  "سایر",
]);
const allowedStatuses = new Set(["new", "contacted", "closed"]);
const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
};
const cookieToken = (req) => {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("atelier_session="));
  return cookie ? cookie.slice("atelier_session=".length) : "";
};
function normalizePhone(value) {
  let phone = normalizeDigits(value).replace(/[\s()-]/g, "");
  if (phone.startsWith("+98")) phone = "0" + phone.slice(3);
  if (phone.startsWith("0098")) phone = "0" + phone.slice(4);
  return /^09\d{9}$/.test(phone) ? phone : null;
}
export function createApp(options = {}) {
  const production =
    options.production ?? process.env.NODE_ENV === "production";
  const password = options.password ?? process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12)
    throw new Error(
      "ADMIN_PASSWORD must contain at least 12 characters. Run node scripts/setup.mjs first.",
    );
  const databasePath =
    options.databasePath ?? path.join(root, "data", "atelier.sqlite");
  if (databasePath !== ":memory:")
    mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS callback_requests(id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, service TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','closed')), consent_at TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS callback_requests_created ON callback_requests(created_at DESC);
 CREATE INDEX IF NOT EXISTS callback_requests_phone ON callback_requests(phone);
 CREATE TABLE IF NOT EXISTS admin_sessions(token_hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS admin_sessions_expiry ON admin_sessions(expires_at);`);
  const salt = randomBytes(16);
  const passwordHash = scryptSync(password, salt, 64);
  const app = express();
  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'none'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: production ? [] : null,
        },
      },
      strictTransportSecurity: production ? undefined : false,
    }),
  );
  app.use("/api", (_, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use("/api", express.json({ limit: "8kb", strict: true }));
  const publicOrigin = options.publicOrigin ?? process.env.PUBLIC_ORIGIN;
  app.use("/api", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const origin = req.get("Origin");
    const expected = publicOrigin || `${req.protocol}://${req.get("host")}`;
    if (
      (origin && origin !== expected) ||
      req.get("Sec-Fetch-Site") === "cross-site"
    )
      return res
        .status(403)
        .json({ error: "این درخواست از مبدأ مجاز ارسال نشده است." });
    if (
      req.method !== "DELETE" &&
      !(req.get("Content-Type") || "")
        .toLowerCase()
        .startsWith("application/json")
    )
      return res.status(415).json({ error: "فرمت درخواست باید JSON باشد." });
    next();
  });
  const limited = (message) => ({ error: message });
  const submitLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: limited("تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید."),
  });
  const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: limited("تلاش ورود زیاد است. ۱۵ دقیقه دیگر دوباره تلاش کنید."),
  });
  const requireAdmin = (req, res, next) => {
    const token = cookieToken(req);
    if (!/^[a-f0-9]{64}$/.test(token))
      return res
        .status(401)
        .json({ error: "برای دسترسی به درخواست‌ها وارد شوید." });
    const session = db
      .prepare("SELECT csrf,expires_at FROM admin_sessions WHERE token_hash=?")
      .get(tokenHash(token));
    if (!session || session.expires_at <= Date.now()) {
      if (session)
        db.prepare("DELETE FROM admin_sessions WHERE token_hash=?").run(
          tokenHash(token),
        );
      return res.status(401).json({ error: "جلسه ورود شما تمام شده است." });
    }
    req.adminSession = session;
    req.adminToken = token;
    next();
  };
  const requireCsrf = (req, res, next) => {
    if (!safeEqual(req.get("X-CSRF-Token") || "", req.adminSession.csrf))
      return res
        .status(403)
        .json({ error: "اعتبار درخواست مدیریت تأیید نشد. دوباره وارد شوید." });
    next();
  };
  app.get("/api/health", (_, res) => res.json({ ok: true }));
  app.post("/api/requests", submitLimit, (req, res) => {
    const body = req.body ?? {};
    if (typeof body.website === "string" && body.website.trim())
      return res.status(400).json({ error: "درخواست قابل ثبت نیست." });
    if (
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 80
    )
      return res.status(400).json({ error: "نام باید بین ۲ و ۸۰ نویسه باشد." });
    if (typeof body.phone !== "string" || body.phone.length > 30)
      return res.status(400).json({ error: "شماره موبایل معتبر وارد کنید." });
    const phone = normalizePhone(body.phone);
    if (!phone)
      return res
        .status(400)
        .json({ error: "شماره موبایل ایران را با ۰۹ وارد کنید." });
    if (!allowedServices.has(body.service))
      return res.status(400).json({ error: "موضوع درخواست را انتخاب کنید." });
    if (
      body.note != null &&
      (typeof body.note !== "string" || body.note.length > 1000)
    )
      return res
        .status(400)
        .json({ error: "توضیحات باید حداکثر ۱۰۰۰ نویسه باشد." });
    if (body.consent !== true)
      return res
        .status(400)
        .json({ error: "برای تماس، رضایت ثبت اطلاعات لازم است." });
    const now = new Date().toISOString();
    const existing = db
      .prepare(
        "SELECT id FROM callback_requests WHERE phone=? AND service=? AND created_at>?",
      )
      .get(phone, body.service, new Date(Date.now() - 60000).toISOString());
    if (existing) return res.status(200).json({ ok: true });
    db.prepare(
      "INSERT INTO callback_requests(id,name,phone,service,note,status,consent_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",
    ).run(
      randomUUID(),
      body.name.trim(),
      phone,
      body.service,
      (body.note || "").trim(),
      "new",
      now,
      now,
      now,
    );
    return res.status(201).json({ ok: true });
  });
  app.post("/api/admin/login", loginLimit, (req, res) => {
    const entered = req.body?.password;
    if (typeof entered !== "string" || entered.length > 200)
      return res.status(401).json({ error: "رمز ورود صحیح نیست." });
    const supplied = scryptSync(entered, salt, 64);
    if (!timingSafeEqual(supplied, passwordHash))
      return res.status(401).json({ error: "رمز ورود صحیح نیست." });
    db.prepare("DELETE FROM admin_sessions WHERE expires_at<=?").run(
      Date.now(),
    );
    const old = cookieToken(req);
    if (old)
      db.prepare("DELETE FROM admin_sessions WHERE token_hash=?").run(
        tokenHash(old),
      );
    const token = randomBytes(32).toString("hex");
    const csrf = randomBytes(24).toString("hex");
    db.prepare(
      "INSERT INTO admin_sessions(token_hash,csrf,expires_at) VALUES(?,?,?)",
    ).run(tokenHash(token), csrf, Date.now() + 8 * 60 * 60 * 1000);
    res.cookie("atelier_session", token, {
      httpOnly: true,
      secure: production,
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/api/admin",
    });
    res.json({ ok: true, csrf });
  });
  app.get("/api/admin/session", requireAdmin, (req, res) =>
    res.json({ csrf: req.adminSession.csrf }),
  );
  app.post("/api/admin/logout", requireAdmin, requireCsrf, (req, res) => {
    db.prepare("DELETE FROM admin_sessions WHERE token_hash=?").run(
      tokenHash(req.adminToken),
    );
    res.clearCookie("atelier_session", {
      path: "/api/admin",
      httpOnly: true,
      sameSite: "strict",
      secure: production,
    });
    res.json({ ok: true });
  });
  app.get("/api/admin/requests", requireAdmin, (req, res) => {
    const offset = Number(req.query.offset || 0);
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
      return res.status(400).json({ error: "شماره صفحه معتبر نیست." });
    const requests = db
      .prepare(
        "SELECT id,name,phone,service,note,status,created_at,updated_at FROM callback_requests ORDER BY created_at DESC,id DESC LIMIT 101 OFFSET ?",
      )
      .all(offset);
    res.json({
      requests: requests.slice(0, 100),
      hasMore: requests.length > 100,
    });
  });
  app.patch(
    "/api/admin/requests/:id",
    requireAdmin,
    requireCsrf,
    (req, res) => {
      if (!allowedStatuses.has(req.body?.status))
        return res.status(400).json({ error: "وضعیت معتبر نیست." });
      const result = db
        .prepare(
          "UPDATE callback_requests SET status=?,updated_at=? WHERE id=?",
        )
        .run(req.body.status, new Date().toISOString(), req.params.id);
      if (!result.changes)
        return res.status(404).json({ error: "درخواست پیدا نشد." });
      res.json({ ok: true });
    },
  );
  app.delete(
    "/api/admin/requests/:id",
    requireAdmin,
    requireCsrf,
    (req, res) => {
      const result = db
        .prepare("DELETE FROM callback_requests WHERE id=?")
        .run(req.params.id);
      if (!result.changes)
        return res.status(404).json({ error: "درخواست پیدا نشد." });
      res.json({ ok: true });
    },
  );
  app.get("/api/admin/export", requireAdmin, (_, res) => {
    const rows = db
      .prepare(
        "SELECT name,phone,service,note,status,created_at FROM callback_requests ORDER BY created_at DESC",
      )
      .all();
    const cell = (value) => {
      let text = String(value ?? "");
      if (/^[\s]*[=+@\-\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const csv =
      "\uFEFF" +
      [
        ["نام", "شماره موبایل", "موضوع", "توضیح", "وضعیت", "زمان درخواست"],
        ...rows.map((r) => [
          r.name,
          r.phone,
          r.service,
          r.note,
          r.status,
          r.created_at,
        ]),
      ]
        .map((row) => row.map(cell).join(","))
        .join("\r\n");
    res
      .set({
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="callback-requests.csv"',
      })
      .send(csv);
  });
  app.use("/api", (_, res) =>
    res.status(404).json({ error: "این مسیر وجود ندارد." }),
  );
  app.use(
    express.static(path.join(root, "public"), {
      maxAge: production ? "1h" : 0,
      etag: true,
      dotfiles: "deny",
      index: "index.html",
    }),
  );
  app.use((req, res) => res.status(404).type("text").send("صفحه پیدا نشد."));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "حجم درخواست بیش از حد مجاز است." });
    if (error instanceof SyntaxError && error.status === 400)
      return res.status(400).json({ error: "فرمت اطلاعات درخواست صحیح نیست." });
    console.error("Request failed:", error.code || error.name);
    res
      .status(500)
      .json({ error: "ثبت اطلاعات انجام نشد. کمی بعد دوباره تلاش کنید." });
  });
  return { app, db, close: () => db.close() };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { app } = createApp();
  const port = Number(process.env.PORT || 3000);
  const host =
    process.env.HOST ||
    (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
  const server = app.listen(port, host, () =>
    console.log(
      `Atelier ready: http://${host}:${port}\nAdmin: http://${host}:${port}/admin.html#/admin`,
    ),
  );
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? "Port is busy. Choose another PORT in .env."
        : error.message,
    );
    process.exitCode = 1;
  });
}
