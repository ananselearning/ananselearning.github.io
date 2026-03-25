(() => {
  const FOOTER_EMAIL = "ananselearning@gmail.com";
  const BROWSER_EMAIL_COMPOSE_URL =
    "https://mail.google.com/mail/?view=cm&fs=1&to=ananselearning@gmail.com";
  const MOBILE_FOOTER_COLLAPSE_CLASS = "is-mobile-collapsed";
  const MOBILE_BODY_FOOTER_COLLAPSE_CLASS = "footer-mobile-collapsed";
  const MOBILE_FOOTER_INITIAL_EXPANDED_MS = 3000;

  function getFooterLinkPrefix(pathname) {
    if (pathname.includes("/pages/pathways/")) {
      return "../";
    }

    if (pathname.includes("/pages/")) {
      return "";
    }

    return "pages/";
  }

  function renderFooter() {
    const footerGrids = document.querySelectorAll(".site-footer-grid");
    if (!footerGrids.length) {
      return;
    }

    const prefix = getFooterLinkPrefix(window.location.pathname);

    footerGrids.forEach((grid) => {
      grid.innerHTML = `
        <div class="footer-item">
          <strong>Ananse Learning</strong>
          <span>Airport West, 198 Osu Badu St, Accra</span>
        </div>
        <div class="footer-item footer-social-icons">
          <a href="https://www.facebook.com/profile.php?id=61584932624965&_rdc=1&_rdr" target="_blank" rel="noopener" class="social-icon-link" aria-label="Facebook">
            <i class="icon icon-facebook" aria-hidden="true"></i>
          </a>
          <a href="https://www.instagram.com/ananselearning" target="_blank" rel="noopener" class="social-icon-link" aria-label="Instagram">
            <svg class="social-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"></rect>
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
              <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor"></circle>
            </svg>
          </a>
          <a href="${BROWSER_EMAIL_COMPOSE_URL}" target="_blank" rel="noopener" class="social-icon-link js-email-app-link" aria-label="Email">
            <svg class="social-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
              <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
          <a href="tel:+233244840042" class="social-icon-link" aria-label="Phone">
            <svg class="social-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.61 2.63a2 2 0 0 1-.45 2.11L9 10.71a16 16 0 0 0 4.29 4.29l1.25-1.22a2 2 0 0 1 2.11-.45c.85.29 1.73.49 2.63.61A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
        </div>
        <div class="footer-item">
          <span><a href="${prefix}store.html">Shop</a> · <a href="${prefix}about.html">About</a> · <a href="${prefix}contact.html">Contact</a></span>
          <form id="emailForm" class="newsletter-signup-form footer-inline-newsletter" data-submit-endpoint="https://script.google.com/macros/s/AKfycbwpeqmZoyCXB-46-564Rby5vaeqbc55fM0VKT36LdTvAFjQUcxlhUETGGw2KtPedV9Ljw/exec" novalidate>
            <p class="footer-feedback footer-inline-feedback" aria-live="polite"></p>
            <input type="email" id="email" name="email" required placeholder="Enter email for Newsletter signup" aria-label="enter your email for Newsletter signup">
            <button type="submit">Submit</button>
          </form>
        </div>
      `;
    });

    bindEmailAppFallback();
    initMobileFooterCollapse();
  }

  function bindEmailAppFallback() {
    const emailLinks = Array.from(
      document.querySelectorAll(".js-email-app-link"),
    );
    if (!emailLinks.length) {
      return;
    }

    emailLinks.forEach((link) => {
      if (link.dataset.emailAppBound === "true") {
        return;
      }

      link.addEventListener("click", (event) => {
        if (!isMobileDevice()) {
          return;
        }

        event.preventDefault();
        openEmailAppWithFallback();
      });

      link.dataset.emailAppBound = "true";
    });
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  }

  function openEmailAppWithFallback() {
    const gmailAppUrl = `googlegmail://co?to=${encodeURIComponent(FOOTER_EMAIL)}`;
    const mailtoUrl = `mailto:${FOOTER_EMAIL}`;
    let appOpened = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    window.setTimeout(() => {
      if (!appOpened) {
        window.location.href = mailtoUrl;
      }
    }, 260);

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!appOpened) {
        window.open(BROWSER_EMAIL_COMPOSE_URL, "_blank", "noopener");
      }
    }, 980);

    window.location.href = gmailAppUrl;
  }

  function initMobileFooterCollapse() {
    const footer = document.querySelector("footer");
    if (!footer || footer.dataset.mobileCollapseBound === "true") {
      return;
    }

    let canAutoCollapse = !isMobileFooterViewport();

    const collapseFooter = () => {
      if (!isMobileFooterViewport() || !canAutoCollapse) {
        return;
      }
      footer.classList.add(MOBILE_FOOTER_COLLAPSE_CLASS);
      document.body.classList.add(MOBILE_BODY_FOOTER_COLLAPSE_CLASS);
    };

    const expandFooter = () => {
      footer.classList.remove(MOBILE_FOOTER_COLLAPSE_CLASS);
      document.body.classList.remove(MOBILE_BODY_FOOTER_COLLAPSE_CLASS);
    };

    const collapseOnPageInteraction = (event) => {
      if (!isMobileFooterViewport()) {
        return;
      }

      if (event && footer.contains(event.target)) {
        return;
      }

      collapseFooter();
    };

    footer.addEventListener("click", () => {
      if (!isMobileFooterViewport()) {
        return;
      }

      expandFooter();
    });

    document.addEventListener("pointerdown", collapseOnPageInteraction, true);
    window.addEventListener("scroll", collapseFooter, { passive: true });
    window.addEventListener("touchmove", collapseFooter, { passive: true });
    window.addEventListener("resize", () => {
      if (!isMobileFooterViewport()) {
        canAutoCollapse = true;
        expandFooter();
      }
    });

    if (isMobileFooterViewport()) {
      expandFooter();
      window.setTimeout(() => {
        if (!isMobileFooterViewport()) {
          return;
        }
        canAutoCollapse = true;
        collapseFooter();
      }, MOBILE_FOOTER_INITIAL_EXPANDED_MS);
    }

    footer.dataset.mobileCollapseBound = "true";
  }

  function isMobileFooterViewport() {
    return window.matchMedia("(max-width: 992px)").matches;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }
})();
