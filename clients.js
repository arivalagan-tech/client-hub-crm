function formatTimeTo12Hour(timeStr) {
  //  Converts 24h time to 12h for user-friendly display. UX best practice in CRMs.
  if (!timeStr) return "-";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function escapeHtml(value) {
  //  Sanitizes user input to prevent XSS. Essential for dynamic content.
  if (value === undefined || value === null) return "-";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getClientsFromStorage() {
  //  Central util to fetch/parse localStorage. Ensures consistent data source.
  return JSON.parse(localStorage.getItem("myArray")) || [];
}

function renderClients(filter = "") {
  // Dynamically builds client cards, filters by name. Uses dataset.id for clicks.
  const clientsList = document.getElementById("clientsList");
  const clientDetailsContainer = document.getElementById("clientDetails-container");
  const clients = getClientsFromStorage();
  clientsList.innerHTML = "";
  const normalizedFilter = (filter || "").toLowerCase();
  const filtered = clients.filter((c) =>
    (c.name || "").toLowerCase().includes(normalizedFilter)
  );
  if (filtered.length === 0) {
    clientsList.innerHTML = `<p class="empty">No clients found...</p>`;
    clientDetailsContainer.innerHTML = "";
    return;
  }
  filtered.forEach((client) => {
    const card = document.createElement("div");
    card.className = "client-card";
    card.dataset.id = client.id;
    card.innerHTML = `
      <div class="clientProfile-mainDiv">
        <div class="clientImgDiv" aria-hidden="true"></div>
        <div class="clientInfoDiv">
          <div class="header-sec">
            <h3>${escapeHtml(client.name || "-")}</h3>
            <p>
              <span class="clientTag">Tag: ${escapeHtml(client.tag || "-")}</span>
              <span class="clientStatus">Status: ${escapeHtml(client.status || "-")}</span>
            </p>
          </div>
        </div>
      </div>
    `;
    clientsList.appendChild(card);
  });
}

function renderClientCalls(callsArr, clientId) {
  // Pass clientId for status/delete actions. Loops calls array, adds status toggle and delete.
  const container = document.querySelector(".nextCall-card-wrap");
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(callsArr) || callsArr.length === 0) {
    container.innerHTML = `<p class="font-size">No calls scheduled</p>`;
    return;
  }
  callsArr.forEach((call, index) => {
    const dateText = call.date || "-";
    const time24 = call.time || "-";
    const time12 = time24 === "-" ? "-" : formatTimeTo12Hour(time24);
    //  Color-code priority badges
    const priorityColor = call.priority === "High" ? "red" : call.priority === "Medium" ? "orange" : "green";
    const div = document.createElement("div");
    div.className = "nextCall-card";
    div.innerHTML = `
      <h4 class="font-size2">Call ${index + 1}</h4>
      <p><strong>Date:</strong> ${escapeHtml(dateText)}</p>
      <p><strong>Time:</strong> ${escapeHtml(time12)} (${escapeHtml(time24)})</p>
      <p><strong>Agenda:</strong> ${escapeHtml(call.agenda)}</p>
      <p><strong>Priority:</strong> <span style="color:${priorityColor}">${escapeHtml(call.priority)}</span></p>
      <p class="font-size">(${escapeHtml(call.whenAdded || "")})</p>
      <!-- NOVAH FEATURE: Toggle status and delete buttons -->
      <button class="ProgressBtn call-status-btn" data-call-index="${index}" data-client-id="${clientId}">
        ${call.status === "Completed" ? "Mark Pending" : "Mark Completed"}
      </button>
      <button class="ProgressBtn call-delete-btn" data-call-index="${index}" data-client-id="${clientId}">Delete</button>
    `;
    container.appendChild(div);
  });
}

function renderClientNotes(notesArr) {
  // Loops notes array, builds dynamic list. Safe escaping, timestamps for history.
  const notesContainer = document.querySelector(".notes_card_wrap");
  if (!notesContainer) return;
  notesContainer.innerHTML = "";
  if (!Array.isArray(notesArr) || notesArr.length === 0) {
    notesContainer.innerHTML = `<p class="font-size">No notes yet</p>`;
    return;
  }
  notesArr.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "notes_card";
    div.innerHTML = `
      <h4 class="font-size2">${escapeHtml(note.title || `Meeting ${index + 1}`)}</h4>
      <p class="font-size">${escapeHtml(note.text)}</p>
      <p class="font-size">(${escapeHtml(note.when)})</p>
    `;
    notesContainer.appendChild(div);
  });
}

