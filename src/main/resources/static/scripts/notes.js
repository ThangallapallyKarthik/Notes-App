// ============================================================
// Notes App Frontend - JWT Auth + CRUD + Dark Mode
// ============================================================

// -----------------------------
// Utilities
// -----------------------------
function bearer() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

function setStatus(msg) {
  const el = document.getElementById("statusText");
  if (el) el.textContent = msg;
}

function ensureAuth() {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  }
}

function showToast(msg, type = "ok") {
  let toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function setBusy(isBusy) {
  const loader = document.getElementById("loader");
  loader.classList.toggle("show", isBusy);
}

// -----------------------------
// DOM Refs
// -----------------------------
const searchInput = document.getElementById("searchInput");
const colorFilter = document.getElementById("colorFilter");
const refreshBtn = document.getElementById("refreshBtn");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const countText = document.getElementById("countText");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteColor = document.getElementById("noteColor");
const createBtn = document.getElementById("createBtn");
const clearBtn = document.getElementById("clearBtn");
const createResult = document.getElementById("createResult");

// -----------------------------
// State
// -----------------------------
let allNotes = [];

// -----------------------------
// API Calls
// -----------------------------
async function loadNotes() {
  setBusy(true);
  setStatus("Loading…");
  try {
    const resp = await fetch(`${BASE_URL}/api/notes`, {
      headers: { "Content-Type": "application/json", ...bearer() },
    });

    if (resp.status === 401 || resp.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!resp.ok) throw new Error(`Failed to load notes (${resp.status})`);
    allNotes = await resp.json();
    applyFilter();
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    showToast("Failed to load notes", "err");
    renderNotes([]);
    setStatus("Error");
  } finally {
    setBusy(false);
  }
}

async function createNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  const color = noteColor.value;
  console.log("Creating note", { title, content, color });

  if (!title) {
    createResult.textContent = "⚠️ Title is required.";
    return;
  }

  setBusy(true);
  setStatus("Creating…");
  try {
    const resp = await fetch(`${BASE_URL}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...bearer() },
      body: JSON.stringify({ title, content, color }),
    });

    if (resp.status === 401 || resp.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(txt || "Failed to create note");
    }

    const data = await resp.json();
    allNotes.unshift(data);
    applyFilter();
    clearNewForm();
    createResult.textContent = "";
    showToast("✅ Note created!", "ok");
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    createResult.textContent = "❌ " + err.message;
    showToast(err.message, "err");
    setStatus("Error");
  } finally {
    setBusy(false);
  }
}

async function updateNote(id, payload) {
  setBusy(true);
  setStatus("Saving…");
  try {
    const resp = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...bearer() },
      body: JSON.stringify(payload),
    });

    if (resp.status === 401 || resp.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!resp.ok) throw new Error("Update failed");
    const updated = await resp.json();
    allNotes = allNotes.map(n => (n.id === id ? updated : n));
    applyFilter();
    showToast("💾 Saved", "ok");
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    showToast("❌ " + err.message, "err");
    setStatus("Error");
  } finally {
    setBusy(false);
  }
}

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  setBusy(true);
  setStatus("Deleting…");
  try {
    const resp = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...bearer() },
    });

    if (!resp.ok) throw new Error("Delete failed");

    allNotes = allNotes.filter(n => n.id !== id);
    applyFilter();
    showToast("🗑️ Deleted", "ok");
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    showToast("❌ " + err.message, "err");
    setStatus("Error");
  } finally {
    setBusy(false);
  }
}

// -----------------------------
// Rendering & Filtering
// -----------------------------
function applyFilter() {
  const q = (searchInput?.value || "").toLowerCase();
  const c = colorFilter?.value || "";

  const filtered = allNotes.filter(n => {
    const matchesQuery =
      !q ||
      n.title?.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q);
    const matchesColor = !c || n.color === c;
    return matchesQuery && matchesColor;
  });

  renderNotes(filtered);
}

function renderNotes(items) {
  notesGrid.innerHTML = "";
  countText.textContent = `${items.length} note${items.length === 1 ? "" : "s"}`;

  if (!items.length) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  for (const n of items) {
    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.innerHTML = `
      <span class="color-dot" style="background:${n.color || "#FFD166"}"></span>
      <span class="title">${n.title || "(Untitled)"}</span>
    `;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Updated: ${fmtDate(n.updatedAt)} • Created: ${fmtDate(n.createdAt)}`;

    const titleInput = document.createElement("input");
    titleInput.value = n.title || "";
    const colorSel = document.createElement("select");
    ["#FFD166","#06D6A0","#118AB2","#EF476F","#8338EC"].forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = colorName(c);
      if (c === n.color) opt.selected = true;
      colorSel.appendChild(opt);
    });

    const contentTa = document.createElement("textarea");
    contentTa.value = n.content || "";

    const actions = document.createElement("div");
    actions.className = "row";
    actions.style.justifyContent = "flex-end";

    const saveBtn = document.createElement("button");
    saveBtn.className = "primary";
    saveBtn.textContent = "Save";
    saveBtn.onclick = () =>
      updateNote(n.id, {
        title: titleInput.value.trim(),
        content: contentTa.value,
        color: colorSel.value,
      });

    const delBtn = document.createElement("button");
    delBtn.className = "danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteNote(n.id);

    actions.appendChild(saveBtn);
    actions.appendChild(delBtn);

    const editRow = document.createElement("div");
    editRow.className = "row";
    editRow.appendChild(titleInput);
    editRow.appendChild(colorSel);

    card.append(head, meta, contentTa, editRow, actions);
    notesGrid.appendChild(card);
  }
}

function colorName(hex) {
  switch (hex) {
    case "#FFD166": return "Yellow";
    case "#06D6A0": return "Green";
    case "#118AB2": return "Blue";
    case "#EF476F": return "Pink";
    case "#8338EC": return "Purple";
    default: return hex;
  }
}

function clearNewForm() {
  noteTitle.value = "";
  noteContent.value = "";
  noteColor.value = "#FFD166";
  createResult.textContent = "";
}

// -----------------------------
// DARK MODE
// -----------------------------
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  }

  themeToggle.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark");
    if (dark) {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀️ Light";
    } else {
      localStorage.removeItem("theme");
      themeToggle.textContent = "🌙 Dark";
    }
  });
}

// -----------------------------
// Init
// -----------------------------
ensureAuth();
createBtn?.addEventListener("click", createNote);
clearBtn?.addEventListener("click", clearNewForm);
refreshBtn?.addEventListener("click", loadNotes);
searchInput?.addEventListener("input", applyFilter);
colorFilter?.addEventListener("change", applyFilter);
document.addEventListener("DOMContentLoaded", loadNotes);
