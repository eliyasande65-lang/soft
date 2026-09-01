
const API = 'https://qeja-backend-azkf.onrender.com';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* =========================================================
   TOAST
========================================================= */
function toast(message) {
  let t = $('#toast');

  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }

  t.textContent = message;
  t.classList.add('show');

  clearTimeout(window.__toast);

  window.__toast = setTimeout(() => {
    t.classList.remove('show');
  }, 3500);
}

/* =========================================================
   MODALS
========================================================= */
function setModal(id, open = true) {
  const m = document.getElementById(id);

  if (m) {
    m.dataset.open = String(open);
    document.body.classList.toggle('no-scroll', open);
  }
}

/* =========================================================
   API HELPER
========================================================= */
async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await fetch(API + path, {
    ...options,
    headers
  });

  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      message: text
    };
  }

  if (!res.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed (${res.status})`
    );
  }

  return data;
}

/* =========================================================
   DOM READY
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     MODALS
  ------------------------------------------------------- */

  $$('[data-modal-target]').forEach(button => {
    button.addEventListener('click', () => {
      setModal(button.dataset.modalTarget, true);
    });
  });

  $$('.modal-close').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-overlay');

      if (modal) {
        setModal(modal.id, false);
      }
    });
  });

  $$('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        setModal(modal.id, false);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      $$('.modal-overlay[data-open="true"]').forEach(modal => {
        setModal(modal.id, false);
      });
    }
  });


  /* -------------------------------------------------------
     MOBILE DRAWER
  ------------------------------------------------------- */

  const toggle = $('.menu-toggle');
  const drawer = $('#mobile-drawer');
  const scrim = $('.scrim');

  const drawerState = open => {
    if (drawer) {
      drawer.dataset.open = String(open);
    }

    if (scrim) {
      scrim.dataset.open = String(open);
    }

    document.body.classList.toggle('no-scroll', open);
  };

  toggle?.addEventListener('click', () => {
    drawerState(true);
  });

  $('#drawer-close')?.addEventListener('click', () => {
    drawerState(false);
  });

  scrim?.addEventListener('click', () => {
    drawerState(false);
  });

  $$('.mobile-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      drawerState(false);
    });
  });


  /* -------------------------------------------------------
     ACTIVE NAVIGATION
  ------------------------------------------------------- */

  const page = document.body.dataset.page;

  if (page) {
    $$('.main-nav a').forEach(link => {
      if (link.dataset.page === page) {
        link.dataset.active = 'true';
      }
    });
  }


  /* -------------------------------------------------------
     FAQ
  ------------------------------------------------------- */

  $$('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
      question.parentElement.classList.toggle('open');
    });
  });


  /* =======================================================
     SOFT INNOVATIONS — CONTACT FORM
     
     IMPORTANT:
     This intentionally uses /soft/contact.
     Do NOT change this to /contact because /contact
     belongs to the existing QejaConnect authenticated
     endpoint.
  ======================================================= */

  const contactForm = $('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();

      const button =
        contactForm.querySelector('button[type="submit"]');

      if (!button) return;

      button.disabled = true;
      button.textContent = 'Sending…';

      try {
        const formData =
          Object.fromEntries(new FormData(contactForm));

        await api('/soft/contact', {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        contactForm.reset();

        toast(
          'Message sent successfully. We’ll get back to you soon.'
        );

      } catch (error) {

        console.error('Soft contact error:', error);

        toast(
          error.message ||
          'Could not send your message.'
        );

      } finally {

        button.disabled = false;
        button.textContent = 'Send message';
      }
    });
  }


  /* =======================================================
     SOFT INNOVATIONS — PROJECT ORDER FORM
     
     IMPORTANT:
     Uses /soft/orders instead of /orders.
  ======================================================= */

  const orderForm = $('#order-form');

  if (orderForm) {
    orderForm.addEventListener('submit', async event => {
      event.preventDefault();

      const button =
        orderForm.querySelector('button[type="submit"]');

      if (!button) return;

      button.disabled = true;
      button.textContent = 'Submitting…';

      try {

        const formData =
          Object.fromEntries(new FormData(orderForm));

        const data = await api('/soft/orders', {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        orderForm.reset();

        setModal('modal-order', false);

        /*
         * If the backend returns a tracking ID,
         * show it to the customer.
         */
        if (data?.order_id || data?.tracking_id || data?.tracking_code) {

          const tracking =
            data.order_id ||
            data.tracking_id ||
            data.tracking_code;

          toast(
            `Request submitted successfully. Tracking ID: ${tracking}`
          );

        } else {

          toast(
            'Project request submitted successfully.'
          );
        }

      } catch (error) {

        console.error('Soft order error:', error);

        toast(
          error.message ||
          'Could not submit your project request.'
        );

      } finally {

        button.disabled = false;
        button.textContent = 'Send request';
      }
    });
  }


  /* =======================================================
     LOGIN
     
     This remains /login because it belongs to the
     existing QejaConnect authentication system.
  ======================================================= */

  const loginForm = $('#login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async event => {
      event.preventDefault();

      const button =
        loginForm.querySelector('button[type="submit"]');

      if (button) {
        button.disabled = true;
        button.textContent = 'Signing in…';
      }

      try {

        const formData =
          Object.fromEntries(new FormData(loginForm));

        const data = await api('/login', {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        if (data.token) {
          localStorage.setItem(
            'soft_token',
            data.token
          );
        }

        setModal('modal-login', false);

        toast('Login successful.');

      } catch (error) {

        console.error('Login error:', error);

        toast(
          error.message ||
          'Login failed.'
        );

      } finally {

        if (button) {
          button.disabled = false;
          button.textContent = 'Login';
        }
      }
    });
  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  $$('.reveal').forEach(element => {

    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('visible');

            /*
             * Stop observing after the animation has
             * already happened.
             */
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12
      }
    );

    observer.observe(element);
  });

});


/* =========================================================
   SERVICE WORKER
========================================================= */

if ('serviceWorker' in navigator) {

  window.addEventListener('load', () => {

    navigator.serviceWorker
      .register('../sw.js')
      .then(registration => {
        console.log(
          'Service worker registered:',
          registration.scope
        );
      })
      .catch(error => {
        console.warn(
          'Service worker registration failed:',
          error
        );
      });

  });
}
```
