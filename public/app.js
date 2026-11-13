const main = document.querySelector("#main");
const products = [
  {
    id: "suit",
    name: "کت‌وشلوار زنانه",
    category: "رسمی",
    photo: "suit",
    fabric: "پارچه فاستونی سبک",
    desc: "برش ساده و خوش‌فرم برای روزهای کاری و قرارهای رسمی؛ با انتخاب قد، مدل یقه و جزئیات متناسب با سلیقه شما.",
  },
  {
    id: "blouse",
    name: "شومیز روزمره",
    category: "روزمره",
    photo: "blouse",
    fabric: "پنبه و پارچه‌های سبک",
    desc: "یک شومیز ساده، راحت و کاربردی؛ با امکان انتخاب مدل آستین، یقه و قد دلخواه.",
  },
  {
    id: "dress",
    name: "پیراهن ساده مهمانی",
    category: "مجلسی ساده",
    photo: "dress",
    fabric: "کرپ سبک",
    desc: "پیراهنی ساده و خوش‌دوخت برای مهمانی؛ با تمرکز بر راحتی، برش تمیز و تن‌خور مناسب، بدون تزئینات پیچیده.",
  },
  {
    id: "coat",
    name: "مانتو و پالتوی ساده",
    category: "مانتو و پالتو",
    photo: "coat",
    fabric: "پارچه متناسب با فصل",
    desc: "مدل‌های ساده و کاربردی برای استفاده روزمره؛ با قد، جیب و جزئیات انتخابی شما.",
  },
];
const services = [
  "دوخت زنانه",
  "لباس مجلسی ساده",
  "تعمیرات زنانه",
  "تعمیرات مردانه",
  "سایر",
];
const icon = '<span aria-hidden="true">↖</span>';
const photo = (name, label, extra = "") =>
  `<div class="photo ${name} ${extra}" role="img" aria-label="${label}"></div>`;
const cta = (text = "از یک گفت‌وگو شروع کنیم.") =>
  `<section class="contact-band"><div class="wrap"><div><h2>${text}</h2><p>نام و شماره‌ات را بگذار؛ برای صحبت درباره لباست با تو تماس می‌گیریم.</p></div><a class="button" href="#/contact">درخواست تماس ${icon}</a></div></section>`;
const process = () =>
  `<div class="steps"><article class="step"><b>۰۱</b><h3>درباره لباست بگو</h3><p>ایده، نیاز و مدل موردنظرت را با هم بررسی می‌کنیم.</p></article><article class="step"><b>۰۲</b><h3>با هم انتخاب کنیم</h3><p>درباره پارچه، جزئیات دوخت یا روش تعمیر صحبت می‌کنیم.</p></article><article class="step"><b>۰۳</b><h3>برای مراجعه هماهنگ کنیم</h3><p>زمان مناسب اندازه‌گیری یا پرو را با هم تعیین می‌کنیم.</p></article></div>`;
const card = (p) =>
  `<article class="portfolio-card" data-category="${p.category}"><a href="#/work/${p.id}">${photo(p.photo, p.name)}<div class="item-info">${p.name}<span>${p.category} ↖</span></div></a></article>`;
