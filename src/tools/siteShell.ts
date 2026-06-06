export function initSiteShell() {
  const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-button]");
  const menuButtonLabel = document.querySelector<HTMLElement>("[data-menu-button-label]");
  const navLinks = document.querySelector<HTMLElement>("[data-nav-links]");
  const navGroups = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-group]"));

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      if (menuButtonLabel) menuButtonLabel.textContent = isOpen ? "Close" : "Menu";
    });
  }

  const closeNavGroups = (except?: HTMLElement) => {
    navGroups.forEach((group) => {
      if (group === except) return;
      group.classList.remove("is-open");
      group.querySelector<HTMLButtonElement>("[data-nav-trigger]")?.setAttribute("aria-expanded", "false");
    });
  };

  navGroups.forEach((group) => {
    const trigger = group.querySelector<HTMLButtonElement>("[data-nav-trigger]");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = !group.classList.contains("is-open");
      closeNavGroups(group);
      group.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".nav")) return;
    closeNavGroups();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNavGroups();
    if (menuButton && navLinks?.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      if (menuButtonLabel) menuButtonLabel.textContent = "Menu";
    }
  });

  const yearNode = document.querySelector<HTMLElement>("[data-year]");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}
