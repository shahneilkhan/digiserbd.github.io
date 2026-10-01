import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =========================================================
   DigiSER BD — Registration / Application
   Firebase + Firestore
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyCAc-am544kM_qxSB6vn61Uk-8N_jpq2s",
  authDomain: "digiserbds.firebaseapp.com",
  projectId: "digiserbds",
  storageBucket: "digiserbds.firebasestorage.app",
  messagingSenderId: "543059824242",
  appId: "1:543059824242:web:71cf0227ecddf2f840fceb",
  measurementId: "G-NX8RD20E7S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================================================
   Helpers
   ========================================================= */

const $ = id => document.getElementById(id);

function val(id) {
  const el = $(id);
  return el ? String(el.value || "").trim() : "";
}

function safeText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "";
}

function safeDisplay(id, display) {
  const el = $(id);
  if (el) el.style.display = display;
}

function safeRequired(id, required) {
  const el = $(id);
  if (el) el.required = required;
}

/* =========================================================
   Default Payment
   ========================================================= */

const DEFAULT_PAYMENT = {
  enabled: true,

  fee: 50,

  currency: "BDT",

  methods: {
    bkash: {
      enabled: true,
      number: "+8801580422117"
    },

    nagad: {
      enabled: false,
      number: ""
    },

    rocket: {
      enabled: false,
      number: ""
    }
  },

  instructions:
    "Send the application fee to the selected merchant number. Then enter the sender mobile number and transaction ID. Upload your payment screenshot.",

  screenshotRequired: true
};

let payment = JSON.parse(JSON.stringify(DEFAULT_PAYMENT));

let currentStep = 1;
let submitting = false;
let toastTimer = null;

/* =========================================================
   DOM
   ========================================================= */

const form = $("applicationForm");

const steps = [
  ...document.querySelectorAll(".form-step")
];

const indicators = [
  ...document.querySelectorAll(".step[data-step-indicator]")
];

/* =========================================================
   Initial UI
   ========================================================= */

if ($("year")) {
  $("year").textContent = new Date().getFullYear();
}

if ($("paymentDate")) {
  $("paymentDate").value =
    new Date().toISOString().slice(0, 10);
}

/* =========================================================
   Toast
   ========================================================= */

function showToast(message, type = "") {
  const toast = $("toast");

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.className = "toast show " + type;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 5000);
}

/* =========================================================
   Mobile
   ========================================================= */

function normalizeMobile(value) {
  let mobile = String(value || "")
    .replace(/[\s-]/g, "");

  if (mobile.startsWith("+880")) {
    mobile = "0" + mobile.slice(4);
  }

  if (mobile.startsWith("880")) {
    mobile = "0" + mobile.slice(3);
  }

  return mobile;
}

function validMobile(value) {
  return /^01[3-9]\d{8}$/.test(
    normalizeMobile(value)
  );
}

/* =========================================================
   IDs
   ========================================================= */

function createId(prefix) {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}

function createApplicationId() {
  return (
    `DGS-${new Date().getFullYear()}-` +
    Math.floor(10000 + Math.random() * 90000)
  );
}

/* =========================================================
   Firebase Timeout
   ========================================================= */

function withTimeout(promise, ms = 20000, message = "Request timed out.") {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, ms);
    })
  ]);
}

/* =========================================================
   Firebase Error
   ========================================================= */

function firebaseError(error) {
  console.error("Firebase error:", error);

  if (!error) {
    return "Something went wrong. Please try again.";
  }

  const code = error.code || "";

  if (code.includes("permission-denied")) {
    return "Permission denied by Firebase. Please check Firestore rules.";
  }

  if (code.includes("unauthenticated")) {
    return "Firebase authentication is required.";
  }

  if (code.includes("resource-exhausted")) {
    return "The submitted file/data is too large for Firestore.";
  }

  if (code.includes("invalid-argument")) {
    return "Some submitted data is invalid.";
  }

  if (code.includes("failed-precondition")) {
    return "Firebase is not ready. Please try again.";
  }

  if (code.includes("unavailable")) {
    return "Firebase is temporarily unavailable. Please try again.";
  }

  if (code.includes("deadline-exceeded")) {
    return "Firebase took too long to respond.";
  }

  if (
    error.message &&
    error.message.toLowerCase().includes("timed out")
  ) {
    return error.message;
  }

  return error.message || "Something went wrong. Please try again.";
}

