let collectionList = JSON.parse(localStorage.getItem("collectionList")) || []
let categoryList = JSON.parse(localStorage.getItem("categoryList")) || []
let categoryIndex = localStorage.getItem("categoryIndex") || 0 // category最大index值
let collectionIndex = localStorage.getItem("collectionIndex") || 0 // collection最大index值

console.log(collectionList, categoryIndex)

let currentCategoryIndex = 0
let collectionInput = document.querySelector(".collection_input_wrap")
let isCollectionEdit = false

// 添加新category事件
document.querySelector("#category_add").onclick = function (e) {
  let categoryInput = document.querySelector(".copy").cloneNode(true)
  categoryInput.classList.remove("copy")
  document.querySelector(".category_list").appendChild(categoryInput)
  categoryIndex++
  categoryInput.attributes["index"].value = categoryIndex
  console.log(categoryInput.attributes["index"].value)
  // console.log(categoryInput)
  let input = categoryInput.querySelector("input")
  input.onblur = function () {
    console.log(input.value)
    if (input.value.trim()) {
      categoryInput.innerHTML = input.value
      categoryList.push({
        id: Number(categoryInput.attributes["index"].value),
        name: input.value,
      })
      localStorage.setItem("categoryList", JSON.stringify(categoryList))
      categoryClick(categoryInput)
      if (Number(categoryInput.attributes["index"].value) > localStorage.getItem("collectionList")) {
        localStorage.setItem("categoryIndex", Number(categoryInput.attributes["index"].value))
      }
    } else {
      categoryInput.remove()
    }
  }
}

// category列表点击事件
function categoryClick(node) {
  node.onclick = function (e) {
    // console.log(e.target)
    document
      .querySelector(".category_list")
      .querySelectorAll("li")
      .forEach((item) => {
        item.classList.remove("clicked")
      })
    e.target.classList.add("clicked")
    console.log(e.target.attributes["index"].value)
    currentCategoryIndex = Number(e.target.attributes["index"].value)
    initCollectionList()
  }
}

// category初始化
function initCategory() {
  categoryList.forEach((item) => {
    let categoryDefault = document.querySelector(".copy2").cloneNode(true)
    categoryDefault.classList.remove("copy2")
    categoryDefault.attributes["index"].value = item.id
    categoryDefault.innerHTML = item.name
    document.querySelector(".category_list").appendChild(categoryDefault)
  })

  document
    .querySelector(".category_list")
    .querySelectorAll("li")
    .forEach((item) => {
      item.classList.remove("clicked")
      categoryClick(item)
    })

  document.querySelector(".category_list").querySelector("li").classList.add("clicked")
}
initCategory()

/***********分界线 */

// collection列表点击按钮时的事件，对其进行编辑/删除
function collectionSetting(node) {
  node.onclick = function (e) {
    // console.log(e.target.closest(".collection_list"))
    let collectionListId = Number(e.target.closest(".collection_list").querySelector(".collection_list_index").innerHTML)
    let dataTemp = collectionList.find((item) => item.id === collectionListId)
    console.log(collectionListId, dataTemp)
    document.querySelector("#collection_list_add").click()
    collectionInput.querySelector("#input_title").value = dataTemp.title
    collectionInput.querySelector("#input_url").value = dataTemp.url
    collectionInput.querySelector("#input_notes").value = dataTemp.notes
    for (let i = 0; i < collectionList.length; i++) {
      if (collectionList[i].id === collectionListId) {
        collectionList.splice(i, 1)
        return
      }
    }

    // isCollectionEdit = true
  }
}
function collectionDelete(node) {
  node.onclick = function (e) {
    console.log(e.target.closest(".collection_list").querySelector(".collection_list_index").innerHTML)
    for (let i = 0; i < collectionList.length; i++) {
      if (Number(collectionList[i].id) === Number(e.target.closest(".collection_list").querySelector(".collection_list_index").innerHTML)) {
        collectionList.splice(i, 1)
        break
      }
    }
    e.target.closest(".collection_list").remove()
    localStorage.setItem("collectionList", JSON.stringify(collectionList))
    initCollectionList()
  }
}

// collection list初始化
function initCollection() {
  document.querySelector("#collection_list_add").onclick = function () {
    console.log("collection_list_add")
    document.querySelector(".collection_wrap").style.display = "none"
    document.querySelector(".collection_add_wrap").style.display = "block"
    console.log(
      categoryList,
      currentCategoryIndex,
      categoryList.find((item) => Number(item.id) === Number(currentCategoryIndex))
    )
    let categoryData = categoryList.find((item) => Number(item.id) === Number(currentCategoryIndex))
    collectionInput.querySelector("#input_category").value = categoryData ? categoryData.name : "default"
    collectionIndex++
  }

  document.querySelector("#back").onclick = function () {
    document.querySelector(".collection_wrap").style.display = "block"
    document.querySelector(".collection_add_wrap").style.display = "none"
  }

  document.querySelectorAll("#collection_list_setting").forEach((item) => {
    collectionSetting(item)
  })

  document.querySelectorAll("#collection_list_delete").forEach((item) => {
    collectionDelete(item)
  })

  addCollection()
  initCollectionList()
}
initCollection()

// 添加一条collection
function addCollection() {
  document.querySelector(".collection_save").onclick = function () {
    console.log("collection_save")
    // collectionInput.querySelector("#input_category").value = "test2"
    let obj = {
      id: collectionIndex,
      title: collectionInput.querySelector("#input_title").value,
      categoryId: currentCategoryIndex,
      url: collectionInput.querySelector("#input_url").value,
      notes: collectionInput.querySelector("#input_notes").value,
    }
    console.log(obj)
    if (obj.title.trim() === "" || obj.url.trim === "") {
      return
    }
    collectionList.push(obj)
    localStorage.setItem("collectionIndex", collectionIndex)
    localStorage.setItem("collectionList", JSON.stringify(collectionList))

    document.querySelector("#back").click()
    collectionInput.querySelectorAll("input").forEach((item) => {
      item.value = ""
    })
    collectionInput.querySelector("textarea").value = ""
    initCollectionList()
  }
}

// collection list初始化
function initCollectionList() {
  document.querySelectorAll(".collection_list").forEach((item) => {
    if (item.className === "collection_list") item.remove()
  })
  collectionList.forEach((item) => {
    if (Number(item.categoryId) === currentCategoryIndex) {
      console.log(item)
      let newCollection = document.querySelector(".copy3").cloneNode(true)
      newCollection.classList.remove("copy3")
      // console.dir(newCollection.querySelector("a"))
      newCollection.querySelector(".collection_list_index").innerHTML = item.id
      newCollection.querySelector("a").innerHTML = item.title
      newCollection.querySelector("a").href = "http://" + item.url
      collectionSetting(newCollection.querySelector("#collection_list_setting"))
      collectionDelete(newCollection.querySelector("#collection_list_delete"))
      document.querySelector(".collection_list_wrap").appendChild(newCollection)
    }
  })
}
