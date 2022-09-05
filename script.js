const addBtns = document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns = document.querySelectorAll('.solid')
const addItemContainers = document.querySelectorAll('.add-container')
const addItems = document.querySelectorAll('.add-item')
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list')
const backlogList = document.getElementById('backlog-list')
const progressList = document.getElementById('progress-list')
const completeList = document.getElementById('complete-list')
const onHoldList = document.getElementById('on-hold-list')

// Items
let updateOnLoad = false
// Initialize Arrays
let backlogListArray = []
let progressListArray = []
let completeListArray = []
let onHoldListArray = []
let listArray = []
// Drag Functionality
let draggedItem
let currentColumn
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems)
    progressListArray = JSON.parse(localStorage.progressItems)
    completeListArray = JSON.parse(localStorage.completeItems)
    onHoldListArray = JSON.parse(localStorage.onHoldItems)
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax']
    progressListArray = ['Work on projects', 'Listen to music']
    completeListArray = ['Being cool', 'Getting stuff done']
    onHoldListArray = ['Being uncool']
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ]
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]))
  })
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li')
  listEl.classList.add('drag-item')
  listEl.draggable = true
  listEl.textContent = item
  listEl.contentEditable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`)
  // Append
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns()
  }
  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  })
  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true
  updateSavedColumns()
}

function updateItem(id, column) {
  const selectedArray = listArray[column]
  const selectedColumnEl = listColumns[column].children
  if (!selectedColumnEl[id].textContent) {
    delete selectedColumnEl[id]
  }
  console.log(selectedArray)
  updateDOM()
}

function addToColumn(column) {
  const itemText = addItems[column].textContent
  const selectedArray = listArray[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM()
}
// show add item input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

// hide add item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

// Allow array to reflect drag and drop
function rebuildArrays() {
  backlogListArray = []
  progressListArray = []
  completeListArray = []
  onHoldListArray = []
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}

// When Item starts dragging
function drag(e) {
  draggedItem = e.target
}
// Column Allow Drop for Item to DROP
function allowDrop(e) {
  e.preventDefault()
}
// When Item enter Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column
}
function drop(e) {
  e.preventDefault()
  // remove background color padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  // Add Item to column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  rebuildArrays()
}

// On load
updateDOM()
