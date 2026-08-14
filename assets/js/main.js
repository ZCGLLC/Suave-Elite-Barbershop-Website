/**
 * Suave Elite Barbershop — site behaviour
 * Vanilla JS, no dependencies. Every enhancement degrades gracefully.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
   * Header: solid background once the page scrolls
   * -------------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  var bookbar = document.querySelector("[data-bookbar]");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 24);
    if (bookbar) bookbar.classList.toggle("is-visible", y > 420);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
   * Mobile menu
   * -------------------------------------------------------------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var drawer = document.querySelector("[data-mobile-menu]");

  function setMenu(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1040) setMenu(false);
    });
  }

  /* ----------------------------------------------------------------------
   * Scroll reveals
   * -------------------------------------------------------------------- */
  var revealables = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Stagger children inside any [data-reveal-group] */
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var step = parseInt(group.getAttribute("data-reveal-group"), 10) || 90;
    Array.prototype.forEach.call(group.children, function (child, index) {
      if (child.hasAttribute("data-reveal")) {
        child.style.setProperty("--reveal-delay", index * step + "ms");
      }
    });
  });

  /* ----------------------------------------------------------------------
   * Opening hours — highlight today and show live open/closed status
   * Hours are stored in shop-local time (America/Chicago).
   * index 0 = Sunday, matching Date#getDay()
   * -------------------------------------------------------------------- */
  var HOURS = [
    { open: 10, close: 17 }, // Sunday
    { open: 10, close: 19 }, // Monday
    { open: 10, close: 19 }, // Tuesday
    { open: 10, close: 19 }, // Wednesday
    { open: 10, close: 19 }, // Thursday
    { open: 10, close: 19 }, // Friday
    { open: 10, close: 19 }, // Saturday
  ];

  function shopNow() {
    // Read "now" as it is at the shop, regardless of the visitor's timezone.
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(new Date());

      var lookup = {};
      parts.forEach(function (part) {
        lookup[part.type] = part.value;
      });

      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(lookup.hour, 10);

      return {
        day: days[lookup.weekday],
        minutes: (hour === 24 ? 0 : hour) * 60 + parseInt(lookup.minute, 10),
      };
    } catch (error) {
      var fallback = new Date();
      return {
        day: fallback.getDay(),
        minutes: fallback.getHours() * 60 + fallback.getMinutes(),
      };
    }
  }

  function formatHour(hour) {
    var suffix = hour >= 12 ? "PM" : "AM";
    var display = hour % 12 === 0 ? 12 : hour % 12;
    return display + " " + suffix;
  }

  var now = shopNow();
  var today = HOURS[now.day];
  var isOpen =
    now.minutes >= today.open * 60 && now.minutes < today.close * 60;

  document.querySelectorAll("[data-day]").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === now.day) {
      row.classList.add("is-today");
    }
  });

  document.querySelectorAll("[data-status]").forEach(function (el) {
    if (isOpen) {
      el.textContent = "Open now \u00b7 until " + formatHour(today.close);
      el.classList.add("is-open");
    } else {
      var nextDay = now.minutes < today.open * 60 ? now.day : (now.day + 1) % 7;
      var label = now.minutes < today.open * 60 ? "today" : "tomorrow";
      el.textContent =
        "Closed \u00b7 opens " + label + " at " + formatHour(HOURS[nextDay].open);
      el.classList.remove("is-open");
    }
  });

  /* ----------------------------------------------------------------------
   * FAQ accordion
   * -------------------------------------------------------------------- */
  document.querySelectorAll("[data-accordion]").forEach(function (root) {
    var triggers = root.querySelectorAll(".accordion__trigger");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(
          trigger.getAttribute("aria-controls")
        );

        triggers.forEach(function (other) {
          if (other === trigger) return;
          other.setAttribute("aria-expanded", "false");
          var otherPanel = document.getElementById(
            other.getAttribute("aria-controls")
          );
          if (otherPanel) otherPanel.setAttribute("data-open", "false");
        });

        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.setAttribute("data-open", String(!expanded));
      });
    });
  });

  /* ----------------------------------------------------------------------
   * Service filter (services page)
   * -------------------------------------------------------------------- */
  var filterRoot = document.querySelector("[data-filter-root]");

  if (filterRoot) {
    var chips = filterRoot.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll("[data-service-tags]");
    var emptyState = document.querySelector("[data-filter-empty]");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter");
        var shown = 0;

        chips.forEach(function (other) {
          other.classList.toggle("is-active", other === chip);
          other.setAttribute("aria-pressed", String(other === chip));
        });

        items.forEach(function (item) {
          var tags = item.getAttribute("data-service-tags") || "";
          var match = value === "all" || tags.indexOf(value) !== -1;
          item.hidden = !match;
          if (match) shown++;
        });

        // Hide any menu group left with no visible rows.
        document.querySelectorAll("[data-service-group]").forEach(function (group) {
          var visible = group.querySelectorAll(
            "[data-service-tags]:not([hidden])"
          ).length;
          group.hidden = visible === 0;
        });

        if (emptyState) emptyState.hidden = shown !== 0;
      });
    });

    var resetButton = document.querySelector("[data-filter-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        var showAll = filterRoot.querySelector('[data-filter="all"]');
        if (showAll) showAll.click();
      });
    }
  }

  /* ----------------------------------------------------------------------
   * Sub-navigation active state
   * -------------------------------------------------------------------- */
  var subnavLinks = document.querySelectorAll("[data-subnav] a");

  if (subnavLinks.length && "IntersectionObserver" in window) {
    var sections = [];
    subnavLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) sections.push({ link: link, target: target });
    });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          subnavLinks.forEach(function (link) {
            link.classList.remove("is-active");
          });
          var match = sections.filter(function (item) {
            return item.target === entry.target;
          })[0];
          if (match) match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(function (item) {
      sectionObserver.observe(item.target);
    });
  }

  /* ----------------------------------------------------------------------
   * Current year in footer
   * -------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
