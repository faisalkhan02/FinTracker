// FinTracker JavaScript - Fixed Version
// Compatible with your current index.html structure

let currentEditingId = null;
let currentEditingSection = null;

const sampleData = {
  roomOwner: [
    // {
    //   id: 1,
    //   tenantName: "John Doe",
    //   roomNumber: "101",
    //   rentAmount: 8000,
    //   joinDate: "2024-01-15",
    //   electricityBill: 500,
    //   status: "paid"
    // }
  ],
  pgOwner: [],
  messOwner: [],
  personalExpenses: []
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
  showDashboard();
});

// Initialize localStorage data
function initializeApp() {
  if (!localStorage.getItem("fintracker_data")) {
    localStorage.setItem("fintracker_data", JSON.stringify(sampleData));
  }
  updateDashboardStats();
}

// Add all event listeners
function setupEventListeners() {
  // Dashboard button
  document.getElementById("dashboardBtn").addEventListener("click", showDashboard);

  // Room section
//   document.getElementById("addRoomBtn").addEventListener("click", () => showForm("room"));

  document.getElementById("addRoomBtn").addEventListener("click", () => {
  console.log("✅ Add Room button clicked!");
  showForm("room");
});

  document.getElementById("cancelRoomForm").addEventListener("click", () => hideForm("room"));
  document.getElementById("roomOwnerForm").addEventListener("submit", handleRoomSubmit);

  // PG section
  document.getElementById("addPGBtn").addEventListener("click", () => showForm("pg"));
  document.getElementById("cancelPGForm").addEventListener("click", () => hideForm("pg"));
  document.getElementById("pgOwnerForm").addEventListener("submit", handlePgSubmit);

  // Mess section
  document.getElementById("addMessBtn").addEventListener("click", () => showForm("mess"));
  document.getElementById("cancelMessForm").addEventListener("click", () => hideForm("mess"));
  document.getElementById("messOwnerForm").addEventListener("submit", handleMessSubmit);

  // Personal section
  document.getElementById("addPersonalBtn").addEventListener("click", () => showForm("personal"));
  document.getElementById("cancelPersonalForm").addEventListener("click", () => hideForm("personal"));
  document.getElementById("personalExpensesForm").addEventListener("submit", handlePersonalSubmit);
}

// Utility functions
function getData() {
  return JSON.parse(localStorage.getItem("fintracker_data")) || sampleData;
}

function saveData(data) {
  localStorage.setItem("fintracker_data", JSON.stringify(data));
  updateDashboardStats();
}

function generateId(section) {
  const data = getData();
  const items = data[section] || [];
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Section display
function showDashboard() {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById("dashboard").classList.remove("hidden");
  updateDashboardStats();
}

function showSection(sectionName) {
  document.getElementById("dashboard").classList.add("hidden");
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionName + "Section").classList.remove("hidden");
  loadSectionData(sectionName);
}

// Load and display section data
function loadSectionData(section) {
  const data = getData();

  if (section === "room") displayRoomData(data.roomOwner);
  if (section === "pg") displayPgData(data.pgOwner);
  if (section === "mess") displayMessData(data.messOwner);
  if (section === "personal") displayPersonalData(data.personalExpenses);
}

// Show / hide form
function showForm(section) {
  document.getElementById(section + "Form").classList.remove("hidden");
  const today = new Date().toISOString().split("T")[0];

  if (section === "room") document.getElementById("joinDate").value = today;
  if (section === "pg") document.getElementById("pgJoinDate").value = today;
  if (section === "mess") document.getElementById("messDate").value = today;
  if (section === "personal") document.getElementById("expenseDate").value = today;
}

function hideForm(section) {
  document.getElementById(section + "Form").classList.add("hidden");
  currentEditingId = null;
  currentEditingSection = null;
}

// ---------------------- ROOM ------------------------
function handleRoomSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    tenantName: document.getElementById("tenantName").value,
    roomNumber: document.getElementById("roomNumber").value,
    rentAmount: parseInt(document.getElementById("rentAmount").value),
    joinDate: document.getElementById("joinDate").value,
    electricityBill: parseInt(document.getElementById("electricityBill").value) || 0,
    status: document.getElementById("roomStatus").value
  };

  if (currentEditingId && currentEditingSection === "room") {
    const index = data.roomOwner.findIndex(r => r.id === currentEditingId);
    data.roomOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("roomOwner");
    data.roomOwner.push(formData);
  }

  saveData(data);
  hideForm("room");
  displayRoomData(data.roomOwner);
}

