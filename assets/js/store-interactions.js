(function () {
  const CART_STORAGE_KEY = "ananse_cart_v1";
  const CHECKOUT_STORAGE_KEY = "ananse_checkout_v1";
  const PENDING_ORDER_KEY = "ananse_pending_checkout_v1";
  const WHATSAPP_NUMBER = "233244840042";
  const PAYSTACK_CHECKOUT_URL = "https://paystack.com/pay/ananselearning";

  const filterButtons = Array.from(
    document.querySelectorAll(".store-filter-btn"),
  );
  const searchInput = document.getElementById("store-search");
  const sortSelect = document.getElementById("store-sort");
  const ageFilter = document.getElementById("age-filter");
  const ageTabs = Array.from(document.querySelectorAll(".store-age-tab"));
  const languageFilter = document.getElementById("language-filter");
  const statusFilter = document.getElementById("status-filter");
  const quickTiles = Array.from(
    document.querySelectorAll("[data-quick-filter]"),
  );
  const quizAge = document.getElementById("quiz-age");
  const quizFocus = document.getElementById("quiz-focus");
  const quizSubmit = document.getElementById("quiz-submit");
  const quizResult = document.getElementById("quiz-result");
  const resultCount = document.getElementById("store-result-count");
  const sections = Array.from(document.querySelectorAll(".catalogue-section"));
  const assetsPrefix = window.location.pathname.includes("/pages/")
    ? "../assets"
    : "assets";

  const cartMap = readJson(CART_STORAGE_KEY, {});
  const checkoutCache = readJson(CHECKOUT_STORAGE_KEY, {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    destinationCountry: "Ghana",
  });

  if (!filterButtons.length || !sections.length) {
    return;
  }

  initStorePreviewPaystackTiles();

  sections.forEach((section) => {
    const category = section.dataset.category;
    Array.from(section.querySelectorAll(".catalogue-card")).forEach((card) => {
      const title = (card.querySelector("h4")?.textContent || "").trim();
      const imageSource = getImageForCard(category, title);
      let figure = card.querySelector("figure");
      if (!figure) {
        figure = document.createElement("figure");
        card.prepend(figure);
      }

      let image = figure.querySelector("img");
      if (!image) {
        image = document.createElement("img");
        figure.appendChild(image);
      }

      image.src = imageSource;
      image.alt = `${title || category || "product"} cover`;
    });
  });

  const allCards = sections.flatMap((section) =>
    Array.from(section.querySelectorAll(".catalogue-card")).map(
      (card, index) => ({
        id: slugify(
          (card.querySelector("h4")?.textContent || "item") +
            `-${section.dataset.category || "general"}`,
        ),
        card,
        section,
        initialIndex: index,
        title: (card.querySelector("h4")?.textContent || "").trim(),
        text: (card.textContent || "").toLowerCase(),
        price: parsePrice(card.querySelector(".price")?.textContent || ""),
        ageRange:
          card.dataset.age || inferAgeRange(section.dataset.category, card),
        languages: inferLanguages(card),
        status: inferStatus(card),
        category: section.dataset.category || "general",
      }),
    ),
  );

  const modelById = Object.fromEntries(
    allCards.map((model) => [model.id, model]),
  );

  simplifyCatalogueCards();

  allCards.forEach(({ card, title }) => {
    const paystackProductUrl = getPaystackProductUrl(title);
    if (paystackProductUrl) {
      card.classList.add("is-clickable-card");
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");

      card.addEventListener("click", (event) => {
        const interactiveTarget = event.target.closest(
          "a, button, input, select, textarea, label",
        );
        if (interactiveTarget) {
          return;
        }

        window.open(paystackProductUrl, "_blank", "noopener");
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        window.open(paystackProductUrl, "_blank", "noopener");
      });
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  sortSelect?.addEventListener("change", applyFilters);
  ageFilter?.addEventListener("change", applyFilters);
  languageFilter?.addEventListener("change", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);

  ageTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      ageTabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      if (ageFilter) {
        ageFilter.value = tab.dataset.age || "all";
      }
      applyFilters();
    });
  });

  quickTiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      const targetCategory = tile.dataset.quickFilter;
      if (!targetCategory) {
        return;
      }

      event.preventDefault();
      filterButtons.forEach((button) => {
        button.classList.toggle(
          "is-active",
          button.dataset.filter === targetCategory,
        );
      });
      applyFilters();
      window.scrollTo({ top: 300, behavior: "smooth" });
    });
  });

  quizSubmit?.addEventListener("click", () => {
    const age = quizAge?.value;
    const focus = quizFocus?.value;
    if (!quizResult) {
      return;
    }

    if (!age || !focus) {
      quizResult.textContent =
        "Select both age range and learning focus to get a recommendation.";
      return;
    }

    let recommendation = "Culture & Literacy Bundle";
    if (age === "3-6" || focus === "language") {
      recommendation = "Early Explorer Bundle";
    }
    if (age === "10-12" || focus === "maker") {
      recommendation = "Research & Design Bundle";
    }
    if (focus === "heritage" && age !== "10-12") {
      recommendation = "Culture & Literacy Bundle";
    }

    quizResult.textContent = `Recommended: ${recommendation}. Use WhatsApp for a custom version with language and pathway preferences.`;
  });

  applyInitialQueryFilters();
  applyFilters();

  function applyInitialQueryFilters() {
    const params = new URLSearchParams(window.location.search);
    const ageParam = (params.get("age") || "").trim();
    const allowedAges = new Set(["3-6", "7-9", "10-12", "all"]);

    if (!allowedAges.has(ageParam)) {
      return;
    }

    if (ageFilter) {
      ageFilter.value = ageParam;
    }

    ageTabs.forEach((tab) => {
      tab.classList.toggle(
        "is-active",
        (tab.dataset.age || "all") === ageParam,
      );
    });
  }

  function applyFilters() {
    const selectedFilter =
      document.querySelector(".store-filter-btn.is-active")?.dataset.filter ||
      "all";
    const query = (searchInput?.value || "").trim().toLowerCase();
    const sortValue = sortSelect?.value || "default";
    const selectedAge = ageFilter?.value || "all";
    const selectedLanguage = languageFilter?.value || "all";
    const selectedStatus = statusFilter?.value || "all";

    let visibleCount = 0;

    ageTabs.forEach((tab) => {
      tab.classList.toggle(
        "is-active",
        (tab.dataset.age || "all") === selectedAge,
      );
    });

    sections.forEach((section) => {
      const category = section.dataset.category;
      const cards = Array.from(section.querySelectorAll(".catalogue-card"));

      cards.forEach((card) => card.classList.remove("is-hidden"));

      const filtered = cards.filter((card) => {
        const cardModel = allCards.find((item) => item.card === card);
        const categoryMatch =
          selectedFilter === "all" || selectedFilter === category;
        const queryMatch =
          !query || card.textContent.toLowerCase().includes(query);
        const ageMatch =
          selectedAge === "all" || cardModel?.ageRange === selectedAge;
        const languageMatch =
          selectedLanguage === "all" ||
          cardModel?.languages.includes(selectedLanguage);
        const statusMatch =
          selectedStatus === "all" || cardModel?.status === selectedStatus;
        const isVisible =
          categoryMatch &&
          queryMatch &&
          ageMatch &&
          languageMatch &&
          statusMatch;
        card.classList.toggle("is-hidden", !isVisible);
        return isVisible;
      });

      sortCards(filtered, sortValue);

      section.style.display = filtered.length ? "" : "none";
      visibleCount += filtered.length;
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount === 0
          ? "No products match your filter."
          : `Showing ${visibleCount} product${visibleCount > 1 ? "s" : ""}`;
    }
  }

  function addToCart(itemId, quantityDelta) {
    const model = modelById[itemId];
    if (!model) {
      return;
    }

    const current = cartMap[itemId] || {
      id: itemId,
      title: model.title,
      category: model.category,
      unitPrice: Number.isFinite(model.price) ? model.price : null,
      qty: 0,
    };

    current.qty = Math.max(0, current.qty + quantityDelta);
    if (current.qty === 0) {
      delete cartMap[itemId];
    } else {
      cartMap[itemId] = current;
    }

    persistJson(CART_STORAGE_KEY, cartMap);
    renderCart();
  }

  function removeFromCart(itemId) {
    if (!cartMap[itemId]) return;
    delete cartMap[itemId];
    persistJson(CART_STORAGE_KEY, cartMap);
    renderCart();
  }

  function initCartUi() {
    const dock = document.createElement("div");
    dock.className = "cart-dock";
    dock.innerHTML =
      '<button type="button" class="cart-dock-btn" id="cartOpenBtn">Cart (0)</button>';

    const backdrop = document.createElement("div");
    backdrop.className = "cart-backdrop";
    backdrop.id = "cartBackdrop";

    const panel = document.createElement("aside");
    panel.className = "cart-panel";
    panel.id = "cartPanel";
    panel.innerHTML = `
      <div class="cart-panel-header d-flex justify-content-between align-items-center">
        <div>
          <h4 class="mb-0">Your Cart</h4>
          <small class="small-note">Stored locally on this device.</small>
        </div>
        <button type="button" class="btn btn-sm btn-outline-primary" id="cartCloseBtn">Close</button>
      </div>
      <div class="cart-lines" id="cartLines"></div>
      <div class="cart-panel-footer">
        <div class="cart-totals mb-2" id="cartTotals"></div>
        <form class="checkout-form" id="cartCheckoutForm">
          <div class="row g-2">
            <div class="col-12"><input id="checkoutName" class="form-control" type="text" placeholder="Your name" required></div>
            <div class="col-12"><input id="checkoutEmail" class="form-control" type="email" placeholder="Your email" required></div>
            <div class="col-12"><input id="checkoutPhone" class="form-control" type="tel" placeholder="Phone / WhatsApp"></div>
            <div class="col-12"><input id="checkoutCountry" class="form-control" type="text" placeholder="Delivery country"></div>
            <div class="col-12 d-flex flex-wrap gap-2">
              <button id="checkoutWhatsapp" type="button" class="btn btn-outline-primary">Submit via WhatsApp</button>
              <button id="checkoutPaystack" type="button" class="btn btn-primary">Checkout with Paystack</button>
              <button id="clearCart" type="button" class="btn btn-sm btn-light">Clear cart</button>
            </div>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(dock);

    const open = () => {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
    };

    const close = () => {
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
    };

    dock.querySelector("#cartOpenBtn")?.addEventListener("click", open);
    panel.querySelector("#cartCloseBtn")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);

    panel
      .querySelector("#checkoutWhatsapp")
      ?.addEventListener("click", submitViaWhatsapp);
    panel
      .querySelector("#checkoutPaystack")
      ?.addEventListener("click", submitViaPaystack);
    panel.querySelector("#clearCart")?.addEventListener("click", () => {
      Object.keys(cartMap).forEach((id) => delete cartMap[id]);
      persistJson(CART_STORAGE_KEY, cartMap);
      renderCart();
    });

    panel.querySelector("#checkoutName").value =
      checkoutCache.customerName || "";
    panel.querySelector("#checkoutEmail").value =
      checkoutCache.customerEmail || "";
    panel.querySelector("#checkoutPhone").value =
      checkoutCache.customerPhone || "";
    panel.querySelector("#checkoutCountry").value =
      checkoutCache.destinationCountry || "Ghana";

    return {
      dock,
      panel,
      lines: panel.querySelector("#cartLines"),
      totals: panel.querySelector("#cartTotals"),
      count: dock.querySelector("#cartOpenBtn"),
      name: panel.querySelector("#checkoutName"),
      email: panel.querySelector("#checkoutEmail"),
      phone: panel.querySelector("#checkoutPhone"),
      country: panel.querySelector("#checkoutCountry"),
      open,
    };
  }

  function renderCart() {
    const entries = Object.values(cartMap);
    const totalQty = entries.reduce((sum, item) => sum + item.qty, 0);
    const pricedTotal = entries.reduce((sum, item) => {
      if (typeof item.unitPrice === "number") {
        return sum + item.unitPrice * item.qty;
      }
      return sum;
    }, 0);
    const tbcCount = entries.filter(
      (item) => typeof item.unitPrice !== "number",
    ).length;

    cartUi.count.textContent = `Cart (${totalQty})`;

    cartUi.lines.innerHTML = "";
    if (!entries.length) {
      cartUi.lines.innerHTML =
        '<div class="cart-empty">No items selected yet. Add products from the catalogue.</div>';
    } else {
      entries.forEach((item) => {
        const line = document.createElement("div");
        line.className = "cart-line";
        line.innerHTML = `
          <div class="cart-line-top">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <div class="small-note">${item.category}</div>
              <div>${typeof item.unitPrice === "number" ? `GHS ${item.unitPrice}` : "Price TBC"}</div>
            </div>
            <button type="button" class="btn btn-sm btn-light" data-remove="${item.id}">Remove</button>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <div class="qty-controls">
              <button type="button" data-dec="${item.id}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-inc="${item.id}">+</button>
            </div>
            <strong>${typeof item.unitPrice === "number" ? `GHS ${item.unitPrice * item.qty}` : "TBC"}</strong>
          </div>
        `;
        cartUi.lines.appendChild(line);
      });
    }

    cartUi.lines.querySelectorAll("[data-inc]").forEach((button) => {
      button.addEventListener("click", () => addToCart(button.dataset.inc, 1));
    });
    cartUi.lines.querySelectorAll("[data-dec]").forEach((button) => {
      button.addEventListener("click", () => addToCart(button.dataset.dec, -1));
    });
    cartUi.lines.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () =>
        removeFromCart(button.dataset.remove),
      );
    });

    cartUi.totals.textContent = `Items: ${totalQty} · Subtotal: GHS ${pricedTotal.toFixed(2)}${tbcCount ? ` · ${tbcCount} item(s) with TBC price` : ""}`;

    document.querySelectorAll(".add-cart-btn").forEach((button) => {
      const item = cartMap[button.dataset.cartId];
      button.textContent = item ? `Add more (${item.qty})` : "Add to cart";
    });
  }

  function submitViaWhatsapp() {
    const payload = buildCheckoutPayload();
    if (!payload.items.length) {
      return;
    }

    const lines = [
      "Hello Ananse Learning, I was on your website exploring the Store page checkout section and I want to place an order:",
      "",
      ...payload.items.map(
        (item, index) =>
          `${index + 1}. ${item.title} x${item.qty} (${item.unitPriceText})`,
      ),
      "",
      `Subtotal (priced items): GHS ${payload.pricedTotal.toFixed(2)}`,
      `Customer: ${payload.customerName}`,
      `Email: ${payload.customerEmail}`,
      `Phone: ${payload.customerPhone || "N/A"}`,
      `Delivery Country: ${payload.destinationCountry || "N/A"}`,
      "",
      "Please confirm availability and payment next steps.",
    ];

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  }

  function submitViaPaystack() {
    const payload = buildCheckoutPayload();
    if (!payload.items.length) {
      return;
    }

    if (!payload.customerEmail) {
      alert("Please enter an email before continuing to Paystack checkout.");
      return;
    }

    if (payload.pricedTotal <= 0) {
      alert(
        "Cart has no priced items. Use WhatsApp checkout for items with TBC pricing.",
      );
      return;
    }

    const reference = `AL-${Date.now()}`;
    persistJson(PENDING_ORDER_KEY, {
      reference,
      ...payload,
      createdAt: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      ref: reference,
      amount_ghs: payload.pricedTotal.toFixed(2),
      email: payload.customerEmail,
      name: payload.customerName,
      country: payload.destinationCountry || "",
    });

    window.location.href = `${PAYSTACK_CHECKOUT_URL}?${params.toString()}`;
  }

  function buildCheckoutPayload() {
    const items = Object.values(cartMap).map((item) => ({
      ...item,
      unitPriceText:
        typeof item.unitPrice === "number"
          ? `GHS ${item.unitPrice}`
          : "Price TBC",
    }));

    const pricedTotal = items.reduce((sum, item) => {
      if (typeof item.unitPrice === "number") {
        return sum + item.unitPrice * item.qty;
      }
      return sum;
    }, 0);

    const payload = {
      items,
      pricedTotal,
      customerName: (cartUi.name.value || "").trim(),
      customerEmail: (cartUi.email.value || "").trim(),
      customerPhone: (cartUi.phone.value || "").trim(),
      destinationCountry: (cartUi.country.value || "").trim(),
    };

    persistJson(CHECKOUT_STORAGE_KEY, {
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      destinationCountry: payload.destinationCountry,
    });

    if (!payload.items.length) {
      alert("Cart is empty. Add products before checkout.");
    }

    return payload;
  }

  function sortCards(cards, sortValue) {
    if (!cards.length || sortValue === "default") {
      return;
    }

    const cardData = cards.map((card) => {
      const title = (card.querySelector("h4")?.textContent || "")
        .trim()
        .toLowerCase();
      const price = parsePrice(card.querySelector(".price")?.textContent || "");
      return { card, title, price };
    });

    cardData.sort((a, b) => {
      if (sortValue === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortValue === "price-asc") {
        return a.price - b.price;
      }
      if (sortValue === "price-desc") {
        return b.price - a.price;
      }
      return 0;
    });

    const parent = cards[0].parentElement;
    cardData.forEach(({ card }) => parent.appendChild(card));
  }

  function parsePrice(priceText) {
    const match = priceText.replace(/,/g, "").match(/\d+/);
    if (!match) {
      return Number.POSITIVE_INFINITY;
    }
    return Number(match[0]);
  }

  function inferStatus(card) {
    const text = card.textContent.toLowerCase();
    if (
      text.includes("preorder") ||
      text.includes("coming soon") ||
      text.includes("price tbc")
    ) {
      return "preorder";
    }
    return "in-stock";
  }

  function inferLanguages(card) {
    const text = card.textContent.toLowerCase();
    const result = ["english"];
    if (text.includes("twi")) result.push("twi");
    if (text.includes("eʋe") || text.includes("ewe")) result.push("eve");
    if (text.includes(" ga") || text.includes("(ga") || text.includes(", ga"))
      result.push("ga");
    return result;
  }

  function inferAgeRange(category, card) {
    const text = card.textContent.toLowerCase();

    if (category === "flashcards") return "3-6";
    if (category === "posters") {
      if (text.includes("numeracy") || text.includes("research")) return "7-9";
      return "3-6";
    }

    if (
      text.includes("workbook") ||
      text.includes("trailblazers") ||
      text.includes("roadmakers") ||
      text.includes("nyaneba")
    ) {
      return "10-12";
    }
    if (
      text.includes("colouring") ||
      text.includes("alphabet") ||
      text.includes("bilingual")
    ) {
      return "7-9";
    }
    return "7-9";
  }

  function getPlaceholderForCategory(category) {
    if (category === "posters") {
      return `${assetsPrefix}/images/placeholders/placeholder_poster.png`;
    }
    if (category === "flashcards") {
      return `${assetsPrefix}/images/placeholders/placeholder_flashcard.png`;
    }
    return `${assetsPrefix}/images/placeholders/placeholder_book.png`;
  }

  function getImageForCard(category, title) {
    if (category !== "books") {
      return getPlaceholderForCategory(category);
    }

    const normalized = title.toLowerCase();
    const coverFileName = getBookCoverFileName(normalized);
    if (!coverFileName) {
      return getPlaceholderForCategory(category);
    }

    return `${assetsPrefix}/images/book_covers/${encodeURIComponent(coverFileName)}`;
  }

  function getBookCoverFileName(normalizedTitle) {
    if (normalizedTitle.includes("worlds they made"))
      return "Worlds They Made.png";
    if (normalizedTitle.includes("design workbook"))
      return "The Design Workbook.png";
    if (normalizedTitle.includes("abcdawadawa")) return "abcdawadawa cover.png";
    if (
      normalizedTitle.includes("asante twi-english") ||
      normalizedTitle.startsWith("abd (")
    )
      return "abd cover.png";
    if (normalizedTitle.includes("adobea bakes"))
      return "adobea bakes updated cover16april2025.png";
    if (normalizedTitle.includes("my favourite things"))
      return "My Favourite Things Cover.png";
    return null;
  }

  function getPaystackProductUrl(title) {
    const normalizedTitle = String(title || "")
      .trim()
      .toLowerCase();

    if (normalizedTitle.includes("worlds they made")) {
      return "https://paystack.com/buy/ananselearning-book-worlds-they-made";
    }

    if (normalizedTitle.includes("asante twi-english")) {
      return "https://paystack.com/buy/ananselearning-book-abd-asante-twi-english-bilingual-book";
    }

    if (normalizedTitle === "abcdawadawa") {
      return "https://paystack.com/buy/ananselearning-book-abcdawadawa";
    }

    return null;
  }

  function initStorePreviewPaystackTiles() {
    const previewTiles = Array.from(
      document.querySelectorAll(".store-preview-card[data-paystack-url]"),
    );

    previewTiles.forEach((tile) => {
      const url = (tile.dataset.paystackUrl || "").trim();
      if (!url) {
        return;
      }

      tile.classList.add("is-clickable-card");
      tile.setAttribute("role", "link");
      tile.setAttribute("tabindex", "0");

      tile.addEventListener("click", (event) => {
        const interactiveTarget = event.target.closest(
          "a, button, input, select, textarea, label",
        );
        if (interactiveTarget) {
          return;
        }

        window.open(url, "_blank", "noopener");
      });

      tile.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        window.open(url, "_blank", "noopener");
      });
    });
  }

  function simplifyCatalogueCards() {
    const cards = Array.from(document.querySelectorAll(".catalogue-card"));

    cards.forEach((card) => {
      const figure = card.querySelector("figure");
      const title = card.querySelector("h4");

      Array.from(card.children).forEach((child) => {
        if (child === figure || child === title) {
          return;
        }
        child.remove();
      });
    });
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function persistJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // ignore storage quota issues
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
