import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const source = new URL(
  "../../imports/NAKH-original/index.html",
  import.meta.url,
);
const publicDir = new URL("../public/", import.meta.url);
mkdirSync(new URL("assets/nakh/", publicDir), { recursive: true });
let html = readFileSync(source, "utf8");
const images = new Map();
html = html.replace(
  /data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g,
  (uri, ext, data) => {
    if (!images.has(uri)) {
      const filename =
        createHash("sha256").update(data).digest("hex").slice(0, 16) +
        "." +
        ext;
      writeFileSync(
        new URL("assets/nakh/" + filename, publicDir),
        Buffer.from(data, "base64"),
      );
      images.set(uri, "/assets/nakh/" + filename);
    }
    return images.get(uri);
  },
);
let css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
css = css.replace(
  /@import url\([\s\S]*?\);/,
  '@font-face{font-family:Vazirmatn;src:url("/assets/vazirmatn.woff2") format("woff2");font-weight:100 900;font-display:swap}',
);
html = html.replace(
  /<style>[\s\S]*?<\/style>/,
  '<link rel="stylesheet" href="/nakh.css"><link rel="stylesheet" href="/nakh-responsive.css">',
);
let js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
html = html.replace(
  /<script>[\s\S]*?<\/script>/,
  '<script defer src="/nakh.js"></script>',
);
let handlers = [];
html = html.replace(/\son(click|submit)="([^"]*)"/g, (_, event, code) => {
  const id = handlers.length;
  handlers.push(
    `document.querySelector('[data-nakh-action-${id}]').addEventListener('${event}',function(event){${code}});`,
  );
  return ` data-nakh-action-${id}`;
});
js = js.replace(
  /function demoSubmit\(e\)\{[^\n]+\}/,
  `async function demoSubmit(e){
 e.preventDefault();
 const form=document.getElementById('requestForm');
 const button=form.querySelector('button[type="submit"]');
 const message=document.getElementById('requestStatus');
 const phone=document.getElementById('phone');
 const normalized=phone.value.replace(/[۰-۹٠-٩]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\\s()-]/g,'');
 if(!/^(09\\d{9}|\\+989\\d{9}|00989\\d{9})$/.test(normalized)){phone.setCustomValidity('شماره موبایل معتبر وارد کنید.');phone.reportValidity();return;}
 button.disabled=true;message.textContent='در حال ثبت درخواست…';
 try{
  const service=document.getElementById('service').value;
  const response=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('name').value,phone:normalized,service:'سایر',note:'نوع درخواست: '+service+'\\n'+document.getElementById('details').value,consent:document.getElementById('contactConsent').checked,website:''})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'ثبت درخواست انجام نشد.');
  form.reset();closeModal();toast('شماره شما ثبت شد؛ برای بررسی درخواست با شما تماس می‌گیریم.');message.textContent='';
 }catch(error){message.textContent=error.message;}finally{button.disabled=false;}
}`,
);
html = html.replace('<form id="requestForm"', '<form id="requestForm"');
html = html.replace(
  '<input id="name" required',
  '<input id="name" autocomplete="name" minlength="2" maxlength="80" required',
);
html = html.replace(
  '<input id="phone" type="tel" required',
  '<input id="phone" type="tel" autocomplete="tel" maxlength="18" required',
);
html = html.replace(
  '<textarea id="details"',
  '<textarea maxlength="900" id="details"',
);
html = html.replace(
  /<label for="photoUpload">[\s\S]*?<input id="photoUpload"[^>]*>/,
  '<label class="contact-consent"><input type="checkbox" id="contactConsent" required> با ثبت شماره برای تماس آتلیه درباره این درخواست موافقم.</label>',
);
html = html.replace("بررسی نمونه درخواست ←", "ثبت شماره برای تماس ←");
html = html.replace(
  "این فقط نمونه اولیه است — اطلاعات واردشده جایی ارسال یا ذخیره نمیشه و سفارش واقعی ثبت نمیشه",
  "نام و شماره شما فقط برای پیگیری درخواست ذخیره می‌شود. ثبت فرم به معنی خرید یا رزرو قطعی نیست.",
);
html = html.replace(
  '</form><p class="notice">',
  '<p id="requestStatus" role="status" aria-live="polite"></p></form><p class="notice">',
);
html = html.replace("عکس لباست رو بفرست ←", "درخواست تماس برای تعمیر ←");
html = html.replace(
  "تیم آتلیه امکان‌سنجی، زمان و هزینه رو اعلام میکنه",
  "برای بررسی امکان اجرا، زمان و هزینه با تو تماس می‌گیریم",
);
html = html.replace(
  "سایز، پارچه، تغییرات دلخواه یا عکس لباس آسیب‌دیده",
  "شماره تماس و توضیح کوتاهی درباره لباس را ثبت کن",
);
html = html.replace(
  "</footer>",
  '<div class="container admin-entry"><a href="/admin.html#/admin">مدیریت درخواست‌های تماس ↗</a></div></footer>',
);
css +=
  "\n.contact-consent{display:flex!important;align-items:flex-start;gap:9px;line-height:1.8}.dialog .contact-consent input{width:17px;min-width:17px;height:17px;accent-color:var(--gold);margin-top:4px}.admin-entry{padding-top:18px;font-size:11px;color:var(--gold)}#requestStatus{color:#f4d7a1;font-size:12px}button:disabled{opacity:.6;cursor:wait}.dialog{overscroll-behavior:contain}html{scroll-padding-top:92px}\n";
js +=
  "\n" +
  handlers.join("\n") +
  `\ndocument.getElementById('phone').addEventListener('input',function(){this.setCustomValidity('')});\n`;
writeFileSync(new URL("index.html", publicDir), html);
writeFileSync(new URL("nakh.css", publicDir), css);
writeFileSync(new URL("nakh.js", publicDir), js);
if (existsSync(new URL("assets/nakh/hero-hq.jpg", publicDir))) {
  await import("./update-nakh-images.mjs");
}
console.log(
  "NAKH imported; extracted " +
    images.size +
    " local images and " +
    handlers.length +
    " event handlers.",
);
