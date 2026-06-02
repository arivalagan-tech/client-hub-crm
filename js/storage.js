/**
 * Client Hub CRM - LocalStorage Database Wrapper & Seeding Engine
 */

const STORAGE_KEY = "client_hub_crm_clients";
const OLD_KEY = "myArray";

// Fallback seed data in case data/client.json cannot be fetched
const FALLBACK_SEED_DATA = [
  {
    "id": 1,
    "name": "Arivalagan Sankar",
    "tag": "Elite",
    "status": "Available",
    "timeSpent": "5 hours",
    "company": "Nova Enterprises",
    "address": "Thoraipakkam, Chennai, Tamil Nadu, 600099",
    "email": "arivualagan800@gmail.com",
    "phone": "+91 8220151020",
    "availableTime": "Weekdays, 9 AM - 5 PM",
    "language": "English",
    "dealBudget": "$50,000",
    "dealStatus": "In Progress",
    "dealService": "Web Development",
    "dealDeadline": "2026-08-30",
    "notes": [
      {
        "title": "Initial Meeting",
        "text": "Client showed interest in web development services and expansion plans.",
        "when": "Monday, June 1, 2026 at 10:15 AM"
      },
      {
        "title": "Proposal Follow-up",
        "text": "Sent proposal with website layout and pricing. Awaiting feedback.",
        "when": "Tuesday, June 2, 2026 at 11:30 AM"
      }
    ],
    "calls": [
      {
        "date": "2026-08-15",
        "time": "14:30",
        "agenda": "Discuss new project requirements and e-commerce integrations.",
        "priority": "High",
        "status": "Pending",
        "whenAdded": "Monday, June 1, 2026 at 10:30 AM"
      }
    ]
  },
  {
    "id": 2,
    "name": "Sarah Connor",
    "tag": "Premium",
    "status": "Busy",
    "timeSpent": "12 hours",
    "company": "Cyberdyne Systems",
    "address": "123 Tech Way, San Francisco, CA 94107",
    "email": "s.connor@cyberdyne.com",
    "phone": "+1 555-867-5309",
    "availableTime": "Weekends, 10 AM - 4 PM",
    "language": "English",
    "dealBudget": "$120,000",
    "dealStatus": "Completed",
    "dealService": "Cloud Migration & Security",
    "dealDeadline": "2026-07-15",
    "notes": [
      {
        "title": "Security Audit",
        "text": "Completed the initial security infrastructure assessment. High vulnerabilities detected in legacy nodes.",
        "when": "Wednesday, May 27, 2026 at 9:00 AM"
      }
    ],
    "calls": [
      {
        "date": "2026-06-10",
        "time": "10:00",
        "agenda": "Review migration roadmap and security patch deployment.",
        "priority": "High",
        "status": "Completed",
        "whenAdded": "Wednesday, May 27, 2026 at 9:45 AM"
      }
    ]
  }
];

/**
 * Perform safe data migrations and default database seeding.
 */
export async function initializeStorage() {
  try {
    // 1. Check for legacy "myArray" key and migrate
    const legacyData = localStorage.getItem(OLD_KEY);
    if (legacyData) {
      console.log("Legacy data detected. Migrating to new professional storage key...");
      localStorage.setItem(STORAGE_KEY, legacyData);
      localStorage.removeItem(OLD_KEY);
      return;
    }

    // 2. Seed data if storage is empty
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (!currentData || JSON.parse(currentData).length === 0) {
      console.log("Database is empty. Seeding defaults...");
      try {
        const response = await fetch("data/client.json");
        if (response.ok) {
          const seedData = await response.ok ? await response.json() : FALLBACK_SEED_DATA;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
          console.log("Database successfully seeded from client.json");
        } else {
          throw new Error("Failed to fetch client.json");
        }
      } catch (err) {
        console.warn("Could not fetch data/client.json, seeding using fallback constant:", err);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_SEED_DATA));
      }
    }
  } catch (error) {
    console.error("Storage initialization failed:", error);
  }
}

/**
 * Gets all clients from local storage.
 * @returns {Array} List of clients
 */
export function getClients() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse clients from LocalStorage:", error);
    return [];
  }
}

/**
 * Saves the entire clients array to local storage.
 * @param {Array} clients The updated clients list
 */
export function saveClients(clients) {
  try {
    if (!Array.isArray(clients)) throw new Error("Invalid client data format.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error("Failed to save clients to LocalStorage:", error);
  }
}

/**
 * Adds a new client to the database.
 * @param {Object} client The client data object
 * @returns {boolean} Success status
 */
export function addClient(client) {
  try {
    const clients = getClients();
    clients.push(client);
    saveClients(clients);
    return true;
  } catch (error) {
    console.error("Failed to add client:", error);
    return false;
  }
}

/**
 * Update an existing client's fields or arrays.
 * @param {string|number} id The client ID
 * @param {Object} updatedFields Object containing fields to update
 * @returns {boolean} Success status
 */
export function updateClient(id, updatedFields) {
  try {
    const clients = getClients();
    const index = clients.findIndex(c => String(c.id) === String(id));
    if (index === -1) return false;
    
    clients[index] = { ...clients[index], ...updatedFields };
    saveClients(clients);
    return true;
  } catch (error) {
    console.error("Failed to update client:", error);
    return false;
  }
}
