/**
 * Client Hub CRM - Main Entry Script & Add Client Form Controller
 */
import { initializeStorage, addClient } from './storage.js';
import { getFormattedDateTime } from './utils.js';

// Initialize localStorage on application load
document.addEventListener("DOMContentLoaded", async () => {
  await initializeStorage();

  const clientForm = document.querySelector(".client-form");
  if (clientForm) {
    clientForm.addEventListener("submit", handleFormSubmit);
  }
});

/**
 * Handles the Add Client form submission.
 * @param {Event} event Submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const tag = document.getElementById("tag").value;
  const status = document.getElementById("Status").value;
  const timeSpent = document.getElementById("spent-time").value.trim();
  const company = document.getElementById("company").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const availableTime = document.getElementById("available-time").value.trim();
  const language = document.getElementById("Language").value;
  
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const agendaText = document.getElementById("agenda").value.trim();
  const notesText = document.getElementById("notes").value.trim();

  // Validate required fields
  const validationErrors = [];
  if (!name) validationErrors.push("Client Name is required.");
  if (!company) validationErrors.push("Company Name is required.");
  if (!email) {
    validationErrors.push("Email Address is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.push("Please enter a valid email address.");
    }
  }
  if (!phone) validationErrors.push("Phone Number is required.");

  if (validationErrors.length > 0) {
    alert("Validation Failed:\n\n" + validationErrors.join("\n"));
    return; // Keep user on page, prevent save
  }

  // Create arrays for notes and calls
  const notesArray = [];
  if (notesText) {
    notesArray.push({
      title: "Initial Meeting Note",
      text: notesText,
      when: getFormattedDateTime()
    });
  }

  const callsArray = [];
  if (date || time || agendaText) {
    callsArray.push({
      date: date || "-",
      time: time || "-",
      agenda: agendaText || "Initial Discussion",
      whenAdded: getFormattedDateTime(),
      status: "Pending",
      priority: "Medium"
    });
  }

  // Build the unified client object
  const newClient = {
    id: Date.now(),
    name,
    tag: tag === "Select" ? "Basic" : tag,
    status: status === "Select" ? "Available" : status,
    timeSpent: timeSpent || "-",
    company: company || "-",
    address: address || "-",
    email: email || "-",
    phone: phone || "-",
    availableTime: availableTime || "-",
    language: language === "Select" ? "English" : language,
    calls: callsArray,
    notes: notesArray,
    dealBudget: "$5,000",          // Default initial mock deal
    dealStatus: "In Progress",
    dealService: "Consulting",
    dealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days out
  };

  const success = addClient(newClient);
  if (success) {
    alert("Client details saved successfully!");
    document.querySelector(".client-form").reset();
    // Redirect to clients page
    window.location.href = "clients.html";
  } else {
    alert("Failed to save client details. Please check form values.");
  }
}
