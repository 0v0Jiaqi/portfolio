let taskIndex = localStorage.getItem("taskIndex") || 0 // Card maximum index value
let taskList = JSON.parse(localStorage.getItem("taskList")) || [[], [], []]

console.log(taskIndex, taskList)

let clockTaskData = null // clock data
let clockTextarea = document.querySelector(".note_input").querySelector("textarea") // notes

/*****
 * Various page initializations
 * begin
 */

// Page initialization, rendering according to the card data stored in localStorage
function initTaskList() {
  taskList.forEach((item, index) => {
    // console.log(item)
    item.forEach((item2) => {
      console.log(document.querySelector(`.task_wrap${index + 1}`).querySelector(".task_list_wrap"))

      const newTask = dataToDoneTask(item2)
      document
        .querySelector(`.task_wrap${index + 1}`)
        .querySelector(".task_list_wrap")
        .appendChild(newTask)
    })
  })
}
initTaskList()

// Card event initialization (initialization when the page loads, add corresponding edit/delete/double-click events to each card)
function initEvent() {
  // document.querySelectorAll("#task_list_done").forEach((item) => {
  //   initTaskDoneEvent(item)
  // })

  document.querySelectorAll("#task_list_edit").forEach((item) => {
    initTaskEditEvent(item)
  })

  document.querySelectorAll(".task_list_delete").forEach((item) => {
    initTaskDeleteEvent(item)
  })

  document.querySelectorAll(".task_list").forEach((item) => {
    initTaskDblClickEvent(item)
  })
}

initEvent()

/******
 * Various page initializations
 * end
 */

// Add a new card, when you click the plus sign in each column, a new card to be edited will be added, which is implemented here
document.querySelectorAll(".task_add_wrap").forEach((item) => {
  item.onclick = function (e) {
    console.log(e.target.closest(".task_wrap").querySelector(".task_list_wrap"))
    let newTask = document.querySelector(".copy").cloneNode(true)
    newTask.classList.remove("copy")
    taskIndex++
    newTask.querySelector(".task_index").innerHTML = taskIndex
    // console.log(newTask)
    e.target.closest(".task_wrap").querySelector(".task_list_wrap").appendChild(newTask)
    // initEvent(newTask)
    initTaskDoneEvent(newTask.querySelector("#task_list_done"), true)
    initTaskDeleteEvent(newTask.querySelector(".task_list_delete"), true)

    e.target.closest(".task_add_wrap").style.display = "none"
  }
})

/*******
 * Card confirmation/edit/delete event initialization
 * begin
 */

// Data => Card: Render the card data in the taskList into a card
function dataToDoneTask(obj) {
  let newTaskDone = document.querySelector(".copy2").cloneNode(true)
  newTaskDone.classList.remove("copy2")
  newTaskDone.querySelector(".task_index").innerHTML = obj.id
  newTaskDone.querySelector(".first_details").innerHTML = obj.name
  newTaskDone.querySelector(".second_details").innerHTML = `DUE DAY: ${obj.date}`
  newTaskDone.querySelector(".third_details").innerHTML = `Estimated time: ${obj.time.hours}h ${obj.time.minutes}m`
  return newTaskDone
}

// Card determination event function flag: whether it is a new card
function initTaskDoneEvent(node, flag = false) {
  // console.log(flag)
  node.onclick = function (e) {
    // console.log(e.target.closest(".task_list"))
    let currentTaskCardIndex = Number(e.target.closest(".task_wrap").querySelector(".task_card_index").innerHTML)
    let currentTaskIndex = Number(e.target.closest(".task_list").querySelector(".task_index").innerHTML)
    console.log(currentTaskCardIndex, currentTaskIndex)

    let inputWrap = e.target.closest(".task_list").querySelector(".task_list_details")
    // console.log(inputWrap)
    let obj = {
      id: currentTaskIndex,
      name: inputWrap.querySelector("#text").value,
      date: inputWrap.querySelector("#date").value,
      time: {
        hours: Number(inputWrap.querySelector("#time_h").value),
        minutes: Number(inputWrap.querySelector("#time_m").value),
      },
      notes: "",
    }
    console.log(obj)
    // Check if it is complete
    if (obj.name.trim() === "" || obj.date === "" || (obj.time.hours === 0 && obj.time.minutes === 0)) {
      return
    }
    e.target.closest(".task_card_wrap").querySelector(".task_add_wrap").style.display = "block"

    let newTaskDone = dataToDoneTask(obj)
    e.target.closest(".task_list_wrap").replaceChild(newTaskDone, e.target.closest(".task_list"))

    if (flag) {
      taskList[currentTaskCardIndex].push(obj)
      if (obj.id > localStorage.getItem("taskIndex")) {
        localStorage.setItem("taskIndex", obj.id)
      }
    } else {
      for (let i = 0; i < taskList[currentTaskCardIndex].length; i++) {
        if (taskList[currentTaskCardIndex][i].id === currentTaskIndex) {
          obj.notes = taskList[currentTaskCardIndex][i].notes
          taskList[currentTaskCardIndex][i] = obj
          break
        }
      }
    }

    console.log(taskList)
    localStorage.setItem("taskList", JSON.stringify(taskList))
    // e.target.closest(".task_list").remove()
    initTaskEditEvent(newTaskDone.querySelector("#task_list_edit"))
    initTaskDeleteEvent(newTaskDone.querySelector(".task_list_delete"), true)
    initTaskDblClickEvent(newTaskDone)
  }
}

