(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  applyThemeFromStorage();

  document.addEventListener("DOMContentLoaded", () => {
    initThemeMode();
    initMobileMenus();
    initWhatsAppPrefillLinks();
    initNewsletterForms();

    if (!prefersReducedMotion) {
      initRevealAnimations();
      initPointerGlow();
      initAmbientShift();
    }

    decorateInteractiveElements();
  });

  function initThemeMode() {
    const toggles = ensureThemeToggleButtons();
    syncThemeToggleIcons(toggles);

    toggles.forEach((toggle) => {
      if (toggle.dataset.themeBound === "true") {
        return;
      }

      toggle.addEventListener("click", () => {
        const isDark =
          document.documentElement.getAttribute("data-theme") === "dark";
        applyTheme(isDark ? "light" : "dark", true);
      });

      toggle.dataset.themeBound = "true";
    });
  }

  function applyThemeFromStorage() {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "dark";
    applyTheme(initialTheme, false);
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    syncThemeToggleIcons();

    if (persist) {
      localStorage.setItem("theme", theme);
    }
  }

  function ensureThemeToggleButtons() {
    const allMenus = Array.from(
      document.querySelectorAll(".main-menu .menu-list"),
    );
    if (!allMenus.length) {
      return [];
    }

    const existingButtons = Array.from(
      document.querySelectorAll("#theme-toggle, .theme-toggle"),
    );

    const normalizeButton = (button) => {
      button.classList.add("theme-toggle");
      button.type = "button";
      button.id = "theme-toggle";
      button.setAttribute("aria-label", "Toggle dark / light mode");
      button.setAttribute("title", "Toggle dark / light mode");
      return button;
    };

    const usedButtons = [];

    allMenus.forEach((menuList, index) => {
      let menuItem = menuList.querySelector(".theme-toggle-item");
      let button =
        menuItem?.querySelector("#theme-toggle, .theme-toggle") || null;

      if (!button) {
        const reusable = existingButtons.find(
          (candidate) => !usedButtons.includes(candidate),
        );
        button = reusable || document.createElement("button");
      }

      button = normalizeButton(button);

      if (!menuItem) {
        menuItem = document.createElement("li");
        menuItem.className = "menu-item theme-toggle-item";
      }

      menuItem.appendChild(button);
      menuList.appendChild(menuItem);
      usedButtons.push(button);

      if (!menuList.id) {
        menuList.id = `theme-nav-menu-${index + 1}`;
      }
    });

    existingButtons.forEach((button) => {
      if (!usedButtons.includes(button)) {
        button.remove();
      }
    });

    return usedButtons;
  }

  function syncThemeToggleIcons(targetButtons) {
    const buttons =
      targetButtons ||
      Array.from(document.querySelectorAll("#theme-toggle, .theme-toggle"));
    if (!buttons.length) {
      return;
    }

    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    buttons.forEach((button) => {
      button.textContent = isDark ? "🌙" : "☀️";
    });
  }

  function decorateInteractiveElements() {
    document.querySelectorAll(".btn-primary").forEach((button, index) => {
      if (index < 3) {
        button.classList.add("cta-glow");
      }
    });

    document
      .querySelectorAll(
        ".catalogue-card, .pathway-card, .info-panel, .bundle-card, .character-card",
      )
      .forEach((el) => {
        el.classList.add("glow-surface");
      });
  }

  function initMobileMenus() {
    const menus = document.querySelectorAll(".main-menu");
    if (!menus.length) {
      return;
    }

    const isMobileViewport = () => window.innerWidth <= 992;

    const closeAllMenus = () => {
      menus.forEach((menu) => {
        const menuList = menu.querySelector(".menu-list");
        const hamburger = menu.querySelector(".hamburger");
        menu.classList.remove("menu-open");
        if (menuList) {
          menuList.setAttribute("aria-hidden", "true");
        }
        if (hamburger) {
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    };

    menus.forEach((menu, menuIndex) => {
      const menuList = menu.querySelector(".menu-list");
      if (!menuList) {
        return;
      }

      let hamburger = menu.querySelector(".hamburger");
      if (!hamburger) {
        hamburger = document.createElement("button");
        hamburger.type = "button";
        hamburger.className = "hamburger";
        hamburger.innerHTML =
          '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        menu.appendChild(hamburger);
      } else if (hamburger.tagName.toLowerCase() !== "button") {
        const replacement = document.createElement("button");
        replacement.type = "button";
        replacement.className = hamburger.className || "hamburger";
        replacement.innerHTML = hamburger.innerHTML;
        hamburger.replaceWith(replacement);
        hamburger = replacement;
      }

      const menuId = menuList.id || `mobile-menu-${menuIndex + 1}`;
      menuList.id = menuId;
      hamburger.setAttribute("aria-controls", menuId);
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Toggle navigation menu");
      hamburger.setAttribute("aria-haspopup", "true");

      if (isMobileViewport()) {
        menuList.setAttribute("aria-hidden", "true");
      } else {
        menuList.setAttribute("aria-hidden", "false");
      }

      const closeMenu = () => {
        menu.classList.remove("menu-open");
        menuList.setAttribute("aria-hidden", "true");
        hamburger.setAttribute("aria-expanded", "false");
      };

      const openMenu = () => {
        closeAllMenus();
        menu.classList.add("menu-open");
        menuList.setAttribute("aria-hidden", "false");
        hamburger.setAttribute("aria-expanded", "true");
      };

      const toggleMenu = () => {
        if (!isMobileViewport()) {
          return;
        }

        if (menu.classList.contains("menu-open")) {
          closeMenu();
          return;
        }

        openMenu();
      };

      hamburger.addEventListener("click", toggleMenu);

      menuList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 992) {
            closeMenu();
          }
        });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMobileViewport()) {
        closeAllMenus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!isMobileViewport()) {
        return;
      }

      const clickedInsideMenu = event.target.closest(".main-menu");
      const clickedHamburger = event.target.closest(".hamburger");
      if (clickedInsideMenu || clickedHamburger) {
        return;
      }

      const isAnyOpen = Array.from(menus).some((menu) =>
        menu.classList.contains("menu-open"),
      );
      if (isAnyOpen) {
        closeAllMenus();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (!isMobileViewport()) {
          closeAllMenus();
          menus.forEach((menu) => {
            const menuList = menu.querySelector(".menu-list");
            if (menuList) {
              menuList.setAttribute("aria-hidden", "false");
            }
          });
        } else {
          menus.forEach((menu) => {
            const menuList = menu.querySelector(".menu-list");
            if (menuList && !menu.classList.contains("menu-open")) {
              menuList.setAttribute("aria-hidden", "true");
            }
          });
        }
      },
      { passive: true },
    );
  }

  function initRevealAnimations() {
    const targets = document.querySelectorAll(
      ".section-block .container, .catalogue-card, .pathway-card, .info-panel, .bundle-card, .character-card, .mini-newsletter, .store-toolbar",
    );

    if (!targets.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-on-scroll", "is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((target) => {
      target.classList.add("reveal-on-scroll");
      observer.observe(target);
    });
  }

  function initPointerGlow() {
    const canUsePointerGlow = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canUsePointerGlow) {
      return;
    }

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    document.body.classList.add("has-cursor-glow");

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener(
      "mousemove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        document.documentElement.style.setProperty(
          "--glow-x",
          `${(event.clientX / window.innerWidth) * 100}%`,
        );
        document.documentElement.style.setProperty(
          "--glow-y",
          `${(event.clientY / window.innerHeight) * 100}%`,
        );
      },
      { passive: true },
    );

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      glow.style.transform = `translate(${currentX - 140}px, ${currentY - 140}px)`;
      requestAnimationFrame(animate);
    };

    animate();
  }

  function initAmbientShift() {
    const hero = document.querySelector(".page-hero");
    if (!hero) {
      return;
    }

    let x = 50;
    let y = 40;

    window.addEventListener(
      "scroll",
      () => {
        const scrollY = window.scrollY || 0;
        const drift = Math.min(scrollY / 18, 24);
        hero.style.backgroundPosition = `${50 + drift * 0.15}% ${0 + drift * 0.3}%`;
        x = 15 + drift * 0.3;
        y = 10 + drift * 0.22;
        document.documentElement.style.setProperty("--glow-x", `${x}%`);
        document.documentElement.style.setProperty("--glow-y", `${y}%`);
      },
      { passive: true },
    );
  }

  function initWhatsAppPrefillLinks() {
    const whatsAppLinks = Array.from(
      document.querySelectorAll('a[href*="wa.me/"]'),
    );
    if (!whatsAppLinks.length) {
      return;
    }

    const pageLabel = getPageLabel();

    whatsAppLinks.forEach((link) => {
      let url;
      try {
        url = new URL(link.getAttribute("href"), window.location.origin);
      } catch (_error) {
        return;
      }

      if (!url.hostname.includes("wa.me")) {
        return;
      }

      const message = buildWhatsAppMessage(link, pageLabel);
      if (!message) {
        return;
      }

      url.searchParams.set("text", message);
      link.setAttribute("href", url.toString());
    });
  }

  function buildWhatsAppMessage(link, pageLabel) {
    const explicitMessage = (link.dataset.whatsappMessage || "").trim();
    if (explicitMessage) {
      return explicitMessage;
    }

    const explicitContext = (link.dataset.whatsappContext || "").trim();
    if (explicitContext) {
      return `Hi Ananse Learning, I was on your website exploring ${explicitContext} and I wanted to reach out and get more information.`;
    }

    const productTitle =
      link
        .closest(".catalogue-card, .store-preview-card, .bundle-card")
        ?.querySelector("h4, h3")
        ?.textContent?.trim() || "";

    if (productTitle) {
      return `Hi Ananse Learning, I was on your website exploring the ${pageLabel} and I am interested in the product \"${productTitle}\". I wanted to reach out for more information.`;
    }

    const sectionHeading =
      link
        .closest("section")
        ?.querySelector("h1, h2, h3")
        ?.textContent?.trim() || "";

    if (sectionHeading) {
      return `Hi Ananse Learning, I was on your website exploring the \"${sectionHeading}\" section and I wanted to reach out and get more information.`;
    }

    return `Hi Ananse Learning, I was on your website exploring the ${pageLabel} and I wanted to reach out and get more information.`;
  }

  function getPageLabel() {
    const title = (document.title || "").trim();
    if (!title) {
      return "website";
    }

    const segments = title
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
    return segments[segments.length - 1] || "website";
  }

  function initNewsletterForms() {
    const forms = Array.from(
      document.querySelectorAll(".newsletter-signup-form"),
    );
    if (!forms.length) {
      return;
    }

    forms.forEach((form) => {
      if (form.dataset.newsletterBound === "true") {
        return;
      }

      const emailInput = form.querySelector('input[type="email"]');
      const feedback = form.querySelector(".footer-feedback");
      if (!emailInput) {
        return;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!emailInput.checkValidity()) {
          if (feedback) {
            feedback.textContent = "Enter a valid email address to sign up.";
            feedback.classList.remove("is-success");
            feedback.classList.add("is-error");
          }
          emailInput.reportValidity();
          return;
        }

        if (feedback) {
          feedback.textContent =
            "Thanks. You are on the list for newsletter updates.";
          feedback.classList.remove("is-error");
          feedback.classList.add("is-success");
        }

        form.reset();
      });

      form.dataset.newsletterBound = "true";
    });
  }
})();
