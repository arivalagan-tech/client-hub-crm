/**
 * Client Hub CRM - Clients Page & Interactive Dashboard Controller
 */
import { initializeStorage, getClients, saveClients } from './storage.js';
import { escapeHtml, formatTimeTo12Hour, getFormattedDateTime } from './utils.js';
import { SaaSPopup } from './popup.js';

let currentClientId = null;
let notePopup = null;
let callPopup = null;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Ensure storage is initialized & seeded
  await initializeStorage();

  // 2. Instantiate universal modal controllers
  notePopup = new SaaSPopup("popupForm", "popupOverlay");
  callPopup = new SaaSPopup("popupCallForm", "popupOverlay");

  const clientsList = document.getElementById("clientsList");
  const clientDetailsContainer = document.getElementById("clientDetails-container");
  const searchBox = document.getElementById("searchBox");
  const mainContainer = document.querySelector(".clients-main-container");

  // 3. Render client cards left pane
  renderClients();

  // 4. Input hook for filtering list
  if (searchBox) {
    searchBox.addEventListener("input", (e) => renderClients(e.target.value));
  }

  // 5. Click hook on left list to open detail view
  if (clientsList) {
    clientsList.addEventListener("click", (e) => {
      const card = e.target.closest(".client-card");
      if (!card) return;
      
      const id = card.dataset.id;
      if (!id) return;

      // Update active states
      document.querySelectorAll(".client-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const clients = getClients();
      const matched = clients.find((c) => String(c.id) === String(id));
      if (matched) {
        currentClientId = id;
        showDetails(matched);

        // Slide viewport on mobile/tablet screens
        if (mainContainer) {
          mainContainer.classList.add("show-details");
        }
      }
    });
  }

  // 6. Action listener for client details dashboard sheet
  if (clientDetailsContainer) {
    clientDetailsContainer.addEventListener("click", (e) => {
      const clients = getClients();
      const currentClient = clients.find((c) => String(c.id) === String(currentClientId));
      if (!currentClient) return;

      // Back Button for Mobile View
      if (e.target.closest(".add-back-btn")) {
        currentClientId = null;
        if (mainContainer) {
          mainContainer.classList.remove("show-details");
        }
        document.querySelectorAll(".client-card").forEach(c => c.classList.remove("active"));
        renderClients(searchBox ? searchBox.value : "");
      }

      // Add Note Popup trigger
      if (e.target.closest(".add-note-btn")) {
        const btn = e.target.closest(".add-note-btn");
        notePopup.open(btn, (noteData) => {
          // Callback handler defined dynamically
        });

        // Set up Note submission callback
        const noteForm = document.getElementById("popupGenericForm");
        const saveNoteHandler = (submitEvt) => {
          submitEvt.preventDefault();
          const noteText = document.getElementById("popupNoteText").value.trim();
          const noteTitle = document.getElementById("popupNoteTitle").value.trim() || "Meeting Note";
          
          if (!noteText) return alert("Please enter a note.");

          const timestamp = getFormattedDateTime();
          const noteData = { title: noteTitle, text: noteText, when: timestamp };

          if (!Array.isArray(currentClient.notes)) currentClient.notes = [];
          currentClient.notes.push(noteData);
          
          const updatedClients = getClients();
          const idx = updatedClients.findIndex(c => String(c.id) === String(currentClientId));
          if (idx !== -1) {
            updatedClients[idx] = currentClient;
            saveClients(updatedClients);
          }

          renderClientNotes(currentClient.notes);
          notePopup.close();
          noteForm.removeEventListener("submit", saveNoteHandler);
        };
        
        noteForm.onsubmit = saveNoteHandler;
      }

      // Schedule Call Popup trigger
      if (e.target.closest(".schedule-call-btn")) {
        const btn = e.target.closest(".schedule-call-btn");
        callPopup.open(btn);

        // Set up Call submission callback
        const callForm = document.getElementById("popupCallGenericForm");
        const saveCallHandler = (submitEvt) => {
          submitEvt.preventDefault();
          const date = document.getElementById("popupCallDate").value;
          const time = document.getElementById("popupCallTime").value;
          const agenda = document.getElementById("popupCallAgenda").value.trim();
          const priority = document.getElementById("popupCallPriority").value;

          if (!date || !time || !agenda) {
            return alert("Please fill all fields");
          }

          const callData = {
            date,
            time,
            agenda,
            priority,
            status: "Pending",
            whenAdded: getFormattedDateTime()
          };

          if (!Array.isArray(currentClient.calls)) currentClient.calls = [];
          currentClient.calls.push(callData);

          const updatedClients = getClients();
          const idx = updatedClients.findIndex(c => String(c.id) === String(currentClientId));
          if (idx !== -1) {
            updatedClients[idx] = currentClient;
            saveClients(updatedClients);
          }

          renderClientCalls(currentClient.calls, currentClientId);
          callPopup.close();
          callForm.removeEventListener("submit", saveCallHandler);
        };

        callForm.onsubmit = saveCallHandler;
      }

      // Call completion status toggler
      if (e.target.closest(".call-status-btn")) {
        const targetBtn = e.target.closest(".call-status-btn");
        const index = targetBtn.dataset.callIndex;
        const clientId = targetBtn.dataset.clientId;

        const updatedClients = getClients();
        const client = updatedClients.find((c) => String(c.id) === String(clientId));
        if (client && client.calls[index]) {
          client.calls[index].status = client.calls[index].status === "Completed" ? "Pending" : "Completed";
          saveClients(updatedClients);
          
          // Re-render
          currentClient.calls = client.calls;
          renderClientCalls(client.calls, clientId);
        }
      }

      // Call deletion trigger
      if (e.target.closest(".call-delete-btn")) {
        const targetBtn = e.target.closest(".call-delete-btn");
        const index = targetBtn.dataset.callIndex;
        const clientId = targetBtn.dataset.clientId;

        if (confirm("Are you sure you want to delete this scheduled call?")) {
          const updatedClients = getClients();
          const client = updatedClients.find((c) => String(c.id) === String(clientId));
          if (client && client.calls[index]) {
            client.calls.splice(index, 1);
            saveClients(updatedClients);
            
            // Re-render
            currentClient.calls = client.calls;
            renderClientCalls(client.calls, clientId);
          }
        }
      }
    });
  }
});

