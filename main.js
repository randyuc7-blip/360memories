(function () {
  const config = window.siteConfig;

  if (!config) {
    return;
  }

  const phoneDigits = config.phoneNumber.replace(/\D/g, "");
  const emailHref = `mailto:${config.email}`;
  const langStorageKey = `${config.businessName.toLowerCase().replace(/\s+/g, "-")}-lang`;
  const packageSelect = document.querySelector("#package-interest");
  const html = document.documentElement;

  function getLang() {
    const saved = window.localStorage.getItem(langStorageKey);
    if (saved && config.translations[saved]) {
      return saved;
    }

    return config.defaultLanguage;
  }

  function setTextContent() {
    document.querySelectorAll("[data-config]").forEach((node) => {
      const key = node.dataset.config;
      if (!config[key]) {
        return;
      }

      node.textContent = config[key];
    });

    document.querySelectorAll("[data-config-value]").forEach((node) => {
      const key = node.dataset.configValue;
      if (!config[key]) {
        return;
      }

      node.value = config[key];
    });

    document.querySelectorAll("[data-package-price]").forEach((node) => {
      const index = Number(node.dataset.packagePrice);
      if (!config.packages[index]) {
        return;
      }

      node.textContent = config.packages[index].price;
    });

    document.querySelectorAll("[data-phone-link]").forEach((node) => {
      node.setAttribute("href", `tel:+1${phoneDigits}`);
      if (!node.textContent.trim() && !node.querySelector("[data-i18n]")) {
        node.textContent = config.phoneDisplay;
      }
    });

    document.querySelectorAll("[data-email-link]").forEach((node) => {
      node.setAttribute("href", emailHref);
      node.textContent = config.email;
    });

    document.querySelectorAll("[data-instagram-link]").forEach((node) => {
      node.setAttribute("href", config.instagramUrl);
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noreferrer");
      node.textContent = `Instagram: @${config.instagram}`;
    });
  }

  function renderPackageOptions(lang) {
    if (!packageSelect) {
      return;
    }

    const labels = {
      es: { placeholder: "Selecciona un paquete", hourLabel: "Hora", hoursLabel: "Horas" },
      en: { placeholder: "Select a package", hourLabel: "Hour", hoursLabel: "Hours" }
    };

    const dictionary = labels[lang];

    packageSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = dictionary.placeholder;
    placeholder.disabled = true;
    placeholder.selected = true;
    packageSelect.appendChild(placeholder);

    config.packages.forEach((pkg, index) => {
      const hourCount = index + 1;
      const hourLabel = hourCount === 1 ? dictionary.hourLabel : dictionary.hoursLabel;
      const optionValue = `${hourCount} ${hourLabel} - ${pkg.price}`;
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      packageSelect.appendChild(option);
    });
  }

  function setLanguage(lang) {
    const dictionary = config.translations[lang];
    if (!dictionary) {
      return;
    }

    html.lang = lang;
    window.localStorage.setItem(langStorageKey, lang);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (dictionary[key]) {
        node.textContent = dictionary[key];
      }
    });

    renderPackageOptions(lang);

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      const isActive = button.dataset.langToggle === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  setTextContent();
  setLanguage(getLang());

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
      setLanguage(button.dataset.langToggle);
    });
  });

  function initScrollAnimations() {
    const revealTargets = [
      ".hero-copy > .eyebrow",
      ".hero-copy > h1",
      ".hero-copy > .hero-lead",
      ".hero-copy > .hero-actions",
      ".hero-panel",
      "#packages .section-heading",
      "#packages .packages-grid",
      "#gallery .section-heading",
      "#gallery .gallery-layout",
      "#value .section-heading",
      "#value .value-grid",
      "#faq .section-heading",
      "#faq .faq-list",
      "#service-area .section-heading",
      "#service-area .service-area-card",
      "#lead-form .lead-panel",
      "#lead-form .lead-form"
    ];

    revealTargets.forEach((selector, index) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.classList.add("reveal");
        node.style.setProperty("--reveal-delay", `${Math.min(index * 35, 180)}ms`);
      });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((node) => {
        node.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    document.querySelectorAll(".reveal").forEach((node) => {
      observer.observe(node);
    });
  }

  initScrollAnimations();
})();
