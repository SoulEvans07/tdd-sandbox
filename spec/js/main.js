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
}

main();