// Card edit event function
function initTaskEditEvent(node) {
  node.onclick = function (e) {
    let currentTaskCardIndex = Number(e.target.closest(".task_wrap").querySelector(".task_card_index").innerHTML)
    let currentTaskIndex = Number(e.target.closest(".task_list").querySelector(".task_index").innerHTML)
    let editObj = taskList[currentTaskCardIndex].find((item) => item.id === currentTaskIndex)
    console.log(editObj)
    let newTaskEdit = document.querySelector(".copy").cloneNode(true)
    newTaskEdit.classList.remove("copy")
    newTaskEdit.querySelector(".task_index").innerHTML = editObj.id
    newTaskEdit.querySelector("#text").value = editObj.name
    newTaskEdit.querySelector("#date").value = editObj.date
    newTaskEdit.querySelector("#time_h").value = editObj.time.hours
    newTaskEdit.querySelector("#time_m").value = editObj.time.minutes
    e.target.closest(".task_list_wrap").replaceChild(newTaskEdit, e.target.closest(".task_list"))
    initTaskDoneEvent(newTaskEdit.querySelector("#task_list_done"))
    initTaskDeleteEvent(newTaskEdit.querySelector(".task_list_delete"))
  }
}

// Card deletion event function flag: whether it is a new card
function initTaskDeleteEvent(node, flag = false) {
  // console.log(flag)
  node.onclick = function (e) {
    console.log(e.target.closest(".task_list"))
    if (flag) {
      e.target.closest(".task_wrap").querySelector(".task_add_wrap").style.display = "block"
    } else {
      let currentTaskCardIndex = Number(e.target.closest(".task_wrap").querySelector(".task_card_index").innerHTML)
      let currentTaskIndex = Number(e.target.closest(".task_list").querySelector(".task_index").innerHTML)
      for (let i = 0; i < taskList[currentTaskCardIndex].length; i++) {
        if (taskList[currentTaskCardIndex][i].id === currentTaskIndex) {
          taskList[currentTaskCardIndex].splice(i, 1)
          break
        }
      }
      console.log(taskList)
      localStorage.setItem("taskList", JSON.stringify(taskList))
    }
    e.target.closest(".task_list").remove()
  }
}

/*******
 * Card confirmation/edit/delete event initialization
 * end
 */

/******
 * card drag
 * begin
 */

// Node Insertion Function
function insertAfter(newNode, curNode) {
  curNode.parentNode.insertBefore(newNode, curNode.nextElementSibling)
}

let draggedTask = null
let dragOrigin = null
let dragTarget = null

// Card drag start event
document.querySelector(".card_wrap").ondragstart = function (e) {
  // console.log(e.target)
  draggedTask = e.target
  dragOrigin = e.target.closest(".task_wrap")
  e.target.style.opacity = 0.5
}

// Card drag end event
document.querySelector(".card_wrap").ondragend = function (e) {
  // console.log(e.target)
  e.target.style.opacity = 1
}

// Prevent the card from returning to its original position after dragging
function taskDragOver(node) {
  node.ondragover = function (e) {
    e.preventDefault()
  }
}

