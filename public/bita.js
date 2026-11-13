import { categories, models } from "./models-data.js";
const $ = (s, root = document) => root.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  manto: "M9 3h6l4 4 2 7-3 1-1-5 1 11H6L7 10l-1 5-3-1 2-7 4-4Zm0 0 3 4 3-4M12 7v14",
  blouse: "M8 4 4 7l-2 6 4 2 2-5v10h8V10l2 5 4-2-2-6-4-3-4 3-4-3ZM8 4l1-2h6l1 2M12 7v13",
  coat: "M9 2h6l4 5 3 10-4 1-2-8 2 12H6L8 10l-2 8-4-1L5 7l4-5Zm0 0 3 7 3-7M12 9v13M7 15h3M14 15h3",
  suit: "M8 3h8l4 4 2 9-4 1-2-9v8H8V8l-2 9-4-1 2-9 4-4ZM8 3l4 7 4-7M8 16l-1 6h4l1-5 1 5h4l-1-6",
  dress: "M9 2h6l1 5-2 4 6 11H4l6-11-2-4 1-5ZM9 2c0 4 6 4 6 0M10 11h4",
  skirt: "M8 3h8l5 18H3L8 3Zm0 4h8M9 10 7 21M15 10l2 11",
  gift: "M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8C4 8 5 1 9 3l3 5Zm0 0c8 0 7-7 3-5l-3 5Z",
  sketch: "M4 3h11v4M4 3v18h16V10M8 7h3M8 11h2M8 17l1-4L18 4l3 3-9 9-4 1Zm8-11 3 3",
  spool: "M6 3h12v3H6zM6 18h12v3H6zM8 6v12M16 6v12M8 8l8 3M8 12l8 3M8 16l5 2M17 13c6 0 6 5 2 5",
  menu: "M4 7h16M4 12h16M4 17h16",
  info: "M12 11v6M12 7v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  close: "m6 6 12 12M18 6 6 18",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  check: "m5 12 4 4L19 6",
  phone:
    "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2C9 19 5 15 3 7c-1-2 0-4 2-4Z",
  ruler: "m3 17 14-14 4 4L7 21l-4-4ZM9 11l3 3M13 7l3 3",
  needle: "M18 3 5 19l-2 2 1-3L17 3c2-2 4 0 1 3ZM9 15c3 4 8 4 10 1",
  cloth: "M4 4h16v16H4zM8 4v16M4 8h16M12 4v16M4 12h16",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  model: "M12 3c-4 0-4 5 0 5v3M12 11 3 18v2h18v-2l-9-7Z",
};
const icon = (name, size = 22) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
let saved = new Set();
try {
  saved = new Set(
    JSON.parse(localStorage.getItem("bita-saved") || "[]").filter((id) =>
      models.some((m) => m.id === id),
    ),
  );
} catch {}
let motion = true;
try {
  motion = localStorage.getItem("bita-motion") !== "off";
} catch {}
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const button = (label, href, cls = "primary") =>
  `<a class="button ${cls}" href="${href}">${label}</a>`;
