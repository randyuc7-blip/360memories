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

  function initExperienceCustomizer() {
    const previewImage = document.querySelector("#experience-preview-image");
    const optionButtons = document.querySelectorAll("[data-preview-group]");

    if (!previewImage || !optionButtons.length) {
      return;
    }

    const state = {
      event: "wedding",
      overlay: "minimal",
      theme: "warm"
    };

    function formatAlt() {
      return `Phone preview of a ${state.event} 360 booth experience with a ${state.overlay} overlay and ${state.theme} theme`;
    }

    function updatePreview() {
      previewImage.classList.add("is-fading");

      window.setTimeout(() => {
        previewImage.src = `images/preview-${state.event}-${state.overlay}-${state.theme}.svg`;
        previewImage.alt = formatAlt();
        previewImage.classList.remove("is-fading");
      }, 180);
    }

    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.dataset.previewGroup;
        const value = button.dataset.previewValue;

        if (!group || !value || state[group] === value) {
          return;
        }

        state[group] = value;

        document
          .querySelectorAll(`[data-preview-group="${group}"]`)
          .forEach((node) => node.classList.remove("is-active"));

        button.classList.add("is-active");
        updatePreview();
      });
    });
  }

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
      "#experience-customizer .section-heading",
      "#experience-customizer .customizer-layout",
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

  function initStickyCtaVisibility() {
    const stickyCta = document.querySelector(".mobile-sticky-cta");

    if (!stickyCta) {
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;
    const threshold = 14;

    function updateStickyCta() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) < threshold) {
        ticking = false;
        return;
      }

      if (currentScrollY <= 24 || delta < 0) {
        stickyCta.classList.remove("cta-hidden");
      } else if (delta > 0) {
        stickyCta.classList.add("cta-hidden");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) {
          return;
        }

        ticking = true;
        window.requestAnimationFrame(updateStickyCta);
      },
      { passive: true }
    );
  }

  function initServiceConstellation() {
    const constellation = document.querySelector(".service-area-constellation");
    const starsLayer = document.querySelector(".constellation-stars");
    const linesLayer = document.querySelector(".constellation-lines");
    const tooltip = document.querySelector(".constellation-tooltip");

    if (!constellation || !starsLayer || !linesLayer || !tooltip) {
      return;
    }

    const starData = [
      // Base platform ring
      { zip: "75007", name: "Carrollton", x: 30, y: 44, driftX: 2.6, driftY: 2.3, phase: 0.2 },
      { zip: "75006", name: "Carrollton", x: 39, y: 36, driftX: 2.4, driftY: 2.1, phase: 0.8 },
      { zip: "75001", name: "Addison", x: 51, y: 34, driftX: 2.2, driftY: 2.4, phase: 1.4 },
      { zip: "75234", name: "Farmers Branch", x: 61, y: 38, center: true, driftX: 2.8, driftY: 2.3, phase: 2.0 },
      { zip: "75019", name: "Coppell", x: 66, y: 48, driftX: 2.5, driftY: 2.2, phase: 2.6 },
      { zip: "75038", name: "Irving", x: 61, y: 56, driftX: 2.3, driftY: 2.5, phase: 3.2 },
      { zip: "75039", name: "Irving", x: 49, y: 60, driftX: 2.7, driftY: 2.1, phase: 3.8 },
      { zip: "75063", name: "Irving", x: 36, y: 55, driftX: 2.4, driftY: 2.4, phase: 4.4 },

      // Vertical arm, screen, and top ring
      { zip: "75080", name: "Richardson", x: 33, y: 28, driftX: 2.2, driftY: 2.0, phase: 5.0 },
      { zip: "75248", name: "Dallas", x: 40, y: 16, driftX: 2.5, driftY: 2.1, phase: 5.6 }
    ];

    const connections = [
      // Base platform ring
      ["75007", "75006"],
      ["75006", "75001"],
      ["75001", "75234"],
      ["75234", "75019"],
      ["75019", "75038"],
      ["75038", "75039"],
      ["75039", "75063"],
      ["75063", "75007"],
      // Vertical arm from back-left of base
      ["75006", "75080"],
      // Small screen block
      ["75080", "75001"],
      ["75080", "75234"],
      // Top ring light / attachment
      ["75080", "75248"],
      ["75248", "75001"]
    ];

    const stars = new Map();
    const lines = [];

    starData.forEach((star) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `service-star${star.center ? " is-center" : ""}`;
      button.setAttribute("aria-label", `${star.zip} - ${star.name}`);
      button.dataset.zip = star.zip;
      button.dataset.name = star.name;
      starsLayer.appendChild(button);
      stars.set(star.zip, { ...star, element: button, currentX: star.x, currentY: star.y });
    });

    connections.forEach(([from, to]) => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "constellation-line");
      linesLayer.appendChild(line);
      lines.push({ from, to, element: line });
    });

    function showTooltip(star) {
      tooltip.textContent = `${star.zip} - ${star.name}`;
      tooltip.style.left = `${star.currentX}%`;
      tooltip.style.top = `${star.currentY}%`;
      tooltip.classList.add("is-visible");
      stars.forEach((entry) => entry.element.classList.toggle("is-active", entry.zip === star.zip));
    }

    function hideTooltip() {
      tooltip.classList.remove("is-visible");
      stars.forEach((entry) => entry.element.classList.remove("is-active"));
    }

    stars.forEach((star) => {
      star.element.addEventListener("mouseenter", () => showTooltip(star));
      star.element.addEventListener("focus", () => showTooltip(star));
      star.element.addEventListener("click", () => showTooltip(star));
      star.element.addEventListener("mouseleave", hideTooltip);
      star.element.addEventListener("blur", hideTooltip);
    });

    constellation.addEventListener("mouseleave", hideTooltip);

    function animate(time) {
      stars.forEach((star) => {
        const driftX = Math.sin(time / 2400 + star.phase) * (star.driftX / 10);
        const driftY = Math.cos(time / 2600 + star.phase) * (star.driftY / 10);
        star.currentX = star.x + driftX;
        star.currentY = star.y + driftY;
        star.element.style.left = `${star.currentX}%`;
        star.element.style.top = `${star.currentY}%`;
      });

      lines.forEach((line) => {
        const from = stars.get(line.from);
        const to = stars.get(line.to);
        if (!from || !to) {
          return;
        }

        line.element.setAttribute("x1", from.currentX);
        line.element.setAttribute("y1", from.currentY);
        line.element.setAttribute("x2", to.currentX);
        line.element.setAttribute("y2", to.currentY);
      });

      if (tooltip.classList.contains("is-visible")) {
        const activeStar = Array.from(stars.values()).find((star) =>
          star.element.classList.contains("is-active")
        );
        if (activeStar) {
          tooltip.style.left = `${activeStar.currentX}%`;
          tooltip.style.top = `${activeStar.currentY}%`;
        }
      }

      window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
  }

  initScrollAnimations();
  initExperienceCustomizer();
  initStickyCtaVisibility();
  initServiceConstellation();
})();
