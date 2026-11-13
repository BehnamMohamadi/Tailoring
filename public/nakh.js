let designName = "کت زنانه",
  designImage = "women",
  designColor = "زیتونی",
  cart = [];
const images = {
  women: "/assets/nakh/women-hq.jpg",
  blouse: "/assets/blouse.jpg",
  evening: "/assets/nakh/evening-hq.jpg",
  coat: "/assets/nakh/coat-hq.jpg",
};
function toast(t) {
  const x = document.getElementById("toast");
  x.textContent = t;
  x.classList.add("show");
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => x.classList.remove("show"), 3500);
}
function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("show");
  document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");
  document
    .querySelector(".menu-btn")
    .setAttribute("aria-label", "باز کردن منو");
}
function toggleMenu() {
  const open = document.getElementById("mobileMenu").classList.toggle("show");
  const button = document.querySelector(".menu-btn");
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
}
function openModal(title) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modal").classList.add("on");
  document.body.style.overflow = "hidden";
  document.getElementById("service").value = title.includes("تعمیر")
    ? "تعمیر یا تغییر لباس"
    : title.includes("دوخت")
      ? "دوخت اختصاصی"
      : title.includes("خرید")
        ? "خرید لباس"
        : "مشاوره";
}
function closeModal() {
  document.getElementById("modal").classList.remove("on");
  document.body.style.overflow = "";
}
async function demoSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("requestForm");
  const button = form.querySelector('button[type="submit"]');
  const message = document.getElementById("requestStatus");
  const phone = document.getElementById("phone");
  const normalized = phone.value
    .replace(/[۰-۹٠-٩]/g, (c) =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".includes(c)
          ? "۰۱۲۳۴۵۶۷۸۹".indexOf(c)
          : "٠١٢٣٤٥٦٧٨٩".indexOf(c),
      ),
    )
    .replace(/[\s()-]/g, "");
  if (!/^(09\d{9}|\+989\d{9}|00989\d{9})$/.test(normalized)) {
    phone.setCustomValidity("شماره موبایل معتبر وارد کنید.");
    phone.reportValidity();
    return;
  }
  button.disabled = true;
  message.textContent = "در حال ثبت درخواست…";
  try {
    const service = document.getElementById("service").value;
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        phone: normalized,
        service: "سایر",
        note:
          "نوع درخواست: " +
          service +
          "\n" +
          document.getElementById("details").value,
        consent: document.getElementById("contactConsent").checked,
        website: "",
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "ثبت درخواست انجام نشد.");
    form.reset();
    closeModal();
    toast("شماره شما ثبت شد؛ برای بررسی درخواست با شما تماس می‌گیریم.");
    message.textContent = "";
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}
function addCart(name) {
  cart.push(name);
  document.getElementById("cartNum").textContent = String(cart.length).replace(
    /\d/g,
    (x) => "۰۱۲۳۴۵۶۷۸۹"[x],
  );
  toast("«" + name + "» به لیست انتخاب نمایشی اضافه شد");
}
function showCart() {
  toast(
    cart.length
      ? "انتخاب‌های شما: " + cart.join("، ")
      : "لیست انتخاب هنوز خالیه",
  );
}
function filterProducts(type, btn) {
  document
    .querySelectorAll(".filterbar button")
    .forEach((x) => x.classList.remove("active"));
  if (btn) {
    btn.classList.add("active");
  } else {
    const index = { all: 0, women: 1, coat: 2, evening: 3 };
    document
      .querySelectorAll(".filterbar button")
      [index[type] || 0].classList.add("active");
  }
  document
    .querySelectorAll(".product")
    .forEach((x) =>
      x.classList.toggle(
        "hide",
        type !== "all" && !x.dataset.type.split(" ").includes(type),
      ),
    );
}
function setStyle(name, btn, image) {
  designName = name;
  designImage = image;
  document
    .querySelectorAll(".style-tab")
    .forEach((x) => x.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("designPhoto").src = images[image];
  updateDesignLabel();
}
function setColor(color, btn) {
  designColor = color;
  document
    .querySelectorAll(".swatches button")
    .forEach((x) => x.classList.remove("active"));
  btn.classList.add("active");
  updateDesignLabel();
}
function updateDesignLabel() {
  document.getElementById("designLabel").textContent =
    "انتخاب فعلی: " + designName + " | " + designColor;
}
function openDesign() {
  openModal("دوخت اختصاصی");
  document.getElementById("details").value =
    "مدل دلخواه: " + designName + " | رنگ مورد علاقه: " + designColor;
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

document
  .querySelector("[data-nakh-action-0]")
  .addEventListener("click", function (event) {
    showCart();
  });
document
  .querySelector("[data-nakh-action-1]")
  .addEventListener("click", function (event) {
    openModal("ثبت سفارش دوخت اختصاصی");
  });
document
  .querySelector("[data-nakh-action-2]")
  .addEventListener("click", function (event) {
    toggleMenu();
  });
document
  .querySelector("[data-nakh-action-3]")
  .addEventListener("click", function (event) {
    closeMenu();
  });
document
  .querySelector("[data-nakh-action-4]")
  .addEventListener("click", function (event) {
    closeMenu();
  });
document
  .querySelector("[data-nakh-action-5]")
  .addEventListener("click", function (event) {
    closeMenu();
  });
document
  .querySelector("[data-nakh-action-6]")
  .addEventListener("click", function (event) {
    closeMenu();
  });
document
  .querySelector("[data-nakh-action-7]")
  .addEventListener("click", function (event) {
    closeMenu();
  });
document
  .querySelector("[data-nakh-action-8]")
  .addEventListener("click", function (event) {
    openModal("دوخت اختصاصی");
  });
document
  .querySelector("[data-nakh-action-9]")
  .addEventListener("click", function (event) {
    filterProducts("women");
  });
document
  .querySelector("[data-nakh-action-10]")
  .addEventListener("click", function (event) {
    event.preventDefault();
    openModal("تعمیرات لباس مردانه");
  });
document
  .querySelector("[data-nakh-action-11]")
  .addEventListener("click", function (event) {
    filterProducts("evening");
  });
document
  .querySelector("[data-nakh-action-12]")
  .addEventListener("click", function (event) {
    filterProducts("coat");
  });
document
  .querySelector("[data-nakh-action-13]")
  .addEventListener("click", function (event) {
    setStyle("کت زنانه", this, "women");
  });
document
  .querySelector("[data-nakh-action-14]")
  .addEventListener("click", function (event) {
    setStyle("شومیز زنانه", this, "blouse");
  });
document
  .querySelector("[data-nakh-action-15]")
  .addEventListener("click", function (event) {
    setStyle("پیراهن مجلسی", this, "evening");
  });
document
  .querySelector("[data-nakh-action-16]")
  .addEventListener("click", function (event) {
    setStyle("پالتو", this, "coat");
  });
document
  .querySelector("[data-nakh-action-17]")
  .addEventListener("click", function (event) {
    setColor("زیتونی", this);
  });
document
  .querySelector("[data-nakh-action-18]")
  .addEventListener("click", function (event) {
    setColor("کرم", this);
  });
document
  .querySelector("[data-nakh-action-19]")
  .addEventListener("click", function (event) {
    setColor("مشکی", this);
  });
document
  .querySelector("[data-nakh-action-20]")
  .addEventListener("click", function (event) {
    setColor("زرشکی", this);
  });
document
  .querySelector("[data-nakh-action-21]")
  .addEventListener("click", function (event) {
    setColor("سرمه‌ای", this);
  });
document
  .querySelector("[data-nakh-action-22]")
  .addEventListener("click", function (event) {
    openDesign();
  });
document
  .querySelector("[data-nakh-action-23]")
  .addEventListener("click", function (event) {
    openModal("درخواست تعمیر لباس");
  });
document
  .querySelector("[data-nakh-action-24]")
  .addEventListener("click", function (event) {
    filterProducts("all", this);
  });
document
  .querySelector("[data-nakh-action-25]")
  .addEventListener("click", function (event) {
    filterProducts("women", this);
  });
document
  .querySelector("[data-nakh-action-26]")
  .addEventListener("click", function (event) {
    filterProducts("coat", this);
  });
document
  .querySelector("[data-nakh-action-27]")
  .addEventListener("click", function (event) {
    filterProducts("evening", this);
  });
document
  .querySelector("[data-nakh-action-28]")
  .addEventListener("click", function (event) {
    addCart("پالتوی کرم کلاسیک");
  });
document
  .querySelector("[data-nakh-action-29]")
  .addEventListener("click", function (event) {
    addCart("شومیز ساده زنانه");
  });
document
  .querySelector("[data-nakh-action-30]")
  .addEventListener("click", function (event) {
    addCart("پیراهن مجلسی مشکی");
  });
document
  .querySelector("[data-nakh-action-31]")
  .addEventListener("click", function (event) {
    addCart("کت زنانه شهری");
  });
document
  .querySelector("[data-nakh-action-32]")
  .addEventListener("click", function (event) {
    openModal("مشاوره و ثبت سفارش");
  });
document
  .querySelector("[data-nakh-action-33]")
  .addEventListener("click", function (event) {
    closeModal();
  });
document
  .querySelector("[data-nakh-action-34]")
  .addEventListener("submit", function (event) {
    demoSubmit(event);
  });
document.getElementById("phone").addEventListener("input", function () {
  this.setCustomValidity("");
});
document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");
document.querySelector(".menu-btn").setAttribute("aria-controls", "mobileMenu");
matchMedia("(min-width:1101px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
