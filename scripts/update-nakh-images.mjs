import { readFileSync, writeFileSync } from "node:fs";
const root = new URL("../public/", import.meta.url);
const replacements = {
  "3e341819846a3436.webp": "hero-hq.jpg",
  "82bd800c4876beb0.webp": "hero-hq.jpg",
  "01887c1b53391800.webp": "design-detail-hq.jpg",
  "927a5a11b8e35598.webp": "repair-hq.jpg",
  "9cd742a9fb1b386e.webp": "women-hq.jpg",
  "83b68b7dd31a8f1d.webp": "men-hq.jpg",
  "a44ac05b50751c04.webp": "evening-hq.jpg",
  "30c703441e737faf.webp": "coat-hq.jpg",
};
for (const filename of ["index.html", "nakh.js"]) {
  let source = readFileSync(new URL(filename, root), "utf8");
  for (const [oldFile, newFile] of Object.entries(replacements))
    source = source.replaceAll(
      "/assets/nakh/" + oldFile,
      "/assets/nakh/" + newFile,
    );
  source = source.replaceAll(
    "تصویر مفهومی یک استاد خیاط مرد و همکار خانم در فضای آتلیه، مشغول دوخت لباس",
    "دست‌های خیاط مرد در حال دوخت و اندازه‌گیری بانوان توسط همکار خانم، بدون نمایش چهره مرد",
  );
  source = source.replaceAll(
    "تصویر مفهومی استاد خیاط و همکار خانم مشغول کار",
    "فرایند دوخت و اندازه‌گیری بانوان در آتلیه",
  );
  source = source.replaceAll(
    "طرح یک کت و ابزارهای طراحی و دوخت",
    "نمای نزدیک دوخت دستی کت",
  );
  source = source.replaceAll(
    "نمونه تصویری قبل و بعد ترمیم یک لباس",
    "دوخت و ترمیم لباس توسط خیاط",
  );
  source = source.replaceAll(
    "تصویر مفهومی مقایسه قبل و بعد ترمیم پارگی لباس",
    "نمای نزدیک دست‌های خیاط در حال ترمیم درز کت",
  );
  source = source.replaceAll("قبل / بعد از ترمیم", "تعمیر و اصلاح تن‌خور");
  source = source.replaceAll(
    "نمونه تصویری — نه پروژه واقعی",
    "تصویر مفهومی از فرایند تعمیر",
  );
  source = source.replaceAll(
    "یک استاد خیاط مرد در مرکز داستان برند، در کنار همکاران خانمی که در فضای کارگاه فعالیت میکنن — این بخش قراره با عکس واقعی تیم شما، پشت‌صحنه دوخت و قصه لباس‌ها زنده بشه",
    "دوخت با دقت دست‌های یک خیاط باتجربه پیش می‌رود؛ اندازه‌گیری بانوان را همکار خانم انجام می‌دهد. از انتخاب پارچه تا بررسی تن‌خور، درباره جزئیات با هم صحبت می‌کنیم.",
  );
  if (filename === "index.html") {
    source = source.replace(
      /<p>\s*یک استاد خیاط مرد[\s\S]*?<\/p>/,
      "<p>دوخت با دقت دست‌های یک خیاط باتجربه پیش می‌رود؛ اندازه‌گیری بانوان را همکار خانم انجام می‌دهد. از انتخاب پارچه تا بررسی تن‌خور، درباره جزئیات با هم صحبت می‌کنیم.</p>",
    );
  }
  writeFileSync(new URL(filename, root), source);
}
console.log("All NAKH image references updated to the high-resolution set.");
