/* Tzeriz Consultant — verification form and donation address controls. */
(function () {
  'use strict';

  var form = document.getElementById('kyc-form');
  if (!form) return;

  var nameInput = document.getElementById('user-name');
  var numberInput = document.getElementById('user-number');
  var addressInput = document.getElementById('doc-input');
  var pasteButton = document.getElementById('paste-btn');
  var submitButton = document.getElementById('submit-btn');
  var retryButton = document.getElementById('retry-btn');
  var status = document.getElementById('kyc-status');
  var firstStep = document.getElementById('verification-step-submit');
  var reviewStep = document.getElementById('verification-step-review');
  var fields = [nameInput, numberInput, addressInput];
  var originalSubmit = submitButton.innerHTML;
  var pending = false;
  var submitted = false;

  function hasDetails() {
    return fields.every(function (input) { return input.value.trim().length > 0; });
  }

  function updateSubmit() {
    submitButton.disabled = pending || submitted || !hasDetails();
  }

  function showStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
    status.hidden = false;
  }

  function lockFields(locked) {
    fields.forEach(function (input) { input.disabled = locked; });
    pasteButton.disabled = locked;
  }

  form.addEventListener('input', updateSubmit);
  pasteButton.addEventListener('click', async function () {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error('Clipboard unavailable');
      var text = (await navigator.clipboard.readText()).trim();
      if (!text) {
        showStatus('Clipboard is empty. Enter your crypto address or IBAN directly in the field.', true);
        addressInput.focus();
        return;
      }
      if (text.length > addressInput.maxLength) {
        showStatus('Please enter only your crypto address or IBAN in the address field.', true);
        addressInput.focus();
        return;
      }
      addressInput.value = text;
      status.hidden = true;
      addressInput.focus();
      updateSubmit();
    } catch (error) {
      showStatus('Paste directly into the address field using your keyboard.', true);
      addressInput.focus();
    }
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (pending || submitted || !form.reportValidity()) return;
    if (!hasDetails()) {
      showStatus('Please enter your name, number and crypto address or IBAN.', true);
      return;
    }

    var endpoint = form.getAttribute('data-endpoint').trim();
    if (!endpoint) {
      showStatus('Online verification is not yet available. Please contact the firm to arrange a review.', true);
      retryButton.hidden = false;
      return;
    }

    var payload = new FormData(form);
    pending = true;
    lockFields(true);
    updateSubmit();
    form.setAttribute('aria-busy', 'true');
    retryButton.hidden = true;
    showStatus('Submitting your details for review.');

    try {
      var response = await fetch(endpoint, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, credentials: 'omit', redirect: 'error' });
      if (!response.ok) throw new Error('Submission failed');
      submitted = true;
      submitButton.textContent = 'Submitted';
      firstStep.classList.remove('is-current');
      firstStep.classList.add('is-done');
      firstStep.removeAttribute('aria-current');
      reviewStep.classList.add('is-current');
      reviewStep.setAttribute('aria-current', 'step');
      showStatus('Your submission has been received for review. Verification is not yet complete.');
    } catch (error) {
      lockFields(false);
      showStatus('Your details could not be submitted. Please try again or contact the firm.', true);
    } finally {
      pending = false;
      form.removeAttribute('aria-busy');
      retryButton.hidden = false;
      updateSubmit();
    }
  });

  form.addEventListener('reset', function (event) {
    if (pending) { event.preventDefault(); return; }
    submitted = false;
    lockFields(false);
    status.hidden = true;
    retryButton.hidden = true;
    submitButton.innerHTML = originalSubmit;
    firstStep.classList.remove('is-done');
    firstStep.classList.add('is-current');
    firstStep.setAttribute('aria-current', 'step');
    reviewStep.classList.remove('is-current');
    reviewStep.removeAttribute('aria-current');
    setTimeout(function () { updateSubmit(); nameInput.focus(); }, 0);
  });

  function legacyCopy(text) {
    var previousFocus = document.activeElement;
    var temporary = document.createElement('textarea');
    temporary.value = text;
    temporary.setAttribute('readonly', '');
    temporary.style.position = 'fixed';
    temporary.style.left = '-9999px';
    document.body.appendChild(temporary);
    try {
      temporary.select();
      if (!document.execCommand('copy')) throw new Error('Copy unavailable');
    } finally {
      temporary.remove();
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }
  }

  var copyStatus = document.getElementById('copy-status');
  document.querySelectorAll('.verification-copy').forEach(function (button) {
    var label = button.querySelector('span');
    var originalLabel = label.textContent;
    button.addEventListener('click', async function () {
      var address = button.getAttribute('data-address');
      button.disabled = true;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try { await navigator.clipboard.writeText(address); }
          catch (error) { legacyCopy(address); }
        } else {
          legacyCopy(address);
        }
        label.textContent = 'Copied';
        button.classList.add('is-copied');
        copyStatus.textContent = button.getAttribute('aria-label').replace(/^Copy /, '') + ' copied.';
        setTimeout(function () { label.textContent = originalLabel; button.classList.remove('is-copied'); }, 2000);
      } catch (error) {
        copyStatus.textContent = 'Select the address above and copy it manually.';
      } finally {
        button.disabled = false;
      }
    });
  });

  updateSubmit();
})();
