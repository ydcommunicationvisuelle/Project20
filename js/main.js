document.addEventListener('DOMContentLoaded', function () {
  /* ---------- Header on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fecha o menu ao clicar em qualquer link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Dropdowns (se houver no futuro) ---------- */
  document.querySelectorAll('.has-dropdown > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        a.parentElement.classList.toggle('is-open');
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--i', el.closest('.reveal-group') ? (i % 8) : 0);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- RGPD modal ---------- */
  var modal = document.querySelector('.modal-overlay');
  var openers = document.querySelectorAll('[data-open-rgpd]');
  var closers = document.querySelectorAll('[data-close-rgpd]');
  openers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (modal) modal.classList.add('is-open');
    });
  });
  closers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (modal) modal.classList.remove('is-open');
    });
  });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('is-open');
    });
  }


  /* ---------- Contact Form (Web3Forms AJAX) ---------- */
const form = document.querySelector('.contact-form form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const success = document.querySelector('.form-success');
    
    // Feedback visual durante o envio
    if (success) {
      success.style.display = 'block';
      success.style.backgroundColor = '#dbeafe';
      success.style.color = '#1e40af';
      success.textContent = 'Envoi en cours, veuillez patienter...';
      success.classList.add('is-visible');
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let resJson = await response.json();
      if (response.status === 200) {
        if (success) {
          success.style.backgroundColor = '#dcfce7';
          success.style.color = '#15803d';
          success.textContent = 'Merci ! Votre message a été envoyé avec succès.';
        }
        form.reset();
      } else {
        if (success) {
          success.style.backgroundColor = '#fee2e2';
          success.style.color = '#b91c1c';
          success.textContent = resJson.message || 'Une erreur est survenue lors de l\'envoi.';
        }
      }
    })
    .catch(error => {
      if (success) {
        success.style.backgroundColor = '#fee2e2';
        success.style.color = '#b91c1c';
        success.textContent = 'Erreur de connexion. Veuillez réessayer.';
      }
    });
  });
}


  /* ---------- Active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links > li').forEach(function (li) {
    var a = li.querySelector(':scope > a');
    if (a && a.getAttribute('href') === path) li.classList.add('active');
  });
});