// Display Room data
function displayRoomData(rooms) {
  const tbody = document.querySelector("#roomTable tbody");
  if (!rooms.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No tenants yet. Click "Add New Tenant".</td></tr>`;
    return;
  }

  tbody.innerHTML = rooms
    .map(
      r => `
      <tr>
        <td>${r.tenantName}</td>
        <td>${r.roomNumber}</td>
        <td>₹${r.rentAmount}</td>
        <td>${r.joinDate}</td>
        <td>₹${r.electricityBill}</td>
        <td>${r.status}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('room', ${r.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('room', ${r.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- PG ------------------------
function handlePgSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    memberName: document.getElementById("memberName").value,
    bedNumber: document.getElementById("bedNumber").value,
    monthlyRent: parseInt(document.getElementById("monthlyRent").value),
    pgJoinDate: document.getElementById("pgJoinDate").value,
    electricityCharge: parseInt(document.getElementById("electricityCharge").value) || 0,
    foodCharge: parseInt(document.getElementById("foodCharge").value) || 0,
    status: document.getElementById("pgMemberStatus").value
  };

  if (currentEditingId && currentEditingSection === "pg") {
    const index = data.pgOwner.findIndex(m => m.id === currentEditingId);
    data.pgOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("pgOwner");
    data.pgOwner.push(formData);
  }

  saveData(data);
  hideForm("pg");
  displayPgData(data.pgOwner);
}

function displayPgData(members) {
  const tbody = document.querySelector("#pgTable tbody");
  if (!members.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">No members added.</td></tr>`;
    return;
  }

  tbody.innerHTML = members
    .map(
      m => `
      <tr>
        <td>${m.memberName}</td>
        <td>${m.bedNumber}</td>
        <td>₹${m.monthlyRent}</td>
        <td>${m.pgJoinDate}</td>
        <td>₹${m.electricityCharge}</td>
        <td>₹${m.foodCharge}</td>
        <td>${m.status}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('pg', ${m.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('pg', ${m.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- MESS ------------------------
function handleMessSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    date: document.getElementById("messDate").value,
    mealType: document.getElementById("mealType").value,
    expense: parseInt(document.getElementById("expense").value),
    memberCount: parseInt(document.getElementById("memberCount").value)
  };

  if (currentEditingId && currentEditingSection === "mess") {
    const index = data.messOwner.findIndex(m => m.id === currentEditingId);
    data.messOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("messOwner");
    data.messOwner.push(formData);
  }

  saveData(data);
  hideForm("mess");
  displayMessData(data.messOwner);
}

function displayMessData(records) {
  const tbody = document.querySelector("#messTable tbody");
  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No food records yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = records
    .map(
      r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.mealType}</td>
        <td>₹${r.expense}</td>
        <td>${r.memberCount}</td>
        <td>₹${(r.expense / r.memberCount).toFixed(2)}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('mess', ${r.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('mess', ${r.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- PERSONAL ------------------------
function handlePersonalSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    description: document.getElementById("expenseDescription").value,
    amount: parseInt(document.getElementById("expenseAmount").value),
    category: document.getElementById("expenseCategory").value,
    date: document.getElementById("expenseDate").value
  };

  if (currentEditingId && currentEditingSection === "personal") {
    const index = data.personalExpenses.findIndex(p => p.id === currentEditingId);
    data.personalExpenses[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("personalExpenses");
    data.personalExpenses.push(formData);
  }

  saveData(data);
  hideForm("personal");
  displayPersonalData(data.personalExpenses);
}

function displayPersonalData(items) {
  const tbody = document.querySelector("#personalTable tbody");
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No expenses yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map(
      i => `
      <tr>
        <td>${i.date}</td>
        <td>${i.description}</td>
        <td>₹${i.amount}</td>
        <td>${i.category}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('personal', ${i.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('personal', ${i.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- EDIT / DELETE ------------------------
function editRecord(section, id) {
  const data = getData();
  currentEditingId = id;
  currentEditingSection = section;

  if (section === "room") {
    const r = data.roomOwner.find(x => x.id === id);
    if (!r) return;
    document.getElementById("tenantName").value = r.tenantName;
    document.getElementById("roomNumber").value = r.roomNumber;
    document.getElementById("rentAmount").value = r.rentAmount;
    document.getElementById("joinDate").value = r.joinDate;
    document.getElementById("electricityBill").value = r.electricityBill;
    document.getElementById("roomStatus").value = r.status;
    showForm("room");
  }

  if (section === "pg") {
    const m = data.pgOwner.find(x => x.id === id);
    if (!m) return;
    document.getElementById("memberName").value = m.memberName;
    document.getElementById("bedNumber").value = m.bedNumber;
    document.getElementById("monthlyRent").value = m.monthlyRent;
    document.getElementById("pgJoinDate").value = m.pgJoinDate;
    document.getElementById("electricityCharge").value = m.electricityCharge;
    document.getElementById("foodCharge").value = m.foodCharge;
    document.getElementById("pgMemberStatus").value = m.status;
    showForm("pg");
  }

  if (section === "mess") {
    const rec = data.messOwner.find(x => x.id === id);
    if (!rec) return;
    document.getElementById("messDate").value = rec.date;
    document.getElementById("mealType").value = rec.mealType;
    document.getElementById("expense").value = rec.expense;
    document.getElementById("memberCount").value = rec.memberCount;
    showForm("mess");
  }

  if (section === "personal") {
    const exp = data.personalExpenses.find(x => x.id === id);
    if (!exp) return;
    document.getElementById("expenseDescription").value = exp.description;
    document.getElementById("expenseAmount").value = exp.amount;
    document.getElementById("expenseCategory").value = exp.category;
    document.getElementById("expenseDate").value = exp.date;
    showForm("personal");
  }
}

function deleteRecord(section, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  const data = getData();
  if (section === "room") data.roomOwner = data.roomOwner.filter(x => x.id !== id);
  if (section === "pg") data.pgOwner = data.pgOwner.filter(x => x.id !== id);
  if (section === "mess") data.messOwner = data.messOwner.filter(x => x.id !== id);
  if (section === "personal") data.personalExpenses = data.personalExpenses.filter(x => x.id !== id);

  saveData(data);
  loadSectionData(section);
}

// ---------------------- DASHBOARD ------------------------
function updateDashboardStats() {
  const data = getData();
  document.getElementById("roomStats").textContent = `${data.roomOwner.length} Tenants`;
  document.getElementById("pgStats").textContent = `${data.pgOwner.length} Members`;
  document.getElementById("messStats").textContent = `₹${data.messOwner.reduce((s, r) => s + r.expense, 0)} Total`;
  document.getElementById("personalStats").textContent = `₹${data.personalExpenses.reduce((s, e) => s + e.amount, 0)} Spent`;
}

function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += ((localStorage[key].length + key.length) * 2); // bytes (2 bytes per char)
    }
  }
  console.log("Approx localStorage size:", (total / 1024).toFixed(2), "KB");
}

getLocalStorageSize();

// 🔍 Search records in each section
function searchRecords(section) {
  const query = document.getElementById(section + "Search").value.toLowerCase();
  const data = getData();

  let filtered = [];

  switch (section) {
    case "room":
      filtered = data.roomOwner.filter(r =>
        r.tenantName.toLowerCase().includes(query) ||
        r.roomNumber.toLowerCase().includes(query)
      );
      displayRoomData(filtered);
      break;

    case "pg":
      filtered = data.pgOwner.filter(m =>
        m.memberName.toLowerCase().includes(query) ||
        m.bedNumber.toLowerCase().includes(query)
      );
      displayPgData(filtered);
      break;

    case "mess":
      filtered = data.messOwner.filter(rec =>
        rec.mealType.toLowerCase().includes(query) ||
        rec.date.toLowerCase().includes(query)
      );
      displayMessData(filtered);
      break;

    case "personal":
      filtered = data.personalExpenses.filter(exp =>
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query)
      );
      displayPersonalData(filtered);
      break;
  }
}
