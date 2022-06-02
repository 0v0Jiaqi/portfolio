let taskIndex = localStorage.getItem("taskIndex") || 0 // 卡片最大index值
let taskList = JSON.parse(localStorage.getItem("taskList")) || [[], [], []]

console.log(taskIndex, taskList)

let clockTaskData = null // 时钟数据
let clockTextarea = document.querySelector(".note_input").querySelector("textarea") // notes

/*****
 * 各种页面初始化
 * begin
 */

// 页面初始化，根据localStorage储存的卡片数据进行渲染
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

// 卡片事件初始化（页面加载时的初始化,给每个卡片添加上对应的编辑/删除/双击事件）
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
 * 各种页面初始化
 * end
 */

// 添加新卡片,点击每一列中的加号时，会添加一张新的待编辑卡片，此处则对其进行实现
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
 * 卡片确定/编辑/删除事件初始化
 * begin
 */

// 数据 => 卡片：将taskList中的卡片数据渲染成卡片
function dataToDoneTask(obj) {
  let newTaskDone = document.querySelector(".copy2").cloneNode(true)
  newTaskDone.classList.remove("copy2")
  newTaskDone.querySelector(".task_index").innerHTML = obj.id
  newTaskDone.querySelector(".first_details").innerHTML = obj.name
  newTaskDone.querySelector(".second_details").innerHTML = `DUE DAY: ${obj.date}`
  newTaskDone.querySelector(".third_details").innerHTML = `Estimated time: ${obj.time.hours}h ${obj.time.minutes}m`
  return newTaskDone
}

// 卡片确定事件函数 flag:是否为新卡片
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
    // 判断是否填写完整
    if (obj.name.trim() === "" || obj.date === "" || obj.time.hours === 0 || obj.time.minutes === 0) {
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

// 卡片编辑事件函数
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

// 卡片删除事件函数 flag:是否为新卡片
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
 * 卡片确定/编辑/删除事件初始化
 * end
 */

/******
 * 卡片拖拽
 * begin
 */

// 节点插入函数
function insertAfter(newNode, curNode) {
  curNode.parentNode.insertBefore(newNode, curNode.nextElementSibling)
}

// // 更新某一列卡片数据
// function updateData(rowNum) {
//   let taskWrap = document.querySelector(`.task_wrap${rowNum + 1}`)
//   console.log(taskWrap)

//   let arr = []
//   // document.querySelectorAll('.task_list').forEach

//   // for (let i = 0; i < taskList[currentTaskCardIndex].length; i++) {
//   //   if (taskList[currentTaskCardIndex][i].id === currentTaskIndex) {
//   //     taskList[currentTaskCardIndex].splice(i, 1)
//   //     break
//   //   }
//   // }
// }

let draggedTask = null
let dragOrigin = null
let dragTarget = null

// 卡片拖拽开始事件
document.querySelector(".card_wrap").ondragstart = function (e) {
  // console.log(e.target)
  draggedTask = e.target
  dragOrigin = e.target.closest(".task_wrap")
  e.target.style.opacity = 0.5
}

// 卡片拖拽结束事件
document.querySelector(".card_wrap").ondragend = function (e) {
  // console.log(e.target)
  e.target.style.opacity = 1
}

// 阻止拖拽后卡片返回至原处
function taskDragOver(node) {
  node.ondragover = function (e) {
    e.preventDefault()
  }
}

// 卡片拖拽过程中，移动卡片至目标处，对其进行添加与删除
function taskDropEnter(node) {
  node.ondragenter = function (e) {
    // console.log(e.target)
    dragTarget = e.target.closest(".task_wrap")

    if (e.target.closest(".task_list")) {
      // console.log(e.target.closest(".task_list"))
      insertAfter(draggedTask, e.target.closest(".task_list"))
    } else if (e.target.className === "task_list_wrap") {
      console.log(e.target.querySelector(".task_list"), "?????")
      e.target.insertBefore(draggedTask, e.target.querySelector(".task_list"))
    }
  }
}

// 卡片拖拽结束时（鼠标松开），更新卡片数据至localStorage，保证卡片数据为最新的
function taskDrag(node) {
  // node.ondrag = function (e) {
  //   // console.log(e.target)
  //   console.log(draggedTask, dragTarget)
  // }
  node.addEventListener("drop", function (e) {
    console.log(dragOrigin, dragTarget)

    // updateData(Number(dragOrigin.querySelector(".task_card_index").innerHTML))
    // updateData(Number(dragTarget.querySelector(".task_card_index").innerHTML))

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
  })
}

// 卡片拖拽初始化
function initDrag() {
  document.querySelectorAll(".task_card_wrap").forEach((item) => {
    taskDragOver(item)
    taskDropEnter(item)
    taskDrag(item)
  })
}
initDrag()

/*****
 * 卡片拖拽
 * end
 */

// 卡片双击事件函数 => 跳转至时钟页面（将时钟显示，并隐藏卡片页面达到页面跳转的效果）
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
 * 时钟页面
 * begin
 */

// 将时钟页面中的notes数据储存至对应卡片数据结构中
clockTextarea.oninput = function () {
  // console.log(clockTaskData, "textarea")
  clockTaskData.notes = clockTextarea.value
  localStorage.setItem("taskList", JSON.stringify(taskList))
}

// 时钟返回至卡片页面
document.querySelector("#clock_back").onclick = function () {
  document.querySelector(".card_wrap").style.display = "block"
  document.querySelector(".clock_wrap").style.display = "none"
}

/******
 * 时钟页面
 * end
 */

/*****
 * 计时器
 * begin
 */

let time = null
// let timePause = true
let duration = 25 * 60

let clockTime = document.querySelector(".clock_time")

function formateTime(times) {
  let hours = Math.floor(times / 60)
  let minutes = Number(times % 60)
  return {
    hours,
    minutes,
  }
}
// 时间渲染
function changeTime(arg) {
  let temp = formateTime(arg)
  console.log(temp)
  clockTime.innerHTML = `${String(temp.hours).length < 2 ? "0" + temp.hours : temp.hours}:${
    String(temp.minutes).length < 2 ? "0" + temp.minutes : temp.minutes
  }`
}

// 时钟开始计时
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
        // document.querySelector("#reset_time").click()
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

// document.querySelector("#reset_time").addEventListener("click", function () {
//   intervalTimes++
//   if (intervalTimes % (settingTime.interval * 2 + 2) === 0) {
//     console.log("long break")
//     document.querySelector("button[data-time='long_break']").click()
//   } else if (intervalTimes % 2 === 1) {
//     console.log("study")
//     document.querySelector("button[data-time='study']").click()
//   } else {
//     console.log("short break")
//     document.querySelector("button[data-time='short_break']").click()
//   }
// })

// // study/short break/long break 点击事件
// document
//   .querySelector(".timer_Buttons")
//   .querySelectorAll("button")
//   .forEach((item) => {
//     item.onclick = function () {
//       document
//         .querySelector(".timer_Buttons")
//         .querySelectorAll("button")
//         .forEach((item2) => {
//           item2.classList.remove("clicked")
//         })
//       item.classList.add("clicked")
//       console.log(item.attributes["data-time"].value)
//       duration = settingTime[item.attributes["data-time"].value] * 60
//       changeTime(duration)
//       clearInterval(time)
//       document.querySelector("#start_time").classList.add("icon-bofang")
//       document.querySelector("#start_time").classList.remove("icon-zanting")
//       time = null
//       document.querySelector("#start_time").click()
//     }
//   })

/*****
 * 计时器
 * end
 */
