// core/utils.js

/**
 * Shorthand for document.querySelector.
 * @param {string} selector - The CSS selector.
 * @param {Element|Document} parent - The parent element to search within (defaults to document).
 * @returns {Element|null} The first matching element or null.
 */
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll.
 * @param {string} selector - The CSS selector.
 * @param {Element|Document} parent - The parent element to search within (defaults to document).
 * @returns {NodeList} A NodeList containing all matching elements.
 */
function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Creates an HTML element with specified attributes and children.
 * @param {string} tag - The HTML tag name.
 * @param {object} attributes - An object of attributes to set (e.g., { class: 'foo', id: 'bar' }).
 * @param {Array<Node|string>} children - An array of child nodes or strings to append.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
}

/**
 * Shows an element by removing the 'hidden' class or setting display to 'block'.
 * (Assumes a CSS class 'hidden' with display: none !important; or similar)
 * For simplicity, this example will directly manipulate style.display.
 * @param {HTMLElement} element - The element to show.
 */
function show(element) {
  if (element && element.style) {
    element.style.display = ''; // Or 'block', 'flex', etc., depending on default
  }
}

/**
 * Hides an element by setting display to 'none'.
 * @param {HTMLElement} element - The element to hide.
 */
function hide(element) {
  if (element && element.style) {
    element.style.display = 'none';
  }
}

// --- API Key Management ---
const ZYTOOLS_API_KEY_NAME = 'zytools_gemini_api_key';

/**
 * Retrieves the API key from localStorage.
 * @returns {string|null} The API key or null if not found.
 */
function getApiKey() {
  return localStorage.getItem(ZYTOOLS_API_KEY_NAME);
}

/**
 * Stores the API key in localStorage.
 * @param {string} apiKey - The API key to store.
 */
function setApiKey(apiKey) {
  localStorage.setItem(ZYTOOLS_API_KEY_NAME, apiKey);
}

/**
 * Removes the API key from localStorage.
 */
function removeApiKey() {
  localStorage.removeItem(ZYTOOLS_API_KEY_NAME);
}

/**
 * Checks if an API key exists in localStorage.
 * @returns {boolean} True if an API key exists, false otherwise.
 */
function hasApiKey() {
  return !!getApiKey();
}

// Potential: Export functions if using modules in the future
// export { qs, qsa, createElement, show, hide, getApiKey, setApiKey, removeApiKey, hasApiKey };
