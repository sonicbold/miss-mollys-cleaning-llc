/**
 * Miss Molly's Cleaning LLC - Interactive Scripts
 * Handles mobile drawer, FAQ accordion, service pre-selection, and booking request form.
 */

document.addEventListener('DOMContentLoaded', () => {
  const MOLLY_PHONE_HREF = '+14065796115';
  const MOLLY_PHONE_DISPLAY = '(406) 579-6115';

  // 1. Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileNav.hidden = isExpanded;
    });

    const mobLinks = mobileNav.querySelectorAll('.mob-link');
    mobLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  // 3. Pre-select service in booking form when clicking service/pricing CTAs
  const serviceButtons = document.querySelectorAll('[data-service]');
  const serviceSelect = document.getElementById('cust-service');
  const nameInput = document.getElementById('cust-name');

  serviceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetService = btn.getAttribute('data-service');
      if (serviceSelect && targetService) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === targetService) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      setTimeout(() => {
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 450);
    });
  });

  // 4. FAQ Accordion
  const faqRows = document.querySelectorAll('.faq-row');
  faqRows.forEach((row) => {
    const btn = row.querySelector('.faq-q-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = row.classList.contains('active');

      faqRows.forEach((other) => {
        if (other !== row) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-q-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        row.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        row.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 5. Easy Booking Request Form
  const bookingForm = document.getElementById('molly-booking-form');
  const feedbackBox = document.getElementById('booking-feedback');
  const submitBtn = document.getElementById('booking-submit-btn');

  if (bookingForm && feedbackBox) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error messages
      const errors = bookingForm.querySelectorAll('.field-error');
      errors.forEach((err) => (err.style.display = 'none'));
      feedbackBox.hidden = true;
      feedbackBox.className = 'booking-feedback';
      feedbackBox.textContent = '';

      // Elements
      const name = document.getElementById('cust-name');
      const phone = document.getElementById('cust-phone');
      const email = document.getElementById('cust-email');
      const address = document.getElementById('cust-address');
      const service = document.getElementById('cust-service');
      const date = document.getElementById('cust-date');
      const notes = document.getElementById('cust-notes');

      let isValid = true;

      if (!name.value.trim()) {
        showError('err-name');
        isValid = false;
      }

      const phoneRegex = /^[\d\s\-\+\(\)\.]{7,20}$/;
      if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
        showError('err-phone');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        showError('err-email');
        isValid = false;
      }

      if (!address.value.trim()) {
        showError('err-address');
        isValid = false;
      }

      if (!service.value) {
        showError('err-service');
        isValid = false;
      }

      if (!date.value.trim()) {
        showError('err-date');
        isValid = false;
      }

      if (!isValid) {
        feedbackBox.hidden = false;
        feedbackBox.className = 'booking-feedback error';
        feedbackBox.textContent =
          "Hold your horses! Please fill out all required fields marked with an asterisk (*) so I have what I need.";
        return;
      }

      const custName = name.value.trim();
      const custPhone = phone.value.trim();
      const custEmail = email.value.trim();
      const custAddress = address.value.trim();
      const custService = service.value;
      const custDate = date.value.trim();
      const custNotes = notes ? notes.value.trim() : '';

      const smsBody =
        `Hey Molly! I'd like to book a cleaning.\n` +
        `Name: ${custName}\n` +
        `Phone: ${custPhone}\n` +
        `Email: ${custEmail}\n` +
        `Address: ${custAddress}\n` +
        `Service: ${custService}\n` +
        `Preferred Time: ${custDate}` +
        (custNotes ? `\nDetails: ${custNotes}` : '');

      const smsHref = `sms:${MOLLY_PHONE_HREF}?&body=${encodeURIComponent(smsBody)}`;

      feedbackBox.hidden = false;
      feedbackBox.className = 'booking-feedback success';
      feedbackBox.innerHTML = `
        <strong>Hot dog, ${escapeHtml(custName)}! Your booking details are ready! 🧹✨</strong><br>
        Tap below to send this request straight to Molly's phone at <strong>${MOLLY_PHONE_DISPLAY}</strong> for the fastest confirmation, or give her a quick call!
        <div class="sms-confirm-actions">
          <a href="${smsHref}" class="btn btn-pink-pop btn-sm">💬 Text Request to Molly Now</a>
          <a href="tel:${MOLLY_PHONE_HREF}" class="btn btn-warm-cream btn-sm">📞 Call ${MOLLY_PHONE_DISPLAY}</a>
        </div>
      `;

      bookingForm.reset();
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function showError(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
