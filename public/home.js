/* The homepage has its own editorial layout; shared routes and forms stay in app.js. */
function renderEditorialHome({ photo, products, form }) {
  return `<div class="atelier-home">
    <section class="studio-stage">
      <div class="stage-top">
        <div class="stage-heading"><p class="studio-kicker"><span></span> آتلیه دوخت زنانه و تعمیرات لباس</p><h1>خوش‌دوخت.<br><span>درست، اندازهٔ تو.</span></h1></div>
        <div class="stage-intro"><p>لباسی که در آن خودت باشی.<br>از دوخت یک شومیز ساده،<br>تا دوباره پوشیدن لباس محبوبت.</p><a href="#/contact" class="round-link"><span>از اینجا<br>شروع کنیم</span><b aria-hidden="true">↙</b></a></div>
      </div>
      <div class="stage-bottom">
        <div class="stage-art" role="img" aria-label="خیاط در حال کار روی کت زنانه در آتلیه روشن"><span class="image-index">ATELIER / 01</span><span class="image-note">از ایده، تا آخرین کوک.</span></div>
        <div class="stage-directory"><p class="directory-title">برای کدامش اینجایی؟</p><a href="#/tailoring"><span><small>۰۱ / دوخت اختصاصی</small>یک لباس تازه</span><b aria-hidden="true">↖</b></a><a href="#/repairs"><span><small>۰۲ / تعمیر و اصلاح</small>یک اندازهٔ تازه</span><b aria-hidden="true">↖</b></a><div class="fabric-signature"><span></span><span></span><span></span><p>ساده در ظاهر.<br>دقیق در جزئیات.</p></div></div>
      </div>
      <div class="stage-foot"><span>دوخت زنانه · مجلسی ساده · تعمیرات زنانه و مردانه</span><a href="#/portfolio">کمی نزدیک‌تر ببین <b aria-hidden="true">↓</b></a></div>
    </section>

    <section class="editorial-collection">
      <div class="collection-heading"><div><p class="studio-kicker">۰۱ / برای روزهای واقعی</p><h2>کمتر شلوغ.<br><span>بیشتر شبیه تو.</span></h2></div><div class="collection-intro"><p>برش‌های ساده و جزئیاتی که تفاوت می‌سازند؛<br>برای روزمره، کار و مهمانی‌های خودمانی.</p><a class="fine-link" href="#/portfolio">دیدن همه مدل‌ها <span>↖</span></a></div></div>
      <div class="lookbook-grid">
        <a href="#/work/blouse" class="look look-one">${photo("blouse", "شومیز سفید ساده با یقه کلاسیک")}<div><small>۰۱</small><h3>راحت، هر روز.</h3><span>شومیز و لباس روزمره ↖</span></div></a>
        <a href="#/work/coat" class="look look-two">${photo("coat", "مانتوی ساده و روشن")}<div><small>۰۲</small><h3>یک برشِ ماندنی.</h3><span>مانتو و پالتو ↖</span></div></a>
        <a href="#/work/dress" class="look look-three">${photo("dress", "پیراهن ساده آبی برای مهمانی")}<div><small>۰۳</small><h3>بی‌تکلف، برای مهمانی.</h3><span>پیراهن مجلسی ساده ↖</span></div></a>
      </div><p class="collection-disclaimer">تصاویر این مجموعه، ایده‌های نمایشی دوخت هستند.</p>
    </section>

    <section class="repair-story">
      <div class="repair-story-visual">${photo("hem", "تعمیر لبه شلوار با دوخت دقیق")}<span>گاهی، فقط چند سانتی‌متر.</span></div>
      <div class="repair-story-copy"><p class="studio-kicker">۰۲ / هنوز دوستش داری؟</p><h2>قرار نیست<br>ازش <em>دل بکنی.</em></h2><p>قدش کمی بلند است؟ اندازه‌ات نیست؟ زیپش خراب شده؟<br>قبل از کنار گذاشتنش، درباره یک تغییر کوچک صحبت کنیم.</p><div class="repair-tags"><span>زنانه و مردانه</span><span>اصلاح سایز</span><span>کوتاهی</span><span>تعویض زیپ</span></div><a class="fine-link" href="#/repair-request">لباسم نیاز به تغییر دارد <span>↖</span></a></div>
    </section>

    <section class="atelier-note"><span class="note-number">از نزدیک</span><div><h2>تفاوت، جایی‌ست<br>که <span>دقت می‌کنیم.</span></h2><p>یقه‌ای که درست می‌ایستد. آستینی که اندازه است.<br>لباسی که موقع پوشیدنش، حس خوبی داری.</p><a class="fine-link" href="#/about">درباره آتلیه <span>↖</span></a></div><div class="detail-crop">${photo("craft", "کار دست روی یقه کت روشن")}<span>انتخاب پارچه / اندازه‌گیری / دوخت و پرو</span></div></section>

    <section class="home-callback"><div class="callback-copy"><p class="studio-kicker">۰۳ / ادامه‌اش را تلفنی حرف بزنیم</p><h2>شماره از تو،<br><span>تماس از ما.</span></h2><p>بگو چه لباسی در ذهن داری یا چه تغییری می‌خواهی.<br>برای صحبت درباره جزئیات با تو تماس می‌گیریم.</p><div class="callback-line"><span></span><small>بدون ثبت‌نام · بدون رزرو یا پرداخت قطعی</small></div></div><div class="callback-panel">${form("")}</div></section>
  </div>`;
}
