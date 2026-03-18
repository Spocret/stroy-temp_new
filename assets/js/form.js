function usePhoneMask(input) {
  if (!input) return;

  const format = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits.length) return '';

    let result = '+7';
    const rest = digits.startsWith('7') ? digits.slice(1) : digits;

    if (rest.length === 0) return result;
    result += ' (' + rest.slice(0, 3);
    if (rest.length < 3) return result;
    result += ') ' + rest.slice(3, 6);
    if (rest.length < 6) return result;
    result += '-' + rest.slice(6, 8);
    if (rest.length < 8) return result;
    result += '-' + rest.slice(8, 10);
    return result;
  };

  input.addEventListener('keydown', (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  });

  input.addEventListener('input', () => {
    const position = input.selectionStart;
    const raw = input.value;
    const formatted = format(raw);
    input.value = formatted;
    const diff = formatted.length - raw.length;
    const newPos = Math.max(0, position + diff);
    input.setSelectionRange(newPos, newPos);
  });

  input.addEventListener('focus', () => {
    if (!input.value) {
      input.value = '+7 (';
    }
  });

  input.addEventListener('blur', () => {
    if (input.value === '+7 (' || input.value === '+7') {
      input.value = '';
    }
  });
}

function useFormValidation(form) {
  if (!form) return null;

  const rules = {
    name: {
      validate: (v) => v.trim().length >= 2 && /^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(v.trim()),
      message: 'Минимум 2 символа, только буквы',
    },
    phone: {
      validate: (v) => {
        const digits = v.replace(/\D/g, '');
        return digits.length === 11;
      },
      message: 'Введите телефон полностью',
    },
    message: {
      validate: (v) => v.trim().length >= 10,
      message: 'Минимум 10 символов',
    },
  };

  const setError = (input, message) => {
    const errorEl = document.getElementById(input.id + 'Error');
    input.classList.remove('field--success');
    input.classList.add('field--error');
    if (errorEl) errorEl.textContent = message;
  };

  const setSuccess = (input) => {
    const errorEl = document.getElementById(input.id + 'Error');
    input.classList.remove('field--error');
    input.classList.add('field--success');
    if (errorEl) errorEl.textContent = '';
  };

  const clearState = (input) => {
    const errorEl = document.getElementById(input.id + 'Error');
    input.classList.remove('field--error', 'field--success');
    if (errorEl) errorEl.textContent = '';
  };

  const validateField = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;

    if (!input.value.trim()) {
      setError(input, 'Обязательное поле');
      return false;
    }

    if (!rule.validate(input.value)) {
      setError(input, rule.message);
      return false;
    }

    setSuccess(input);
    return true;
  };

  const inputs = form.querySelectorAll('.form__input');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('field--error')) {
        validateField(input);
      }
    });
    input.addEventListener('focus', () => {
      if (!input.value) clearState(input);
    });
  });

  return {
    validateAll: () => {
      let valid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) valid = false;
      });
      return valid;
    },
    reset: () => {
      inputs.forEach((input) => clearState(input));
    },
  };
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('toast--visible');

  setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 4000);
}

function useFormSubmit(form, validator) {
  if (!form) return;

  const submitBtn = form.querySelector('#formSubmit');
  const submitText = submitBtn ? submitBtn.querySelector('.form__submit-text') : null;
  const submitSpinner = submitBtn ? submitBtn.querySelector('.form__submit-spinner') : null;

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (submitText) submitText.style.display = loading ? 'none' : '';
    if (submitSpinner) submitSpinner.hidden = !loading;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (validator && !validator.validateAll()) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    form.reset();
    if (validator) validator.reset();
    showToast('Спасибо! Мы вам перезвоним 🎉');
  });
}

export { usePhoneMask, useFormValidation, useFormSubmit };
