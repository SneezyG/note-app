

//get footer height
const footer = document.querySelector('footer');
let footHeight = footer.offsetHeight;


// get note header height
const noteHead = document.querySelector("#noteHead");
let noteHeadHeight = noteHead.offsetHeight;


// get header height and set note height
const header = document.querySelector("header");
let headHeight = header.offsetHeight;



const notes = document.querySelector("#note-display");
const noteList = document.querySelector('#noteList');
const titleInput = document.querySelector('#title > input');
const bodyInput = document.querySelector('#body > span');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#add');
const newButton = document.querySelector('#noteHead button');
const newNote = document.querySelector("#new-note");
const error = document.querySelector("#error");



// Get window height.
let oldHeight = window.innerHeight;
setHeight(oldHeight);



// group of document event and their listener.
newButton.addEventListener('click', () => {
     newNote.showModal();
     bodyInput.innerHTML = "";
     titleInput.value = "";
     error.style.display = "none";
});

submitBtn.addEventListener('click', () => {
  console.log("note added to recent");
})

titleInput.addEventListener('input', () => {
  submitBtn.style.opacity = 0.6;
  submitBtn.style.pointerEvents = "none";
  error.style.display = "none";
  let value = titleInput.value.trim();
  
  if (value.length > 0) {
    if (value == "grocery-list") {
      error.style.display = "block";
    } else {
    submitBtn.style.opacity = 1;
    submitBtn.style.pointerEvents = "auto";
    }
    return null;
  }
})


window.onresize = render;



// cause a height rerender of noteList.
function render() {
   let newHeight = window.innerHeight;
   if (newHeight != oldHeight) {
     oldHeight = newHeight;
     setHeight(newHeight);
   }
   else {
     console.log("false alert");
   }
}


// set noteList height.
function setHeight(height) {
  //console.log("setting");
  let newHeight = height - headHeight - footHeight - noteHeadHeight - 30;
  //console.log(height, headHeight, footHeight, noteHeadHeight, newHeight);
 noteList.style.height = newHeight + "px";
  //console.log(noteList.style.height);
}



