updateSectionCounter = (section, name) ->
  counter = document.querySelector "[data-counter-for=\"#{name}\"]"
  return unless counter?
  checkboxes = section.querySelectorAll "input"
  count = 0
  for entry from checkboxes
    count += if entry.checked then 1 else 0
  counter.innerText = "(#{count}/#{checkboxes.length})"

initSection = (section, name) ->
  localStorageEntryName = "hk-completion-#{name}"
  checked = new Set()
  saved = localStorage.getItem localStorageEntryName
  try
    data = JSON.parse saved
    for item from data
      checked.add item
  catch error

  checks = section.querySelectorAll ".row-checkbox"
  for check from checks
    row = check.parentElement.parentElement
    if checked.has row.dataset.name
      row.querySelector("input").checked = true
      row.classList.toggle "row-cleared", true

    rowListener = (check) -> (evt) -> # bind check since there is no `let` in coffee
      return if evt.target is check
      check.dispatchEvent new MouseEvent("click")
    row.addEventListener "click", rowListener check

    check.addEventListener "change", (evt) ->
      row = evt.target.parentElement.parentElement
      row.classList.toggle "row-cleared", evt.target.checked
      updateSectionCounter section, name
      if evt.target.checked
        checked.add row.dataset.name
      else
        checked.delete row.dataset.name
      localStorage.setItem localStorageEntryName, JSON.stringify([...checked])
  updateSectionCounter section, name

sections = document.querySelectorAll "[data-section]"
for section from sections
  name = section.dataset.section
  continue unless name
  initSection section, name
