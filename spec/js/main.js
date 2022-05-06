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
}

main();
