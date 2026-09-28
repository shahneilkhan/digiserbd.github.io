/* =========================================================
   DigiSER BD
   Shared Data
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const DIGISERBD_STORAGE_KEY =
  "digiserbd_admin_v1";


/* =========================================================
   DEFAULT DATABASE
========================================================= */

const DIGISERBD_DEFAULT_DB = {

  users: [],

  jobs: [],

  services: [],

  employees: [],

  businesses: [],

  messages: [],

  blog: []

};


/* =========================================================
   GET DATABASE
========================================================= */

function getDB(){

  try{

    const raw =
      localStorage.getItem(
        DIGISERBD_STORAGE_KEY
      );


    if(!raw){

      return JSON.parse(
        JSON.stringify(
          DIGISERBD_DEFAULT_DB
        )
      );

    }


    const db =
      JSON.parse(raw);


    /*
      Make sure every collection exists.
    */

    Object.keys(
      DIGISERBD_DEFAULT_DB
    ).forEach(key=>{

      if(!Array.isArray(db[key])){

        db[key] =
          [];

      }

    });


    return db;

  }catch(error){

    console.error(
      "DigiSER BD database error:",
      error
    );


    return JSON.parse(
      JSON.stringify(
        DIGISERBD_DEFAULT_DB
      )
    );

  }

}


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveDB(db){

  try{

    localStorage.setItem(
      DIGISERBD_STORAGE_KEY,
      JSON.stringify(db)
    );


    return true;

  }catch(error){

    console.error(
      "DigiSER BD save error:",
      error
    );


    return false;

  }

}


/* =========================================================
   RESET DATABASE
========================================================= */

function resetDB(){

  const freshDB =
    JSON.parse(
      JSON.stringify(
        DIGISERBD_DEFAULT_DB
      )
    );


  saveDB(
    freshDB
  );


  return freshDB;

}


/* =========================================================
   GENERATE ID
========================================================= */

function generateID(prefix="DGBD"){

  const time =
    Date.now()
      .toString(36)
      .toUpperCase();


  const random =
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();


  return `${prefix}-${time}-${random}`;

}


/* =========================================================
   GENERATE TRACKING NUMBER
========================================================= */

function generateTrackingNumber(){

  const year =
    new Date()
      .getFullYear();


  const number =
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  return `DGBD-${year}-${number}`;

}


/* =========================================================
   NORMALIZE MOBILE
========================================================= */

function normalizeMobile(value){

  let mobile =
    String(
      value || ""
    )
    .replace(
      /\D/g,
      ""
    );


  /*
    Bangladesh international format:
    8801XXXXXXXXX
    →
    01XXXXXXXXX
  */

  if(
    mobile.startsWith("880")
  ){

    mobile =
      "0" +
      mobile.substring(3);

  }


  return mobile;

}


/* =========================================================
   NORMALIZE TRACKING NUMBER
========================================================= */

function normalizeTrackingNumber(value){

  return String(
    value || ""
  )
  .trim()
  .toUpperCase()
  .replace(
    /\s+/g,
    ""
  );

}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(status){

  const labels = {

    new:
      "Application Submitted",

    reviewing:
      "Under Review",

    shortlisted:
      "Shortlisted",

    interview:
      "Interview",

    selected:
      "Selected",

    rejected:
      "Not Selected"

  };


  return (
    labels[status] ||
    "Application Submitted"
  );

}


/* =========================================================
   STATUS DESCRIPTION
========================================================= */

function getStatusDescription(status){

  const descriptions = {

    new:
      "Your application has been received.",

    reviewing:
      "Your application is currently being reviewed.",

    shortlisted:
      "You have been shortlisted for the next stage.",

    interview:
      "Your application has reached the interview stage.",

    selected:
      "Your application has been selected.",

    rejected:
      "The application process has been completed."

  };


  return (
    descriptions[status] ||
    "Your application has been received."
  );

}


/* =========================================================
   STATUS ORDER
========================================================= */

