/**
 * Client Hub CRM - Professional SaaS Utilities
 */

/**
 * Sanitizes user inputs to prevent Cross-Site Scripting (XSS) attacks.
 * @param {*} value The string or value to sanitize
 * @returns {string} Safe HTML string or '-' if null/undefined
 */
export function escapeHtml(value) {
  if (value === undefined || value === null) return "-";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Converts 24-hour time format (HH:MM) to 12-hour AM/PM format.
 * @param {string} timeStr Time string in HH:MM format
 * @returns {string} 12-hour formatted time with AM/PM
 */
export function formatTimeTo12Hour(timeStr) {
  if (!timeStr || timeStr === "-") return "-";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

/**
 * Generates a polished human-readable date and time string.
 * Used for CRM notes, call log timestamps, and histories.
 * @returns {string} E.g., "Monday, June 1, 2026 at 10:15 AM"
 */
export function getFormattedDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  // Replacing ' at ' style formatting
  return now.toLocaleString("en-US", options).replace(",", " at");
}
