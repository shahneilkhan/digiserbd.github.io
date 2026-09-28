/* =========================================================
   DigiSER BD
   Language / i18n System
========================================================= */

"use strict";


/* =========================================================
   LANGUAGE STORAGE
========================================================= */

const DIGISERBD_LANGUAGE_KEY =
  "digiserbd_language";


/* =========================================================
   TRANSLATIONS
========================================================= */

const DIGISERBD_TRANSLATIONS = {

  en: {

    "nav.home":
      "Home",

    "nav.jobs":
      "Jobs",

    "nav.employees":
      "Employees",

    "nav.services":
      "Services",

    "nav.businesses":
      "Businesses",

    "nav.track":
      "Track Application",

    "nav.register":
      "Register",

    "nav.contact":
      "Contact",

    "common.search":
      "Search",

    "common.submit":
      "Submit",

    "common.save":
      "Save",

    "common.cancel":
      "Cancel",

    "common.close":
      "Close",

    "common.back":
      "Back",

    "status.new":
      "Application Submitted",

    "status.reviewing":
      "Under Review",

    "status.shortlisted":
      "Shortlisted",

    "status.interview":
      "Interview",

    "status.selected":
      "Selected",

    "status.rejected":
      "Not Selected"

  },


  bn: {

    "nav.home":
      "হোম",

    "nav.jobs":
      "চাকরি",

    "nav.employees":
      "কর্মী",

    "nav.services":
      "সেবা",

    "nav.businesses":
      "ব্যবসা",

    "nav.track":
      "আবেদন ট্র্যাক করুন",

    "nav.register":
      "রেজিস্টার",

    "nav.contact":
      "যোগাযোগ",

    "common.search":
      "সার্চ",

    "common.submit":
      "সাবমিট",

    "common.save":
      "সেভ",

    "common.cancel":
      "বাতিল",

    "common.close":
      "বন্ধ করুন",

    "common.back":
      "ফিরে যান",

    "status.new":
      "Application Submitted",

    "status.reviewing":
      "Under Review",

    "status.shortlisted":
      "Shortlisted",

    "status.interview":
      "Interview",

    "status.selected":
      "Selected",

    "status.rejected":
      "Not Selected"

  }

};


/* =========================================================
   GET LANGUAGE
========================================================= */

function getLanguage(){

  const saved =
    localStorage.getItem(
      DIGISERBD_LANGUAGE_KEY
    );


  if(
    saved === "bn" ||
    saved === "en"
  ){

    return saved;

  }


  return "en";

}


/* =========================================================
   SET LANGUAGE
========================================================= */

function setLanguage(
  language
){

  if(
    language !== "bn" &&
    language !== "en"
  ){

    language = "en";

  }


  localStorage.setItem(
    DIGISERBD_LANGUAGE_KEY,
    language
  );


  applyLanguage(
    language
  );


  return language;

}


/* =========================================================
   TRANSLATE
========================================================= */

function t(
  key,
  fallback=""
){

  const language =
    getLanguage();


  return (
    DIGISERBD_TRANSLATIONS
      [language]?.[key]
    ??
    DIGISERBD_TRANSLATIONS
      .en?.[key]
    ??
    fallback
    ??
    key
  );

}


/* =========================================================
   APPLY LANGUAGE
========================================================= */

function applyLanguage(
  language = getLanguage()
){

  const dictionary =
    DIGISERBD_TRANSLATIONS[
      language
    ] ||
    DIGISERBD_TRANSLATIONS.en;


  /*
    Elements using:
    data-i18n="nav.home"
  */

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element=>{

        const key =
          element.dataset.i18n;


        if(
          dictionary[key] !== undefined
        ){

          element.textContent =
            dictionary[key];

        }

      }
    );


  /*
    Placeholder translation
  */

  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(
      element=>{

        const key =
          element.dataset
            .i18nPlaceholder;


        if(
          dictionary[key] !== undefined
        ){

          element.placeholder =
            dictionary[key];

        }

      }
    );


  /*
    Document language
  */

  document.documentElement.lang =
    language;


  /*
    Update language buttons
  */

  document
    .querySelectorAll(
      "[data-language]"
    )
    .forEach(
      button=>{

        const buttonLanguage =
          button.dataset.language;


        const active =
          buttonLanguage ===
          language;


        button.classList.toggle(
          "active",
          active
        );


        button.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

      }
    );

}


/* =========================================================
   LANGUAGE TOGGLE
========================================================= */

function toggleLanguage(){

  const current =
    getLanguage();


  const next =
    current === "en"
      ? "bn"
      : "en";


  setLanguage(
    next
  );


  return next;

}


/* =========================================================
   AUTO LANGUAGE BUTTON
========================================================= */

document.addEventListener(
  "click",
  function(event){

    const button =
      event.target.closest(
        "[data-language]"
      );


    if(!button){
      return;
    }


    const language =
      button.dataset.language;


    if(
      language !== "bn" &&
      language !== "en"
    ){

      return;

    }


    setLanguage(
      language
    );

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    applyLanguage();

  }
);


/* =========================================================
   GLOBAL API
========================================================= */

window.DigiSERBD_I18N = {

  getLanguage,

  setLanguage,

  toggleLanguage,

  applyLanguage,

  t

};
