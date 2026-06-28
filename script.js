const routes = ["about", "experience", "education", "skills", "projects"];
const panels = document.querySelectorAll("[data-panel]");
const routeControls = document.querySelectorAll("[data-route]");
const copyEmailButton = document.querySelector("[data-copy-email]");

function routeFromLocation() {
  const pathRoute = window.location.pathname.replace("/", "");
  const hashRoute = window.location.hash.replace("#", "");

  if (routes.includes(hashRoute)) return hashRoute;
  if (routes.includes(pathRoute)) return pathRoute;
  return "about";
}

function setRoute(route, push = true) {
  const nextRoute = routes.includes(route) ? route : "about";

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === nextRoute;
    panel.classList.toggle("active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  routeControls.forEach((control) => {
    const isActive = control.dataset.route === nextRoute;
    control.classList.toggle("active", isActive);
    if (control.classList.contains("tab-link")) {
      control.setAttribute("aria-selected", String(isActive));
      control.setAttribute("tabindex", isActive ? "0" : "-1");
    }
  });

  if (push) {
    window.history.pushState({ route: nextRoute }, "", `#${nextRoute}`);
  }

  window.scrollTo({ top: 0, behavior: push ? "smooth" : "auto" });
}

routeControls.forEach((control) => {
  control.addEventListener("click", () => {
    setRoute(control.dataset.route);
  });
});

window.addEventListener("popstate", () => setRoute(routeFromLocation(), false));
setRoute(routeFromLocation(), false);

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

if (copyEmailButton) {
  const label = copyEmailButton.querySelector("[data-copy-email-label]");
  const defaultLabel = label?.textContent || "Email";
  let resetTimer;

  copyEmailButton.addEventListener("click", async () => {
    try {
      await copyText(copyEmailButton.dataset.copyEmail);
      if (label) label.textContent = "Email copied";
      copyEmailButton.setAttribute("aria-label", "Email address copied");
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        if (label) label.textContent = defaultLabel;
        copyEmailButton.setAttribute("aria-label", "Copy email address");
      }, 1800);
    } catch {
      window.location.href = `mailto:${copyEmailButton.dataset.copyEmail}`;
    }
  });
}
