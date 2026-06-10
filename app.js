const STORAGE_KEY = "dual-schedule-data-v1";
const DEFAULT_PASSWORD = "1234";

const state = {
  monthCursor: new Date(),
  data: loadData(),
};

const elements = {
  loginScreen: document.querySelector("#loginScreen"),
  appScreen: document.querySelector("#appScreen"),
  loginForm: document.querySelector("#loginForm"),
  loginMessage: document.querySelector("#loginMessage"),
  passwordInput: document.querySelector("#passwordInput"),
  logoutButton: document.querySelector("#logoutButton"),
  changePasswordButton: document.querySelector("#changePasswordButton"),
  passwordDialog: document.querySelector("#passwordDialog"),
  passwordForm: document.querySelector("#passwordForm"),
  newPasswordInput: document.querySelector("#newPasswordInput"),
  cancelPasswordButton: document.querySelector("#cancelPasswordButton"),
  prevMonthButton: document.querySelector("#prevMonthButton"),
  nextMonthButton: document.querySelector("#nextMonthButton"),
  todayButton: document.querySelector("#todayButton"),
  currentMonthLabel: document.querySelector("#currentMonthLabel"),
  personOneName: document.querySelector("#personOneName"),
  personTwoName: document.querySelector("#personTwoName"),
  personSelect: document.querySelector("#personSelect"),
  shiftForm: document.querySelector("#shiftForm"),
  shiftDate: document.querySelector("#shiftDate"),
  shiftType: document.querySelector("#shiftType"),
  shiftNote: document.querySelector("#shiftNote"),
  calendarGrid: document.querySelector("#calendarGrid"),
};

init();

function init() {
  state.monthCursor.setDate(1);
  bindEvents();

  showLogin();
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.logoutButton.addEventListener("click", logout);
  elements.changePasswordButton.addEventListener("click", openPasswordDialog);
  elements.cancelPasswordButton.addEventListener("click", () => elements.passwordDialog.close());
  elements.passwordForm.addEventListener("submit", saveNewPassword);

  elements.prevMonthButton.addEventListener("click", () => changeMonth(-1));
  elements.nextMonthButton.addEventListener("click", () => changeMonth(1));
  elements.todayButton.addEventListener("click", goToCurrentMonth);
  elements.shiftForm.addEventListener("submit", addShift);

  elements.personOneName.addEventListener("input", () => updatePersonName(0, elements.personOneName.value));
  elements.personTwoName.addEventListener("input", () => updatePersonName(1, elements.personTwoName.value));

  elements.calendarGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-shift");
    if (!button) return;
    deleteShift(button.dataset.id);
  });
}

function handleLogin(event) {
  event.preventDefault();
  const password = elements.passwordInput.value.trim();

  if (password !== state.data.password) {
    elements.loginMessage.textContent = "密碼不正確，請再試一次。";
    return;
  }

  elements.passwordInput.value = "";
  elements.loginMessage.textContent = "";
  showApp();
}

function showLogin() {
  elements.loginScreen.hidden = false;
  elements.appScreen.hidden = true;
  elements.passwordInput.focus();
}

function showApp() {
  elements.loginScreen.hidden = true;
  elements.appScreen.hidden = false;
  syncPeopleInputs();
  render();
}

function logout() {
  showLogin();
}

function openPasswordDialog() {
  elements.newPasswordInput.value = "";
  elements.passwordDialog.showModal();
  elements.newPasswordInput.focus();
}

function saveNewPassword(event) {
  event.preventDefault();
  state.data.password = elements.newPasswordInput.value;
  saveData();
  elements.passwordDialog.close();
}

function changeMonth(delta) {
  state.monthCursor.setMonth(state.monthCursor.getMonth() + delta);
  render();
}

function goToCurrentMonth() {
  state.monthCursor = new Date();
  state.monthCursor.setDate(1);
  render();
}

function syncPeopleInputs() {
  elements.personOneName.value = state.data.people[0].name;
  elements.personTwoName.value = state.data.people[1].name;
  updatePersonOptions();
}

function updatePersonName(index, name) {
  state.data.people[index].name = name.trim() || `第 ${index + 1} 位`;
  saveData();
  updatePersonOptions();
  renderCalendar();
}

function updatePersonOptions() {
  elements.personSelect.replaceChildren(
    ...state.data.people.map((person, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = person.name;
      return option;
    }),
  );
}

function addShift(event) {
  event.preventDefault();

  const personIndex = Number(elements.personSelect.value);
  const type = elements.shiftType.value;
  const note = elements.shiftNote.value.trim();

  state.data.shifts.push({
    id: crypto.randomUUID(),
    date: elements.shiftDate.value,
    personIndex,
    type,
    note,
  });

  state.data.shifts.sort((a, b) => a.date.localeCompare(b.date) || a.personIndex - b.personIndex);
  saveData();
  elements.shiftNote.value = "";
  render();
}

function deleteShift(id) {
  state.data.shifts = state.data.shifts.filter((shift) => shift.id !== id);
  saveData();
  renderCalendar();
}

function render() {
  renderHeader();
  renderCalendar();
}

function renderHeader() {
  const year = state.monthCursor.getFullYear();
  const month = state.monthCursor.getMonth() + 1;
  elements.currentMonthLabel.textContent = `${year} 年 ${month} 月`;
  elements.shiftDate.value = toDateInputValue(new Date(year, month - 1, new Date().getDate()));
}

function renderCalendar() {
  const year = state.monthCursor.getFullYear();
  const month = state.monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const cells = [];
  const todayValue = toDateInputValue(new Date());

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateValue = toDateInputValue(date);
    const dayShifts = state.data.shifts.filter((shift) => shift.date === dateValue);

    const cell = document.createElement("article");
    cell.className = "day-cell";
    if (date.getMonth() !== month) cell.classList.add("is-muted");
    if (dateValue === todayValue) cell.classList.add("is-today");

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.innerHTML = `<span>${date.getDate()}</span>${dateValue === todayValue ? '<span class="today-pill">今天</span>' : ""}`;

    const shiftList = document.createElement("div");
    shiftList.className = "shift-list";

    dayShifts.forEach((shift) => {
      const person = state.data.people[shift.personIndex] || state.data.people[0];
      const item = document.createElement("div");
      item.className = `shift-item person-${shift.personIndex}`;
      item.dataset.type = shift.type;

      const text = document.createElement("span");
      text.className = "shift-text";
      text.textContent = `${person.name}：${shift.type}${shift.note ? `｜${shift.note}` : ""}`;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-shift";
      deleteButton.type = "button";
      deleteButton.dataset.id = shift.id;
      deleteButton.setAttribute("aria-label", `刪除 ${person.name} ${shift.type}`);
      deleteButton.textContent = "×";

      item.append(text, deleteButton);
      shiftList.append(item);
    });

    cell.append(dayNumber, shiftList);
    cells.push(cell);
  }

  elements.calendarGrid.replaceChildren(...cells);
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      password: DEFAULT_PASSWORD,
      people: [{ name: "第一位" }, { name: "第二位" }],
      shifts: [],
    };
  }

  try {
    const data = JSON.parse(saved);
    return {
      password: data.password || DEFAULT_PASSWORD,
      people: Array.isArray(data.people) && data.people.length >= 2 ? data.people.slice(0, 2) : [{ name: "第一位" }, { name: "第二位" }],
      shifts: Array.isArray(data.shifts) ? data.shifts : [],
    };
  } catch {
    return {
      password: DEFAULT_PASSWORD,
      people: [{ name: "第一位" }, { name: "第二位" }],
      shifts: [],
    };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
