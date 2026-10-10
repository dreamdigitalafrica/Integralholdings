(function () {
  const launchTime = document.querySelector("[data-launch-time]");
  if (!launchTime) return;

  const duration = 30 * 24 * 60 * 60 * 1000;
  const storageKey = "integral-launch-target-v2";
  let target = Number(localStorage.getItem(storageKey));

  if (!target || target < Date.now()) {
    target = Date.now() + duration;
    localStorage.setItem(storageKey, String(target));
  }

  const pad = (value) => String(value).padStart(2, "0");

  function tick() {
    const remaining = Math.max(target - Date.now(), 0);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    launchTime.textContent = `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  tick();
  setInterval(tick, 1000);
}());

(function () {
  const header = document.querySelector(".integral-header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY > 120 && scrollingDown) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }

    lastScrollY = Math.max(currentScrollY, 0);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}());

(function () {
  const menus = document.querySelectorAll(".company-menu");
  if (!menus.length) return;

  menus.forEach((menu) => {
    let closeTimer;

    const open = () => {
      window.clearTimeout(closeTimer);
      menu.classList.add("is-open");
    };

    const close = () => {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (!menu.matches(":hover") && !menu.contains(document.activeElement)) {
          menu.classList.remove("is-open");
        }
      }, 260);
    };

    menu.addEventListener("pointerenter", open);
    menu.addEventListener("pointerleave", close);
    menu.addEventListener("focusin", open);
    menu.addEventListener("focusout", close);
  });
}());

(function () {
  const header = document.querySelector(".integral-header");
  const nav = header && header.querySelector(".integral-nav");
  if (!nav) return;

  nav.id = nav.id || "integral-site-nav";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "integral-menu-toggle";
  toggle.setAttribute("aria-label", "Open menu");
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
  header.appendChild(toggle);

  const setOpen = (open) => {
    header.classList.toggle("is-mobile-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = open
      ? '<i class="fa fa-times" aria-hidden="true"></i>'
      : '<i class="fa fa-bars" aria-hidden="true"></i>';
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!header.classList.contains("is-mobile-open"));
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1380) setOpen(false);
  });
}());

(function () {
  const triggers = document.querySelectorAll("[data-modal-target]");
  const modals = document.querySelectorAll(".leadership-modal");
  if (!triggers.length || !modals.length) return;

  let activeTrigger = null;

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (activeTrigger) activeTrigger.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modalTarget);
      if (!modal) return;

      activeTrigger = trigger;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      const closeButton = modal.querySelector(".modal-close");
      if (closeButton) closeButton.focus();
    });
  });

  modals.forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
      closeButton.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openModal = document.querySelector(".leadership-modal.is-open");
    if (openModal) closeModal(openModal);
  });
}());

(function () {
  const carousel = document.querySelector("[data-autos-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-autos-track]");
  const cards = Array.from(track.querySelectorAll(".autos-vehicle-card"));
  const dots = Array.from(carousel.querySelectorAll("[data-autos-dot]"));
  const previous = carousel.querySelector("[data-autos-prev]");
  const next = carousel.querySelector("[data-autos-next]");
  let activeIndex = 0;
  let scrollFrame = 0;

  const update = (index) => {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === activeIndex));
    });
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === cards.length - 1;
  };

  const goTo = (index) => {
    const boundedIndex = Math.max(0, Math.min(index, cards.length - 1));
    cards[boundedIndex].scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "start"
    });
    update(boundedIndex);
  };

  previous.addEventListener("click", () => goTo(activeIndex - 1));
  next.addEventListener("click", () => goTo(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  track.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const nearest = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity });
      update(nearest.index);
    });
  }, { passive: true });

  update(0);
}());
