const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
    document.body.style.overflow = open ? "" : "hidden";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = group.querySelectorAll(".chip");
  const panels = document.querySelectorAll("[data-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== id;
      });
    });
  });
});

const form = document.querySelector("#booking-form");
const status = document.querySelector(".form-status");

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "").trim();

    if (!name || !phone || !service) {
      status.textContent = "Please share your name, phone, and preferred service.";
      status.classList.add("error");
      return;
    }

    status.classList.remove("error");
    status.textContent = "Opening Booksy so you can confirm your chair time.";
    form.reset();
    window.open(
      "https://booksy.com/en-us/954976_suave-elite-barbershop_barber-shop_134786_dallas",
      "_blank",
      "noopener"
    );
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