/* =========================================================
   File Validation
   ========================================================= */

function checkFile(input, maxMB, types) {
  if (!input) return null;

  const file =
    input.files &&
    input.files[0];

  if (!file) return null;

  if (file.size > maxMB * 1024 * 1024) {
    throw new Error(
      `${file.name} is larger than ${maxMB} MB.`
    );
  }

  if (
    types.length &&
    !types.includes(file.type)
  ) {
    throw new Error(
      `${file.name} has an unsupported file type.`
    );
  }

  return file;
}

/* =========================================================
   File Reader
   ========================================================= */

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(
        new Error("File could not be read.")
      );
    };

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

/* =========================================================
   Image Compression
   ========================================================= */

function compressImage(
  file,
  maxWidth = 700,
  quality = 0.45
) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const img = new Image();

    img.onerror = () => {
      URL.revokeObjectURL(url);

      reject(
        new Error("Invalid image file.")
      );
    };

    img.onload = () => {
      try {
        const scale =
          Math.min(1, maxWidth / img.width);

        const canvas =
          document.createElement("canvas");

        canvas.width =
          Math.max(
            1,
            Math.round(img.width * scale)
          );

        canvas.height =
          Math.max(
            1,
            Math.round(img.height * scale)
          );

        const ctx =
          canvas.getContext("2d");

        if (!ctx) {
          throw new Error(
            "Image processing failed."
          );
        }

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        URL.revokeObjectURL(url);

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            quality
          )
        );

      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.src = url;
  });
}

/* =========================================================
   Convert File
   ========================================================= */

async function fileToData(file) {
  if (!file) {
    return "";
  }

  if (
    file.type &&
    file.type.startsWith("image/")
  ) {
    let data =
      await compressImage(
        file,
        700,
        0.45
      );

    /*
      Keep Base64 data small because
      Firestore documents have size limits.
    */

    if (data.length > 220000) {
      data =
        await compressImage(
          file,
          550,
          0.35
        );
    }

    if (data.length > 220000) {
      throw new Error(
        "Image is too large after compression. Please upload a smaller image."
      );
    }

    return data;
  }

  /*
    CV files are kept intentionally small.
    Large PDF/DOC files should eventually use
    Firebase Storage instead of Firestore.
  */

  if (file.size > 250 * 1024) {
    throw new Error(
      "CV must be under 250 KB. Please upload a smaller CV."
    );
  }

  return await readAsDataURL(file);
}

/* =========================================================
   Payment Settings
   ========================================================= */

async function loadSettings() {
  try {
    const reference =
      doc(
        db,
        "settings",
        "payment"
      );

    const snapshot =
      await withTimeout(
        getDoc(reference),
        12000,
        "Payment settings request timed out."
      );

    if (snapshot.exists()) {
      const data = snapshot.data();

      payment = {
        ...DEFAULT_PAYMENT,
        ...data,

        methods: {
          ...DEFAULT_PAYMENT.methods,
          ...(data.methods || {})
        }
      };
    }

  } catch (error) {

    console.warn(
      "Payment settings could not be loaded:",
      error
    );

    /*
      Do not stop the registration form
      if payment settings fail.
    */

    payment =
      JSON.parse(
        JSON.stringify(DEFAULT_PAYMENT)
      );
  }

  renderPayment();
}

/* =========================================================
   Render Payment
   ========================================================= */