function showDetails(data) {
  // Renders client details dynamically, calls render funcs for arrays. No single-call fields.
  const clientDetailsContainer = document.getElementById("clientDetails-container");
  clientDetailsContainer.innerHTML = "";
  const container = document.createElement("div");
  container.className = "clientDetails";
  container.innerHTML = `
    <div class="client-detail-header">
      <div class="client-detail-backBtn">
        <div><h2>Client Details</h2></div>
        <div><button class="back-btn add-back-btn">← Back to Clients</button></div>
      </div>
      <p style="color:darkslategray;">Overview of client information and interactions</p>
    </div>
    <section class="client-Overview-container">
      <h3 class="Overview-title">Overview</h3>
      <div class="Overview-MainCard">
        <div class="Overview-card1">
          <div class="overView-name-sec">
            <p class="font-size">Name</p>
            <p>${escapeHtml(data.name)}</p>
          </div>
          <div class="overView-tag-sec">
            <p class="font-size">Tag</p>
            <p>${escapeHtml(data.tag)}</p>
          </div>
        </div>
        <div class="Overview-card2">
          <div class="overView-Status-sec">
            <p class="font-size">Status</p>
            <p>${escapeHtml(data.status)}</p>
          </div>
          <div class="overView-Spent-sec">
            <p class="font-size">Time Spent</p>
            <p>${escapeHtml(data.timeSpent || "-")}</p>
          </div>
        </div>
        <div class="Overview-card3">
          <div class="overView-Company-sec">
            <p class="font-size">Company</p>
            <p>${escapeHtml(data.company || "-")}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="client-contactInfo-container">
      <h3 class="contactInfo-title">Contact information</h3>
      <div class="contactInfo-card1">
        <div class="contactInfo-Address-sec">
          <p class="font-size">Address</p>
          <p>${escapeHtml(data.address || "-")}</p>
        </div>
        <div class="contactInfo-Email-sec">
          <p class="font-size">Email</p>
          <p>${escapeHtml(data.email || "-")}</p>
        </div>
      </div>
      <div class="contactInfo-card2">
        <div class="contactInfo-Phone-sec">
          <p class="font-size">Phone</p>
          <p>${escapeHtml(data.phone || "-")}</p>
        </div>
      </div>
    </section>
    <section class="client-communicationPref-container">
      <h3 class="communicationPref-title">Communication Preference</h3>
      <div class="communicationPref-card1">
        <div class="communicationPref-Time-sec">
          <p class="font-size">Available Time</p>
          <p>${escapeHtml(data.availableTime || "-")}</p>
        </div>
        <div class="communicationPref-Language-sec">
          <p class="font-size">Preferred Language</p>
          <p>${escapeHtml(data.language || "-")}</p>
        </div>
      </div>
    </section>
    <section class="client-nextCall-container">
      <h3 class="nextCall-title">Next Call</h3>
      <div class="nextCall-card-wrap"></div>
      <button class="ProgressBtn add-btn3 schedule-call-btn">+ Schedule New Call</button>
    </section>
    <section class="client-notes-container">
      <h3 class="notes-title">Notes</h3>
      <div class="notes_card_wrap"></div>
      <button class="ProgressBtn add-btn3 add-note-btn">+ Add New Note</button>
    </section>
    <section class="client-Deals-container">
      <h3 class="Deals-title">Deals</h3>
      <div class="clientTable-container">
        <table>
          <thead>
            <tr>
              <th>Budget</th>
              <th>Status</th>
              <th>Service</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-size">${escapeHtml(data.dealBudget || "$50,000")}</td>
              <td><button class="ProgressBtn add-btn3">${escapeHtml(data.dealStatus || "In Progress")}</button></td>
              <td class="font-size">${escapeHtml(data.dealService || "Web Development")}</td>
              <td class="font-size">${escapeHtml(data.dealDeadline || "2024-08-30")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
  clientDetailsContainer.appendChild(container);
  renderClientCalls(data.calls || [], data.id); //  Pass clientId for status/delete
  renderClientNotes(data.notes || []);
}

let currentClientId = null;

function openPopup(onSubmitCallback) {
  // Generic modal handler for notes. Single listener, clean reset.
  const overlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popupForm");
  const form = document.getElementById("popupGenericForm");
  overlay.style.display = "block";
  popup.style.display = "block";
  document.getElementById("popupNoteText").value = "";
  document.getElementById("popupNoteTitle").value = "";
  const closePopup = () => {
    overlay.style.display = "none";
    popup.style.display = "none";
    form.removeEventListener("submit", submitHandler);
  };
  document.getElementById("popupCancel").onclick = closePopup;
  overlay.onclick = closePopup;
  const submitHandler = function (e) {
    e.preventDefault();
    const note = document.getElementById("popupNoteText").value.trim();
    const title = document.getElementById("popupNoteTitle").value.trim() || "Meeting Note";
    if (!note) return alert("Please enter a note.");
    const timestamp = getFormattedDateTime();
    const noteData = { title, text: note, when: timestamp };
    if (typeof onSubmitCallback === "function") {
      onSubmitCallback(noteData);
    }
    closePopup();
  };
  form.removeEventListener("submit", submitHandler); //  Remove any old listeners
  form.addEventListener("submit", submitHandler);
}

function openCallPopup(onSubmitCallback) {
  //  Fixed call popup to append to calls array, single listener.
  const overlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popupCallForm");
  const form = document.getElementById("popupCallGenericForm");
  overlay.style.display = "block";
  popup.style.display = "block";
  document.getElementById("popupCallDate").value = "";
  document.getElementById("popupCallTime").value = "";
  document.getElementById("popupCallAgenda").value = "";
  document.getElementById("popupCallPriority").value = "Medium";
  const closePopup = () => {
    overlay.style.display = "none";
    popup.style.display = "none";
    form.removeEventListener("submit", submitHandler);
  };
  document.getElementById("popupCallCancel").onclick = closePopup;
  overlay.onclick = closePopup;
  const submitHandler = function (e) {
    e.preventDefault();
    const date = document.getElementById("popupCallDate").value;
    const time = document.getElementById("popupCallTime").value;
    const agenda = document.getElementById("popupCallAgenda").value.trim();
    const priority = document.getElementById("popupCallPriority").value;
    if (!date || !time || !agenda) {
      alert("Please fill all fields");
      return;
    }
    const callData = {
      date,
      time,
      agenda,
      whenAdded: getFormattedDateTime(),
      status: "Pending", //  Track call status
      priority //  Track call priority
    };
    console.log("Saving call:", callData); // Debug to confirm save
    if (typeof onSubmitCallback === "function") {
      onSubmitCallback(callData);
    }
    closePopup();
  };
  form.removeEventListener("submit", submitHandler); //  Prevent multiple listeners
  form.addEventListener("submit", submitHandler);
}

document.addEventListener("DOMContentLoaded", () => {
  const clientsList = document.getElementById("clientsList");
  const clientDetailsContainer = document.getElementById("clientDetails-container");
  const searchBox = document.getElementById("searchBox");

  clientsList.addEventListener("click", (e) => {
    const card = e.target.closest(".client-card");
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;
    const clients = getClientsFromStorage();
    const matched = clients.find((c) => String(c.id) === String(id));
    if (matched) {
      currentClientId = id;
      showDetails(matched);
    }
  });

  clientDetailsContainer.addEventListener("click", (e) => {
    const clients = getClientsFromStorage();
    const currentClient = clients.find((c) => String(c.id) === String(currentClientId));
    if (!currentClient) return;

    if (e.target.matches(".add-note-btn")) {
      openPopup((noteData) => {
        if (!Array.isArray(currentClient.notes)) currentClient.notes = [];
        currentClient.notes.push(noteData);
        localStorage.setItem("myArray", JSON.stringify(clients));
        console.log("Note added:", noteData);
        renderClientNotes(currentClient.notes);
      });
    }

    if (e.target.matches(".schedule-call-btn")) {
      openCallPopup((callData) => {
        if (!Array.isArray(currentClient.calls)) currentClient.calls = [];
        currentClient.calls.push(callData); //  Append, don't overwrite
        localStorage.setItem("myArray", JSON.stringify(clients));
        console.log("Call scheduled:", callData);
        renderClientCalls(currentClient.calls, currentClientId);
      });
    }

    // Toggle call status
    if (e.target.matches(".call-status-btn")) {
      const index = e.target.dataset.callIndex;
      const clientId = e.target.dataset.clientId;
      const client = clients.find((c) => String(c.id) === String(clientId));
      if (client && client.calls[index]) {
        client.calls[index].status = client.calls[index].status === "Completed" ? "Pending" : "Completed";
        localStorage.setItem("myArray", JSON.stringify(clients));
        renderClientCalls(client.calls, clientId);
      }
    }

    //  Delete call
    if (e.target.matches(".call-delete-btn")) {
      const index = e.target.dataset.callIndex;
      const clientId = e.target.dataset.clientId;
      const client = clients.find((c) => String(c.id) === String(clientId));
      if (client && client.calls[index]) {
        client.calls.splice(index, 1);
        localStorage.setItem("myArray", JSON.stringify(clients));
        renderClientCalls(client.calls, clientId);
      }
    }

    if (e.target.matches(".add-back-btn")) {
      currentClientId = null;
      renderClients(searchBox.value || "");
      clientDetailsContainer.innerHTML = "";
    }
  });

  renderClients();
  searchBox.addEventListener("input", (e) => renderClients(e.target.value));
});