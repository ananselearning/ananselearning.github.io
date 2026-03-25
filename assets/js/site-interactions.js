(() => {
  const VISIT_LOG_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbyTuNqApzg1PWpKA8kVH7p6N15-ByxchGCJCcsdNsoy-7L5U8sGVnjITtWOr3jBywYe_g/exec";
  const VISIT_LOG_SUPPRESS_KEY = "visit_log_suppressed";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let hasInitialized = false;

  applyThemeFromStorage();

  const initializePageInteractions = () => {
    if (hasInitialized) {
      return;
    }
    hasInitialized = true;

    initThemeMode();
    initMobileMenus();
    initPageImagery();
    initWhatsAppPrefillLinks();
    initNewsletterForms();
    initVisitLogging();

    if (!prefersReducedMotion) {
      initRevealAnimations();
      initPointerGlow();
      initAmbientShift();
    }

    decorateInteractiveElements();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePageInteractions);
  } else {
    initializePageInteractions();
  }

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

  function initPageImagery() {
    if (document.body.classList.contains("store-page")) {
      return;
    }

    const path = window.location.pathname;
    const imageConfig = getPageImageConfig(path);
    if (!imageConfig) {
      return;
    }

    const assetsPrefix = getAssetsPrefix(path);
    const hero = document.querySelector(".page-hero");

    if (hero && imageConfig.hero) {
      const heroImageUrl = `${assetsPrefix}/images/page_images/${imageConfig.hero}`;
      hero.classList.add("has-photo-hero");
      hero.style.backgroundImage = `linear-gradient(120deg, rgba(13, 34, 37, 0.68) 0%, rgba(16, 42, 45, 0.52) 100%), url("${heroImageUrl}")`;
    }

    if (!imageConfig.section) {
      return;
    }

    const firstSectionContainer = document.querySelector(
      ".section-block .container",
    );
    if (!firstSectionContainer) {
      return;
    }

    if (firstSectionContainer.querySelector(".page-feature-visual")) {
      return;
    }

    const figure = document.createElement("figure");
    figure.className = "page-feature-visual";

    const image = document.createElement("img");
    image.src = `${assetsPrefix}/images/page_images/${imageConfig.section}`;
    image.alt = imageConfig.sectionAlt || "Ananse Learning visual";
    image.loading = "lazy";

    figure.appendChild(image);
    firstSectionContainer.appendChild(figure);
  }

  function getAssetsPrefix(pathname) {
    if (pathname.includes("/pages/pathways/")) {
      return "../../assets";
    }
    if (pathname.includes("/pages/")) {
      return "../assets";
    }
    return "assets";
  }

  function getPageImageConfig(pathname) {
    const imageMap = [
      {
        page: "/index.html",
        hero: "hero-home-family-reading.jpg",
        section: null,
        sectionAlt: "",
      },
      {
        page: "/pages/about.html",
        hero: "hero-about-learning-journey.jpg",
        section: null,
        sectionAlt: "",
      },
      {
        page: "/pages/contact.html",
        hero: "hero-contact-community.jpg",
        section: "section-contact-reading.jpg",
        sectionAlt: "Family storytelling and connection",
      },
      {
        page: "/pages/learning-pathways.html",
        hero: "hero-learning-pathways.jpg",
        section: "section-learning-pathways.jpg",
        sectionAlt: "Learning pathways visual",
      },
      {
        page: "/pages/ntentan-universe.html",
        hero: "hero-ntentan-universe.jpg",
        section: "section-ntentan-story.jpg",
        sectionAlt: "Story world and imagination",
      },
      {
        page: "/pages/studiomansa.html",
        hero: "hero-studio-mansa.jpg",
        section: "section-studio-mansa.jpg",
        sectionAlt: "Creative studio storytelling visual",
      },
      {
        page: "/pages/qr-holding-page.html",
        hero: "hero-qr-coming-soon.jpg",
        section: "section-learning-pathways.jpg",
        sectionAlt: "Coming soon visual",
      },
      {
        page: "/pages/pathways/pathway-architecture.html",
        hero: "pathway-architecture.jpg",
        section: "section-art-design.jpg",
        sectionAlt: "Architecture pathway visual",
      },
      {
        page: "/pages/pathways/pathway-art-and-design.html",
        hero: "pathway-art-design.jpg",
        section: "section-art-design.jpg",
        sectionAlt: "Art and design pathway visual",
      },
      {
        page: "/pages/pathways/pathway-food-and-culture.html",
        hero: "pathway-food-culture.jpg",
        section: "section-food-culture.jpg",
        sectionAlt: "Food and culture pathway visual",
      },
      {
        page: "/pages/pathways/pathway-history-and-heritage.html",
        hero: "pathway-history-heritage.jpg",
        section: "section-history-heritage.jpg",
        sectionAlt: "History and heritage pathway visual",
      },
      {
        page: "/pages/pathways/pathway-literature.html",
        hero: "pathway-literature.jpg",
        section: "section-literature.jpg",
        sectionAlt: "Literature pathway visual",
      },
      {
        page: "/pages/pathways/pathway-research.html",
        hero: "pathway-research.jpg",
        section: "section-research.jpg",
        sectionAlt: "Research pathway visual",
      },
      {
        page: "/pages/pathways/pathway-sustainability.html",
        hero: "pathway-sustainability.jpg",
        section: "section-sustainability.jpg",
        sectionAlt: "Sustainability pathway visual",
      },
      {
        page: "/pages/pathways/pathway-technology.html",
        hero: "pathway-technology.jpg",
        section: "section-technology.jpg",
        sectionAlt: "Technology pathway visual",
      },
    ];

    const exactMatch = imageMap.find((item) => pathname.endsWith(item.page));
    if (exactMatch) {
      return exactMatch;
    }

    if (pathname === "/" || pathname.endsWith("/ananselearning.github.io")) {
      return imageMap.find((item) => item.page === "/index.html") || null;
    }

    return null;
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
    let backdrop = document.querySelector(".mobile-nav-backdrop");

    if (!backdrop) {
      backdrop = document.createElement("button");
      backdrop.type = "button";
      backdrop.className = "mobile-nav-backdrop";
      backdrop.setAttribute("aria-label", "Close navigation menu");
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
    }

    const syncBackdrop = () => {
      const isAnyOpen = Array.from(menus).some((menu) =>
        menu.classList.contains("menu-open"),
      );

      if (isMobileViewport() && isAnyOpen) {
        backdrop.hidden = false;
        backdrop.classList.add("is-visible");
        return;
      }

      backdrop.classList.remove("is-visible");
      backdrop.hidden = true;
    };

    const closeAllMenus = () => {
      menus.forEach((menu) => {
        const menuList = menu.querySelector(".menu-list");
        const hamburger = menu.querySelector(".mobile-nav-trigger, .hamburger");
        menu.classList.remove("menu-open");
        if (menuList) {
          menuList.setAttribute("aria-hidden", "true");
          menuList.hidden = true;
        }
        if (hamburger) {
          hamburger.setAttribute("aria-expanded", "false");
        }
      });

      syncBackdrop();
    };

    menus.forEach((menu, menuIndex) => {
      const menuList = menu.querySelector(".menu-list");
      if (!menuList) {
        return;
      }

      menu.classList.add("mobile-nav-enhanced");

      // Remove any StellarNav-injected toggle so it doesn't interfere
      const stellarToggle = menu.querySelector(".menu-toggle");
      if (stellarToggle) {
        stellarToggle.remove();
      }

      let controls = menu.querySelector(".mobile-nav-controls");
      if (!controls) {
        controls = document.createElement("div");
        controls.className = "mobile-nav-controls";
      }

      if (controls.parentElement !== menu) {
        menu.insertBefore(controls, menuList);
      }

      const desktopThemeButton = menuList.querySelector(
        ".theme-toggle-item .theme-toggle",
      );
      let mobileThemeButton = controls.querySelector(".theme-toggle-mobile");

      if (desktopThemeButton && !mobileThemeButton) {
        mobileThemeButton = document.createElement("button");
        mobileThemeButton.type = "button";
        mobileThemeButton.className = "theme-toggle theme-toggle-mobile";
        mobileThemeButton.removeAttribute("id");
        mobileThemeButton.setAttribute(
          "aria-label",
          "Toggle dark / light mode",
        );
        mobileThemeButton.setAttribute("title", "Toggle dark / light mode");
        mobileThemeButton.addEventListener("click", () => {
          const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";
          applyTheme(isDark ? "light" : "dark", true);
        });
        controls.appendChild(mobileThemeButton);
      }

      let hamburger = menu.querySelector(".mobile-nav-trigger, .hamburger");
      if (!hamburger) {
        hamburger = document.createElement("button");
        hamburger.type = "button";
        hamburger.className = "mobile-nav-trigger";
        hamburger.innerHTML =
          '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        controls.appendChild(hamburger);
      } else if (hamburger.tagName.toLowerCase() !== "button") {
        const replacement = document.createElement("button");
        replacement.type = "button";
        replacement.className =
          `${hamburger.className || ""} mobile-nav-trigger`.trim();
        replacement.innerHTML = hamburger.innerHTML;
        hamburger.replaceWith(replacement);
        hamburger = replacement;
      }

      if (!hamburger.querySelector(".bar")) {
        hamburger.innerHTML =
          '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
      }

      hamburger.classList.add("mobile-nav-trigger");
      hamburger.hidden = false;
      hamburger.removeAttribute("hidden");
      hamburger.style.removeProperty("display");

      if (hamburger.parentElement !== controls) {
        controls.appendChild(hamburger);
      }

      const menuId = menuList.id || `mobile-menu-${menuIndex + 1}`;
      menuList.id = menuId;
      hamburger.setAttribute("aria-controls", menuId);
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Toggle navigation menu");
      hamburger.setAttribute("aria-haspopup", "true");

      if (isMobileViewport()) {
        menuList.setAttribute("aria-hidden", "true");
        menuList.hidden = true;
      } else {
        menuList.setAttribute("aria-hidden", "false");
        menuList.hidden = false;
      }

      if (mobileThemeButton) {
        mobileThemeButton.hidden = !isMobileViewport();
      }

      const closeMenu = () => {
        menu.classList.remove("menu-open");
        menuList.setAttribute("aria-hidden", "true");
        menuList.hidden = true;
        hamburger.setAttribute("aria-expanded", "false");
        syncBackdrop();
      };

      const openMenu = () => {
        closeAllMenus();
        menu.classList.add("menu-open");
        menuList.setAttribute("aria-hidden", "false");
        menuList.hidden = false;
        hamburger.setAttribute("aria-expanded", "true");
        syncBackdrop();
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

    backdrop.addEventListener("click", closeAllMenus);

    document.addEventListener("click", (event) => {
      if (!isMobileViewport()) {
        return;
      }

      const clickedInsideMenu = event.target.closest(".main-menu");
      const clickedHamburger = event.target.closest(
        ".mobile-nav-trigger, .hamburger",
      );
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
            const mobileThemeButton = menu.querySelector(
              ".theme-toggle-mobile",
            );
            if (menuList) {
              menuList.setAttribute("aria-hidden", "false");
              menuList.hidden = false;
            }
            if (mobileThemeButton) {
              mobileThemeButton.hidden = true;
            }
          });
        } else {
          menus.forEach((menu) => {
            const menuList = menu.querySelector(".menu-list");
            const mobileThemeButton = menu.querySelector(
              ".theme-toggle-mobile",
            );
            if (menuList && !menu.classList.contains("menu-open")) {
              menuList.setAttribute("aria-hidden", "true");
              menuList.hidden = true;
            }
            if (mobileThemeButton) {
              mobileThemeButton.hidden = false;
            }
          });
        }

        syncBackdrop();
      },
      { passive: true },
    );

    syncThemeToggleIcons();
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

  function initVisitLogging() {
    try {
      if (sessionStorage.getItem(VISIT_LOG_SUPPRESS_KEY) === "true") {
        return;
      }
    } catch (storageError) {
      // Ignore storage access issues and attempt logging.
    }

    logVisit().catch(() => {
      suppressVisitLoggingForSession();
    });
  }

  async function logVisit() {
    const storageKey = "site_client_id";
    let clientId = "";

    try {
      clientId = localStorage.getItem(storageKey) || "";
      if (!clientId) {
        clientId =
          window.crypto && typeof window.crypto.randomUUID === "function"
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(storageKey, clientId);
      }
    } catch (storageError) {
      clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    const payload = {
      path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      clientId,
      timestampGmt: getGmtTimestamp(),
    };

    const posted = await postVisitLog(payload);
    if (posted) {
      return;
    }

    const getFallbackSent = await sendVisitLogByGet(payload);
    if (!getFallbackSent) {
      throw new Error("Visit log transports failed");
    }
  }

  async function postVisitLog(payload) {
    try {
      const body = JSON.stringify(payload);
      await fetch(VISIT_LOG_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body,
        keepalive: true,
        credentials: "omit",
        cache: "no-store",
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function sendVisitLogByGet(payload) {
    try {
      const url = new URL(VISIT_LOG_ENDPOINT);
      url.searchParams.set("path", payload.path);
      url.searchParams.set("url", payload.url);
      url.searchParams.set("userAgent", payload.userAgent);
      url.searchParams.set("clientId", payload.clientId);
      url.searchParams.set("timestampGmt", payload.timestampGmt);

      if (navigator.sendBeacon) {
        const beaconSent = navigator.sendBeacon(url.toString());
        if (beaconSent) {
          return true;
        }
      }

      await fetch(url.toString(), {
        method: "GET",
        mode: "no-cors",
        keepalive: true,
        credentials: "omit",
        cache: "no-store",
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  function suppressVisitLoggingForSession() {
    try {
      sessionStorage.setItem(VISIT_LOG_SUPPRESS_KEY, "true");
    } catch (storageError) {
      // Ignore storage access issues.
    }
  }

  function getGmtTimestamp() {
    return new Date().toISOString();
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

      let feedbackTimer = null;

      const setFeedbackMessage = (message, status) => {
        if (!feedback) {
          return;
        }

        feedback.textContent = message;
        feedback.classList.remove("is-success", "is-error");
        if (status) {
          feedback.classList.add(status);
        }

        if (feedbackTimer) {
          window.clearTimeout(feedbackTimer);
          feedbackTimer = null;
        }

        feedbackTimer = window.setTimeout(() => {
          feedback.textContent = "";
          feedback.classList.remove("is-success", "is-error");
        }, 4500);
      };

      const emailInput = form.querySelector('input[type="email"]');
      const feedback = form.querySelector(".footer-feedback");
      if (!emailInput) {
        return;
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!emailInput.checkValidity()) {
          setFeedbackMessage(
            "Enter a valid email address to sign up.",
            "is-error",
          );
          emailInput.reportValidity();
          return;
        }

        const submitEndpoint = form.dataset.submitEndpoint;
        if (submitEndpoint) {
          try {
            const timestampGmt = getGmtTimestamp();
            const payload = new URLSearchParams({
              email: emailInput.value,
              timestampGmt,
            });

            const response = await fetch(submitEndpoint, {
              method: "POST",
              mode: "no-cors",
              body: payload,
            });

            let message = "Thanks. Your newsletter signup was submitted.";

            if (response.type !== "opaque") {
              try {
                const result = await response.json();
                message = result.message || message;
              } catch (parseError) {
                message = "Submitted.";
              }
            }

            if (feedback) {
              setFeedbackMessage(message, "is-success");
            }

            form.reset();
          } catch (requestError) {
            const errorMessage =
              "Unable to submit right now. Please try again.";
            setFeedbackMessage(errorMessage, "is-error");
          }

          return;
        }

        setFeedbackMessage(
          "Thanks. You are on the list for newsletter updates.",
          "is-success",
        );

        form.reset();
      });

      form.dataset.newsletterBound = "true";
    });
  }
})();