const photo = (src, alt, cls = "", loading = "lazy") =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="${loading}" decoding="async">`;
const kicker = (t) => `<p class="kicker"><span></span>${t}</p>`;
const crumbs = (t) =>
  `<nav class="breadcrumbs" aria-label="مسیر صفحه"><a href="#home">خانه</a><span>/</span><span>${t}</span></nav>`;
const categoryLink = (c) =>
  `<a class="category-tile depth-card" href="#models?category=${c.id}" data-tilt><div class="category-photo">${photo(c.image, c.name)}<span class="photo-number">${String(categories.indexOf(c) + 1).replace(/[0-9]/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])}</span></div><div class="category-label"><span><b>${c.name}</b><small>${c.note}</small></span><span class="category-icon">${icon(c.id,24)}</span></div></a>`;
const saveButton = (m) =>
  `<button class="save-model ${saved.has(m.id) ? "is-saved" : ""}" data-save="${m.id}" aria-label="${saved.has(m.id) ? "حذف از" : "افزودن به"} مدل‌های پسندیده: ${m.name}" aria-pressed="${saved.has(m.id)}">${icon("heart", 20)}</button>`;
const modelCard = (m) =>
  `<article class="model-card depth-card" data-name="${esc(m.name)}" data-category="${m.category}"><div class="model-image"><a href="#model/${m.id}">${photo(m.image, m.name)}</a>${saveButton(m)}<span class="model-tag">${m.tag}</span></div><div class="model-content"><small>${categories.find((c) => c.id === m.category).name}</small><h3><a href="#model/${m.id}">${m.name}</a></h3><a class="button subtle" href="#model/${m.id}">دیدن جزئیات مدل</a></div></article>`;
const roles = () =>
  `<div class="team-proof"><div><span class="proof-icon">${icon("needle", 25)}</span><span><small>ظرافت در اجرا</small><strong>برش متناسب، دوخت دقیق</strong></span></div><div><span class="proof-icon">${icon("ruler", 25)}</span><span><small>اندازه‌گیری بانوان</small><strong>توسط پرسنل خانم</strong></span></div></div>`;
const invite = (title = "لباست از یک گفت‌وگو شروع می‌شود.") =>
  `<section class="invite wrap"><div>${kicker("برای شروع، فقط یک شماره")}<h2>${title}</h2><p>ایده یا نیازت را بگو؛ برای بررسی جزئیات با تو تماس می‌گیریم.</p></div>${button("درخواست تماس", "#contact")}</section>`;
const steps = () =>
  `<div class="steps-grid">${[
    [
      "1",
      "مدلت را پیدا کن",
      "مدل‌های منتخب بیتا را ببینید و طرح نزدیک به سلیقه‌تان را انتخاب کنید.",
      "sketch",
    ],
    [
      "2",
      "درباره‌اش حرف بزنیم",
      "درخواست مشاوره ثبت کنید؛ برای بررسی مدل، پارچه و جزئیات با شما تماس می‌گیریم.",
      "phone",
    ],
    [
      "3",
      "برای اندازه‌گیری هماهنگ کنیم",
      "با هماهنگی قبلی و همراهی همکار خانم، اندازه‌گیری و مراحل دوخت و پرو انجام می‌شود.",
      "ruler",
    ],
    ["4", "آماده برای همراهی شما", "پس از کنترل نهایی دوخت و تن‌خور، زمان تحویل لباس با شما هماهنگ می‌شود.", "gift"],
  ]
    .map(
      ([n, t, p, i]) =>
        `<article class="step-card depth-card"><span class="step-number">${n.replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[d])}</span><span class="sculpt-icon">${icon(i, 30)}</span><h3>${t}</h3><p>${p}</p></article>`,
    )
    .join("")}</div>`;
function home() {
  return `<section class="hero-shell wrap"><div class="hero-copy"><h1>به سلیقهٔ شما،<br><span>با ظرافت بیتا.</span></h1><div class="hero-intro"><div class="hero-garments"><span>مانتو</span><i></i><span>شومیز</span><i></i><span>پالتو</span></div><p>انتخاب شما، با برش و دوخت اختصاصی بیتا.</p></div><div class="button-row">${button("ورود به مدل‌خانه", "#models")}${button("لباسم نیاز به تعمیر دارد", "#repairs", "secondary")}</div>${roles()}<button class="scroll-cue" type="button" data-scroll-services><span class="scroll-track" aria-hidden="true"><i></i></span><span>ادامهٔ تجربه بیتا<small>خدمات و مدل‌های منتخب</small></span></button></div><div class="hero-visual" data-tilt><svg class="hero-thread" viewBox="0 0 640 600" fill="none" aria-hidden="true"><path class="thread-base" d="M96 44C-4 60 4 261 58 361S194 590 393 554S656 420 599 321C560 254 492 287 521 330C555 379 643 287 601 180"/><path class="thread-glint" d="M96 44C-4 60 4 261 58 361S194 590 393 554S656 420 599 321C560 254 492 287 521 330C555 379 643 287 601 180"/></svg><div class="hero-photo-frame">${photo("/assets/nakh/hero-hq.jpg", "نمای نزدیک دوخت در مزون بیتا؛ اندازه‌گیری بانوان توسط همکار خانم", "hero-photo", "eager")}</div></div></section>