function updateData2() {
  // let originNum = Number(draggedTask.querySelector(".task_index").innerHTML)
  // let originRowNum = Number(dragOrigin.querySelector(".task_card_index").innerHTML)
  // console.log(originNum, originRowNum, taskList)
  // for (let i = 0; i < taskList[originRowNum].length; i++) {
  //   if (taskList[originRowNum][i].id === originNum) {
  //     taskList[originRowNum].splice(i, 1)
  //     break
  //   }
  // }
  // return

  // let tempListArr = [...taskList[0], ...taskList[1], ...taskList[2]]
  let tempListSet = []
  let tempListArr = []
  taskList.forEach((item) => {
    item.forEach((item2) => {
      tempListSet.push(JSON.stringify(item2))
    })
  })
  Array.from(new Set(tempListSet)).forEach((item) => {
    tempListArr.push(JSON.parse(item))
  })
  console.log(tempListArr)
  // console.log(dragOrigin, dragTarget)
  // console.log(tempListArr)

  // Drag and drop update function: when the card drag is completed, update the two columns of card data dragged (new method)
  // Update the data according to the DOM node, and solve the bug of data update failure when the drag event is not successfully triggered
  function updateData(node) {
    let rowNum = Number(node.querySelector(".task_card_index").innerHTML)
    let rowArr = []
    node.querySelectorAll(".task_index").forEach((item) => {
      rowArr.push(Number(item.innerHTML))
    })

    // let tempListArr = [...taskList[0], ...taskList[1], ...taskList[2]]
    console.log(node, rowNum, rowArr, tempListArr)

    let temp = []
    rowArr.forEach((item) => {
      temp.push(tempListArr.find((item2) => item2.id === item))
    })
    // console.log(temp)
    taskList[rowNum] = temp
    // console.log(taskList)
    localStorage.setItem("taskList", JSON.stringify(taskList))
  }
  updateData(dragOrigin)
  updateData(dragTarget)
}

// During the card dragging process, move the card to the target, add and delete it
function taskDropEnter(node) {
  node.ondragenter = function (e) {
    // console.log(e.target)
    dragTarget = e.target.closest(".task_wrap")
    // return

    if (e.target.closest(".task_list")) {
      // console.log(e.target.closest(".task_list"))
      insertAfter(draggedTask, e.target.closest(".task_list"))
      // updateData2()
    } else if (e.target.className === "task_list_wrap") {
      // console.log(e.target.querySelector(".task_list"), "?????")
      e.target.insertBefore(draggedTask, e.target.querySelector(".task_list"))
      // updateData2()
    }
  }
}

// When the card dragging ends (the mouse is released), update the card data to localStorage to ensure that the card data is the latest
function taskDrag(node) {
  // node.ondrag = function (e) {
  //   // console.log(e.target)
  //   console.log(draggedTask, dragTarget)
  // }
  node.addEventListener("drop", function (e) {
    e.preventDefault()
    console.log(dragOrigin, dragTarget)
    updateData2()

    return

    if (!e.target.closest(".task_list_wrap")) {
      return
    }

    updateDragData()
  })
}

/*

// The data update function when the card is dragged (old method, there are bugs, discarded)
function updateDragData() {
  let arrTemp = []
  let oldTaskCardIndex = Number(dragOrigin.querySelector(".task_card_index").innerHTML)
  let oldTaskIndex = Number(draggedTask.querySelector(".task_index").innerHTML)
  for (let i = 0; i < taskList[oldTaskCardIndex].length; i++) {
    if (taskList[oldTaskCardIndex][i].id === oldTaskIndex) {
      arrTemp = taskList[oldTaskCardIndex].splice(i, 1)[0]
      console.log(arrTemp)
      break
    }
  }

  let newTaskCardIndex = Number(dragTarget.querySelector(".task_card_index").innerHTML)
  if (draggedTask.nextElementSibling) {
    let newTaskIndex = Number(draggedTask.nextElementSibling.querySelector(".task_index").innerHTML)
    for (let i = 0; i < taskList[newTaskCardIndex].length; i++) {
      if (taskList[newTaskCardIndex][i].id === newTaskIndex) {
        taskList[newTaskCardIndex].splice(i, 0, arrTemp)
        break
      }
    }
    // console.log(newTaskCardIndex, newTaskIndex, "???!!!")
  } else {
    taskList[newTaskCardIndex].push(arrTemp)
  }

  console.log(taskList)
  localStorage.setItem("taskList", JSON.stringify(taskList))
}

*/

// Card drag and drop initialization
function initDrag() {
  document.querySelectorAll(".task_card_wrap").forEach((item) => {
    taskDragOver(item)
    taskDropEnter(item)
    taskDrag(item)
  })
}
initDrag()