const home = () => renderEditorialHome({ photo, products, form });
const tailoring = () =>
  `<div class="wrap"><div class="page-top"><p class="eyebrow">دوخت زنانه</p></div><section class="page-hero"><div><h1>لباسی برای<br><span class="underline">زندگی تو.</span></h1><p>شومیز، مانتو، کت‌وشلوار و پیراهن‌های ساده مهمانی؛ با برشی متناسب با اندام و جزئیاتی که خودت انتخاب می‌کنی.</p><ul class="service-list"><li>شومیز و لباس روزمره <span>راحت و کاربردی</span></li><li>مانتو و پالتو <span>ساده و متناسب با فصل</span></li><li>کت‌وشلوار زنانه <span>برش تمیز، تن‌خور دقیق</span></li><li>پیراهن مهمانی ساده <span>بدون مدل‌های پیچیده و عروس</span></li></ul><a class="button" href="#/contact?service=دوخت%20زنانه">برای دوخت صحبت کنیم ${icon}</a></div>${photo("blouse", "شومیز پنبه‌ای روشن با دوخت ساده")}</section><section class="section process"><p class="eyebrow">فرایند دوخت اختصاصی</p><h2>انتخاب‌های کوچک،<br>یک لباس مخصوص تو.</h2>${process()}</section><section class="section"><div class="section-head"><h2>کدام به سلیقه‌ات نزدیک‌تر است؟</h2><a href="#/portfolio" class="text-link">دیدن همه مدل‌ها ${icon}</a></div><div class="gallery-editorial">${products
    .slice(0, 3)
    .map(
      (p) =>
        `<article><a href="#/work/${p.id}">${photo(p.photo, p.name)}<div class="item-info">${p.name}</div></a></article>`,
    )
    .join(
      "",
    )}</div><p class="gallery-note">این تصاویر، ایده‌های نمایشی برای شروع مشاوره‌اند.</p></section></div>${cta("ایده‌ات را با ما در میان بگذار.")}`;