<section class="path-section wrap"><div class="path-card depth-card"><span class="sculpt-icon">${icon("spool", 30)}</span><div><small>یک لباس تازه</small><h2>دوخت لباس</h2><p>برش‌های سنجیده، جزئیات منتخب و تن‌خوری مختص شما.</p><a class="text-button" href="#services">آشنایی با خدمات دوخت</a></div></div><div class="path-card depth-card"><span class="sculpt-icon">${icon("needle", 30)}</span><div><small>یک اندازهٔ تازه</small><h2>تعمیر لباس محبوبت</h2><p>کوتاهی، اصلاح سایز، تعویض زیپ و ترمیم لباس زنانه و مردانه.</p><a class="text-button" href="#repairs">خدمات تعمیرات لباس</a></div></div></section>
<section class="section section-paper"><div class="wrap"><div class="section-heading"><div>${kicker("مدل‌خانه بیتا")}<h2>انتخابی برای استایل شما</h2></div></div><div class="category-grid">${categories.map(categoryLink).join("")}</div><p class="image-disclaimer">تصاویر مدل‌ها برای نمایش ایده‌های دوخت ساخته شده‌اند؛ نمونه‌کار واقعی نیستند.</p></div></section>
<section class="section wrap craft-feature"><div class="craft-media depth-card">${photo("/assets/nakh/repair-hq.jpg", "نمای نزدیک دوخت دستی روی کت")}</div><div class="craft-copy">${kicker("اصلاح و ترمیم پوشاک")}<h2>تن‌خور بهتر،<br><span>همان لباس محبوب.</span></h2><p>با اصلاح اندازه، تنظیم قد و ترمیم جزئیات، تناسب و آراستگی را به لباس دلخواهتان برگردانید.</p><div class="service-pills"><span>اصلاح سایز</span><span>کوتاهی</span><span>تعویض زیپ</span><span>ترمیم</span></div>${button("درخواست بررسی تعمیر", "#contact?service=repair", "primary")}<small>تعمیرات زنانه و مردانه؛ دوخت اختصاصی فقط زنانه.</small></div></section>
<section class="section section-paper"><div class="wrap"><div class="section-heading"><div>${kicker("از ایده تا لباس")}<h2>از انتخاب شما،<br>تا امضای دوخت بیتا.</h2></div><a class="text-button" href="#about">درباره مزون بیتا</a></div>${steps()}</div></section>${invite()}`;
}
function modelsPage(params) {
  const active = categories.some((c) => c.id === params.get("category"))
    ? params.get("category")
    : "all";
  const onlySaved = params.get("saved") === "1";
  const category = categories.find((c) => c.id === active);
  const list = models.filter(
    (m) =>
      (active === "all" || m.category === active) &&
      (!onlySaved || saved.has(m.id)),
  );
  return `<div class="wrap page-content"><div class="page-heading"><div>${kicker("مدل‌خانه بیتا")}<h1>${onlySaved ? "مدل‌های پسندیدهٔ تو" : category ? `مدل‌های ${category.name}` : "یک مدل، نزدیک به سلیقهٔ تو."}</h1><p>مدل‌های منتخب زنانه را ببین، جزئیات را بررسی کن و برای دوختش با ما صحبت کن.</p></div><div class="page-heading-icon sculpt-icon">${icon("model", 44)}</div></div><div class="models-toolbar"><nav class="category-tabs" aria-label="دسته‌بندی مدل‌ها"><a href="#models${onlySaved ? "?saved=1" : ""}" ${active === "all" ? 'aria-current="page"' : ""}>همه مدل‌ها</a>${categories.map((c) => `<a href="#models?category=${c.id}${onlySaved ? "&saved=1" : ""}" ${active === c.id ? 'aria-current="page"' : ""}>${c.name}</a>`).join("")}</nav><label class="search-box">${icon("search", 19)}<input type="search" id="model-search" placeholder="جست‌وجوی مدل…" aria-label="جست‌وجوی مدل‌ها"></label></div><div class="models-meta"><span id="model-count">${list.length.toLocaleString("fa-IR")} مدل برای دیدن</span><a href="#models${onlySaved ? "" : "?saved=1"}" class="text-button">${onlySaved ? "نمایش همه مدل‌ها" : "مدل‌های پسندیده"}</a></div><div class="model-grid">${list.map(modelCard).join("")}</div><div class="empty-state" id="models-empty" ${list.length ? "hidden" : ""}>${icon("model", 38)}<h2>هنوز مدلی اینجا نیست.</h2><p>${onlySaved ? "با لمس قلب روی مدل‌ها، انتخاب‌هایت را اینجا نگه دار." : "عبارت کوتاه‌تر یا دسته دیگری را امتحان کن."}</p>${button("همه مدل‌ها", "#models", "secondary")}</div><p class="image-disclaimer">مدل‌ها و تصاویر، ایده‌های نمایشی هستند. امکان اجرا و جزئیات دوخت بعد از مشاوره مشخص می‌شود.</p></div>${invite("از مدل انتخابی‌ات برایمان بگو.")}`;
}
function detailPage(id) {
  const m = models.find((m) => m.id === id);
  if (!m) return missing();
  const cat = categories.find((c) => c.id === m.category);
  const related = models
    .filter((p) => p.category === m.category && p.id !== m.id)
    .concat(models.filter((p) => p.category !== m.category))
    .slice(0, 3);
  return `<div class="wrap page-content">${crumbs("مدل‌خانه / " + m.name)}<section class="model-detail"><div class="detail-image depth-card">${photo(m.image, m.name, "", "eager")}${saveButton(m)}<span class="detail-image-label">ایده‌ای برای دوخت، به اندازهٔ تو</span></div><div class="detail-copy">${kicker(cat.name + " / مدل‌خانه بیتا")}<h1>${m.name}</h1><p>${m.detail}</p><dl class="detail-specs"><div><dt>پیشنهاد پارچه</dt><dd>${m.fabric}</dd></div><div><dt>نوع دوخت</dt><dd>زنانه، با تن‌خور اختصاصی</dd></div><div><dt>اندازه‌گیری بانوان</dt><dd>توسط همکار خانم</dd></div></dl><div class="feature-checks">${m.features.map((f) => `<span>${icon("check", 16)}${f}</span>`).join("")}</div>${button("درباره دوخت این مدل تماس بگیرید", `#contact?model=${m.id}`)}<p class="small-note">رنگ، پارچه و جزئیات را در گفت‌وگو انتخاب می‌کنیم؛ نیازی به انتخاب آن‌ها در سایت نیست.</p><div class="detail-assurance">${icon("shield", 20)}<span>برش و دوخت زیر نظر استادکار بیتا؛ اندازه‌گیری بانوان با پرسنل خانم.</span></div></div></section><section class="section"><div class="section-heading"><h2>چند مدل دیگر برای دیدن</h2><a class="text-button" href="#models?category=${m.category}">همه مدل‌های ${cat.name}</a></div><div class="model-grid related-grid">${related.map(modelCard).join("")}</div></section></div>`;
}
function servicesPage() {
  return `<div class="wrap page-content">${crumbs("دوخت زنانه")}<section class="service-hero"><div>${kicker("خدمات دوخت / مزون بیتا")}<h1>ظرافت در برش،<br>تمایز در تن‌خور.</h1><p>تمرکز ما لباس‌های زنانه‌ای است که واقعاً می‌پوشی: مانتو، شومیز، پالتو، کت‌وشلوار زنانه، دامن و پیراهن.</p><div class="scope-note">${icon("info")}<span>مجموعه خدمات بیتا بر مانتو، شومیز، پالتو و پوشاک منتخب زنانه متمرکز است.</span></div><div class="button-row">${button("مدل‌ها را ببین", "#models")}${button("درخواست مشاوره", "#contact", "secondary")}</div>${roles()}</div><div class="service-image depth-card">${photo("/assets/bita/suit.jpg", "کت‌وشلوار زنانه خوش‌دوخت با دوخت تمیز", "", "eager")}</div></section><section class="section"><div class="section-heading"><h2>برای کدام لباس شروع کنیم؟</h2><p>انتخاب دسته، مدل‌های مرتبط را برایت باز می‌کند.</p></div><div class="category-grid">${categories.map(categoryLink).join("")}</div></section><section class="section compact-section"><h2>مسیر دوخت، قدم‌به‌قدم</h2>${steps()}</section></div>${invite()}`;
}
function repairsPage() {
  return `<div class="wrap page-content">${crumbs("تعمیرات لباس")}<section class="service-hero repair-hero"><div>${kicker("تعمیرات زنانه و مردانه")}<h1>همان لباس،<br><span>حالِ بهتر.</span></h1><p>تغییر سایز، کوتاهی، تعویض زیپ یا ترمیم؛ روش مناسب به ساختار و جنس لباس بستگی دارد و بعد از بررسی پیشنهاد می‌شود.</p><div class="button-row">${button("برای تعمیر با من تماس بگیرید", "#contact?service=repair")}</div><div class="scope-note">${icon("shield")}<span>برای آقایان فقط خدمات تعمیر و اصلاح لباس داریم؛ دوخت و مدل‌خانه مخصوص لباس زنانه است.</span></div></div><div class="service-image depth-card">${photo("/assets/nakh/repair-hq.jpg", "دست‌های خیاط در حال ترمیم درز لباس", "", "eager")}</div></section><section class="section"><div class="section-heading"><h2>تغییر کوچک، تفاوت محسوس.</h2><p>امکان هر تعمیر پس از بررسی لباس مشخص می‌شود.</p></div><div class="repair-services">${[
    [
      "ruler",
      "اصلاح سایز و تن‌خور",
      "بررسی کمر، آستین و فرم لباس برای اصلاح اندازه.",
    ],
    [
      "needle",
      "کوتاهی و تعویض زیپ",
      "اصلاح قد شلوار و لباس و تعویض زیپ آسیب‌دیده.",
    ],
    ["cloth", "ترمیم و بازسازی", "بررسی درز، آستر و قسمت‌های آسیب‌دیده لباس."],
  ]
    .map(
      ([i, t, p]) =>
        `<article class="step-card depth-card"><span class="sculpt-icon">${icon(i, 32)}</span><h3>${t}</h3><p>${p}</p></article>`,
    )
    .join(
      "",
    )}</div></section><section class="faq-section"><div>${kicker("قبل از سپردن لباس")}<h2>سؤال‌های شما</h2></div><div class="faq-list">${[
    [
      "هزینه تعمیر چطور مشخص می‌شود؟",
      "پس از بررسی نوع لباس، جنس پارچه و تغییر موردنیاز، درباره روش کار و هزینه با شما صحبت می‌کنیم.",
    ],
    [
      "لباس مردانه هم تعمیر می‌کنید؟",
      "بله؛ خدمات تعمیر و اصلاح سایز برای لباس زنانه و مردانه است. دوخت اختصاصی فقط برای لباس زنانه انجام می‌شود.",
    ],
    [
      "اندازه‌گیری بانوان با چه کسی است؟",
      "اندازه‌گیری بانوان توسط همکار خانم انجام می‌شود. برش و دوخت زیر نظر استادکار بیتا انجام می‌شود.",
    ],
    [
      "چطور برای مراجعه هماهنگ کنم؟",
      "نام و شماره‌ات را در فرم بگذار؛ برای گفت‌وگو و هماهنگی مراجعه با تو تماس می‌گیریم.",
    ],
  ]
    .map(
      ([q, a]) =>
        `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`,
    )
    .join("")}</div></section></div>${invite("لباست چه تغییری می‌خواهد؟")}`;
}
function aboutPage() {
  return `<div class="wrap page-content">${crumbs("درباره مزون بیتا")}<section class="about-hero"><div>${kicker("مزون بیتا؛ کار ما خیاطی است")}<h1>پشت هر لباس،<br>دقتِ یک تیم.</h1><p>مزون بیتا، همراه شما در انتخاب پوششی خوش‌دوخت و متناسب است. خدمات ما شامل دوخت اختصاصی زنانه و اصلاح و تعمیر پوشاک بانوان و آقایان است. از انتخاب مدل تا اندازه‌گیری و دوخت، درباره جزئیات با شما صحبت می‌کنیم.</p>${roles()}<p class="small-note">دوخت اختصاصی برای بانوان؛ اصلاح و تعمیر لباس برای بانوان و آقایان.</p>${button("با بیتا صحبت کن", "#contact")}</div><div class="about-image depth-card">${photo("/assets/nakh/hero-hq.jpg", "برش و دوخت در مزون بیتا و اندازه‌گیری بانوان توسط همکار خانم", "", "eager")}</div></section><section class="section"><div class="section-heading"><h2>مهارت در دوخت، دقت در همراهی.</h2></div><div class="team-cards"><article class="team-card depth-card"><span class="sculpt-icon">${icon("needle", 34)}</span><small>مهارت در اجرا</small><h2>امضای استادکار بیتا.</h2><p>برش، دوخت و اصلاح لباس زیر نظر استادکار بیتا انجام می‌شود؛ تمرکز روی تناسب، جزئیات و تمیزی کار است.</p></article><article class="team-card depth-card"><span class="sculpt-icon">${icon("ruler", 34)}</span><small>همراهی در اندازه‌گیری</small><h2>همراهی اختصاصی بانوان.</h2><p>اندازه‌گیری بانوان توسط همکار خانم انجام می‌شود تا مسیر سفارش از ابتدا روشن باشد.</p></article></div></section><div class="concept-note">${icon("info")}<p>تصاویر این سایت برای نمایش فضا و ایده‌های دوخت تولید شده‌اند و عکس واقعی تیم یا نمونه‌کارهای مشتریان نیستند.</p></div></div>${invite()}`;
}
function contactPage(params) {
  const m = models.find((p) => p.id === params.get("model"));
  const repair = params.get("service") === "repair";
  return `<div class="wrap page-content">${crumbs("درخواست تماس")}<section class="contact-layout"><div class="contact-copy">${kicker("شروع یک گفت‌وگو با مزون بیتا")}<h1>برای هماهنگی<br><span>و مشاوره.</span></h1><p>نام و شماره‌ات را بگذار. برای صحبت درباره دوخت یا تعمیر لباس با تو تماس می‌گیریم.</p>${roles()}<div class="contact-expect"><span class="sculpt-icon small">${icon("phone", 24)}</span><div><b>بعد از ثبت فرم چه می‌شود؟</b><p>درخواست در اختیار مدیریت بیتا قرار می‌گیرد؛ برای بررسی جزئیات و هماهنگی مراجعه با شما تماس می‌گیریم.</p></div></div><p class="small-note">ثبت فرم، خرید یا رزرو وقت قطعی نیست. هیچ پرداختی در سایت انجام نمی‌شود.</p></div><div class="form-panel depth-card"><div class="form-panel-heading"><span>${icon("phone", 24)}</span><div><h2>درخواست تماس</h2><p>چند اطلاعات کوتاه برای شروع</p></div></div>${m ? `<div class="chosen-model">${photo(m.image, m.name)}<span><small>مدل انتخابی تو</small><b>${m.name}</b></span><a href="#model/${m.id}">دیدن مدل</a></div>` : ""}<form id="callback-form"><div class="form-columns"><label class="field"><span>نام و نام خانوادگی</span><input name="name" required minlength="2" maxlength="80" autocomplete="name" placeholder="نام شما"></label><label class="field"><span>شماره موبایل</span><input name="phone" required type="tel" inputmode="tel" autocomplete="tel" maxlength="18" placeholder="۰۹۱۲۱۲۳۴۵۶۷" aria-describedby="phone-hint"><small id="phone-hint">شماره‌ای که بتوانیم با شما تماس بگیریم.</small></label></div><label class="field"><span>موضوع تماس</span><select name="service" required><option value="دوخت زنانه" ${!repair ? "selected" : ""}>دوخت لباس زنانه</option><option value="تعمیرات زنانه" ${repair ? "selected" : ""}>تعمیرات لباس زنانه</option><option value="تعمیرات مردانه">تعمیرات لباس مردانه</option><option value="سایر">سایر موارد</option></select></label><label class="field"><span>توضیح کوتاه <small>(اختیاری)</small></span><textarea name="note" maxlength="850" placeholder="مدل دلخواه یا تغییری که برای لباس می‌خواهی…">${m ? esc("مدل موردعلاقه: " + m.name) : ""}</textarea></label><div class="honey" aria-hidden="true"><label>وب‌سایت<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="consent"><input name="consent" type="checkbox" required><span>با ثبت نام و شماره‌ام برای تماس درباره همین درخواست موافقم. <a href="#privacy">حریم خصوصی</a></span></label><button class="button primary submit-button" type="submit">ثبت درخواست تماس</button><div class="form-status" role="status" aria-live="polite"></div></form></div></section></div>`;
}
function privacyPage() {
  return `<article class="wrap page-content prose">${crumbs("حریم خصوصی")}${kicker("اطلاعات شما، برای تماس با شما")}<h1>حریم خصوصی</h1><h2>چه اطلاعاتی ثبت می‌شود؟</h2><p>نام، شماره موبایل، موضوع درخواست و توضیح اختیاری شما در دیتابیس سایت ذخیره می‌شود. اطلاعات عمومی نیست و مدیریت مزون بیتا از پنل رمزدار به آن دسترسی دارد.</p><h2>کاربرد اطلاعات</h2><p>فقط برای پیگیری درخواست، گفت‌وگو درباره خدمات و هماهنگی مراجعه استفاده می‌شود. ثبت فرم به معنی پرداخت، خرید یا رزرو قطعی نیست.</p><h2>اصلاح یا حذف</h2><p>هنگام تماس می‌توانید درخواست حذف یا اصلاح اطلاعاتتان را مطرح کنید. همچنین می‌توانید از فرم تماس با همان شماره برای این درخواست استفاده کنید.</p><h2>مدل‌های پسندیده و حرکت‌ها</h2><p>مدل‌های پسندیده و ترجیح حرکت‌ها فقط در مرورگر خودتان نگهداری می‌شوند؛ این تنظیمات به مدیریت ارسال نمی‌شوند.</p><h2>فایل و اطلاعات حساس</h2><p>فایل یا عکس دریافت نمی‌کنیم و پرداخت اینترنتی نداریم. اطلاعات کارت، رمز یا مدارک شخصی را در توضیحات ننویسید.</p>${button("بازگشت به درخواست تماس", "#contact", "secondary")}</article>`;
}
function missing() {
  return `<section class="wrap empty-state page-content"><span class="sculpt-icon">${icon("model", 40)}</span><h1>این صفحه پیدا نشد.</h1><p>از مدل‌خانه یا صفحه اصلی دوباره شروع کن.</p>${button("صفحه اصلی", "#home")}</section>`;
}
function chrome() {
  document.body.innerHTML = `<a class="skip-link" href="#bita-main">رفتن به محتوای صفحه</a><header class="site-header"><div class="header-inner wrap"><a class="brand" href="#home" aria-label="مزون بیتا، صفحه اصلی"><span class="brand-seal" aria-hidden="true">ب</span><span><b>مزون بیتا</b><small>ظرافت در دوخت، زیبایی در تن‌خور</small></span></a><nav class="main-nav" id="main-navigation" aria-label="ناوبری اصلی"><a href="#home" data-page="home">خانه</a><a href="#models" data-page="models">مدل‌خانه</a><a href="#services" data-page="services">دوخت زنانه</a><a href="#repairs" data-page="repairs">تعمیرات</a><a href="#about" data-page="about">درباره بیتا</a></nav><div class="header-actions"><a class="icon-button saved-link" href="#models?saved=1" aria-label="مدل‌های پسندیده">${icon("heart", 21)}<span id="saved-count" ${saved.size ? "" : "hidden"}>${saved.size.toLocaleString("fa-IR")}</span></a><a class="button primary header-contact" href="#contact">درخواست تماس</a><button class="icon-button menu-button" aria-label="باز کردن منو" aria-expanded="false" aria-controls="main-navigation">${icon("menu", 23)}</button></div></div></header><main id="bita-main" tabindex="-1"></main><footer class="site-footer"><div class="wrap footer-grid"><div class="footer-brand"><a href="#home" class="brand"><span class="brand-seal">ب</span><span><b>مزون بیتا</b><small>ظرافتی که در تن‌خور دیده می‌شود.</small></span></a><p>دوخت زنانه؛ تعمیرات زنانه و مردانه.<br>دقت در اجرا، ظرافت در نتیجه.</p></div><div><b>بیتا را بشناس</b><a href="#services">خدمات دوخت</a><a href="#repairs">تعمیرات لباس</a><a href="#about">درباره بیتا</a></div><div><b>مدلت را پیدا کن</b><a href="#models?category=manto">مدل‌های مانتو</a><a href="#models?category=blouse">مدل‌های شومیز</a><a href="#models?category=coat">مدل‌های پالتو</a></div><div class="footer-contact"><b>یک گفت‌وگوی کوتاه</b><p>شماره‌ات را بگذار؛ برای بررسی درخواست با تو تماس می‌گیریم.</p>${button("تماس با من", "#contact", "secondary")}</div></div><div class="wrap footer-bottom"><span>مزون بیتا؛ لباس به سلیقه تو.</span></div></footer><div class="toast" id="bita-toast" role="status" aria-live="polite"></div>`;
}
chrome();
const main = $("#bita-main");
let tiltCleanup = () => {};
function updateMotion() {
  document.documentElement.dataset.motion =
    motion && !reduced.matches ? "on" : "off";
  const b = $("#motion-toggle");
  if (!b) return;
  b.setAttribute("aria-pressed", String(!motion));
  b.textContent = motion ? "توقف حرکت‌ها" : "فعال‌کردن حرکت‌ها";
}
function toast(text) {
  const el = $("#bita-toast");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("visible"), 2800);
}
function menuClose() {
  const b = $(".menu-button");
  b.setAttribute("aria-expanded", "false");
  b.setAttribute("aria-label", "باز کردن منو");
  $(".main-nav").classList.remove("open");
}
function setupEffects() {
  tiltCleanup();
  const removers = [];
  if (
    !motion ||
    reduced.matches ||
    !matchMedia("(pointer:fine) and (min-width:901px)").matches
  )
    return;
  main.querySelectorAll("[data-tilt]").forEach((el) => {
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--tilt-x",
        `${((e.clientY - r.top) / r.height - 0.5) * -4}deg`,
      );
      el.style.setProperty(
        "--tilt-y",
        `${((e.clientX - r.left) / r.width - 0.5) * 4}deg`,
      );
    };
    const reset = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    removers.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
      reset();
    });
  });
  tiltCleanup = () => removers.forEach((fn) => fn());
}
function bindForm() {
  const form = $("#callback-form");
  if (!form) return;
  const phone = form.elements.phone;
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let number = phone.value
      .replace(/[۰-۹٠-٩]/g, (c) =>
        String(
          "۰۱۲۳۴۵۶۷۸۹".includes(c)
            ? "۰۱۲۳۴۵۶۷۸۹".indexOf(c)
            : "٠١٢٣٤٥٦٧٨٩".indexOf(c),
        ),
      )
      .replace(/[\s()-]/g, "");
    if (!/^(09\d{9}|\+989\d{9}|00989\d{9})$/.test(number)) {
      phone.setCustomValidity("شماره موبایل ایران را درست وارد کنید.");
      phone.reportValidity();
      return;
    }
    const submit = $("button[type=submit]", form);
    const message = $(".form-status", form);
    submit.disabled = true;
    submit.textContent = "در حال ثبت…";
    message.className = "form-status";
    message.textContent = "";
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.elements.name.value,
          phone: number,
          service: form.elements.service.value,
          note: form.elements.note.value,
          consent: form.elements.consent.checked,
          website: form.elements.website.value,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "ثبت انجام نشد. دوباره تلاش کنید.");
      form.reset();
      message.classList.add("success");
      message.innerHTML = `${icon("check", 24)}<span><b>درخواستت ثبت شد.</b> برای گفت‌وگو درباره لباست با همین شماره با تو تماس می‌گیریم.</span>`;
    } catch (error) {
      message.classList.add("error");
      message.textContent =
        error.message || "ارتباط برقرار نشد؛ دوباره تلاش کنید.";
    } finally {
      submit.disabled = false;
      submit.textContent = "ثبت درخواست تماس";
    }
  });
}
let navigationVersion = 0;
let pageAnimation;
async function route() {
  const version = ++navigationVersion;
  pageAnimation?.cancel();
  const animate = route.started && motion && !reduced.matches;
  if (animate) {
    pageAnimation = main.animate([{opacity:1,transform:"perspective(1400px) rotateY(0deg) translateY(0)"},{opacity:0,transform:"perspective(1400px) rotateY(-3deg) translateY(-6px)"}],{duration:130,easing:"ease-in",fill:"forwards"});
    try { await pageAnimation.finished; } catch {}
    if (version !== navigationVersion) return;
    pageAnimation.cancel();
  }
  renderRoute();
  if (animate) pageAnimation = main.animate([{opacity:0,transform:"perspective(1400px) rotateY(4deg) translateY(14px)"},{opacity:1,transform:"perspective(1400px) rotateY(0deg) translateY(0)"}],{duration:420,easing:"cubic-bezier(.2,.7,.2,1)"});
}
function renderRoute() {
  const raw = location.hash.slice(1) || "home";
  if (raw.startsWith("/admin")) {
    location.replace("/admin.html#/admin");
    return;
  }
  const [path, query = ""] = raw.replace(/^\//, "").split("?");
  const params = new URLSearchParams(query);
  const titles = {
    home: "خیاطی زنانه و تعمیرات لباس",
    models: "مدل‌خانه",
    services: "دوخت زنانه",
    repairs: "تعمیرات لباس",
    about: "درباره بیتا",
    contact: "درخواست تماس",
    privacy: "حریم خصوصی",
  };
  const views = {
    home,
    models: () => modelsPage(params),
    services: servicesPage,
    repairs: repairsPage,
    about: aboutPage,
    contact: () => contactPage(params),
    privacy: privacyPage,
  };
  const detail = path.startsWith("model/");
  const page =
    path === "studio" || path === "shop"
      ? "models"
      : path === "repair"
        ? "repairs"
        : path;
  main.innerHTML = detail
    ? detailPage(path.split("/")[1])
    : (views[page] || missing)();
  document.title = `مزون بیتا | ${detail ? models.find((m) => m.id === path.split("/")[1])?.name || "مدل" : titles[page] || "صفحه پیدا نشد"}`;
  document.body.dataset.page = detail ? "model" : page;
  $(".main-nav")
    .querySelectorAll("a")
    .forEach((a) => {
      if (a.dataset.page === (detail ? "models" : page))
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  menuClose();
  bindForm();
  const search = $("#model-search");
  if (search)
    search.addEventListener("input", () => {
      let count = 0;
      main.querySelectorAll(".model-card").forEach((card) => {
        card.hidden = !card.dataset.name.includes(search.value.trim());
        if (!card.hidden) count++;
      });
      $("#model-count").textContent =
        `${count.toLocaleString("fa-IR")} مدل برای دیدن`;
      $("#models-empty").hidden = count > 0;
    });
  setupEffects();
  window.scrollTo({ top: 0, behavior: "instant" });
  if (route.started) main.focus({ preventScroll: true });
  route.started = true;
}
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-scroll-services]")) {
    document.querySelector(".path-section")?.scrollIntoView({behavior: reduced.matches ? "instant" : "smooth", block:"start"});
    return;
  }
  const save = event.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    try {
      localStorage.setItem("bita-saved", JSON.stringify([...saved]));
    } catch {}
    const model = models.find((m) => m.id === id);
    save.outerHTML = saveButton(model);
    $("#saved-count").hidden = !saved.size;
    $("#saved-count").textContent = saved.size.toLocaleString("fa-IR");
    toast(
      saved.has(id)
        ? "مدل به پسندیده‌ها اضافه شد."
        : "مدل از پسندیده‌ها برداشته شد.",
    );
    if (location.hash.startsWith("#models") && new URLSearchParams(location.hash.split("?")[1]).get("saved") === "1") route();
    return;
  }
  if (event.target.closest(".menu-button")) {
    const open = $(".menu-button").getAttribute("aria-expanded") !== "true";
    $(".menu-button").setAttribute("aria-expanded", String(open));
    $(".menu-button").setAttribute(
      "aria-label",
      open ? "بستن منو" : "باز کردن منو",
    );
    $(".main-nav").classList.toggle("open", open);
  } else if (!event.target.closest(".site-header")) menuClose();
  if (event.target.closest("#motion-toggle")) {
    motion = !motion;
    try {
      localStorage.setItem("bita-motion", motion ? "on" : "off");
    } catch {}
    updateMotion();
    setupEffects();
  }
  if (event.target.closest(".skip-link")) {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") menuClose();
});
matchMedia("(min-width:1101px)").addEventListener("change", (e) => {
  if (e.matches) menuClose();
});
reduced.addEventListener("change", () => {
  updateMotion();
  setupEffects();
});
window.addEventListener("hashchange", route);
updateMotion();
route();
