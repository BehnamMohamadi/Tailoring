import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "../server.js";

test("callback flow persists data and protects admin access", async (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "atelier-test-"));
  const databasePath = path.join(dir, "test.sqlite");
  const password = "test-password-long-2941";
  const instance = createApp({ databasePath, password });
  const server = instance.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (url, method = "GET", body, headers = {}) =>
    fetch(base + url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  let cookie;
  let csrf;
  let id;
  try {
    await t.test(
      "site serves raw HTML and local CSS, JS, font and images",
      async () => {
        const html = await call("/");
        assert.equal(html.status, 200);
        const markup = await html.text();
        assert.match(markup, /lang="fa"/);
        assert.match(markup, /bita\.js/);
        assert.doesNotMatch(markup, /\son(?:click|submit)=/);
        for (const asset of [
          "/app.js",
          "/style.css",
          "/nakh.js",
          "/nakh.css",
          "/bita.js",
          "/bita.css",
          "/models-data.js",
          "/admin.html",
          "/assets/vazirmatn.woff2",
          "/assets/suit.jpg",
        ]) {
          const response = await call(asset);
          assert.equal(response.status, 200);
        }
      },
    );
    await t.test(
      "anonymous users cannot list, export, update or delete personal data",
      async () => {
        for (const [url, method, body] of [
          ["/api/admin/requests", "GET"],
          ["/api/admin/export", "GET"],
          ["/api/admin/requests/missing", "PATCH", { status: "closed" }],
          ["/api/admin/requests/missing", "DELETE"],
        ]) {
          assert.equal((await call(url, method, body)).status, 401);
        }
      },
    );
    await t.test(
      "server rejects invalid phones, missing consent and unexpected origins",
      async () => {
        const body = {
          name: "تست مشتری",
          phone: "09121234567",
          service: "دوخت زنانه",
          consent: true,
        };
        assert.equal(
          (await call("/api/requests", "POST", { ...body, phone: "123" }))
            .status,
          400,
        );
        assert.equal(
          (await call("/api/requests", "POST", { ...body, consent: false }))
            .status,
          400,
        );
        assert.equal(
          (
            await call("/api/requests", "POST", body, {
              Origin: "https://untrusted.example",
            })
          ).status,
          403,
        );
      },
    );
    await t.test(
      "Persian numbers and apostrophes save safely; duplicate submit is idempotent",
      async () => {
        const body = {
          name: "تست ' مشتری",
          phone: "۰۹۱۲۱۲۳۴۵۶۷",
          service: "دوخت زنانه",
          note: "=1+1",
          consent: true,
        };
        assert.equal((await call("/api/requests", "POST", body)).status, 201);
        assert.equal((await call("/api/requests", "POST", body)).status, 200);
      },
    );
    await t.test(
      "password login returns HttpOnly cookie and CSRF token",
      async () => {
        assert.equal(
          (await call("/api/admin/login", "POST", { password: "bad-password" }))
            .status,
          401,
        );
        const response = await call("/api/admin/login", "POST", { password });
        assert.equal(response.status, 200);
        const rawCookie = response.headers.get("set-cookie");
        assert.match(rawCookie, /HttpOnly/);
        assert.match(rawCookie, /SameSite=Strict/);
        cookie = rawCookie.split(";")[0];
        csrf = (await response.json()).csrf;
        assert.ok(csrf);
      },
    );
    await t.test("admin sees one normalized saved request", async () => {
      const response = await call("/api/admin/requests", "GET", undefined, {
        Cookie: cookie,
      });
      assert.equal(response.status, 200);
      const data = await response.json();
      assert.equal(data.requests.length, 1);
      assert.equal(data.requests[0].phone, "09121234567");
      assert.equal(data.requests[0].name, "تست ' مشتری");
      id = data.requests[0].id;
      assert.equal(data.requests[0].status, "new");
    });
    await t.test("CSRF required and status changes persist", async () => {
      assert.equal(
        (
          await call(
            `/api/admin/requests/${id}`,
            "PATCH",
            { status: "contacted" },
            { Cookie: cookie },
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await call(
            `/api/admin/requests/${id}`,
            "PATCH",
            { status: "contacted" },
            { Cookie: cookie, "X-CSRF-Token": csrf },
          )
        ).status,
        200,
      );
      const response = await call("/api/admin/requests", "GET", undefined, {
        Cookie: cookie,
      });
      assert.equal((await response.json()).requests[0].status, "contacted");
    });
    await t.test(
      "CSV is private and neutralizes spreadsheet formula injection",
      async () => {
        const response = await call("/api/admin/export", "GET", undefined, {
          Cookie: cookie,
        });
        assert.equal(response.status, 200);
        assert.match(await response.text(), /'=1\+1/);
      },
    );
    await t.test("database survives another app instance", async () => {
      const other = createApp({ databasePath, password });
      assert.equal(
        other.db.prepare("SELECT count(*) AS n FROM callback_requests").get().n,
        1,
      );
      other.close();
    });
    await t.test(
      "delete and logout require authorization and clear records/session",
      async () => {
        assert.equal(
          (
            await call(`/api/admin/requests/${id}`, "DELETE", undefined, {
              Cookie: cookie,
              "X-CSRF-Token": csrf,
              "Content-Type": "application/json",
            })
          ).status,
          200,
        );
        const list = await call("/api/admin/requests", "GET", undefined, {
          Cookie: cookie,
        });
        assert.equal((await list.json()).requests.length, 0);
        assert.equal(
          (
            await call("/api/admin/logout", "POST", undefined, {
              Cookie: cookie,
              "X-CSRF-Token": csrf,
              "Content-Type": "application/json",
            })
          ).status,
          200,
        );
        assert.equal(
          (
            await call("/api/admin/requests", "GET", undefined, {
              Cookie: cookie,
            })
          ).status,
          401,
        );
      },
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    instance.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