const portfolio = () =>
  `<div class="wrap"><header class="page-top"><p class="eyebrow">گالری ایده‌ها</p><h1>جزئیات را ببین.</h1><p>مدل‌های ساده برای روزمره، کار و مهمانی. این تصاویر نمایشی‌اند؛ نمونه‌کارهای واقعی آتلیه بعداً جایگزین می‌شوند.</p></header><div class="filters" aria-label="فیلتر مدل‌ها">${["همه", "روزمره", "رسمی", "مجلسی ساده", "مانتو و پالتو"].map((x, i) => `<button data-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join("")}</div><section class="portfolio-grid" aria-label="مدل‌های دوخت">${products.map(card).join("")}</section></div>${cta("مدل موردعلاقه‌ات را پیدا کردی؟")}`;
const work = (id) => {
  const p = products.find((p) => p.id === id);
  if (!p) return notFound();
  return `<div class="wrap section"><nav class="breadcrumbs" aria-label="مسیر صفحه"><a href="#/portfolio">گالری مدل‌ها</a><span>/</span><span>${p.name}</span></nav><section class="detail-grid"><div class="detail-copy"><p class="eyebrow">${p.category}</p><h1>${p.name}</h1><p>${p.desc}</p><dl class="detail-facts"><div><dt>نوع لباس</dt><dd>${p.name}</dd></div><div><dt>پیشنهاد پارچه</dt><dd>${p.fabric}</dd></div><div><dt>انتخاب جزئیات</dt><dd>متناسب با سلیقه و اندام شما</dd></div></dl><a class="button" href="#/contact?service=${encodeURIComponent(p.category === "مجلسی ساده" ? "لباس مجلسی ساده" : "دوخت زنانه")}">درباره این مدل صحبت کنیم ${icon}</a><p class="note" style="margin-top:15px">تصویر نمایشی است. مدل و امکان دوخت پس از مشاوره مشخص می‌شود.</p>${photo("craft", "جزئیات کار روی کت زنانه")}</div>${photo(p.photo, p.name, "detail-photo")}</section></div>${cta("از همین ایده شروع کنیم.")}`;
};
const repairs = () =>
  `<div class="wrap"><div class="page-top"><p class="eyebrow">تعمیرات تخصصی زنانه و مردانه</p></div><section class="page-hero"><div><h1>لباس محبوبت را<br><span class="underline">دوباره بپوش.</span></h1><p>کوتاهی، اصلاح اندازه و بازسازی جزئیات؛ درباره تغییری که برای لباست می‌خواهی با هم صحبت می‌کنیم.</p><div class="chips"><span class="chip">لباس زنانه</span><span class="chip">لباس مردانه</span></div><a class="button" href="#/repair-request">درخواست تماس برای تعمیر ${icon}</a></div>${photo("hem", "تعمیر و کوتاهی شلوار پارچه‌ای")}</section><section class="section process"><div class="section-head"><h2>چه تغییری نیاز داری؟</h2><span class="note">روش کار پس از بررسی لباس پیشنهاد می‌شود.</span></div><div class="steps"><article class="step"><b>۰۱</b><h3>اصلاح سایز و تن‌خور</h3><p>اصلاح کمر، آستین، قد و فرم لباس با توجه به ساختار آن.</p></article><article class="step"><b>۰۲</b><h3>کوتاهی و تعویض زیپ</h3><p>کوتاهی شلوار و لباس، تعویض زیپ و اصلاح جزئیات.</p></article><article class="step"><b>۰۳</b><h3>ترمیم و بازسازی</h3><p>بررسی پارگی، آستر و قسمت‌های آسیب‌دیده لباس.</p></article></div></section><section class="section"><p class="eyebrow">سؤال‌های رایج</p><h2>قبل از سپردن لباس</h2><div class="faq">${[
    [
      "هزینه تعمیر چطور مشخص می‌شود؟",
      "بعد از بررسی جنس، مدل لباس و نوع تغییر، درباره هزینه با شما صحبت می‌کنیم.",
    ],
    [
      "لباس مردانه هم تعمیر می‌کنید؟",
      "بله؛ خدمات تعمیر و اصلاح تن‌خور برای لباس‌های زنانه و مردانه ارائه می‌شود. دوخت اختصاصی این سایت مربوط به لباس زنانه است.",
    ],
    [
      "چطور برای مراجعه هماهنگ کنم؟",
      "نام و شماره خود را در فرم بگذارید. با شما تماس می‌گیریم و برای بررسی لباس و زمان مراجعه هماهنگ می‌کنیم.",
    ],
    [
      "آیا هر لباسی قابل تغییر سایز است؟",
      "امکان تغییر به جای دوخت، جنس و ساختار لباس بستگی دارد و پس از بررسی مشخص می‌شود.",
    ],
  ]
    .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
    .join(
      "",
    )}</div></section></div>${cta("شماره‌ات را بگذار؛ با هم بررسی کنیم.")}`;
const form = (selected = "") =>
  `<form class="callback-form"><div class="form-row"><div class="field"><label for="customer-name">نام و نام خانوادگی</label><input id="customer-name" name="name" autocomplete="name" minlength="2" maxlength="80" required placeholder="چطور صدایتان کنیم؟"></div><div class="field"><label for="customer-phone">شماره موبایل</label><input class="phone-input" id="customer-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="18" required placeholder="۰۹۱۲۱۲۳۴۵۶۷" aria-describedby="phone-help"><p class="field-help" id="phone-help">شماره‌ای که بتوانیم با شما تماس بگیریم.</p></div></div><div class="field"><label for="customer-service">درباره چه موضوعی تماس بگیریم؟</label><select name="service" id="customer-service" required><option value="">انتخاب موضوع</option>${services.map((s) => `<option ${s === selected ? "selected" : ""}>${s}</option>`).join("")}</select></div><div class="field"><label for="customer-note">توضیح کوتاه <span class="note">(اختیاری)</span></label><textarea id="customer-note" name="note" maxlength="1000" placeholder="مثلاً کوتاهی شلوار، دوخت مانتو یا یک شومیز ساده…"></textarea></div><div class="honeypot" aria-hidden="true"><label>وب‌سایت<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="consent"><input type="checkbox" name="consent" required><span>با ذخیره نام و شماره‌ام برای تماس درباره این درخواست موافقم. <a class="text-link" href="#/privacy">حریم خصوصی</a></span></label><button class="button" type="submit">شماره‌ام را ثبت کن؛ با من تماس بگیرید ${icon}</button><p class="field-help">این فرم درخواست تماس است؛ وقت مراجعه یا سفارشی را قطعی نمی‌کند.</p><div class="form-status" role="status" aria-live="polite"></div></form>`;
