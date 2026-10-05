// ─── Frontend-only Authentication ─────────────────────────────────────────────

const LOGIN_KEY = "focusmate_logged_in";
const USER_KEY = "focusmate_user";

function isLoggedIn() {
  return localStorage.getItem(LOGIN_KEY) === "true";
}

function showLoginScreen() {
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("app");

  if (!loginScreen) return;

  app.style.display = "none";

  loginScreen.innerHTML = `
    <div class="login-screen">
      <div class="login-container">

        <div class="login-brand">
          <div class="login-logo">F</div>
          <h1>FocusMate AI</h1>
          <p>Your adaptive study & productivity workspace</p>
        </div>

        <div class="login-card">

          <div class="login-card-title">
            Welcome back
          </div>

          <div class="login-card-subtitle">
            Sign in to continue to your workspace.
          </div>

          <div id="login-error" class="login-error"></div>

          <form id="login-form">

            <div class="login-field">
              <label for="login-email">
              <div class="login-field">
  <label for="login-name">
    Your name
  </label>

  <input
    id="login-name"
    class="login-input"
    type="text"
    placeholder="Enter your name"
    autocomplete="name"
    maxlength="60"
    required
  >
</div>
                Gmail / Email
              </label>

              <input
                id="login-email"
                class="login-input"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                required
              >
            </div>

            <div class="login-field">
              <label for="login-password">
                Password
              </label>

              <div class="login-password-wrap">

                <input
                  id="login-password"
                  class="login-input"
                  type="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                >

                <button
                  type="button"
                  id="toggle-password"
                  class="login-password-toggle"
                  aria-label="Show password"
                >
                  👁
                </button>

              </div>
            </div>

            <div class="login-options">

              <label class="login-remember">
                <input type="checkbox" id="remember-login" checked>
                <span>Remember me</span>
              </label>

              <a class="login-forgot" id="forgot-password">
                Forgot password?
              </a>

            </div>

            <button
              type="submit"
              class="login-btn"
            >
              Login
            </button>

          </form>

          <div class="login-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            id="google-login"
            class="google-login-btn"
          >
            <span class="google-icon">G</span>
            Continue with Google
          </button>

          <div class="login-footer">
            Frontend demo authentication · No real credentials are verified.
          </div>

        </div>

      </div>
    </div>
  `;

  bindLoginEvents();
}

function bindLoginEvents() {
  const form = document.getElementById("login-form");
const nameInput = document.getElementById("login-name");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
  const error = document.getElementById("login-error");
  const togglePassword = document.getElementById("toggle-password");
  const googleButton = document.getElementById("google-login");
  const forgotPassword = document.getElementById("forgot-password");

  // Login
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
const email = emailInput.value.trim();
const password = passwordInput.value.trim();

error.classList.remove("show");

if (!name || !email || !password) {
  error.textContent = "Please enter your name, email and password.";
  error.classList.add("show");
  return;
}

if (!emailInput.checkValidity()) {
  error.textContent = "Please enter a valid email address.";
  error.classList.add("show");
  return;
}

    if (!emailInput.checkValidity()) {
      error.textContent = "Please enter a valid email address.";
      error.classList.add("show");
      return;
    }

    // Frontend-only login
    localStorage.setItem(LOGIN_KEY, "true");
    localStorage.setItem(
  USER_KEY,
  JSON.stringify({
    email: email,
    name: name
  })
);

state.settings.displayName = name;
saveData(state);

showApplication();
  });

  // Show / hide password
  togglePassword?.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.textContent = "🙈";
      togglePassword.setAttribute("aria-label", "Hide password");
    } else {
      passwordInput.type = "password";
      togglePassword.textContent = "👁";
      togglePassword.setAttribute("aria-label", "Show password");
    }
  });

  // Frontend Google login
  googleButton?.addEventListener("click", () => {

  const name = prompt("Enter your name:");
  if (!name) return;

  const email = prompt("Enter your Gmail address:");
  if (!email) return;

  if (!email.includes("@")) {
    error.textContent = "Please enter a valid Gmail address.";
    error.classList.add("show");
    return;
  }

  localStorage.setItem(
  USER_KEY,
  JSON.stringify({
    email: email,
    name: name
  })
);

state.settings.displayName = name;
saveData(state);

showApplication();
});

  // Forgot password
  forgotPassword?.addEventListener("click", (event) => {
    event.preventDefault();

    error.textContent =
      "This is a frontend-only login. Password recovery is not connected to a real email service.";

    error.classList.add("show");
  });
}

