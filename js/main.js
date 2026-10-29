/* ============================================================
   CONFIGURATION DU FORMULAIRE
   Remplacez FORM_ENDPOINT par l'URL de soumission de votre Google Form :
   - Créez le formulaire sur forms.google.com
   - Récupérez l'URL de pré-remplissage : menu ⋮ > "Obtenir le lien de pré-remplissage"
   - Copiez l'URL https://docs.google.com/forms/d/e/<ID>/formResponse
   - Laissez FORM_ENDPOINT = null pour utiliser uniquement le fallback mailto.
   ============================================================ */
const FORM_ENDPOINT = null; // ex: "https://docs.google.com/forms/d/e/XXXX/formResponse"

/* Mapping des champs du formulaire vers les IDs Google Form */
const FORM_FIELD_IDS = {
  name: "entry.XXXXXX",
  email: "entry.XXXXXX",
  projectType: "entry.XXXXXX",
  message: "entry.XXXXXX",
};

const FALLBACK_EMAIL = "contact@glabdoul.fr";

/* ---------- Menu mobile ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Navbar opaque au scroll ---------- */
const navbar = document.getElementById("navbar");

const onScroll = () => {
  navbar.classList.toggle("is-scrolled", window.scrollY > 8);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Ancre active selon la section visible ---------- */
const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const sections = navAnchors
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActiveAnchor = () => {
  const scrollPos = window.scrollY + 120;
  let current = sections[0];
  for (const s of sections) {
    if (s.offsetTop <= scrollPos) current = s;
  }
  for (const a of navAnchors) {
    a.setAttribute(
      "aria-current",
      a.getAttribute("href") === `#${current.id}` ? "true" : "false"
    );
  }
};
window.addEventListener("scroll", setActiveAnchor, { passive: true });
setActiveAnchor();

/* ---------- Animations au scroll (fade-in / slide-up) ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Formulaire de contact ---------- */
const form = document.getElementById("contactForm");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");
const submitBtn = form.querySelector('button[type="submit"]');

const showSuccess = () => {
  formSuccess.setAttribute("role", "status");
  formError.removeAttribute("role");
  form.reset();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const projectType = form.elements.projectType.value;
  const message = form.elements.message.value.trim();

  if (!name || !email || !projectType || !message || !email.includes("@")) {
    formError.setAttribute("role", "alert");
    formSuccess.removeAttribute("role");
    return;
  }
  formError.removeAttribute("role");

  if (FORM_ENDPOINT) {
    const data = new FormData();
    data.append(FORM_FIELD_IDS.name, name);
    data.append(FORM_FIELD_IDS.email, email);
    data.append(FORM_FIELD_IDS.projectType, projectType);
    data.append(FORM_FIELD_IDS.message, message);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: data,
    })
      .then(showSuccess)
      .catch(() => {
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
          `[Demande de contact] ${projectType} — ${name}`
        )}&body=${encodeURIComponent(`Nom : ${name}\nE-mail : ${email}\nType de projet : ${projectType}\n\n${message}`)}`;
        showSuccess();
      });
  } else {
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
      `[Demande de contact] ${projectType} — ${name}`
    )}&body=${encodeURIComponent(`Nom : ${name}\nE-mail : ${email}\nType de projet : ${projectType}\n\n${message}`)}`;
    showSuccess();
  }
});
