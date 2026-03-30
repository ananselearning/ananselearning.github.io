(function () {
  const STORE_URL = "https://paystack.shop/ananselearning";

  const sections = Array.from(document.querySelectorAll(".catalogue-section"));
  const isRootIndexPath =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";
  const assetsPrefix = isRootIndexPath ? "assets" : "../assets";

  if (!sections.length) {
    return;
  }

  const imagePreview = createImagePreview();

  initStorePreviewPaystackTiles();
  initCyclingCardImages();
  initStockistCards();

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

      if (!image.getAttribute("src")) {
        image.src = imageSource;
      }
      if (!image.getAttribute("alt")) {
        image.alt = `${title || category || "product"} cover`;
      }

      card.classList.remove("is-hidden");
    });
  });

  function initStockistCards() {
    const stockistCards = Array.from(
      document.querySelectorAll(".stockist-card"),
    );

    stockistCards.forEach((card) => {
      const profileLink = card.querySelector("a[href]");
      const url = (profileLink?.getAttribute("href") || "").trim();
      if (!url) {
        return;
      }

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

        window.open(url, "_blank", "noopener");
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        window.open(url, "_blank", "noopener");
      });
    });
  }

  function initCyclingCardImages() {
    const cardsWithImageSets = Array.from(
      document.querySelectorAll(".catalogue-card[data-preview-images]"),
    );

    cardsWithImageSets.forEach((card) => {
      const image = card.querySelector("figure img");
      if (!image) {
        return;
      }

      const sources = String(card.dataset.previewImages || "")
        .split("|")
        .map((source) => source.trim())
        .filter(Boolean);

      if (sources.length <= 1) {
        return;
      }

      let activeIndex = 0;
      image.src = sources[activeIndex];

      window.setInterval(() => {
        image.classList.add("is-fading");

        window.setTimeout(() => {
          activeIndex = (activeIndex + 1) % sources.length;
          image.src = sources[activeIndex];
          image.classList.remove("is-fading");
        }, 250);
      }, 5000);
    });
  }

  const allCards = sections.flatMap((section) =>
    Array.from(section.querySelectorAll(".catalogue-card")),
  );

  allCards.forEach((card) => {
    const title = (card.querySelector("h4")?.textContent || "").trim();
    const paystackProductUrl = getPaystackProductUrl(title) || STORE_URL;
    if (paystackProductUrl && !card.dataset.storeLinked) {
      card.classList.add("is-clickable-card");
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.dataset.storeLinked = "true";

      card.addEventListener("click", (event) => {
        if (isPreviewTrigger(event.target)) {
          event.preventDefault();
          event.stopPropagation();
          toggleImagePreviewForCard(card);
          return;
        }

        if (isDetailsAreaTarget(event.target)) {
          return;
        }

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

        if (isDetailsAreaTarget(event.target)) {
          return;
        }

        const interactiveTarget = event.target.closest(
          "a, button, input, select, textarea, label",
        );
        if (interactiveTarget) {
          return;
        }

        event.preventDefault();
        window.open(paystackProductUrl, "_blank", "noopener");
      });
    }
  });

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
    const normalized = normalizeProductTitle(title);

    if (category === "posters") {
      const posterFileName = getPosterFileName(normalized);
      return posterFileName
        ? `${assetsPrefix}/images/Posters/${encodeURIComponent(posterFileName)}`
        : getPlaceholderForCategory(category);
    }

    if (category === "flashcards") {
      const flashcardFileName = getFlashcardFileName(normalized);
      return flashcardFileName
        ? `${assetsPrefix}/images/Flashcards/${encodeURI(flashcardFileName)}`
        : getPlaceholderForCategory(category);
    }

    if (category !== "books") {
      return getPlaceholderForCategory(category);
    }

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
    if (normalizedTitle.startsWith("abd")) return "abd cover.png";
    if (normalizedTitle.includes("adobea bakes"))
      return "adobea bakes updated cover16april2025.png";
    if (normalizedTitle.includes("my favourite things"))
      return "My Favourite Things Cover.png";
    return null;
  }

  function getPosterFileName(normalizedTitle) {
    const postersByTitle = {
      "letters of the alphabet": "1 Letters of the Alphabet.png",
      "ananses alphabets or something like that":
        "2 Ananse’s Alphabets...or something like that!.png",
      colours: "3 Colours.png",
      "grandpa gyimahs garage": "4 Grandpa Gyimah_s Garage.png",
      shapes: "5 Shapes.png",
      "the shapes of my snacks": "6 The Shapes of My Snacks.png",
      "fruits vegetables": "7 Fruits & Vegetables.png",
      "green to gold plantains amazing journey": "8 Green to Gold.png",
      "giraffe days of the week": "9 Days of the Week (in Ga).png",
      "months of the year": "10 Months of the Year (in Asante Twi).png",
      "animal portrait": "11 Animal Portrait.png",
      "jungle portrait": "12 Jungle Portrait.png",
      "brempong the bear": "13 Brempong the Bear.png",
      "lizzie the lion": "14 Lizzie the Lion.png",
      "gigraw the giraffe": "15 Gigraw the Giraffe.png",
      "zanzama the zebra": "16 Zanzama the Zebra.png",
      "journey to kukurantumi": "17 Journey to Kukurantumi.png",
      "kekelis kitchen": "18 Kekeli_s Kitchen.png",
      "a kenkey feast": "19 A Kenkey Feast.png",
      "doris delicious desserts": "20 Doris_ Delicious Desserts.png",
      "numbers in english asante twi eʋe ga": "21 Numbers (in Eʋe).png",
      "map of ghana": "22 Map of Ghana.png",
      "food map of ghana": "23 Food Map of Ghana.png",
    };

    return postersByTitle[normalizedTitle] || null;
  }

  function getFlashcardFileName(normalizedTitle) {
    if (normalizedTitle.includes("year of affirmations")) {
      return "Months of the Year/Cover.png";
    }

    if (normalizedTitle.includes("number flashcards")) {
      return "Numbers 0-20/Numbers in Asante Twi.png";
    }

    return null;
  }

  function normalizeProductTitle(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’'`]/g, "")
      .replace(/&/g, " ")
      .replace(/[^a-z0-9\sʋ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
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

    if (normalizedTitle.includes("design workbook")) {
      return "https://paystack.com/buy/ananselearning-book-the-design-workbook-food--culture-book-";
    }

    if (
      normalizedTitle.includes("my favourite things") ||
      normalizedTitle.includes("enos colouring book")
    ) {
      return "https://paystack.com/buy/ananselearning-my-favourite-things---enos-colouring-book";
    }

    if (
      normalizedTitle.includes("adobea bakes") ||
      normalizedTitle.includes("coconut doughts")
    ) {
      return "https://paystack.com/buy/ananselearning-book-adobea-bakes-coconut-doughts";
    }

    if (
      normalizedTitle.includes("animal colouring book") ||
      normalizedTitle.includes("animal coloring book")
    ) {
      return "https://paystack.com/buy/animal-colouring-book-axjage";
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
        if (isPreviewTrigger(event.target)) {
          event.preventDefault();
          event.stopPropagation();
          toggleImagePreviewForCard(tile);
          return;
        }

        if (isDetailsAreaTarget(event.target)) {
          return;
        }

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

        if (isDetailsAreaTarget(event.target)) {
          return;
        }

        const interactiveTarget = event.target.closest(
          "a, button, input, select, textarea, label",
        );
        if (interactiveTarget) {
          return;
        }

        event.preventDefault();
        window.open(url, "_blank", "noopener");
      });
    });
  }

  function isPreviewTrigger(target) {
    return Boolean(
      target &&
      target.closest("figure, .card-image-overlay, .quick-view-label"),
    );
  }

  function isDetailsAreaTarget(target) {
    return Boolean(target && target.closest("details, summary"));
  }

  function toggleImagePreviewForCard(card) {
    const image = card.querySelector("figure img");
    if (!image) {
      return;
    }

    const fallbackSource = image.currentSrc || image.getAttribute("src") || "";
    const sources = String(card.dataset.previewImages || "")
      .split("|")
      .map((source) => source.trim())
      .filter(Boolean);
    const previewSources = sources.length ? sources : [fallbackSource];

    if (!previewSources.length || !previewSources[0]) {
      return;
    }

    imagePreview.toggle(
      previewSources,
      image.getAttribute("alt") || "Product preview",
    );
  }

  function createImagePreview() {
    const overlay = document.createElement("div");
    overlay.className = "store-image-preview";
    overlay.setAttribute("aria-hidden", "true");

    const previewFrame = document.createElement("div");
    previewFrame.className = "store-image-preview__frame";

    const previewImage = document.createElement("img");
    previewImage.className = "store-image-preview__image";
    previewImage.alt = "";

    const previousButton = document.createElement("button");
    previousButton.className =
      "store-image-preview__nav store-image-preview__nav--prev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Previous image");
    previousButton.innerHTML = "&#8249;";

    const nextButton = document.createElement("button");
    nextButton.className =
      "store-image-preview__nav store-image-preview__nav--next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML = "&#8250;";

    const dots = document.createElement("div");
    dots.className = "store-image-preview__dots";

    previewFrame.appendChild(previewImage);
    previewFrame.appendChild(previousButton);
    previewFrame.appendChild(nextButton);
    previewFrame.appendChild(dots);
    overlay.appendChild(previewFrame);
    document.body.appendChild(overlay);

    let activeKey = "";
    let activeAlt = "";
    let activeSources = [];
    let activeIndex = 0;

    function renderImage() {
      const currentSource = activeSources[activeIndex] || "";
      previewImage.src = currentSource;
      previewImage.alt =
        activeSources.length > 1
          ? `${activeAlt} (${activeIndex + 1} of ${activeSources.length})`
          : activeAlt;
    }

    function renderDots() {
      dots.innerHTML = "";

      if (activeSources.length <= 1) {
        dots.hidden = true;
        previousButton.hidden = true;
        nextButton.hidden = true;
        return;
      }

      dots.hidden = false;
      previousButton.hidden = false;
      nextButton.hidden = false;

      activeSources.forEach((_, index) => {
        const dotButton = document.createElement("button");
        dotButton.type = "button";
        dotButton.className = "store-image-preview__dot";
        dotButton.setAttribute("aria-label", `View image ${index + 1}`);
        if (index === activeIndex) {
          dotButton.classList.add("is-active");
        }

        dotButton.addEventListener("click", (event) => {
          event.stopPropagation();
          activeIndex = index;
          renderImage();
          renderDots();
        });

        dots.appendChild(dotButton);
      });
    }

    function step(direction) {
      if (activeSources.length <= 1) {
        return;
      }

      activeIndex =
        (activeIndex + direction + activeSources.length) % activeSources.length;
      renderImage();
      renderDots();
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("store-image-preview-open");
      activeKey = "";
      activeAlt = "";
      activeSources = [];
      activeIndex = 0;
    }

    function open(sources, altText) {
      activeSources = sources.slice();
      activeAlt = altText;
      activeKey = activeSources.join("|");
      activeIndex = 0;
      renderImage();
      renderDots();
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("store-image-preview-open");
    }

    function toggle(sources, altText) {
      const nextSources = Array.isArray(sources) ? sources : [sources];
      const nextKey = nextSources.join("|");

      if (overlay.classList.contains("is-open") && activeKey === nextKey) {
        close();
        return;
      }

      open(nextSources, altText);
    }

    overlay.addEventListener("click", close);
    previewImage.addEventListener("click", close);
    previewFrame.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    previousButton.addEventListener("click", (event) => {
      event.stopPropagation();
      step(-1);
    });
    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      step(1);
    });

    document.addEventListener("keydown", (event) => {
      if (!overlay.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        step(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        step(1);
      }
    });

    return {
      toggle,
    };
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
})();
