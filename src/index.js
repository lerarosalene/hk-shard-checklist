function initSection(section, name) {
  const localStorageEntryName = `hk-completion-${name}`;

  let checked = new Set();
  const saved = localStorage.getItem(localStorageEntryName);
  try {
    const data = JSON.parse(saved);
    for (let item of data) {
      checked.add(item);
    }
  } catch (error) {}

  const checks = section.querySelectorAll(".row-checkbox");
  for (const check of checks) {
    const row = check.parentElement.parentElement;
    if (checked.has(row.dataset.name)) {
      row.querySelector("input").checked = true;
      row.classList.toggle("row-cleared", true);
    }
    row.addEventListener("click", function (evt) {
      if (evt.target === check) {
        return;
      }
      check.dispatchEvent(new MouseEvent("click"));
    });
    check.addEventListener("change", function (evt) {
      const row = evt.target.parentElement.parentElement;
      row.classList.toggle("row-cleared", evt.target.checked);
      if (evt.target.checked) {
        checked.add(row.dataset.name);
      } else {
        checked.delete(row.dataset.name);
      }
      localStorage.setItem(localStorageEntryName, JSON.stringify([...checked]));
    });
  }
}

const sections = document.querySelectorAll("[data-section]");
for (let section of sections) {
  let name = section.dataset.section;
  if (!name) {
    continue;
  }
  initSection(section, name);
}
