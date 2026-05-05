const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v) => EMAIL_RE.test((v || '').trim());

export const isPhone = (v) => {
  const digits = (v || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const onlyDigits = (v) => (v || '').replace(/\D/g, '');

export const formatCardNumber = (v) => {
  const digits = onlyDigits(v).slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiry = (v) => {
  const digits = onlyDigits(v).slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const luhn = (cardNumber) => {
  const digits = onlyDigits(cardNumber);
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const isValidExpiry = (v) => {
  const m = /^(\d{2})\/(\d{2})$/.exec((v || '').trim());
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp >= now;
};

export const isValidCvv = (v) => /^\d{3,4}$/.test(v || '');

export const validateCard = ({ cardNumber, cardExpiry, cardCvv, cardName }) => {
  const errors = {};
  if (!cardName || !cardName.trim()) errors.cardName = 'Name on card is required';
  if (!luhn(cardNumber)) errors.cardNumber = 'Enter a valid card number';
  if (!isValidExpiry(cardExpiry)) errors.cardExpiry = 'Expiry must be MM/YY and in the future';
  if (!isValidCvv(cardCvv)) errors.cardCvv = 'CVV must be 3 or 4 digits';
  return errors;
};

export const isValidUpi = (v) => /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test((v || '').trim());
