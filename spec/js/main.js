function openTask() {
  const sidePanel = document.querySelector(".side-panel");
  if (!Array.from(sidePanel.classList).includes("open")) {
    sidePanel.classList.add("open");
  }
}

function closeTask() {
  const sidePanel = document.querySelector(".side-panel");
  if (Array.from(sidePanel.classList).includes("open")) {
    sidePanel.classList.remove("open");
  }
}

function openDropdown(event) {
  event.stopPropagation();
  const dropMenu = document.querySelector(".drop-menu");
  if (!Array.from(dropMenu.classList).includes("open")) {
    dropMenu.classList.add("open");
  }
}

function closeDropdown(event) {
  event.stopPropagation();
  const dropMenu = document.querySelector(".drop-menu");
  if (Array.from(dropMenu.classList).includes("open")) {
    dropMenu.classList.remove("open");
  }
}

function swichTheme() {
  const switchIcon = document.querySelector("img.theme-switch");
  const isDark = Array.from(document.body.classList).includes("dark");
  if (isDark) {
    document.body.classList.remove("dark");
    switchIcon.src = "images/icon-moon.svg";
  } else {
    document.body.classList.add("dark");
    switchIcon.src = "images/icon-sun.svg";
  }
}

function hide(elem) {
  if (!Array.from(elem.classList).includes("hidden")) {
    elem.classList.add("hidden");
  }
}

function unhide(elem) {
  if (Array.from(elem.classList).includes("hidden")) {
    elem.classList.remove("hidden");
  }
}

function activate(elem) {
  if (!Array.from(elem.classList).includes("active")) {
    elem.classList.add("active");
  }
}

function deactivate(elem) {
  if (Array.from(elem.classList).includes("active")) {
    elem.classList.remove("active");
  }
}

function filterTasks(filter) {
  return function (event) {
    event.stopPropagation();

    const filterBtns = document.querySelectorAll(
      ".button-group.filter button.text"
    );
    filterBtns.forEach((item) => {
      const match = item.textContent.toLowerCase() === filter.replace("-", " ");
      if (match) activate(item);
      else deactivate(item);
    });

    const taskItems = document.querySelectorAll(".task-item");
    taskItems.forEach((item) => {
      if (filter === "all") return unhide(item);
      if (Array.from(item.classList).includes(filter)) return unhide(item);
      return hide(item);
    });
  };
}

function setupFilters() {
  const filterBtns = document.querySelectorAll(
    ".button-group.filter button.text"
  );

  filterBtns[0].addEventListener("click", filterTasks("all"));
  filterBtns[1].addEventListener("click", filterTasks("open"));
  filterBtns[2].addEventListener("click", filterTasks("in-progress"));
  filterBtns[3].addEventListener("click", filterTasks("blocked"));
  filterBtns[4].addEventListener("click", filterTasks("done"));
}

function main() {
  const taskItems = document.querySelectorAll(".task-item");
  taskItems.forEach((item) => item.addEventListener("click", openTask));

  const sidePanel = document.querySelector(".side-panel");
  const closeBtn = sidePanel.querySelector(".close-panel");
  closeBtn.addEventListener("click", closeTask);

  const assigneeBtn = document.querySelector(".assignee-row");
  assigneeBtn.addEventListener("click", openDropdown);

  const optionItems = document.querySelectorAll(".option-item");
  optionItems.forEach((item) => item.addEventListener("click", closeDropdown));

  const themeSwitch = document.querySelector(".theme-switch");
  themeSwitch.addEventListener("click", swichTheme);

  setupFilters();
}

main();
