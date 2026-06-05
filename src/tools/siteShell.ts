export function initSiteShell() {
  const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-button]");
  const navLinks = document.querySelector<HTMLElement>("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const yearNode = document.querySelector<HTMLElement>("[data-year]");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}