const contact = (repair = false, selected = "") =>
  `<div class="wrap form-layout"><section><p class="eyebrow">${repair ? "تعمیرات زنانه و مردانه" : "درخواست تماس"}</p><h1>${repair ? "لباست چه تغییری<br>نیاز دارد؟" : "شماره‌ات را بگذار،<br>با تو تماس می‌گیریم."}</h1><p class="form-intro">${repair ? "موضوع تعمیر را بنویس و شماره‌ات را بگذار. برای بررسی جزئیات و هماهنگی مراجعه با تو تماس می‌گیریم." : "برای مشاوره دوخت یا تعمیر لباس، نام و شماره‌ات را ثبت کن. ادامه صحبت را تلفنی با هم پیش می‌بریم."}</p>${form(selected || (repair ? "تعمیرات زنانه" : ""))}</section><aside class="form-aside">${photo(repair ? "hem" : "craft", repair ? "دوخت لبه شلوار" : "کار روی کت زنانه در آتلیه")}<blockquote>یک گفت‌وگوی کوتاه،<br>شروع یک لباس خوش‌دوخت.</blockquote><p class="note">اطلاعات تماس شما فقط برای پیگیری همین درخواست در اختیار مدیریت آتلیه قرار می‌گیرد.</p></aside></div>`;
const about = () =>
  `<div class="wrap section"><section class="about-grid"><div><p class="eyebrow">درباره آتلیه</p><h1>دقت،<br>از اولین کوک.</h1><p>اینجا درباره لباسی صحبت می‌کنیم که با زندگی تو هماهنگ باشد؛ راحت، کاربردی و درست اندازه.</p><p>تمرکز ما دوخت زنانه با مدل‌های ساده و خوش‌فرم است: شومیز، مانتو، کت‌وشلوار و پیراهن مهمانی ساده. در کنار آن، لباس‌های زنانه و مردانه را برای تعمیر و اصلاح تن‌خور بررسی می‌کنیم.</p><a class="text-link" href="#/contact">بیایید درباره لباست صحبت کنیم ${icon}</a></div>${photo("craft", "کار خیاط روی یقه کت زنانه")}</section><section class="section">${process()}<div class="notice">تصاویر این سایت برای نمایش سبک طراحی و ایده‌های دوخت تولید شده‌اند. تصاویر و اطلاعات واقعی آتلیه پیش از انتشار عمومی جایگزین می‌شوند.</div></section></div>${cta()}`;
const privacy = () =>
  `<article class="wrap prose"><p class="eyebrow">حریم خصوصی</p><h1>اطلاعات شما، برای تماس با شما.</h1><p>با ثبت فرم، نام، شماره موبایل، موضوع درخواست و توضیح اختیاری شما در دیتابیس سایت ذخیره می‌شود. این اطلاعات عمومی نیست و تنها مدیریت آتلیه از پنل رمزدار به آن دسترسی دارد.</p><h2>چرا این اطلاعات را می‌گیریم؟</h2><p>فقط برای تماس درباره درخواست شما، بررسی خدمات و هماهنگی مراجعه. ثبت فرم به معنی رزرو قطعی، خرید یا پرداخت نیست.</p><h2>حذف یا اصلاح درخواست</h2><p>هنگام تماس آتلیه می‌توانید درخواست حذف یا اصلاح اطلاعات را مطرح کنید. برای ثبت درخواست حذف نیز می‌توانید فرم تماس را با همان شماره تکمیل کنید.</p><h2>فایل و پرداخت</h2><p>در این نسخه فایل یا عکس دریافت نمی‌کنیم و پرداخت اینترنتی نداریم. اطلاعات کارت بانکی، رمز یا مدارک شخصی را در توضیحات ننویسید.</p><h2>ورود مدیریت</h2><p>کوکی ضروری فقط برای جلسه ورود مدیریت استفاده می‌شود. فرم مشتری نیازی به حساب کاربری ندارد.</p><a class="button outline" href="#/contact">بازگشت به فرم تماس</a></article>`;
const notFound = () =>
  `<div class="wrap empty-state"><p class="eyebrow">۴۰۴</p><h1>این صفحه پیدا نشد.</h1><a class="button" href="#/">برگشت به خانه</a></div>`;
