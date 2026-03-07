(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenus();
    initWhatsAppPrefillLinks();

    if (!prefersReducedMotion) {
      initRevealAnimations();
      initPointerGlow();
      initAmbientShift();
    }

    decorateInteractiveElements();
  });

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
      }

      if (hamburger.tagName.toLowerCase() !== "button") {
        hamburger.setAttribute("role", "button");
        hamburger.setAttribute("tabindex", "0");
      }

      const menuId = menuList.id || `mobile-menu-${menuIndex + 1}`;
      menuList.id = menuId;
      hamburger.setAttribute("aria-controls", menuId);
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Toggle navigation menu");

      const toggleMenu = () => {
        const nextState = !menu.classList.contains("menu-open");
        menu.classList.toggle("menu-open", nextState);
        hamburger.setAttribute("aria-expanded", String(nextState));
      };

      hamburger.addEventListener("click", toggleMenu);
      hamburger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleMenu();
        }
      });

      menuList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 992) {
            menu.classList.remove("menu-open");
            hamburger.setAttribute("aria-expanded", "false");
          }
        });
      });
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 992) {
          document.querySelectorAll(".main-menu.menu-open").forEach((menu) => {
            menu.classList.remove("menu-open");
            const hamburger = menu.querySelector(".hamburger");
            if (hamburger) {
              hamburger.setAttribute("aria-expanded", "false");
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
})();