/*****
 * card drag
 * end
 */

// Card double-click event function => jump to the clock page (display the clock and hide the card page to achieve the effect of page jump)
function initTaskDblClickEvent(node) {
  node.ondblclick = function (e) {
    console.log("double click", e.target.closest(".task_list"))
    let currentTaskCardIndex = Number(e.target.closest(".task_wrap").querySelector(".task_card_index").innerHTML)
    let currentTaskIndex = Number(e.target.closest(".task_list").querySelector(".task_index").innerHTML)
    // let taskData = taskList[currentTaskCardIndex].find((item) => item.id === currentTaskIndex)
    for (let i = 0; i < taskList[currentTaskCardIndex].length; i++) {
      if (taskList[currentTaskCardIndex][i].id === currentTaskIndex) {
        clockTaskData = taskList[currentTaskCardIndex][i]
      }
    }
    console.log(clockTaskData)
    document.querySelector(".card_wrap").style.display = "none"
    document.querySelector(".clock_wrap").style.display = "block"

    clockTextarea.value = clockTaskData.notes
  }
}

/*******
 * clock page
 * begin
 */

// Store the notes data in the clock page into the corresponding card data structure
clockTextarea.oninput = function () {
  // console.log(clockTaskData, "textarea")
  clockTaskData.notes = clockTextarea.value
  localStorage.setItem("taskList", JSON.stringify(taskList))
}

// Clock returns to card page
document.querySelector("#clock_back").onclick = function () {
  document.querySelector(".card_wrap").style.display = "block"
  document.querySelector(".clock_wrap").style.display = "none"
}

/******
 * clock page
 * end
 */

/*****
 * timer
 * begin
 */

let clockTime = document.querySelector(".clock_time")
let time = null
// let timePause = true
let breakTime = 5
let studyTime = 25
// let duration = 25 * 60
let duration = studyTime * 60
let studyFlag = true

changeTime(duration)

function formateTime(times) {
  let hours = Math.floor(times / 60)
  let minutes = Number(times % 60)
  return {
    hours,
    minutes,
  }
}
// time rendering
function changeTime(arg) {
  let temp = formateTime(arg)
  console.log(temp)
  clockTime.innerHTML = `${String(temp.hours).length < 2 ? "0" + temp.hours : temp.hours}:${
    String(temp.minutes).length < 2 ? "0" + temp.minutes : temp.minutes
  }`
}

// clock starts
document.querySelector(".clock_start").onclick = function (e) {
  console.log("clock_start clicked")
  if (duration === 0) {
    return
  }
  if (!time) {
    e.target.style.backgroundImage = "url(./assets/icons/clock/pause.png)"
    time = setInterval(function () {
      if (duration === 0) {
        clearInterval(time)
        time = null
        document.querySelector(".clock_next").click()
        return
      }
      duration--
      changeTime(duration)
    }, 1000)
  } else {
    clearInterval(time)
    e.target.style.backgroundImage = "url(./assets/icons/clock/start.png)"
    time = null
  }
}

// switch clock study/break
document.querySelector(".clock_next").addEventListener("click", function () {
  console.log("clock_next")
  studyFlag = !studyFlag
  if (studyFlag) {
    duration = studyTime * 60
  } else {
    duration = breakTime * 60
  }
  changeTime(duration)
  clearInterval(time)
  document.querySelector(".clock_start").style.backgroundImage = "url(./assets/icons/clock/start.png)"
  time = null
  document.querySelector(".clock_start").click()
  return
})

// Clock set button event
document.querySelector(".clock_setting").onclick = function (e) {
  console.log("clock_setting")
  document.querySelector("#clock_study").value = studyTime
  document.querySelector("#clock_break").value = breakTime
  let timeSetting = document.querySelector(".time_setting")
  timeSetting.style.display = timeSetting.style.display === "none" ? "flex" : "none"
}

// Clock Settings -cancel
document.querySelector(".clock_duration_button_cancel").onclick = function () {
  document.querySelector(".clock_setting").click()
}

// Clock Settings -confirm
document.querySelector(".clock_duration_button_confirm").onclick = function () {
  studyTime = document.querySelector("#clock_study").value
  breakTime = document.querySelector("#clock_break").value
  document.querySelector(".clock_setting").click()
  studyFlag = false
  document.querySelector(".clock_next").click()
}

/*****
 * timer
 * end
 */