let adminCsrf = "";
let adminData = [];
function adminLogin() {
  return `<section class="admin-login"><p class="eyebrow">پنل مزون بیتا</p><h1>مدیریت درخواست‌ها</h1><p class="note">برای دیدن شماره‌ها و پیگیری تماس‌ها وارد شوید.</p><form id="admin-login"><div class="field"><label for="admin-password">رمز مدیریت</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required maxlength="200"></div><button class="button" type="submit">ورود به مدیریت ${icon}</button><div class="form-status" role="status"></div></form></section>`;
}
function escapeHTML(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
const statusNames = {
  new: "در انتظار تماس",
  contacted: "تماس گرفته شد",
  closed: "بسته شده",
};
function adminView() {
  return `<section class="wrap section"><div class="admin-toolbar"><div><p class="eyebrow">پنل مزون بیتا</p><h1 style="font-size:40px;margin-bottom:5px">درخواست‌های تماس</h1><p class="admin-summary">شماره‌ها خصوصی‌اند؛ برای تماس روی شماره کلیک کنید.</p></div><div class="admin-controls"><button class="button small outline" id="admin-refresh">به‌روزرسانی</button><button class="button small outline" id="admin-export">خروجی CSV</button><button class="button small outline" id="admin-logout">خروج</button></div></div><div class="admin-toolbar"><div class="admin-controls"><input id="admin-search" type="search" placeholder="جست‌وجوی نام یا شماره" aria-label="جست‌وجوی درخواست‌ها"><select id="admin-filter" aria-label="فیلتر وضعیت"><option value="all">همه وضعیت‌ها</option>${Object.entries(
    statusNames,
  )
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join(
      "",
    )}</select></div><p id="admin-count" class="note"></p></div><div id="admin-message" role="status" class="form-status"></div><div class="table-wrap"><table><thead><tr><th>نام و شماره</th><th>موضوع و توضیحات</th><th>تاریخ درخواست</th><th>وضعیت</th><th>حذف</th></tr></thead><tbody id="admin-rows"></tbody></table><p id="admin-empty" class="empty-state" hidden>درخواستی با این مشخصات پیدا نشد.</p></div><div class="actions"><button class="button outline" id="admin-more" hidden>نمایش درخواست‌های بیشتر</button></div></section>`;
}
async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("پاسخ سرور قابل خواندن نیست. دوباره تلاش کنید.");
  }
  if (!response.ok) {
    const e = new Error(data.error || "درخواست انجام نشد. دوباره تلاش کنید.");
    e.status = response.status;
    throw e;
  }
  return data;
}
function status(element, message, type = "error") {
  element.textContent = message;
  element.className = `form-status ${type}`;
}
const normalizeDigits = (value) =>
  value.replace(/[۰-۹٠-٩]/g, (c) =>
    String(
      "۰۱۲۳۴۵۶۷۸۹".indexOf(c) >= 0
        ? "۰۱۲۳۴۵۶۷۸۹".indexOf(c)
        : "٠١٢٣٤٥٦٧٨٩".indexOf(c),
    ),
  );
