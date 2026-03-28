/* ==========================================================
   STORE UX INTERACTIONS
   Scroll progress, sticky nav scroll-spy, reveal animations,
   back-to-top, smooth scroll
   ========================================================== */
(function () {
  "use strict";

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
        var top =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  // ── Staggered Reveal on Scroll ──
  var revealCards = document.querySelectorAll(".reveal-card");

  if ("IntersectionObserver" in window && revealCards.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 },
    );

    revealCards.forEach(function (card) {
      revealObserver.observe(card);
    });
  } else {
    // Fallback: reveal all immediately
    revealCards.forEach(function (card) {
      card.classList.add("is-revealed");
    });
  }

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
        var top =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
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
        var top =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  }

  // ── Init on load ──
  updateScrollProgress();
  updateNavShadow();
  toggleBackToTop();
})();
