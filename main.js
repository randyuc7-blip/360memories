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

  function initShowcaseBoothMotion() {
    const section = document.querySelector("#experience-customizer");
    const boothVisual = document.querySelector(".showcase-booth-visual");
    const armGroup = document.querySelector(".showcase-booth-arm-group");
    const ring = document.querySelector(".showcase-booth-ring");

    if (!section || !boothVisual || !armGroup || !ring) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let targetProgress = 0;
    let armProgress = 0;
    let ringProgress = 0;
    let isInView = false;
    let ticking = false;

    function updateTargetProgress() {
      if (!isInView) {
        ticking = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom <= 0) {
        targetProgress = 1;
        ticking = false;
        return;
      }

      if (rect.top >= viewportHeight) {
        targetProgress = 0;
        ticking = false;
        return;
      }

      const travel = viewportHeight + rect.height;
      const rawProgress = (viewportHeight - rect.top) / travel;
      targetProgress = Math.min(1, Math.max(0, rawProgress));
      ticking = false;
    }

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (!isInView) {
          return;
        }

        updateTargetProgress();
      },
      {
        threshold: 0.2
      }
    );

    sectionObserver.observe(section);

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) {
          return;
        }

        ticking = true;
        window.requestAnimationFrame(updateTargetProgress);
      },
      { passive: true }
    );

    window.addEventListener("resize", updateTargetProgress);
    updateTargetProgress();

    function animateShowcaseBooth() {
      const isMobile = window.innerWidth <= 720;
      const maxRotation = isMobile ? 160 : 220;
      const verticalOffset = isMobile ? 8 : 12;
      const showcaseScale = 1 + targetProgress * (isMobile ? 0.025 : 0.035);
      const armDelta = targetProgress - armProgress;
      const ringDelta = targetProgress - ringProgress;

      armProgress += armDelta * 0.1;
      ringProgress += ringDelta * 0.08;

      if (Math.abs(armDelta) < 0.0015) {
        armProgress = targetProgress;
      }

      if (Math.abs(ringDelta) < 0.0015) {
        ringProgress = targetProgress;
      }

      boothVisual.style.transform = `scale(${showcaseScale})`;
      armGroup.style.transform = `rotate(${armProgress * maxRotation}deg) translate3d(0, ${armProgress * verticalOffset}px, 0)`;
      ring.style.transform = `translate(-50%, -50%) rotate(${ringProgress * maxRotation * 0.12}deg) scale(${1 + ringProgress * 0.04})`;

      window.requestAnimationFrame(animateShowcaseBooth);
    }

    window.requestAnimationFrame(animateShowcaseBooth);
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

  initScrollAnimations();
  initExperienceCustomizer();
  initShowcaseBoothMotion();
  initStickyCtaVisibility();
})();