function bindForm() {
  const formEl = main.querySelector(".callback-form");
  if (!formEl) return;
  const phone = formEl.elements.phone;
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const number = normalizeDigits(phone.value).replace(/[\s()-]/g, "");
    if (!/^(09\d{9}|\+989\d{9}|00989\d{9})$/.test(number)) {
      phone.setCustomValidity(
        "یک شماره موبایل معتبر ایران وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷.",
      );
      phone.reportValidity();
      return;
    }
    const button = formEl.querySelector("button[type=submit]");
    const message = formEl.querySelector(".form-status");
    button.disabled = true;
    status(message, "در حال ثبت درخواست…", "");
    try {
      const values = Object.fromEntries(new FormData(formEl));
      await api("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          phone: number,
          consent: formEl.elements.consent.checked,
        }),
      });
      formEl.reset();
      status(
        message,
        "درخواستت ثبت شد. برای صحبت درباره لباست با همین شماره با تو تماس می‌گیریم.",
        "success",
      );
    } catch (error) {
      status(message, error.message);
    } finally {
      button.disabled = false;
    }
  });
}
async function renderAdmin() {
  main.innerHTML = adminLogin();
  try {
    const session = await api("/api/admin/session");
    adminCsrf = session.csrf;
    await loadAdmin();
  } catch (error) {
    if (error.status !== 401)
      status(main.querySelector(".form-status"), error.message);
    bindAdminLogin();
  }
}
function bindAdminLogin() {
  main.querySelector("#admin-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const button = formEl.querySelector("button");
    button.disabled = true;
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: formEl.elements.password.value }),
      });
      adminCsrf = data.csrf;
      await loadAdmin();
    } catch (error) {
      status(formEl.querySelector(".form-status"), error.message);
      button.disabled = false;
    }
  });
}
let hasMore = false;
async function loadAdmin(append = false) {
  const data = await api(
    `/api/admin/requests?offset=${append ? adminData.length : 0}`,
  );
  adminData = append ? [...adminData, ...data.requests] : data.requests;
  hasMore = data.hasMore;
  if (!append) {
    main.innerHTML = adminView();
    bindAdminControls();
  }
  renderRows();
}
function renderRows() {
  const query = main.querySelector("#admin-search").value.trim();
  const filter = main.querySelector("#admin-filter").value;
  const rows = adminData.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      `${r.name} ${r.phone}`.includes(query),
  );
  main.querySelector("#admin-rows").innerHTML = rows
    .map(
      (r) =>
        `<tr><td>${escapeHTML(r.name)}<br><a class="text-link" dir="ltr" href="tel:${escapeHTML(r.phone)}">${escapeHTML(r.phone)}</a></td><td>${escapeHTML(r.service)}<small>${escapeHTML(r.note)}</small></td><td>${new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tehran" }).format(new Date(r.created_at))}</td><td><select data-status-id="${escapeHTML(r.id)}" aria-label="وضعیت درخواست ${escapeHTML(r.name)}">${Object.entries(
          statusNames,
        )
          .map(
            ([k, v]) =>
              `<option value="${k}" ${r.status === k ? "selected" : ""}>${v}</option>`,
          )
          .join(
            "",
          )}</select></td><td><button class="chip" data-delete-id="${escapeHTML(r.id)}" aria-label="حذف درخواست ${escapeHTML(r.name)}">حذف</button></td></tr>`,
    )
    .join("");
  main.querySelector("#admin-empty").hidden = rows.length > 0;
  main.querySelector("#admin-count").textContent =
    `${rows.length.toLocaleString("fa-IR")} درخواست نمایش داده می‌شود`;
  main.querySelector("#admin-more").hidden = !hasMore;
}
function bindAdminControls() {
  main.querySelector("#admin-search").addEventListener("input", renderRows);
  main.querySelector("#admin-filter").addEventListener("change", renderRows);
  main.querySelector("#admin-refresh").onclick = () =>
    loadAdmin().catch(adminError);
  main.querySelector("#admin-more").onclick = () =>
    loadAdmin(true).catch(adminError);
  main.querySelector("#admin-logout").onclick = async () => {
    try {
      await api("/api/admin/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": adminCsrf },
      });
      adminCsrf = "";
      adminData = [];
      main.innerHTML = adminLogin();
      bindAdminLogin();
    } catch (error) {
      adminError(error);
    }
  };
  main.querySelector("#admin-export").onclick = async () => {
    try {
      const response = await fetch("/api/admin/export", {
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("دریافت فایل انجام نشد.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "callback-requests.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      adminError(error);
    }
  };
  main.querySelector("#admin-rows").addEventListener("change", async (e) => {
    const id = e.target.dataset.statusId;
    if (!id) return;
    const previous = adminData.find((r) => r.id === id).status;
    try {
      await api(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "X-CSRF-Token": adminCsrf },
        body: JSON.stringify({ status: e.target.value }),
      });
      adminData.find((r) => r.id === id).status = e.target.value;
      renderRows();
      status(
        main.querySelector("#admin-message"),
        "وضعیت درخواست ذخیره شد.",
        "success",
      );
    } catch (error) {
      e.target.value = previous;
      adminError(error);
    }
  });
  main.querySelector("#admin-rows").addEventListener("click", async (e) => {
    const button = e.target.closest("[data-delete-id]");
    if (!button) return;
    if (!confirm("این درخواست و شماره تماس برای همیشه حذف شود؟")) return;
    try {
      await api(`/api/admin/requests/${button.dataset.deleteId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": adminCsrf },
      });
      adminData = adminData.filter((r) => r.id !== button.dataset.deleteId);
      renderRows();
      status(
        main.querySelector("#admin-message"),
        "درخواست حذف شد.",
        "success",
      );
    } catch (error) {
      adminError(error);
    }
  });
}
function adminError(error) {
  if (error.status === 401) {
    adminCsrf = "";
    adminData = [];
    main.innerHTML = adminLogin();
    bindAdminLogin();
    status(
      main.querySelector(".form-status"),
      "جلسه شما تمام شده؛ دوباره وارد شوید.",
    );
    return;
  }
  const el = main.querySelector("#admin-message");
  if (el) status(el, error.message);
}
function route() {
  const [path, search = ""] = (location.hash.slice(1) || "/").split("?");
  const previous = main.dataset.route;
  main.dataset.route = path;
  document.querySelector("#navigation").classList.remove("open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  document
    .querySelector(".menu-toggle")
    .setAttribute("aria-label", "باز کردن منو");
  document.querySelectorAll(".header nav a").forEach((a) => {
    if (a.getAttribute("href") === `#${path}`)
      a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const titles = {
    "/": "خوش‌دوخت، درست اندازه",
    "/tailoring": "دوخت زنانه و مجلسی ساده",
    "/portfolio": "گالری مدل‌ها",
    "/repairs": "تعمیرات زنانه و مردانه",
    "/repair-request": "درخواست تعمیر",
    "/contact": "درخواست تماس",
    "/about": "درباره آتلیه",
    "/privacy": "حریم خصوصی",
    "/admin": "مدیریت درخواست‌ها",
  };
  document.title = `مزون بیتا — ${titles[path] || (path.startsWith("/work/") ? "جزئیات مدل" : "صفحه پیدا نشد")}`;
  if (path === "/admin") {
    renderAdmin().catch(adminError);
  } else {
    const selected = new URLSearchParams(search).get("service") || "";
    const pages = {
      "/": home,
      "/tailoring": tailoring,
      "/portfolio": portfolio,
      "/repairs": repairs,
      "/repair-request": () => contact(true),
      "/contact": () => contact(false, selected),
      "/about": about,
      "/privacy": privacy,
    };
    main.innerHTML = path.startsWith("/work/")
      ? work(path.split("/")[2])
      : (pages[path] || notFound)();
    bindForm();
    main.querySelectorAll("[data-filter]").forEach((button) =>
      button.addEventListener("click", () => {
        main
          .querySelectorAll("[data-filter]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        main
          .querySelectorAll(".portfolio-card")
          .forEach(
            (card) =>
              (card.hidden =
                button.dataset.filter !== "همه" &&
                card.dataset.category !== button.dataset.filter),
          );
      }),
    );
  }
  main.classList.remove("route-enter");
  requestAnimationFrame(() => main.classList.add("route-enter"));
  if (previous) {
    window.scrollTo({ top: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  }
}
document.querySelector(".skip").addEventListener("click", (e) => {
  e.preventDefault();
  main.focus();
  main.scrollIntoView({ block: "start" });
});
document.querySelector(".menu-toggle").addEventListener("click", (e) => {
  const button = e.currentTarget;
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
  document.querySelector("#navigation").classList.toggle("open", open);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelector("#navigation").classList.remove("open");
    document
      .querySelector(".menu-toggle")
      .setAttribute("aria-expanded", "false");
  }
});
document.querySelector(".close-dialog").onclick = () =>
  document.querySelector("#photo-dialog").close();
window.addEventListener("hashchange", route);
route();
