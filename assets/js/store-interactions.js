(function () {
  const STORE_URL = "https://paystack.shop/ananselearning";

  const sections = Array.from(document.querySelectorAll(".catalogue-section"));
  const assetsPrefix = window.location.pathname.includes("/pages/")
    ? "../assets"
    : "assets";

  if (!sections.length) {
    return;
  }

  initStorePreviewPaystackTiles();
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

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
})();
