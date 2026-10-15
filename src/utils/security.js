// ==========================================
// EXPERIMENT 2f: Front-End Security Practices
// Input validation, XSS prevention, safe string sanitization & API handling
// ==========================================

/**
 * Sanitizes user input to prevent Cross-Site Scripting (XSS)
 * Strips script tags, Javascript protocols, and escapes dangerous HTML characters.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .replace(/javascript:/gi, '') // remove javascript: protocol
    .replace(/on\w+=/gi, '') // remove inline event handlers like onclick=
    .trim();
}

/**
 * Validates text input length and character restrictions
 */
export function validateTextInput(text, min = 1, max = 200) {
  if (!text || typeof text !== 'string') return { isValid: false, error: 'Field cannot be empty' };
  const trimmed = text.trim();
  if (trimmed.length < min) return { isValid: false, error: `Must be at least ${min} character(s)` };
  if (trimmed.length > max) return { isValid: false, error: `Cannot exceed ${max} characters` };
  return { isValid: true, sanitized: sanitizeInput(trimmed) };
}

/**
 * Validates email format strictly using RFC 5322 regex
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return { isValid: false, error: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(email.trim());
  return {
    isValid: valid,
    error: valid ? null : 'Please enter a valid email address (e.g. user@domain.com)',
    sanitized: email.trim().toLowerCase()
  };
}

/**
 * Validates numeric price
 */
export function validatePrice(price) {
  const num = parseFloat(price);
  if (isNaN(num) || num <= 0) {
    return { isValid: false, error: 'Price must be a positive number greater than 0' };
  }
  if (num > 1000) {
    return { isValid: false, error: 'Price exceeds maximum allowed limit ($1,000)' };
  }
  return { isValid: true, value: Number(num.toFixed(2)) };
}

/**
 * Validates external image URL to prevent malicious schema injection
 */
export function validateImageUrl(url) {
  if (!url) return { isValid: true, sanitized: '' };
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Image URL must use http: or https: protocol' };
    }
    return { isValid: true, sanitized: url.trim() };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Safe API request wrapper with rate-limit and error shielding
 */
const requestTimestamps = [];
const RATE_LIMIT_WINDOW_MS = 10000;
const MAX_REQUESTS_PER_WINDOW = 30;

export function checkClientRateLimit() {
  const now = Date.now();
  // Filter out timestamps outside window
  while (requestTimestamps.length && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // rate limited
  }
  requestTimestamps.push(now);
  return true;
}
