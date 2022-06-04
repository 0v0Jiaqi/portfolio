# Iteration of G-practicing based on feedback and further self-reflection
## Music player
In assessment2, I designed the prototype of the music player, the functions include: next song, previous song, replay, song title display bar, playlist.

![01](.\READMEassets\01.png)

When writing Javascript, I found that playlists are not very important, so I removed this function in the latest version of the design. Also I redesigned the position and size of the replay button to make the music player look better overall, and the design is more concise now .

![微信图片_20220604144853](.\READMEassets\微信图片_20220604144853.png)

## Kanban board

![微信图片_20220604153750](.\READMEassets\微信图片_20220604153750.png)

The final version of the kanban board does not change much from the initial design, because in the initial design, I have done several user tests, after getting the affirmation of the test users, I wrote the code for this part.

![微信图片_20220604153747](.\READMEassets\微信图片_20220604153747.png)

The user can use the mouse to drag the TASK to different areas (TO DO/In Progress/Done), and the user can also mark or delete the TASK.


```
// Card drag start eventdocument.querySelector(".card_wrap").ondragstart = function (*e*) { 
// console.log(e.target) draggedTask = *e*.target dragOrigin = *e*.target.closest(".task_wrap") *e*.target.style.opacity = 0.5} 
// Card drag end eventdocument.querySelector(".card_wrap").ondragend = function (*e*) { 
// console.log(e.target) *e*.target.style.opacity = 1}
```

![微信图片_20220604153752](.\READMEassets\微信图片_20220604153752.png)

Users can add tasks by clicking the "plus" button. In the newly created task, users can name the task, set up the date and duration.

## Clock

![微信图片_20220604155526](.\READMEassets\微信图片_20220604155526.png)

In the new version of clock, I have retained the main functions of countdown and taking notes in practice. Users can enter the clock interface by double-clicking the task on the kanban board interface.

```
let time = null
// let timePause = truelet duration = 25 * 60 
   let clockTime = document.querySelector(".clock_time") function formateTime(*times*) { let hours = Math.floor(*times* / 60) 
   let minutes = *Number*(*times* % 60) return {  hours,  minutes, }
```

### time rendering

```
function changeTime(arg) {
  let temp = formateTime(arg)
  console.log(temp)
  clockTime.innerHTML = `${String(temp.hours).length < 2 ? "0" + temp.hours : temp.hours}:${
    String(temp.minutes).length < 2 ? "0" + temp.minutes : temp.minutes
  }`
}
```



![ab98e5814b09879b38b68f530a66407](.\READMEassets\ab98e5814b09879b38b68f530a66407.png)

User can set the study duration and break duration by clicking the setting button.



## collection

Category is on the left side of the collection interface, user can click the ADD button to create a new category, such as "sd "(this is the category I created temporarily).

![0b74ee00be7b59d5fc9d4c40d93bf06](.\READMEassets\0b74ee00be7b59d5fc9d4c40d93bf06.png)

Users can click the ADD button in the center of the page to add and save the content to be used in the collection.

![9b5f1058181b9e3fb7fa2494f71d385](.\READMEassets\9b5f1058181b9e3fb7fa2494f71d385.png)

After clicking Add, users can write content according to their own needs, and save it to local storage after completion.

![edf032cbe387a7f43e71d0498abee3e](.\READMEassets\edf032cbe387a7f43e71d0498abee3e.png)

