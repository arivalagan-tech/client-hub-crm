function getFormattedDateTime() {
  // "whenAdded" in notes/calls arrays. Used for audit trails in CRM history.
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
  return now.toLocaleString("en-US", options);
}

function saveForm(event) {
  // Core form handler. Prevents default submit (no page reload), grabs all fields via IDs, builds client obj with arrays for notes/calls, appends to localStorage "myArray".
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
  console.log(
    `name:${name}, tag:${tag}, Status:${status}, timeSpent:${timeSpent}, company:${company}, Address:${address}, Email:${email}, phone No:${phone}, Available Time:${availableTime}, Language:${language}, Date:${date}, Time:${time} agenda:${agendaText}, notes:${notesText}.`,
  );
  // Create arrays for notes and calls
  let notesArray = [];
  if (notesText) {
    notesArray.push({
      title: "Initial Meeting",
      text: notesText,
      when: getFormattedDateTime(),
    });
  }
  let callsArray = [];
  if (date || time || agendaText) {
    callsArray.push({
      date,
      time,
      agenda: agendaText || "No agenda",
      whenAdded: getFormattedDateTime(),
      status: "Pending", //  Add status for tracking call completion
      priority: "Medium", //  Default priority for new calls
    });
  }
  // Build new client object
  const newClientData = {
    id: Date.now(),
    name,
    tag,
    status,
    timeSpent,
    company,
    address,
    email,
    phone,
    availableTime,
    language,
    calls: callsArray,
    notes: notesArray,
  };
  // Get and update localStorage
  const clientArray = JSON.parse(localStorage.getItem("myArray")) || [];
  clientArray.push(newClientData);
  localStorage.setItem("myArray", JSON.stringify(clientArray));

  console.log("Client Saved Info:", newClientData);
  console.log("All Clients Final Info:", clientArray);
  console.log(
    "localStorage saved data:",
    JSON.parse(localStorage.getItem("myArray")),
  );

  alert("Client details saved successfully!");
  document.querySelector(".client-form").reset();
}
