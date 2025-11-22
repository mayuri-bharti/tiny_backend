/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export function validateUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    // Ensure it's http or https protocol
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Generates a random alphanumeric code of 6-8 characters
 * @returns {string} - Random code string
 */
export function generateCode() {
  const length = Math.floor(Math.random() * 3) + 6; // Random length between 6-8
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}