function renderPayment() {
  const enabled =
    payment.enabled !== false;

  safeDisplay(
    "paymentEnabledBox",
    enabled ? "block" : "none"
  );

  safeDisplay(
    "paymentDisabledBox",
    enabled ? "none" : "block"
  );

  safeText(
    "feeDisplay",
    `${payment.fee || 0} ${
      payment.currency || "BDT"
    }`
  );

  const grid =
    $("methodGrid");

  if (grid) {
    grid.innerHTML = "";

    const methods = [
      {
        key: "bkash",
        label: "bKash"
      },
      {
        key: "nagad",
        label: "Nagad"
      },
      {
        key: "rocket",
        label: "Rocket"
      }
    ];

    let count = 0;

    methods.forEach(method => {
      const config =
        payment.methods &&
        payment.methods[method.key];

      if (
        !config ||
        config.enabled !== true
      ) {
        return;
      }

      count++;

      const wrapper =
        document.createElement("div");

      wrapper.className = "method";

      wrapper.innerHTML = `
        <input
          type="radio"
          name="paymentMethod"
          id="method_${method.key}"
          value="${method.key}"
          ${count === 1 ? "checked" : ""}
        >

        <label for="method_${method.key}">
          ${method.label}
        </label>
      `;

      grid.appendChild(wrapper);
    });

    if (count === 0) {
      grid.innerHTML = `
        <div
          style="
            grid-column:1/-1;
            padding:13px;
            border-radius:12px;
            background:#fff8ed;
            color:#85641f;
            font-size:12px;
          "
        >
          No payment method is currently available.
        </div>
      `;
    }
  }

  safeText(
    "paymentInstructions",
    payment.instructions ||
    DEFAULT_PAYMENT.instructions
  );

  updateMerchant();
  updateRequirements();
}

/* =========================================================
   Merchant
   ========================================================= */

function updateMerchant() {
  const selected =
    document.querySelector(
      'input[name="paymentMethod"]:checked'
    );

  const element =
    $("merchantInfo");

  if (!element) return;

  if (!selected) {
    element.textContent =
      "No payment method selected.";

    return;
  }

  const config =
    payment.methods &&
    payment.methods[selected.value];

  if (
    config &&
    config.number
  ) {
    element.textContent =
      `${selected.value.toUpperCase()} Merchant: ${config.number}`;
  } else {
    element.textContent =
      "Merchant information is not configured yet.";
  }
}

/* =========================================================
   Payment Requirements
   ========================================================= */

function updateRequirements() {
  const enabled =
    payment.enabled !== false;

  safeRequired(
    "senderNumber",
    enabled
  );

  safeRequired(
    "trxId",
    enabled
  );

  safeRequired(
    "paymentScreenshot",
    enabled &&
    payment.screenshotRequired === true
  );
}

/* =========================================================
   Payment Radio Listener
   ========================================================= */

document.addEventListener(
  "change",
  event => {
    if (
      event.target.matches(
        'input[name="paymentMethod"]'
      )
    ) {
      updateMerchant();
    }
  }
);

/* =========================================================
   Step Validation
   ========================================================= */

function validateStep(stepNumber) {
  const step =
    document.querySelector(
      `.form-step[data-step="${stepNumber}"]`
    );

  if (!step) {
    return true;
  }

  const fields =
    step.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

  for (const field of fields) {

    if (
      field.type === "checkbox"
    ) {
      if (!field.checked) {
        field.focus();

        showToast(
          "Please complete all required fields.",
          "error"
        );

        return false;
      }

      continue;
    }

    if (
      !String(field.value || "").trim()
    ) {
      field.focus();

      showToast(
        "Please complete all required fields.",
        "error"
      );

      return false;
    }

    if (
      field.id === "mobile" &&
      !validMobile(field.value)
    ) {
      field.focus();

      showToast(
        "Please enter a valid mobile number.",
        "error"
      );

      return false;
    }
  }

  return true;
}

/* =========================================================
   Summary
   ========================================================= */

function updateSummary() {
  safeText(
    "summaryName",
    val("name") || "—"
  );

  safeText(
    "summaryMobile",
    normalizeMobile(
      val("mobile")
    ) || "—"
  );

  safeText(
    "summaryJob",
    val("jobTitle") || "—"
  );

  safeText(
    "summaryLocation",
    val("location") || "—"
  );
}

/* =========================================================
   Show Step
   ========================================================= */

function showStep(number) {
  currentStep = number;

  steps.forEach(step => {
    step.classList.toggle(
      "active",
      Number(step.dataset.step) === number
    );
  });

  indicators.forEach(indicator => {
    const key =
      Number(
        indicator.dataset.stepIndicator
      );

    indicator.classList.toggle(
      "active",
      key === number
    );

    indicator.classList.toggle(
      "done",
      key < number
    );
  });

  if (number === 3) {
    updateSummary();
  }

  if (number === 4) {
    updateRequirements();
  }

  const shell =
    document.querySelector(
      ".form-shell"
    );

  if (shell) {
    window.scrollTo({
      top:
        shell.getBoundingClientRect().top +
        window.scrollY -
        90,

      behavior: "smooth"
    });
  }
}