/**
 * Dynamically builds client cards based on name search filters.
 * @param {string} filter Query criteria to filter clients
 */
function renderClients(filter = "") {
  const clientsList = document.getElementById("clientsList");
  if (!clientsList) return;

  const clients = getClients();
  clientsList.innerHTML = "";

  const normalizedFilter = (filter || "").trim().toLowerCase();
  const filtered = clients.filter((c) =>
    (c.name || "").toLowerCase().includes(normalizedFilter)
  );

  if (filtered.length === 0) {
    clientsList.innerHTML = `<p class="empty">No clients found...</p>`;
    return;
  }

  filtered.forEach((client) => {
    const card = document.createElement("div");
    card.className = `client-card ${String(client.id) === String(currentClientId) ? 'active' : ''}`;
    card.dataset.id = client.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View client ${client.name}`);

    // Compute status CSS class
    const statusClass = `status-${(client.status || "available").toLowerCase()}`;
    const initials = (client.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2);

    card.innerHTML = `
      <div class="clientProfile-mainDiv">
        <div class="clientImgDiv" aria-hidden="true">${initials}</div>
        <div class="clientInfoDiv">
          <div class="header-sec">
            <h3>${escapeHtml(client.name || "-")}</h3>
            <div class="card-badges">
              <span class="badge badge-tag">${escapeHtml(client.tag || "-")}</span>
              <span class="badge badge-status ${statusClass}">${escapeHtml(client.status || "-")}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    clientsList.appendChild(card);
  });
}

/**
 * Renders the right dashboard pane detailing the client statistics.
 * @param {Object} data Selected client record
 */
