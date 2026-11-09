// Theme toggle: remembers the viewer's choice, falls back to the OS setting.
(function () {
  "use strict";

  var KEY = "cmrd-theme";
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var icon = document.getElementById("theme-icon");

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function apply(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    var isDark = theme ? theme === "dark" : systemPrefersDark();
    if (button) {
      button.setAttribute("aria-pressed", String(isDark));
    }
    if (icon) {
      icon.textContent = isDark ? "☀" : "☾";
    }
  }

  apply(stored());

  if (button) {
    button.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme")
        ? root.getAttribute("data-theme") === "dark"
        : systemPrefersDark();
      var next = isDark ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (error) {
        /* Private mode or blocked storage: the choice just does not persist. */
      }
    });
  }
})();
