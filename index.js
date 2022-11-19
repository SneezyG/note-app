

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
const contentInput = document.querySelector('#body > span');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#add');
const newButton = document.querySelector('#noteHead button');
const newNote = document.querySelector("#new-note");
const error = document.querySelector("#error");



// Get window height.
let oldHeight = window.innerHeight;
setHeight(oldHeight);

// display available recent notes.
const data = [
     {
       "title": "my token",
       "content": "hsjsbcbcndieieieienfnbfnfjrjrkrjjrndnfnfnfnfnjejejrjdjdkdkdbcbcbcnjeieieidididkdkncncncncjdjdididkncncncncncieieieiencncncnfnieiddjdjncncncncnnccnncueirjdjdjdjncncncncurur"
     } ,
     {
       "title": "email addresses",
       "content":
       "ahmadgbolly97@gmail <br> opeyeminasmat@gmail.com <br> ismailiqmah@gmail.com"
     }
  ];

let noteTemplate = `
<details>
<summary>
<b><%= title %></b>
<hr/>
</summary>
<article>
    <span class="content">
    <%= content %>
    </span>
</article>
</details>
<div class="button">
  <button data-id="<%= title %>" class="edit">Edit</button>
  <button data-id="<%= title %>" class="delete">Delete</button>
</div>`;

const templateFunction = _.template(noteTemplate);

displayNote();


// prevent default form submission on enter key press
document.querySelector('input[name="title"]').onkeydown=e=>{

   if(e.key==='Enter')e.preventDefault();

};


// show dialog box to create new note
newButton.addEventListener('click', () => {
     contentInput.innerHTML = "";
     titleInput.value = "";
     titleInput.disabled = false;
     error.style.display = "none";
     newNote.dataset.new = true;
     newNote.showModal();
     submitBtn.style.opacity = 0.6;
     submitBtn.style.pointerEvents = "none";
});




submitBtn.addEventListener('click', () => {
  //console.log(contentInput.innerHTML);
  let content = contentInput.innerHTML;
  let title = titleInput.value.trim();
  let status = newNote.dataset.new;
  console.log(status);
  
  if (status == "false") {
    let index = 0;
    for (let item of data) {
      if (item.title == title) {
        item.content = content;
        break;
      }
      index ++;
    }
  } else {
    let item = {title, content};
    data.push(item);
  }
  
  displayNote();
  
})


// validate dialog form
titleInput.addEventListener('input', () => {
  submitBtn.style.opacity = 0.6;
  submitBtn.style.pointerEvents = "none";
  error.style.display = "none";
  let value = titleInput.value.trim();
  
  if (value.length > 0) {
    let index = 0;
    
    for (let item of data) {
      if (value == item.title) {
        error.style.display = "block";
        return null;
      }
      index ++;
   }
    submitBtn.style.opacity = 1;
    submitBtn.style.pointerEvents = "auto";
    
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


// display recent notes.
function displayNote() {
  //first clear the notelist
  noteList.replaceChildren();
  
  let p = document.createElement('p');
  p.innerHTML = data.length + " recent note";
  noteList.append(p);
  
  for (let item of data) {
    let li = document.createElement('li');
    li.className = "note";
    li.innerHTML = templateFunction({
      "title": item.title,
      "content": item.content
    });
    noteList.append(li);
  }
  
 
 const edit = document.querySelectorAll(".edit");
 for (let elem of edit) {
   elem.addEventListener("click", (e) => {
     let id = e.target.dataset.id;
     for (let item of data) {
       if (item.title == id) {
         contentInput.innerHTML = item.content;
         titleInput.value = item.title;
         break;
       }
     }
 
     titleInput.disabled = true;
     error.style.display = "none";
     newNote.dataset.new = false;
     newNote.showModal();
     submitBtn.style.opacity = 1;
     submitBtn.style.pointerEvents = "auto";
   });
 }
 
 
 const delet = document.querySelectorAll(".delete");
 for (let elem of delet) {
   elem.addEventListener("click", (e) => {
      let id = e.target.dataset.id;
    
      let index = 0;
      for (let item of data) {
        //console.log(data, index, item);
        if (item.title == id) {
          data.splice(index, 1);

          displayNote();
          break;
        }
        index ++;
      }
   });
 }
}
   