const DIGISERBD_STATUS_ORDER = [

  "new",

  "reviewing",

  "shortlisted",

  "interview",

  "selected"

];


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status){

  const allowed = [

    "new",

    "reviewing",

    "shortlisted",

    "interview",

    "selected",

    "rejected"

  ];


  return allowed.includes(
    status
  )
    ? status
    : "new";

}


/* =========================================================
   FIND USER BY ID
========================================================= */

function findUserById(id){

  const db =
    getDB();


  return db.users.find(
    user =>
      String(
        user.id || ""
      ) ===
      String(
        id || ""
      )
  );

}


/* =========================================================
   FIND APPLICATION
========================================================= */

function findApplication(
  mobile,
  trackingNumber
){

  const db =
    getDB();


  const targetMobile =
    normalizeMobile(
      mobile
    );


  const targetTracking =
    normalizeTrackingNumber(
      trackingNumber
    );


  return db.users.find(
    user=>{

      const applicantTracking =
        normalizeTrackingNumber(
          user.trackingNumber ||
          user.id ||
          ""
        );


      const applicantMobile =
        normalizeMobile(
          user.personal?.mobile ||
          user.mobile ||
          ""
        );


      return (

        applicantTracking ===
        targetTracking

      )
      &&
      (

        applicantMobile ===
        targetMobile

      );

    }
  );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value,
  locale="en-BD"
){

  if(!value){

    return "—";

  }


  const date =
    new Date(
      value
    );


  if(
    Number.isNaN(
      date.getTime()
    )
  ){

    return "—";

  }


  return date.toLocaleDateString(
    locale,
    {
      year:"numeric",
      month:"short",
      day:"numeric"
    }
  );

}


/* =========================================================
   FORMAT DATE + TIME
========================================================= */

function formatDateTime(
  value,
  locale="en-BD"
){

  if(!value){

    return "—";

  }


  const date =
    new Date(
      value
    );


  if(
    Number.isNaN(
      date.getTime()
    )
  ){

    return "—";

  }


  return date.toLocaleString(
    locale,
    {
      year:"numeric",
      month:"short",
      day:"numeric",
      hour:"numeric",
      minute:"2-digit"
    }
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(value){

  return String(
    value ?? ""
  )
  .replace(
    /&/g,
    "&amp;"
  )
  .replace(
    /</g,
    "&lt;"
  )
  .replace(
    />/g,
    "&gt;"
  )
  .replace(
    /"/g,
    "&quot;"
  )
  .replace(
    /'/g,
    "&#039;"
  );

}


/* =========================================================
   GET APPLICANT NAME
========================================================= */

function getApplicantName(user){

  return (
    user?.personal?.name ||
    user?.name ||
    "Applicant"
  );

}


/* =========================================================
   GET APPLICANT MOBILE
========================================================= */

function getApplicantMobile(user){

  return (
    user?.personal?.mobile ||
    user?.mobile ||
    ""
  );

}


/* =========================================================
   GET APPLICANT ROLE
========================================================= */

function getApplicantRole(user){

  return (
    user?.wanted?.role ||
    user?.role ||
    "—"
  );

}


/* =========================================================
   GET TRACKING NUMBER
========================================================= */

function getTrackingNumber(user){

  return (
    user?.trackingNumber ||
    user?.id ||
    "—"
  );

}


/* =========================================================
   GET USER STATUS
========================================================= */

function getUserStatus(user){

  return (
    user?.status ||
    "new"
  );

}


/* =========================================================
   EXPORT GLOBAL OBJECT
========================================================= */

window.DigiSERBD = {

  STORAGE_KEY:
    DIGISERBD_STORAGE_KEY,

  getDB,

  saveDB,

  resetDB,

  generateID,

  generateTrackingNumber,

  normalizeMobile,

  normalizeTrackingNumber,

  getStatusLabel,

  getStatusDescription,

  getStatusClass,

  findUserById,

  findApplication,

  formatDate,

  formatDateTime,

  esc,

  getApplicantName,

  getApplicantMobile,

  getApplicantRole,

  getTrackingNumber,

  getUserStatus,

  STATUS_ORDER:
    DIGISERBD_STATUS_ORDER

};
