// src/js/helpers.js
import { TIMEOUT_SEC } from './config.js';

/**
 * Rejects after s seconds — used to race against slow fetches.
 */
const timeout = s =>
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Request took too long! Timeout after ${s} second(s)`)),
      s * 1000
    )
  );

/**
 * Fetch JSON with timeout + standard error handling.
 * @param {string} url
 * @returns {Promise<any>} parsed JSON
 */
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url); // i) create the fetch promise
    // ii) race fetch vs timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json(); // iv) data definition stays the same

    // v) validation (same idea as before)
    if (!res.ok) {
      // prefer API message if available
      const message = data?.message || 'Request failed';
      throw new Error(`${message} (${res.status})`);
    }

    // vi) return the parsed JSON
    return data;
  } catch (error) {
    // vii) rethrow so callers handle UI or logging
    throw error;
  }
};
