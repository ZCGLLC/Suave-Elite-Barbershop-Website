const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

toggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  });
});
