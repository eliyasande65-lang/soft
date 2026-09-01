
/* =========================================================
   SOFT INNOVATIONS — PLAN FORM
========================================================= */

const API = 'https://qeja-backend-azkf.onrender.com';


/* =========================================================
   READ PLAN FROM URL
========================================================= */

const query = new URLSearchParams(location.search);

const plan = query.get('plan') || 'Custom Website';
const base = Number(query.get('price') || 0);


/* =========================================================
   PLAN DISPLAY
========================================================= */

const planElement = document.querySelector('#plan');
const amountElement = document.querySelector('#amount');

if (planElement) {
  planElement.textContent = plan;
}

if (amountElement) {
  amountElement.textContent =
    base.toLocaleString('en-KE');
}


/* =========================================================
   STORAGE / CONTENT OPTIONS
========================================================= */

const selected = new Set();

const costs = {
  text: 0,
  photos: 1500,
  audio: 2500,
  video: 5000
};


/* =========================================================
   STORAGE OPTION BUTTONS
========================================================= */

document
  .querySelectorAll('[data-storage]')
  .forEach(button => {

    button.addEventListener('click', () => {

      const key = button.dataset.storage;

      if (selected.has(key)) {
        selected.delete(key);
      } else {
        selected.add(key);
      }

      button.classList.toggle(
        'selected',
        selected.has(key)
      );

      updateTotal();
    });

  });


/* =========================================================
   CALCULATE TOTAL
========================================================= */

function updateTotal() {

  const additionalCost = [...selected].reduce(
    (total, key) => total + (costs[key] || 0),
    0
  );

  const total = base + additionalCost;

  if (amountElement) {
    amountElement.textContent =
      total.toLocaleString('en-KE');
  }
}


/* =========================================================
   CUSTOM PROJECT FORM
========================================================= */

const form = document.querySelector('#custom-form');

form?.addEventListener('submit', async event => {

  event.preventDefault();

  const submitButton =
    form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting…';
  }


  try {

    /* -----------------------------------------------------
       COLLECT FORM DATA
    ----------------------------------------------------- */

    const data =
      Object.fromEntries(
        new FormData(form)
      );


    /* -----------------------------------------------------
       ADD PLAN INFORMATION
    ----------------------------------------------------- */

    data.plan = plan;

    data.estimated_price = Number(
      amountElement?.textContent
        .replace(/,/g, '') || base
    );

    data.storage = [...selected];


    /* -----------------------------------------------------
       SEND TO SOFT INNOVATIONS BACKEND
       
       IMPORTANT:
       This uses /soft/orders, NOT /orders.
    ----------------------------------------------------- */

    const response = await fetch(
      `${API}/soft/orders`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
      }
    );


    /* -----------------------------------------------------
       HANDLE API ERROR
    ----------------------------------------------------- */

    if (!response.ok) {

      let message = 'Order API unavailable';

      try {

        const errorData =
          await response.json();

        message =
          errorData.message ||
          errorData.error ||
          message;

      } catch {
        // Server did not return JSON.
      }

      throw new Error(message);
    }


    /* -----------------------------------------------------
       READ SUCCESS RESPONSE
    ----------------------------------------------------- */

    let result = null;

    try {
      result = await response.json();
    } catch {
      // Response may contain no JSON body.
    }


    /* -----------------------------------------------------
       RESET FORM
    ----------------------------------------------------- */

    form.reset();

    selected.clear();

    document
      .querySelectorAll('[data-storage]')
      .forEach(button => {
        button.classList.remove('selected');
      });

    updateTotal();


    /* -----------------------------------------------------
       SUCCESS MESSAGE
    ----------------------------------------------------- */

    const trackingId =
      result?.tracking_id ||
      result?.order_id ||
      result?.tracking_code;

    if (trackingId) {

      alert(
        `Your customization request has been submitted successfully.\n\n` +
        `Tracking ID: ${trackingId}`
      );

    } else {

      alert(
        'Your customization request has been submitted successfully.'
      );
    }


  } catch (error) {

    console.error(
      'Soft Innovations order error:',
      error
    );

    alert(
      error.message ||
      'Unable to submit your customization request.'
    );


  } finally {

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit request';
    }

  }

});