function showApplication() {
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("app");

  if (loginScreen) {
    loginScreen.innerHTML = "";
    loginScreen.style.display = "none";
  }

  app.style.display = "";

  render();
}
import { state } from "./state.js";
import { loadData, saveData } from "./storage.js";
import { layout, showToast, openModal, closeModal, escapeHtml, formatDate, priorityBadge, statusBadge } from "./ui.js";
import { renderTasksPage, createTaskModal, handleTaskAction, applyTaskFilters, taskStats } from "./tasks.js";
import { renderPlannerPage, createPlanModal, plannerAction, handlePlannerPageEvents } from "./planner.js";
import { timerView, timerAction, setTimerMode, setupTimer, bindTimerLinkEvents } from "./timer.js";
import { renderGoalsPage, createGoalModal, goalAction } from "./goals.js";
import { renderAnalyticsPage } from "./analytics.js";
import { renderAssistantPage, submitAssistant } from "./assistant.js";
import { renderSettingsPage, settingsAction } from "./settings.js";
import { recommendNextTask, getStudyDebt, generateDailyPlan, slotToTime } from "./recommend.js";

// Bootstrap
Object.assign(state, loadData());
// Ensure arrays exist for new fields
if (!state.focusSessions) state.focusSessions = [];
if (!state.exams) state.exams = [];
if (!state.dailyPlan) state.dailyPlan = [];
setupTimer();

// ─── Utilities ────────────────────────────────────────────────────────────────
function dateLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long", month: "long", day: "numeric"
  }).format(new Date());
}

function greetingText() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const stats = taskStats();
  const open = state.tasks.filter(t => t.status !== "Completed");
  const dueToday = open.filter(t => t.dueDate === today);
  const upcoming = [...open]
    .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"))
    .slice(0, 5);
  const focusMin = Math.floor(state.timer.totalFocusSeconds / 60);
  const recommendation = recommendNextTask();
  const debt = getStudyDebt();

  return `
    <section>
      <!-- Greeting -->
      <div class="dashboard-greeting">
        <div>
          <div class="text-xs text-muted mb-1">${dateLabel()}</div>
          <h2 class="page-title">${greetingText()}, ${escapeHtml(state.settings.displayName)}.</h2>
          <p class="page-subtitle">Here's what deserves your attention today.</p>
        </div>
        <div class="flex gap-2">
          <a href="#focus" class="btn btn-secondary">Start focus</a>
          <button class="btn btn-primary" data-action="create-task">+ New task</button>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="stat-grid stat-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-label">Open tasks</div>
          <div class="stat-number">${open.length}</div>
        </div>
        <div class="stat-card ${dueToday.length > 0 ? "stat-card-warning" : ""}">
          <div class="stat-label">Due today</div>
          <div class="stat-number">${dueToday.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completion</div>
          <div class="stat-number">${stats.completionRate}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Focus time</div>
          <div class="stat-number">${focusMin}<span class="stat-unit">m</span></div>
        </div>
      </div>

      <!-- Recommended next task + study debt -->
      ${recommendation ? renderRecommendedTask(recommendation, debt) : ""}

      <!-- Today's due tasks + Upcoming split -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div class="surface p-5">
          <div class="surface-header mb-4">
            <h3 class="surface-title">Due today</h3>
            <a href="#tasks" class="text-xs text-accent">All tasks →</a>
          </div>
          ${dueToday.length
            ? dueToday.map(t => miniTask(t)).join("")
            : `<div class="py-8 text-center"><p class="font-medium text-sm">Nothing due today.</p><p class="text-xs text-muted mt-1">Add a task or enjoy the clear schedule.</p></div>`}
        </div>

        <div class="surface p-5">
          <div class="surface-header mb-4">
            <h3 class="surface-title">Upcoming</h3>
            <a href="#tasks" class="text-xs text-accent">View all →</a>
          </div>
          ${upcoming.length
            ? upcoming.map(t => miniTask(t)).join("")
            : `<div class="py-8 text-center"><p class="font-medium text-sm">Your queue is clear.</p><p class="text-xs text-muted mt-1">Create tasks to start planning ahead.</p></div>`}
        </div>
      </div>

      <!-- Goals progress summary -->
      ${state.goals.length > 0 ? `
        <div class="surface p-5">
          <div class="surface-header mb-4">
            <h3 class="surface-title">Goals</h3>
            <a href="#goals" class="text-xs text-accent">Manage goals →</a>
          </div>
          <div class="space-y-4">
            ${state.goals.filter(g => g.progress < 100).slice(0, 3).map(g => `
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>${escapeHtml(g.title)}</span>
                  <span class="text-muted">${g.progress}%${g.deadline ? ` · ${formatDate(g.deadline)}` : ""}</span>
                </div>
                <div class="progress-track"><div class="progress-fill" style="width:${g.progress}%"></div></div>
              </div>`).join("")}
          </div>
        </div>` : ""}
    </section>`;
}

