(() => {
  const preferenceKey = "voicekeeper.language";
  const supported = ["ru", "en"];

  function initialLanguage() {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (supported.includes(saved)) return saved;
    } catch {
      // Browser storage can be disabled.
    }

    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
    return preferences.map(locale => locale.split("-")[0].toLowerCase())
      .find(language => supported.includes(language)) ?? "en";
  }

  function bind(updateContent = () => {}) {
    const buttons = [...document.querySelectorAll("button[data-lang]")];
    const picker = document.querySelector("[data-language-picker]");
    const panels = [...document.querySelectorAll("[data-language-panel]")];

    function apply(language) {
      document.documentElement.lang = language;
      picker?.setAttribute("aria-label", language === "ru" ? "Язык" : "Language");

      buttons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.lang === language));
      });
      panels.forEach(panel => { panel.hidden = panel.lang !== language; });

      const heading = document.querySelector("main [data-language-panel]:not([hidden]) h1");
      if (heading) document.title = heading.textContent;

      updateContent(language);
    }

    buttons.forEach(button => button.addEventListener("click", () => {
      const language = button.dataset.lang;
      try {
        localStorage.setItem(preferenceKey, language);
      } catch {
        // The current page can still switch languages.
      }
      apply(language);
    }));

    apply(initialLanguage());
  }

  window.voiceKeeperLanguage = { bind };
})();