/* =========================================================
   Next Buttons
   ========================================================= */

document
  .querySelectorAll("[data-next]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          !validateStep(
            currentStep
          )
        ) {
          return;
        }

        if (
          currentStep < 4
        ) {
          showStep(
            currentStep + 1
          );
        }
      }
    );
  });

/* =========================================================
   Previous Buttons
   ========================================================= */

document
  .querySelectorAll("[data-prev]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          currentStep > 1
        ) {
          showStep(
            currentStep - 1
          );
        }
      }
    );
  });

/* =========================================================
   Submit Button State
   ========================================================= */

function setSubmitting(state) {
  const button =
    $("submitBtn");

  if (!button) return;

  if (state) {
    button.disabled = true;

    button.innerHTML = `
      <span class="loading">
        <span class="spinner"></span>
        Submitting...
      </span>
    `;
  } else {
    button.disabled = false;
    button.textContent =
      "Submit Application";
  }
}

/* =========================================================
   Submit
   ========================================================= */

if (form) {

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      if (submitting) {
        return;
      }

      /*
        Validate every step.
      */

      for (
        let step = 1;
        step <= 4;
        step++
      ) {
        if (!validateStep(step)) {

          showStep(step);

          return;
        }
      }

      const consent =
        $("consent");

      if (
        consent &&
        !consent.checked
      ) {
        showToast(
          "Please confirm the information before submitting.",
          "error"
        );

        consent.focus();

        return;
      }

      submitting = true;

      setSubmitting(true);

      try {

        /* -----------------------------------------
           File Types
           ----------------------------------------- */

        const imageTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];

        const cvTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        /* -----------------------------------------
           Get Files
           ----------------------------------------- */

        const photo =
          checkFile(
            $("photo"),
            5,
            imageTypes
          );

        const cv =
          checkFile(
            $("cv"),
            10,
            cvTypes
          );

        const screenshot =
          checkFile(
            $("paymentScreenshot"),
            5,
            imageTypes
          );

        const paymentEnabled =
          payment.enabled !== false;

        /* -----------------------------------------
           Payment Validation
           ----------------------------------------- */

        if (
          paymentEnabled &&
          payment.screenshotRequired &&
          !screenshot
        ) {
          throw new Error(
            "Payment screenshot is required."
          );
        }

        const selectedPayment =
          document.querySelector(
            'input[name="paymentMethod"]:checked'
          );

        if (
          paymentEnabled &&
          !selectedPayment
        ) {
          throw new Error(
            "Please select a payment method."
          );
        }

        /* -----------------------------------------
           File Conversion
           ----------------------------------------- */

        showToast(
          "Preparing your files..."
        );

        const photoData =
          await fileToData(photo);

        const cvData =
          await fileToData(cv);

        const screenshotData =
          await fileToData(
            screenshot
          );

        /* -----------------------------------------
           Basic Data
           ----------------------------------------- */

        const mobile =
          normalizeMobile(
            val("mobile")
          );

        const profileId =
          createId(
            "profile_"
          );

        const applicationId =
          createApplicationId();

        const now =
          new Date().toISOString();

        /* -----------------------------------------
           Profile
           ----------------------------------------- */

        showToast(
          "Saving applicant profile..."
        );

        const profileData = {

          name:
            val("name"),

          mobile,

          email:
            val("email"),

          emergency:
            val("emergency"),

          address: {
            current:
              val("currentAddress"),

            permanent:
              val("permanentAddress")
          },

          education: {
            ssc:
              val("ssc"),

            hsc:
              val("hsc"),

            graduate:
              val("graduate"),

            other:
              val("otherEducation")
          },

          experience: {
            experience:
              val("experience"),

            duty:
              val("duty"),

            previousSalary:
              val("previousSalary")
          },

          skills:
            val("skills"),

          language:
            val("language"),

          reference: {
            name:
              val("referenceName"),

            contact:
              val("referenceContact"),

            relation:
              val("referenceRelation")
          },

          /*
            Files remain compatible with your
            existing Firestore structure.
          */

          photoUrl:
            photoData,

          cvUrl:
            cvData,

          cv: {
            name:
              cv
                ? cv.name
                : "",

            type:
              cv
                ? cv.type
                : "",

            size:
              cv
                ? cv.size
                : 0
          },

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()
        };

        await withTimeout(
          setDoc(
            doc(
              db,
              "applicantProfiles",
              profileId
            ),
            profileData
          ),
          25000,
          "Applicant profile save timed out. Please try again."
        );

        /* -----------------------------------------
           Application
           ----------------------------------------- */

        showToast(
          "Saving application..."
        );

        const applicationData = {

          id:
            applicationId,

          profileId,

          mobile,

          jobId:
            "",

          jobTitle:
            val("jobTitle"),

          source:
            "website",

          created:
            now,

          updated:
            now,

          status:
            paymentEnabled
              ? "payment_pending"
              : "submitted",

          paymentStatus:
            paymentEnabled
              ? "pending"
              : "not_required",

          notes:
            "",

          applicationData: {

            salary:
              val("expectedSalary"),

            type:
              $("applicationType")
                ? $("applicationType").value
                : "",

            location:
              val("location"),

            reference:
              val("applicationReference"),

            extraInfo:
              val("extraInfo")
          },

          statusHistory:
            paymentEnabled

              ? [
                  {
                    status:
                      "submitted",
                    at:
                      now
                  },

                  {
                    status:
                      "payment_pending",
                    at:
                      now
                  }
                ]

              : [
                  {
                    status:
                      "submitted",
                    at:
                      now
                  }
                ],

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()
        };

        await withTimeout(
          setDoc(
            doc(
              db,
              "applications",
              applicationId
            ),
            applicationData
          ),
          25000,
          "Application save timed out. Please try again."
        );

        /* -----------------------------------------
           Payment
           ----------------------------------------- */

        if (paymentEnabled) {

          showToast(
            "Saving payment information..."
          );

          const paymentId =
            createId(
              "payment_"
            );

          const paymentData = {

            id:
              paymentId,

            applicationId,

            profileId,

            method:
              selectedPayment.value,

            amount:
              Number(
                payment.fee || 0
              ),

            currency:
              payment.currency ||
              "BDT",

            senderNumber:
              normalizeMobile(
                val("senderNumber")
              ),

            trxId:
              val("trxId"),

            paymentDate:
              $("paymentDate")
                ? (
                    $("paymentDate").value ||
                    new Date()
                      .toISOString()
                      .slice(0, 10)
                  )
                : new Date()
                    .toISOString()
                    .slice(0, 10),

            screenshotUrl:
              screenshotData,

            screenshotName:
              screenshot
                ? screenshot.name
                : "",

            status:
              "pending",

            created:
              now,

            updated:
              now,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()
          };

          await withTimeout(
            setDoc(
              doc(
                db,
                "payments",
                paymentId
              ),
              paymentData
            ),
            25000,
            "Payment save timed out. Please try again."
          );
        }

        /* -----------------------------------------
           SUCCESS
           ----------------------------------------- */

        showSuccess(
          applicationId
        );

      } catch (error) {

        console.error(
          "Submission failed:",
          error
        );

        showToast(
          firebaseError(error),
          "error"
        );

      } finally {

        submitting = false;

        setSubmitting(false);
      }
    }
  );
}

/* =========================================================
   Success
   ========================================================= */

function showSuccess(
  applicationId
) {

  const stepsContainer =
    document.querySelector(
      ".steps"
    );

  if (stepsContainer) {
    stepsContainer.style.display =
      "none";
  }

  if (form) {
    form.style.display =
      "none";
  }

  const success =
    $("successScreen");

  if (success) {
    success.classList.add(
      "active"
    );
  }

  safeText(
    "successApplicationId",
    applicationId
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================================================
   Start
   ========================================================= */

async function start() {

  try {

    await loadSettings();

  } catch (error) {

    console.error(
      "Startup error:",
      error
    );

    renderPayment();
  }

  showStep(1);
}

start();