function renderRecommendedTask(rec, debt) {
  const { task, reasons } = rec;
  const reasonStr = reasons.map(r => r).join(" · ") || "highest overall urgency";

  return `
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
      <div class="surface p-5 recommended-card">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="rec-label">Recommended next</span>
              <span class="prototype-badge">Rule-based</span>
            </div>
            <h3 class="font-semibold text-base mb-1">${escapeHtml(task.title)}</h3>
            <div class="flex flex-wrap gap-2 mb-3">
              ${priorityBadge(task.priority)}
              ${statusBadge(task.status)}
              <span class="text-xs text-muted">${escapeHtml(task.category)} · ${formatDate(task.dueDate)}${task.estimatedMinutes ? ` · ${task.estimatedMinutes} min` : ""}</span>
            </div>
            <div class="rec-why">
              <span class="rec-why-label">Why this task?</span>
              <span>${reasonStr}.</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary" data-rec-focus="${task.id}">Start focus session</button>
          <button class="btn btn-secondary" data-task-details="${task.id}">View task</button>
        </div>
      </div>

      <div class="surface p-5">
        <div class="surface-title mb-2">Progress</div>
        <div class="text-center my-4">
          <div class="text-4xl font-semibold">${taskStats().completionRate}%</div>
          <div class="text-xs text-muted mt-1">Tasks completed</div>
        </div>
        <div class="progress-track mb-4">
          <div class="progress-fill" style="width:${taskStats().completionRate}%"></div>
        </div>
        ${debt.count > 0 ? `
          <div class="debt-chip">
            <span class="debt-dot"></span>
            <span class="text-xs">${debt.count} overdue/postponed · ~${debt.estimatedMinutes} min</span>
            <a href="#assistant" class="text-xs text-accent ml-auto">Plan recovery →</a>
          </div>` : ""}
        <div class="flex justify-between text-sm mt-3">
          <div>
            <div class="text-xs text-muted">Active goals</div>
            <div class="font-medium mt-1">${state.goals.filter(g => g.progress < 100).length}</div>
          </div>
          <div>
            <div class="text-xs text-muted">Sessions</div>
            <div class="font-medium mt-1">${state.timer.sessions}</div>
          </div>
          <div>
            <div class="text-xs text-muted">Focus time</div>
            <div class="font-medium mt-1">${Math.floor(state.timer.totalFocusSeconds / 60)}m</div>
          </div>
        </div>
      </div>
    </div>`;
}