function showDetails(data) {
  const clientDetailsContainer = document.getElementById("clientDetails-container");
  if (!clientDetailsContainer) return;

  clientDetailsContainer.innerHTML = "";
  const container = document.createElement("div");
  container.className = "clientDetails";

  container.innerHTML = `
    <div class="client-detail-header">
      <div class="client-detail-backBtn">
        <h2>${escapeHtml(data.name)}</h2>
        <button class="back-btn add-back-btn" aria-label="Return to clients list">← Back</button>
      </div>
      <p style="color: var(--text-muted); font-size: 14px;">Overview of client profile, active logs, and scheduled interactions</p>
    </div>

    <!-- Info Section: Profile Overview -->
    <section class="detail-section" aria-label="Profile Overview">
      <h3 class="detail-section-title">Overview</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Tag Type</span>
          <span class="value">${escapeHtml(data.tag)}</span>
        </div>
        <div class="info-item">
          <span class="label">Status</span>
          <span class="value"><span class="badge badge-status status-${(data.status || "available").toLowerCase()}">${escapeHtml(data.status)}</span></span>
        </div>
        <div class="info-item">
          <span class="label">Time Invested</span>
          <span class="value">${escapeHtml(data.timeSpent || "-")}</span>
        </div>
        <div class="info-item">
          <span class="label">Company Name</span>
          <span class="value">${escapeHtml(data.company || "-")}</span>
        </div>
      </div>
    </section>

    <!-- Info Section: Contact Details -->
    <section class="detail-section" aria-label="Contact Information">
      <h3 class="detail-section-title">Contact Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Primary Email</span>
          <span class="value">${escapeHtml(data.email || "-")}</span>
        </div>
        <div class="info-item">
          <span class="label">Phone Number</span>
          <span class="value">${escapeHtml(data.phone || "-")}</span>
        </div>
        <div class="info-item" style="grid-column: span 2;">
          <span class="label">Mailing Address</span>
          <span class="value">${escapeHtml(data.address || "-")}</span>
        </div>
      </div>
    </section>

    <!-- Info Section: Preferences -->
    <section class="detail-section" aria-label="Preferences">
      <h3 class="detail-section-title">Communication Preference</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Preferred Window</span>
          <span class="value">${escapeHtml(data.availableTime || "-")}</span>
        </div>
        <div class="info-item">
          <span class="label">Preferred Language</span>
          <span class="value">${escapeHtml(data.language || "-")}</span>
        </div>
      </div>
    </section>

    <!-- Interactive Section: Next Call logs -->
    <section class="detail-section" aria-label="Scheduled Interactions">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 class="detail-section-title" style="margin-bottom: 0;">Scheduled Calls</h3>
        <button class="ProgressBtn add-btn3 schedule-call-btn">+ Schedule New Call</button>
      </div>
      <div class="nextCall-card-wrap"></div>
    </section>

    <!-- Interactive Section: Customer Notes -->
    <section class="detail-section" aria-label="Client Notes & Logs">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 class="detail-section-title" style="margin-bottom: 0;">Client Notes</h3>
        <button class="ProgressBtn add-btn3 add-note-btn">+ Add New Note</button>
      </div>
      <div class="notes_card_wrap"></div>
    </section>

    <!-- Deals Grid/Table Section -->
    <section class="detail-section" aria-label="Budget Deals">
      <h3 class="detail-section-title">Deals & Opportunities</h3>
      <div class="clientTable-container">
        <table>
          <thead>
            <tr>
              <th>Target Budget</th>
              <th>Status</th>
              <th>Service Scope</th>
              <th>Target Deadline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escapeHtml(data.dealBudget || "$10,000")}</td>
              <td><span class="badge status-available" style="padding: 4px 10px; border-radius:4px;">${escapeHtml(data.dealStatus || "In Progress")}</span></td>
              <td>${escapeHtml(data.dealService || "Digital Strategy")}</td>
              <td>${escapeHtml(data.dealDeadline || "-")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
  clientDetailsContainer.appendChild(container);
  
  // Render arrays
  renderClientCalls(data.calls || [], data.id);
  renderClientNotes(data.notes || []);
}

/**
 * Renders the list of scheduled calls for the client details sheet.
 * @param {Array} callsArr List of call records
 * @param {string|number} clientId ID of the parent client
 */
function renderClientCalls(callsArr, clientId) {
  const container = document.querySelector(".nextCall-card-wrap");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(callsArr) || callsArr.length === 0) {
    container.innerHTML = `<p class="empty" style="grid-column: span 3; padding: 20px;">No interactions scheduled</p>`;
    return;
  }

  callsArr.forEach((call, index) => {
    const isCompleted = call.status === "Completed";
    const dateText = call.date || "-";
    const time24 = call.time || "-";
    const time12 = time24 === "-" ? "-" : formatTimeTo12Hour(time24);
    
    // Priority badge class
    const prio = (call.priority || "Medium").toLowerCase();
    const prioClass = `priority-${prio}`;

    const div = document.createElement("div");
    div.className = `nextCall-card ${isCompleted ? 'completed' : ''}`;
    div.innerHTML = `
      <h4>
        <span>Call #${index + 1}</span>
        <span class="priority-badge ${prioClass}">${escapeHtml(call.priority)}</span>
      </h4>
      <p><strong>Date:</strong> ${escapeHtml(dateText)}</p>
      <p><strong>Time:</strong> ${escapeHtml(time12)} (${escapeHtml(time24)})</p>
      <p><strong>Agenda:</strong> ${escapeHtml(call.agenda)}</p>
      <p style="font-size: 11px; color: var(--text-light); margin-top: 4px;">Logged: ${escapeHtml(call.whenAdded || "")}</p>
      
      <div class="call-actions-row">
        <button class="ProgressBtn call-status-btn" data-call-index="${index}" data-client-id="${clientId}">
          ${isCompleted ? "Mark Pending" : "Mark Completed"}
        </button>
        <button class="ProgressBtn call-delete-btn" data-call-index="${index}" data-client-id="${clientId}">
          Delete
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

/**
 * Renders the notes list in client details panel.
 * @param {Array} notesArr List of note objects
 */
function renderClientNotes(notesArr) {
  const notesContainer = document.querySelector(".notes_card_wrap");
  if (!notesContainer) return;

  notesContainer.innerHTML = "";

  if (!Array.isArray(notesArr) || notesArr.length === 0) {
    notesContainer.innerHTML = `<p class="empty" style="padding: 20px;">No historical notes found.</p>`;
    return;
  }

  // Render notes in reverse chronological order so latest note appears at top
  const sortedNotes = [...notesArr].reverse();

  sortedNotes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "notes_card";
    div.innerHTML = `
      <h4>${escapeHtml(note.title || "Meeting Note")}</h4>
      <p>${escapeHtml(note.text)}</p>
      <span class="timestamp">Created: ${escapeHtml(note.when)}</span>
    `;
    notesContainer.appendChild(div);
  });
}
