// document.querySelector(".ul_wrap").onclick = function (e) {
//   // console.dir(e.target)
//   if (e.target.nodeName === "LI") {
//     // console.log("li")
//     document
//       .querySelector(".ul_wrap")
//       .querySelectorAll("li")
//       .forEach((item) => {
//         item.classList.remove("clicked")
//       })
//     e.target.classList.add("clicked")
//   }
// }

let musicList = ["Dancing With Our Hands Tied.m4a", "Afterglow.m4a", "Long Live.mp3"]
let musicIndex = 0

// let musicTitle = document.querySelector("marquee")
let musicTitle = document.createElement("marquee")
musicTitle.innerHTML = musicList[musicIndex]
musicTitle.style.textAlign = "center"
document.querySelector(".music_title").appendChild(musicTitle)
musicTitle.stop()

let musicSource = document.querySelector(".music_source")
document.querySelector(".music_play").onclick = function () {
  console.log("music play")
  if (musicSource.paused) {
    musicSource.play()
    musicTitle.start()
    document.querySelector(".music_play").style.backgroundImage = "url(./assets/icons/music/pause.png)"
  } else {
    musicSource.pause()
    musicTitle.stop()
    document.querySelector(".music_play").style.backgroundImage = "url(./assets/icons/music/Play.png)"
  }
}

document.querySelector(".music_next").onclick = function () {
  console.log("music next")
  musicSource.pause()
  musicIndex++
  if (musicIndex > musicList.length - 1) {
    musicIndex = 0
  }
  musicSource.src = "./assets/songs/" + musicList[musicIndex]

  musicTitle.stop()
  musicTitle.innerHTML = musicList[musicIndex]
  musicTitle.start()
  musicSource.play()
  document.querySelector(".music_play").style.backgroundImage = "url(./assets/icons/music/pause.png)"
}

document.querySelector(".music_pre").onclick = function () {
  console.log("music pre")
  musicSource.pause()
  musicIndex--
  if (musicIndex < 0) {
    musicIndex = musicList.length - 1
  }
  // console.log(musicIndex)
  musicSource.src = "./assets/songs/" + musicList[musicIndex]

  musicTitle.stop()
  musicTitle.innerHTML = musicList[musicIndex]
  musicTitle.start()
  musicSource.play()
  document.querySelector(".music_play").style.backgroundImage = "url(./assets/icons/music/pause.png)"
}

document.querySelector(".music_reload").onclick = function () {
  musicTitle.stop()
  musicSource.pause()
  musicSource.src = "./assets/songs/" + musicList[musicIndex]
  musicSource.play()
  musicTitle.start()
  document.querySelector(".music_play").style.backgroundImage = "url(./assets/icons/music/pause.png)"
}