function miniTask(t) {
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = t.dueDate && t.dueDate < today && t.status !== "Completed";
  return `
    <div class="mini-task-row">
      <div class="min-w-0 flex-1">
        <button class="mini-task-title" data-task-details="${t.id}">${escapeHtml(t.title)}</button>
        <div class="text-xs text-muted mt-0.5">${escapeHtml(t.category)} · <span class="${isOverdue ? "text-error" : ""}">${formatDate(t.dueDate)}</span></div>
      </div>
      ${priorityBadge(t.priority)}
    </div>`;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  if (!isLoggedIn()) {
    showLoginScreen();
    return;
  }

  state.currentPage = location.hash.replace("#", "") || "dashboard";

  const pages = {
    dashboard: [dashboard(), "Dashboard"],
    tasks:     [renderTasksPage(), "Tasks"],
    planner:   [renderPlannerPage(), "Study Planner"],
    focus:     [timerView(), "Focus Mode"],
    goals:     [renderGoalsPage(), "Goals"],
    analytics: [renderAnalyticsPage(), "Analytics"],
    assistant: [renderAssistantPage(), "AI Assistant"],
    settings:  [renderSettingsPage(), "Settings"]
  };

  const [content, title] = pages[state.currentPage] || pages.dashboard;
  document.getElementById("app").innerHTML = layout(content, title);
  bindGlobalEvents();
}

