/* =========================================================
   DigiSER BD - Main Application JavaScript
   (header + footer styling now built in, one file to replace)
========================================================= */

"use strict";

const DIGISERBD_CONFIG = {
  whatsapp: "8801719333614",
  siteName: "DigiSER BD",
  tagline: "Job • Service • Growth"
};

/* Renamed from DS to APP_DS: index.html also declares `const DS`,
   and two scripts cannot declare the same top-level const. */
const APP_DS = window.DigiSERBD || {};

function appEsc(value) {
  if (APP_DS.esc) return APP_DS.esc(value);
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function appRoot() {
  return document.body.dataset.root || "";
}

/* =========================================================
   HEADER + FOOTER STYLES
========================================================= */

function injectShellStyles() {
  if (document.getElementById("digiserbd-shell-css")) return;

  const css = `
.site-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);-webkit-backdrop-filter:saturate(180%) blur(14px);backdrop-filter:saturate(180%) blur(14px);border-bottom:1px solid #e4edf1}
.site-header .header-inner{display:flex;align-items:center;gap:26px;min-height:72px}
.site-header .brand,.site-footer .brand{display:inline-flex;align-items:center;gap:11px;flex:0 0 auto;color:#10202b;text-decoration:none}
.brand-mark{width:42px;height:42px;flex:0 0 42px;border-radius:12px;font-size:0;line-height:0;color:transparent;overflow:hidden;background:#eaf8fd url("__LOGO__") center/contain no-repeat;box-shadow:0 0 0 1px #dbe9ef}
.brand-text{display:flex;flex-direction:column;line-height:1.1}
.brand-text strong{font-family:"Space Grotesk",sans-serif;font-size:19px;font-weight:700;letter-spacing:-.3px;color:#10202b}
.brand-text small{margin-top:3px;font-size:11px;font-weight:600;color:#7b8891;letter-spacing:.02em}
.main-nav{display:flex;align-items:center;gap:2px;margin-left:auto}
.main-nav a{padding:9px 14px;border-radius:999px;font-size:14px;font-weight:600;color:#5b6b75;text-decoration:none;white-space:nowrap;transition:background .15s,color .15s}
.main-nav a:hover{color:#10202b;background:#f1f7fa}
.main-nav a.active{color:#0087c4;background:#eaf8fd}
.main-nav .nav-register{display:none}
.header-actions{display:flex;align-items:center;gap:10px;flex:0 0 auto}
.lang-btn{height:40px;padding:0 16px;border:1px solid #e4edf1;border-radius:999px;background:#fff;color:#10202b;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:border-color .15s,background .15s}
.lang-btn:hover{border-color:#b9dce9;background:#f9fdff}
.header-actions .btn{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 20px;border:0;border-radius:999px;background:#0087c4;color:#fff;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 8px 20px rgba(0,135,196,.22);transition:background .15s,transform .15s}
.header-actions .btn:hover{background:#006f9f;transform:translateY(-1px)}
.menu-btn{display:none;flex:0 0 44px;width:44px;height:44px;padding:0;border:1px solid #e4edf1;border-radius:12px;background:#fff;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.menu-btn span{display:block;width:18px;height:2px;border-radius:2px;background:#10202b}

.site-footer{background:#0b2233;color:#b7c9d6;padding-top:60px}
.site-footer .footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;padding-bottom:44px}
.site-footer h3{margin:0 0 14px;font-family:"Space Grotesk",sans-serif;font-size:15px;color:#fff}
.site-footer a{display:block;padding:5px 0;font-size:14px;color:#b7c9d6;text-decoration:none}
.site-footer a:hover{color:#fff}
.site-footer a.brand{display:inline-flex;padding:0}
.site-footer .brand-text strong{color:#fff}
.site-footer .brand-text small{color:#8fa7b6}
.site-footer .brand-mark{box-shadow:none}
.site-footer p{max-width:320px;margin:16px 0 0;font-size:14px;line-height:1.7}
.site-footer .footer-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 20px;padding-top:20px;padding-bottom:22px;border-top:1px solid rgba(255,255,255,.12)}
.site-footer .footer-bottom p{max-width:none;margin:0;font-size:13px;color:#8fa7b6}

@media (max-width:900px){
  .site-header .header-inner{gap:12px;min-height:66px;flex-wrap:wrap}
  .header-actions{margin-left:auto}
  .menu-btn{display:flex}
  .main-nav{display:none;order:5;width:100%;flex-direction:column;align-items:stretch;gap:2px;margin:0;padding:8px 0 14px;border-top:1px solid #e4edf1}
  .main-nav.open{display:flex}
  .main-nav a{padding:13px 14px;border-radius:12px;font-size:15px}
  .site-footer .footer-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:560px){
  .brand-text small{display:none}
  .header-actions .btn{display:none}
  .main-nav .nav-register{display:block;margin-top:6px;background:#0087c4;color:#fff;text-align:center;font-weight:700}
  .main-nav .nav-register:hover{background:#006f9f;color:#fff}
  .site-footer .footer-grid{grid-template-columns:1fr;gap:28px}
}
`.replace(/__LOGO__/g, appRoot() + "logo.png");

  const style = document.createElement("style");
  style.id = "digiserbd-shell-css";
  style.textContent = css;
  document.head.appendChild(style);
}

/* =========================================================
   HEADER
========================================================= */

function renderHeader() {
  const slot = document.getElementById("hdr-slot");
  if (!slot) return;
  const root = appRoot();

  slot.innerHTML = `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="${root}" aria-label="DigiSER BD Home">
          <span class="brand-mark">D</span>
          <span class="brand-text">
            <strong>DigiSER BD</strong>
            <small>Job • Service • Growth</small>
          </span>
        </a>

        <nav class="main-nav" aria-label="Main navigation">
          <a href="${root}" data-nav="home" data-i18n="nav.home">Home</a>
          <a href="${root}jobs/" data-nav="jobs" data-i18n="nav.jobs">Jobs</a>
          <a href="${root}employees/" data-nav="employees" data-i18n="nav.employees">Employees</a>
          <a href="${root}services/" data-nav="services" data-i18n="nav.services">Services</a>
          <a href="${root}businesses/" data-nav="businesses" data-i18n="nav.businesses">Businesses</a>
          <a href="${root}track-application.html" data-nav="track" data-i18n="nav.track">Track</a>
          <a href="${root}contact/" data-nav="contact" data-i18n="nav.contact">Contact</a>
          <a class="nav-register" href="${root}register/" data-i18n="nav.register">Register</a>
        </nav>

        <div class="header-actions">
          <button type="button" class="lang-btn" data-language="bn" aria-label="বাংলা">বাংলা</button>
          <a class="btn pri" href="${root}register/" data-i18n="nav.register">Register</a>
        </div>

        <button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;

  setActiveNavigation();
  setupMobileMenu();
}

function setActiveNavigation() {
  const page = document.body.dataset.page || "home";
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
}

function setupMobileMenu() {
  const button = document.getElementById("menuBtn");
  const nav = document.querySelector(".main-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   FOOTER
========================================================= */

function renderFooter() {
  const slot = document.getElementById("ftr-slot");
  if (!slot) return;
  const root = appRoot();

  slot.innerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <a class="brand footer-brand" href="${root}">
            <span class="brand-mark">D</span>
            <span class="brand-text">
              <strong>DigiSER BD</strong>
              <small>Job • Service • Growth</small>
            </span>
          </a>
          <p>Connecting people, jobs, businesses and digital services across Bangladesh.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <a href="${root}jobs/">Jobs</a>
          <a href="${root}employees/">Employees</a>
          <a href="${root}services/">Services</a>
          <a href="${root}businesses/">Businesses</a>
        </div>

        <div>
          <h3>For Applicants</h3>
          <a href="${root}register/">Register</a>
          <a href="${root}track-application.html">Track Application</a>
          <a href="${root}contact/">Contact</a>
        </div>

        <div>
          <h3>Contact</h3>
          <a href="mailto:info@digiserbd.com">info@digiserbd.com</a>
          <a href="https://wa.me/${DIGISERBD_CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>

      <div class="wrap footer-bottom">
        <p>© ${new Date().getFullYear()} DigiSER BD. All rights reserved.</p>
        <p>Job • Service • Growth</p>
      </div>
    </footer>
  `;
}

/* =========================================================
   WHATSAPP LINKS
========================================================= */

function setupWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach(link => {
    const message = link.dataset.waMessage || "Hello DigiSER BD, I would like to know more.";
    link.href = `https://wa.me/${DIGISERBD_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

/* =========================================================
   HOME SERVICES (only runs if #homeServices exists)
========================================================= */

function renderHomeServices() {
  const container = document.getElementById("homeServices");
  if (!container) return;

  const db = APP_DS.getDB ? APP_DS.getDB() : { services: [] };
  const services = Array.isArray(db.services) ? db.services : [];

  if (!services.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Digital services</h3>
        <p>Professional digital support for your business.</p>
        <a class="btn pri" href="services/">Explore services</a>
      </div>`;
    return;
  }

  container.innerHTML = services.slice(0, 4).map(service => `
    <article class="card">
      <div class="card-icon">${appEsc(service.icon || "✦")}</div>
      <h3>${appEsc(service.title || service.name || "Digital Service")}</h3>
      <p>${appEsc(service.description || "Professional digital service.")}</p>
    </article>`).join("");
}

/* =========================================================
   HOME JOBS (only runs if #homeJobs or #live exists)
========================================================= */

function renderHomeJobs() {
  const container = document.getElementById("homeJobs");
  const liveContainer = document.getElementById("live");
  if (!container && !liveContainer) return;

  const db = APP_DS.getDB ? APP_DS.getDB() : { jobs: [] };
  const jobs = Array.isArray(db.jobs) ? db.jobs : [];
  const openJobs = jobs.filter(job => job.status !== "closed" && job.status !== "inactive");

  if (container) {
    container.innerHTML = openJobs.length
      ? openJobs.slice(0, 6).map(renderJobCard).join("")
      : `<div class="empty-state"><h3>No jobs available yet</h3><p>New opportunities will appear here.</p></div>`;
  }

  if (liveContainer) {
    liveContainer.innerHTML = openJobs.length
      ? openJobs.slice(0, 4).map(job => `
          <a class="live-job" href="jobs/">
            <strong>${appEsc(job.title || job.role || "Job opportunity")}</strong>
            <span>${appEsc(job.company || job.business || "DigiSER BD")}</span>
          </a>`).join("")
      : `<div class="live-empty">No open jobs right now.</div>`;
  }
}

function renderJobCard(job) {
  const title = job.title || job.role || "Job opportunity";
  const company = job.company || job.business || "Local business";
  const location = job.location || "Bangladesh";
  const salary = job.salary || job.expectedSalary || "";

  return `
    <article class="job-card">
      <div class="job-top">
        <div>
          <h3>${appEsc(title)}</h3>
          <p>${appEsc(company)}</p>
        </div>
        <span class="status-badge">Open</span>
      </div>
      <div class="job-meta">
        <span>📍 ${appEsc(location)}</span>
        ${salary ? `<span>💰 ${appEsc(salary)}</span>` : ""}
      </div>
      <a class="more" href="jobs/">View job</a>
    </article>`;
}

/* =========================================================
   SEARCH (old home search; no-op when the form is absent)
========================================================= */

function setupSearch() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("q");
  if (!form || !input) return;

  let type = "jobs";

  document.querySelectorAll("[data-t]").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-t]").forEach(item => {
        item.classList.remove("on");
        item.setAttribute("aria-pressed", "false");
      });
      tab.classList.add("on");
      tab.setAttribute("aria-pressed", "true");
      type = tab.dataset.t;
      updateSearchPlaceholder(input, type);
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) { input.focus(); return; }

    const root = appRoot();
    const pages = {
      jobs: `${root}jobs/?q=${encodeURIComponent(query)}`,
      employees: `${root}employees/?q=${encodeURIComponent(query)}`,
      services: `${root}services/?q=${encodeURIComponent(query)}`
    };
    window.location.href = pages[type] || pages.jobs;
  });

  updateSearchPlaceholder(input, type);
}

function updateSearchPlaceholder(input, type) {
  const placeholders = {
    jobs: "Search jobs...",
    employees: "Search employees...",
    services: "Search services..."
  };
  input.placeholder = placeholders[type] || placeholders.jobs;
}

/* =========================================================
   SMOOTH ANCHOR LINKS + YEAR
========================================================= */

function setupSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderYear() {
  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
}

/* =========================================================
   INITIALIZE
========================================================= */

function initDigiSERBD() {
  injectShellStyles();
  renderHeader();
  renderFooter();
  setupWhatsApp();
  renderHomeServices();
  renderHomeJobs();
  setupSearch();
  setupSmoothLinks();
  renderYear();

  /* Apply saved language after header/footer are created. */
  if (
    window.DigiSERBD_I18N &&
    typeof window.DigiSERBD_I18N.applyLanguage === "function"
  ) {
    window.DigiSERBD_I18N.applyLanguage();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDigiSERBD);
} else {
  initDigiSERBD();
}
