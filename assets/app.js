/* =========================================================
   DigiSER BD
   Main Application JavaScript
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const DIGISERBD_CONFIG = {

  whatsapp:
    "8801719333614",

  siteName:
    "DigiSER BD",

  tagline:
    "Job • Service • Growth"

};


/* =========================================================
   SHORTCUT
========================================================= */

const DS =
  window.DigiSERBD || {};


/* =========================================================
   HEADER
========================================================= */

function renderHeader(){

  const slot =
    document.getElementById(
      "hdr-slot"
    );


  if(!slot){
    return;
  }


  const root =
    document.body.dataset.root || "";


  slot.innerHTML = `

    <header class="site-header">

      <div class="wrap header-inner">

        <a
          class="brand"
          href="${root}"
          aria-label="DigiSER BD Home"
        >

          <span class="brand-mark">
            D
          </span>

          <span class="brand-text">

            <strong>
              DigiSER BD
            </strong>

            <small>
              Job • Service • Growth
            </small>

          </span>

        </a>


        <nav
          class="main-nav"
          aria-label="Main navigation"
        >

          <a
            href="${root}"
            data-nav="home"
            data-i18n="nav.home"
          >
            Home
          </a>

          <a
            href="${root}jobs/"
            data-nav="jobs"
            data-i18n="nav.jobs"
          >
            Jobs
          </a>

          <a
            href="${root}employees/"
            data-nav="employees"
            data-i18n="nav.employees"
          >
            Employees
          </a>

          <a
            href="${root}services/"
            data-nav="services"
            data-i18n="nav.services"
          >
            Services
          </a>

          <a
            href="${root}businesses/"
            data-nav="businesses"
            data-i18n="nav.businesses"
          >
            Businesses
          </a>

          <a
            href="${root}track-application.html"
            data-nav="track"
            data-i18n="nav.track"
          >
            Track
          </a>

          <a
            href="${root}contact/"
            data-nav="contact"
            data-i18n="nav.contact"
          >
            Contact
          </a>

        </nav>


        <div class="header-actions">

          <button
            type="button"
            class="lang-btn"
            data-language="bn"
            aria-label="বাংলা"
          >
            বাংলা
          </button>

          <a
            class="btn pri"
            href="${root}register/"
            data-i18n="nav.register"
          >
            Register
          </a>

        </div>


        <button
          class="menu-btn"
          id="menuBtn"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>

    </header>

  `;


  setActiveNavigation();

  setupMobileMenu();

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActiveNavigation(){

  const page =
    document.body.dataset.page ||
    "home";


  document
    .querySelectorAll(
      "[data-nav]"
    )
    .forEach(
      link=>{

        const active =
          link.dataset.nav === page;


        link.classList.toggle(
          "active",
          active
        );

      }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu(){

  const button =
    document.getElementById(
      "menuBtn"
    );


  const nav =
    document.querySelector(
      ".main-nav"
    );


  if(
    !button ||
    !nav
  ){

    return;

  }


  button.addEventListener(
    "click",
    ()=>{

      const open =
        nav.classList.toggle(
          "open"
        );


      button.setAttribute(
        "aria-expanded",
        open
          ? "true"
          : "false"
      );

    }
  );


  nav
    .querySelectorAll("a")
    .forEach(
      link=>{

        link.addEventListener(
          "click",
          ()=>{

            nav.classList.remove(
              "open"
            );


            button.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );

}


/* =========================================================
   FOOTER
========================================================= */

function renderFooter(){

  const slot =
    document.getElementById(
      "ftr-slot"
    );


  if(!slot){
    return;
  }


  const root =
    document.body.dataset.root || "";


  slot.innerHTML = `

    <footer class="site-footer">

      <div class="wrap footer-grid">

        <div>

          <a
            class="brand footer-brand"
            href="${root}"
          >

            <span class="brand-mark">
              D
            </span>

            <span class="brand-text">

              <strong>
                DigiSER BD
              </strong>

              <small>
                Job • Service • Growth
              </small>

            </span>

          </a>

          <p>
            Connecting people, jobs,
            businesses and digital services
            across Bangladesh.
          </p>

        </div>


        <div>

          <h3>
            Quick Links
          </h3>

          <a href="${root}jobs/">
            Jobs
          </a>

          <a href="${root}employees/">
            Employees
          </a>

          <a href="${root}services/">
            Services
          </a>

          <a href="${root}businesses/">
            Businesses
          </a>

        </div>


        <div>

          <h3>
            For Applicants
          </h3>

          <a href="${root}register/">
            Register
          </a>

          <a href="${root}track-application.html">
            Track Application
          </a>

          <a href="${root}contact/">
            Contact
          </a>

        </div>


        <div>

          <h3>
            Contact
          </h3>

          <a
            href="mailto:info@digiserbd.com"
          >
            info@digiserbd.com
          </a>

          <a
            href="https://wa.me/${DIGISERBD_CONFIG.whatsapp}"
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>

        </div>

      </div>


      <div class="wrap footer-bottom">

        <p>
          © ${new Date().getFullYear()}
          DigiSER BD.
          All rights reserved.
        </p>

        <p>
          Job • Service • Growth
        </p>

      </div>

    </footer>

  `;

}


/* =========================================================
   WHATSAPP LINKS
========================================================= */

function setupWhatsApp(){

  document
    .querySelectorAll(
      "[data-wa]"
    )
    .forEach(
      link=>{

        const message =
          link.dataset.waMessage ||
          "Hello DigiSER BD, I would like to know more.";


        const url =
          `https://wa.me/${DIGISERBD_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;


        link.href =
          url;


        link.target =
          "_blank";


        link.rel =
          "noopener";

      }
    );

}


/* =========================================================
   HOME SERVICES
========================================================= */

function renderHomeServices(){

  const container =
    document.getElementById(
      "homeServices"
    );


  if(!container){
    return;
  }


  const db =
    DS.getDB
      ? DS.getDB()
      : {
          services:[]
        };


  const services =
    Array.isArray(
      db.services
    )
      ? db.services
      : [];


  if(!services.length){

    container.innerHTML = `

      <div class="empty-state">

        <h3>
          Digital services
        </h3>

        <p>
          Professional digital support
          for your business.
        </p>

        <a
          class="btn pri"
          href="services/"
        >
          Explore services
        </a>

      </div>

    `;

    return;

  }


  container.innerHTML =
    services
      .slice(0,4)
      .map(
        service=>`

          <article class="card">

            <div class="card-icon">
              ${DS.esc
                ? DS.esc(
                    service.icon || "✦"
                  )
                : "✦"}
            </div>

            <h3>
              ${DS.esc
                ? DS.esc(
                    service.title ||
                    service.name ||
                    "Digital Service"
                  )
                : "Digital Service"}
            </h3>

            <p>
              ${DS.esc
                ? DS.esc(
                    service.description ||
                    "Professional digital service."
                  )
                : "Professional digital service."}
            </p>

          </article>

        `
      )
      .join("");

}


/* =========================================================
   HOME JOBS
========================================================= */

function renderHomeJobs(){

  const container =
    document.getElementById(
      "homeJobs"
    );


  const liveContainer =
    document.getElementById(
      "live"
    );


  if(
    !container &&
    !liveContainer
  ){

    return;

  }


  const db =
    DS.getDB
      ? DS.getDB()
      : {
          jobs:[]
        };


  const jobs =
    Array.isArray(
      db.jobs
    )
      ? db.jobs
      : [];


  const openJobs =
    jobs.filter(
      job =>
        job.status !== "closed" &&
        job.status !== "inactive"
    );


  if(
    container
  ){

    if(!openJobs.length){

      container.innerHTML = `

        <div class="empty-state">

          <h3>
            No jobs available yet
          </h3>

          <p>
            New opportunities will appear here.
          </p>

        </div>

      `;

    }else{

      container.innerHTML =
        openJobs
          .slice(0,6)
          .map(
            job => renderJobCard(
              job
            )
          )
          .join("");

    }

  }


  if(
    liveContainer
  ){

    if(!openJobs.length){

      liveContainer.innerHTML = `

        <div class="live-empty">
          No open jobs right now.
        </div>

      `;

    }else{

      liveContainer.innerHTML =
        openJobs
          .slice(0,4)
          .map(
            job => `

              <a
                class="live-job"
                href="jobs/"
              >

                <strong>
                  ${
                    DS.esc
                      ? DS.esc(
                          job.title ||
                          job.role ||
                          "Job opportunity"
                        )
                      : "Job opportunity"
                  }
                </strong>

                <span>
                  ${
                    DS.esc
                      ? DS.esc(
                          job.company ||
                          job.business ||
                          "DigiSER BD"
                        )
                      : "DigiSER BD"
                  }
                </span>

              </a>

            `
          )
          .join("");

    }

  }

}


/* =========================================================
   JOB CARD
========================================================= */

function renderJobCard(
  job
){

  const title =
    job.title ||
    job.role ||
    "Job opportunity";


  const company =
    job.company ||
    job.business ||
    "Local business";


  const location =
    job.location ||
    "Bangladesh";


  const salary =
    job.salary ||
    job.expectedSalary ||
    "";


  return `

    <article class="job-card">

      <div class="job-top">

        <div>

          <h3>
            ${
              DS.esc
                ? DS.esc(title)
                : title
            }
          </h3>

          <p>
            ${
              DS.esc
                ? DS.esc(company)
                : company
            }
          </p>

        </div>

        <span class="status-badge">
          Open
        </span>

      </div>


      <div class="job-meta">

        <span>
          📍
          ${
            DS.esc
              ? DS.esc(location)
              : location
          }
        </span>

        ${
          salary
            ? `
              <span>
                💰
                ${
                  DS.esc
                    ? DS.esc(salary)
                    : salary
                }
              </span>
            `
            : ""
        }

      </div>


      <a
        class="more"
        href="jobs/"
      >
        View job
      </a>

    </article>

  `;

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch(){

  const form =
    document.getElementById(
      "searchForm"
    );


  const input =
    document.getElementById(
      "q"
    );


  if(
    !form ||
    !input
  ){

    return;

  }


  let type =
    "jobs";


  document
    .querySelectorAll(
      "[data-t]"
    )
    .forEach(
      tab=>{

        tab.addEventListener(
          "click",
          ()=>{

            document
              .querySelectorAll(
                "[data-t]"
              )
              .forEach(
                item=>{

                  item.classList.remove(
                    "on"
                  );

                  item.setAttribute(
                    "aria-pressed",
                    "false"
                  );

                }
              );


            tab.classList.add(
              "on"
            );


            tab.setAttribute(
              "aria-pressed",
              "true"
            );


            type =
              tab.dataset.t;


            updateSearchPlaceholder(
              input,
              type
            );

          }
        );

      }
    );


  form.addEventListener(
    "submit",
    event=>{

      event.preventDefault();


      const query =
        input.value.trim();


      if(!query){

        input.focus();

        return;

      }


      const root =
        document.body.dataset.root || "";


      const pages = {

        jobs:
          `${root}jobs/?q=${encodeURIComponent(query)}`,

        employees:
          `${root}employees/?q=${encodeURIComponent(query)}`,

        services:
          `${root}services/?q=${encodeURIComponent(query)}`

      };


      window.location.href =
        pages[type] ||
        pages.jobs;

    }
  );


  updateSearchPlaceholder(
    input,
    type
  );

}


/* =========================================================
   SEARCH PLACEHOLDER
========================================================= */

function updateSearchPlaceholder(
  input,
  type
){

  const placeholders = {

    jobs:
      "Search jobs...",

    employees:
      "Search employees...",

    services:
      "Search services..."

  };


  input.placeholder =
    placeholders[type] ||
    placeholders.jobs;

}


/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */

function setupSmoothLinks(){

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      link=>{

        link.addEventListener(
          "click",
          event=>{

            const targetId =
              link.getAttribute(
                "href"
              );


            if(
              !targetId ||
              targetId === "#"
            ){

              return;

            }


            const target =
              document.querySelector(
                targetId
              );


            if(!target){
              return;
            }


            event.preventDefault();


            target.scrollIntoView({
              behavior:"smooth",
              block:"start"
            });

          }
        );

      }
    );

}


/* =========================================================
   YEAR
========================================================= */

function renderYear(){

  document
    .querySelectorAll(
      "[data-year]"
    )
    .forEach(
      element=>{

        element.textContent =
          new Date().getFullYear();

      }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initDigiSERBD(){

  renderHeader();

  renderFooter();

  setupWhatsApp();

  renderHomeServices();

  renderHomeJobs();

  setupSearch();

  setupSmoothLinks();

  renderYear();


  /*
    Apply saved language after
    header/footer are created.
  */

  if(
    window.DigiSERBD_I18N &&
    typeof
      window.DigiSERBD_I18N.applyLanguage
      === "function"
  ){

    window.DigiSERBD_I18N.applyLanguage();

  }

}


/* =========================================================
   START
========================================================= */

if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    initDigiSERBD
  );

}else{

  initDigiSERBD();

}