// ─── Event binding ────────────────────────────────────────────────────────────
function bindGlobalEvents() {
  // Logout
document.querySelector("[data-action='logout']")?.addEventListener("click", () => {
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(USER_KEY);
  location.hash = "";
  showLoginScreen();
});
  // Sidebar toggle
  const menuBtn = document.getElementById("mobile-menu");
const sidebar = document.getElementById("sidebar");

menuBtn?.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");

  menuBtn.setAttribute(
    "aria-expanded",
    String(!isCollapsed)
  );
});
  // Close sidebar on nav click (mobile)
  document.querySelectorAll(".nav-item").forEach(a => {
  a.addEventListener("click", () => sidebar?.classList.remove("collapsed"));
});

  // Global task actions
  document.querySelectorAll("[data-action='create-task']").forEach(b => {
    b.addEventListener("click", () => createTaskModal());
  });
  document.querySelectorAll("[data-action='create-plan']").forEach(b => {
    b.addEventListener("click", () => createPlanModal());
  });
  document.querySelectorAll("[data-action='create-goal']").forEach(b => {
    b.addEventListener("click", () => createGoalModal());
  });

  // Task row actions
  document.querySelectorAll("[data-task-toggle]").forEach(el => {
    el.addEventListener("change", () => handleTaskAction("toggle", el.dataset.taskToggle));
  });
  document.querySelectorAll("[data-task-edit]").forEach(el => {
    el.addEventListener("click", () => handleTaskAction("edit", el.dataset.taskEdit));
  });
  document.querySelectorAll("[data-task-delete]").forEach(el => {
    el.addEventListener("click", () => handleTaskAction("delete", el.dataset.taskDelete));
  });
  document.querySelectorAll("[data-task-details]").forEach(el => {
    el.addEventListener("click", () => handleTaskAction("details", el.dataset.taskDetails));
  });

  // Task filters (re-render task list without full page reload)
  ["task-search", "task-status", "task-priority", "task-sort"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "task-search" ? "input" : "change", () => {
      applyTaskFilters();
      const listEl = document.getElementById("task-list");
      if (listEl) {
        // Lightweight re-render: only the task list
        import("./tasks.js").then(({ renderTasksPage: _ }) => { render(); });
      }
    });
  });

  // Planner
  document.querySelectorAll("[data-plan-delete]").forEach(el => {
    el.addEventListener("click", () => plannerAction("delete", el.dataset.planDelete));
  });
  document.querySelectorAll("[data-topic-toggle]").forEach(el => {
    el.addEventListener("change", () => plannerAction("toggle", el.dataset.topicToggle));
  });
  document.querySelectorAll("[data-add-topic]").forEach(el => {
    el.addEventListener("click", () => plannerAction("add", el.dataset.addTopic));
  });
  handlePlannerPageEvents();

  // Timer
  document.querySelectorAll("[data-timer]").forEach(el => {
    el.addEventListener("click", () => { timerAction(el.dataset.timer); render(); });
  });
  document.querySelectorAll("[data-timer-mode]").forEach(el => {
    el.addEventListener("click", () => { setTimerMode(el.dataset.timerMode); render(); });
  });
  bindTimerLinkEvents();

  // Goals
  document.querySelectorAll("[data-goal-delete]").forEach(el => {
    el.addEventListener("click", () => goalAction("delete", el.dataset.goalDelete));
  });
  document.querySelectorAll("[data-goal-progress]").forEach(el => {
    el.addEventListener("click", () => goalAction("progress", el.dataset.goalProgress));
  });
  document.querySelectorAll("[data-goal-plan]").forEach(el => {
    el.addEventListener("click", () => goalAction("plan", el.dataset.goalPlan));
  });

  // Dashboard recommended task → start focus
  document.querySelectorAll("[data-rec-focus]").forEach(el => {
    el.addEventListener("click", () => {
      state.timer.linkedTaskId = el.dataset.recFocus;
      location.hash = "focus";
    });
  });

  // Assistant
  document.querySelectorAll("[data-assistant-prompt]").forEach(el => {
    el.addEventListener("click", () => submitAssistant(el.dataset.assistantPrompt));
  });
  document.getElementById("assistant-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("assistant-input");
    if (input?.value.trim()) submitAssistant(input.value);
  });

  // Settings
  document.querySelectorAll("[data-setting-save]").forEach(el => {
    el.addEventListener("click", () => settingsAction(el.dataset.settingSave));
  });
  document.getElementById("setting-notifications")?.addEventListener("change", () => {
    settingsAction("notifications");
  });
  document.querySelector("[data-setting-reset]")?.addEventListener("click", () => {
    settingsAction("reset");
  });

  // Global search
  document.querySelector("[data-action='global-search']")?.addEventListener("click", () => {
    openModal({
      title: "Search workspace",
      body: `
        <div class="form-field">
          <div class="filter-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="filter-search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="global-search-input" class="input filter-search-input" placeholder="Search tasks, goals, and topics…" autocomplete="off" aria-label="Search">
          </div>
        </div>
        <div id="global-search-results" class="mt-3" aria-live="polite"></div>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Close</button>`
    });

    const input = document.getElementById("global-search-input");
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      const allItems = [
        ...state.tasks.map(x => ({ type: "Task", title: x.title, sub: x.category, href: "tasks" })),
        ...state.goals.map(x => ({ type: "Goal", title: x.title, sub: `${x.progress}% complete`, href: "goals" })),
        ...state.studyPlans.flatMap(p => p.topics.map(t => ({
          type: "Topic", title: t.name, sub: p.subject, href: "planner"
        })))
      ].filter(x => !q || `${x.title} ${x.sub}`.toLowerCase().includes(q));

      const resultsEl = document.getElementById("global-search-results");
      if (!resultsEl) return;
      resultsEl.innerHTML = allItems.length
        ? allItems.slice(0, 10).map(x => `
            <a href="#${x.href}" class="search-result-row" data-modal-close>
              <div>
                <div class="font-medium text-sm">${escapeHtml(x.title)}</div>
                <div class="text-xs text-muted">${escapeHtml(x.sub)}</div>
              </div>
              <span class="badge badge-neutral">${x.type}</span>
            </a>`).join("")
        : `<p class="text-muted text-sm text-center py-6">${q ? "No results for that search." : "Start typing to search…"}</p>`;

      resultsEl.querySelectorAll("[data-modal-close]").forEach(el => {
        el.addEventListener("click", closeModal);
      });
    });

    input.focus();
  });
}

// ─── Routing & timer loop ─────────────────────────────────────────────────────
window.addEventListener("hashchange", render);
window.addEventListener("load", render);

// Timer tick loop: only re-render on focus page when timer not updating DOM in-place
setInterval(() => {
  if (state.currentPage === "focus" && state.timer.running) {
    const display = document.getElementById("timer-display");
    if (!display) render();
  }
}, 1000);
