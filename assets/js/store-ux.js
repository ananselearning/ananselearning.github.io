/* ==========================================================
   STORE UX INTERACTIONS
   Scroll progress, sticky nav scroll-spy, reveal animations,
   back-to-top, smooth scroll
   ========================================================== */
(function () {
  "use strict";

  // ── Header height → CSS custom property (for sticky category nav offset) ──
  const headerWrap = document.getElementById("header-wrap");
  function syncHeaderHeight() {
    if (headerWrap) {
      document.documentElement.style.setProperty(
        "--header-height",
        headerWrap.offsetHeight + "px",
      );
    }
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });

  // ── Scroll Progress Bar ──
  const progressBar = document.querySelector(".scroll-progress");

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progressBar) {
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      progressBar.style.width = pct + "%";
    }
  }

  // ── Sticky Category Nav Scroll-Spy ──
  const categoryNav = document.getElementById("store-category-nav");
  const navLinks = categoryNav
    ? categoryNav.querySelectorAll(".category-nav-link[data-section]")
    : [];
  const sectionIds = [];
  navLinks.forEach(function (link) {
    sectionIds.push(link.getAttribute("data-section"));
  });

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("data-section") === id) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  // Use IntersectionObserver for scroll-spy
  if ("IntersectionObserver" in window && sectionIds.length > 0) {
    var activeSection = sectionIds[0];
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
            setActiveNav(activeSection);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  // Mark nav scrolled state for shadow
  function updateNavShadow() {
    if (categoryNav) {
      if (window.scrollY > 200) {
        categoryNav.classList.add("is-scrolled");
      } else {
        categoryNav.classList.remove("is-scrolled");
      }
    }
  }

  // ── Smooth scroll for nav links ──
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("data-section");
      var target = document.getElementById(targetId);
      if (target) {
        var navHeight = categoryNav ? categoryNav.offsetHeight : 0;
        var hdrHeight = headerWrap ? headerWrap.offsetHeight : 0;
        var top =
          target.getBoundingClientRect().top +
          window.scrollY -
          hdrHeight -
          navHeight -
          16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  // ── Staggered Reveal on Scroll ──
  // Progressive enhancement: cards are visible by default (no opacity:0 in CSS).
  // Only on non-mobile viewports with IntersectionObserver do we add .has-reveal
  // to <html>, which activates the opacity:0 -> is-revealed animation in CSS.
  var revealCards = document.querySelectorAll(".reveal-card");
  var isMobile = window.matchMedia("(max-width: 768px)").matches;
  var postersSection = document.getElementById("posters");

  function ensureMobilePostersVisible() {
    var mobileNow = window.matchMedia("(max-width: 768px)").matches;
    if (!postersSection) {
      return;
    }

    if (mobileNow) {
      postersSection.classList.add("mobile-force-visible");
      postersSection.style.opacity = "1";
      postersSection.style.visibility = "visible";

      postersSection
        .querySelectorAll(".reveal-on-scroll")
        .forEach(function (node) {
          node.classList.add("is-visible");
          node.style.opacity = "1";
          node.style.transform = "none";
        });

      postersSection
        .querySelectorAll(".catalogue-card")
        .forEach(function (card) {
          card.classList.remove("is-hidden");
          card.style.display = "flex";
        });

      postersSection.querySelectorAll(".reveal-card").forEach(function (card) {
        card.classList.add("is-revealed");
      });
    } else {
      postersSection.classList.remove("mobile-force-visible");
      postersSection.style.opacity = "";
      postersSection.style.visibility = "";

      postersSection
        .querySelectorAll(".reveal-on-scroll")
        .forEach(function (node) {
          node.style.opacity = "";
          node.style.transform = "";
        });

      postersSection
        .querySelectorAll(".catalogue-card")
        .forEach(function (card) {
          card.style.display = "";
        });
    }
  }

  ensureMobilePostersVisible();

  if (!isMobile && "IntersectionObserver" in window && revealCards.length > 0) {
    // Enable reveal animations — cards will start hidden via CSS
    document.documentElement.classList.add("has-reveal");

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.01 },
    );

    revealCards.forEach(function (card) {
      revealObserver.observe(card);
    });

    // Safety net: force-reveal any remaining cards after 4 seconds
    setTimeout(function () {
      revealCards.forEach(function (card) {
        if (!card.classList.contains("is-revealed")) {
          card.classList.add("is-revealed");
        }
      });
    }, 4000);
  }
  // On mobile or without IntersectionObserver: cards stay visible (no .has-reveal)

  window.addEventListener("resize", ensureMobilePostersVisible);
  window.addEventListener("orientationchange", ensureMobilePostersVisible);
  window.addEventListener("load", function () {
    ensureMobilePostersVisible();
    // Run once more after layout settles on mobile browsers.
    setTimeout(ensureMobilePostersVisible, 180);
  });

  // ── Back to Top Button ──
  var backToTop = document.getElementById("back-to-top");

  function toggleBackToTop() {
    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Throttled Scroll Handler ──
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavShadow();
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ── Hero "Shop Now" smooth scroll ──
  var heroShop = document.querySelector('a[href="#featured"]');
  if (heroShop) {
    heroShop.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById("featured");
      if (target) {
        var navHeight = categoryNav ? categoryNav.offsetHeight : 0;
        var hdrHeight = headerWrap ? headerWrap.offsetHeight : 0;
        var top =
          target.getBoundingClientRect().top +
          window.scrollY -
          hdrHeight -
          navHeight -
          16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  }

  var heroBrowse = document.querySelector('a[href="#books"]');
  if (heroBrowse) {
    heroBrowse.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById("books");
      if (target) {
        var navHeight = categoryNav ? categoryNav.offsetHeight : 0;
        var hdrHeight = headerWrap ? headerWrap.offsetHeight : 0;
        var top =
          target.getBoundingClientRect().top +
          window.scrollY -
          hdrHeight -
          navHeight -
          16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  }

  // ── Init on load ──
  updateScrollProgress();
  updateNavShadow();
  toggleBackToTop();
})();
