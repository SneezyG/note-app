




// setting up the persistence indexedb.
let db;
const openRequest = window.indexedDB.open("noteDB", 1);

// listen to event on the openRequest object.
openRequest.addEventListener('error', () => {
  console.log("noteDB fail to open");
});

// call displayNote on database open successfully.
openRequest.addEventListener('success', () => {
  console.log("noteDB open successfully");
  db = openRequest.result;
  displayNote();
});

openRequest.addEventListener('upgradeneeded', (e) => {
   db = e.target.result;
   
   // create a store object.
   const store = db.createObjectStore("noteStore", {
     keyPath: "id",
     autoIncrement: true,
   });
   
   // deine the store schema.
   store.createIndex("title", "title", {
     unique: true
   });
   store.createIndex("content", "content", {
     unique: false
   });
   
   console.log("noteDB setup complete");
})














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
const notify = document.querySelector("#notify > span");
const newNoteHead = document.querySelector("#new-note > h4");


// Get window height.
let oldHeight = window.innerHeight;
setHeight(oldHeight);


// note list structure template
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
<div data-id="<%= id %>" data-title="<%= title %>" class="button">
  <button class="edit">Edit</button>
  <button class="delete">Delete</button>
</div>`;

const templateFunction = _.template(noteTemplate);


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
     newNote.dataset.status = "new";
     newNoteHead.innerHTML = "Create Note"
     newNote.showModal();
     submitBtn.style.opacity = 0.6;
     submitBtn.style.pointerEvents = "none";
});



// create new note or modify existing ones.
submitBtn.addEventListener('click', () => {
  let content = contentInput.innerHTML;
  let title = titleInput.value.trim();
  let status = newNote.dataset.status;
  let id = Number(newNote.dataset.id);
  
  let msg = title;
  const transaction = db.transaction(["noteStore"], "readwrite");
  const objectStore = transaction.objectStore("noteStore");
  
  if (status == "old") {
      // get the old note.
      const getRequest = objectStore.get(id);
      
      getRequest.addEventListener("error", () => {
      console.log("get-modify transaction fail");
      });
      
      getRequest.addEventListener("success", (e) => {
        let data = e.target.result;
        data.content = content;
       
        // update the old note data with put req.
        const putRequest = objectStore.put(data);
        
        putRequest.addEventListener("error", () => {
          console.log("modify transaction fail");
        });
          
        msg += " note modified successfully";
        
      });
      
  } else {
    let item = {title, content};
    
    // add new item.
    const addRequest = objectStore.add(item);
    
    addRequest.addEventListener("error", () => {
      console.log("add transaction fail");
    })
    
    msg += " note added successfully";
  }
  
  transaction.addEventListener("complete", () => {
      console.log(msg);
      notify.innerHTML = msg;
      notify.style.animationPlayState = "running";
      notify.addEventListener("animationend", resetNotify, {once:true});
      displayNote();
    });
    
  transaction.addEventListener("error", () =>
    console.log("Transaction fail in modify request")
    );
  
})



// add a listener to document to reset notification.
document.addEventListener('click', () => {
   notify.style.animation = "none";
   notify.offsetWidth;
   notify.style.animation = null;
});



function resetNotify(e) {
   let elem = e.target;
   setTimeout(() => {
     elem.style.animation = "none";
     elem.offsetWidth;
     elem.style.animation = null;
   }, 4000)
}


// validate title input in create dialog form
titleInput.addEventListener('input', () => {
  submitBtn.style.opacity = 0.6;
  submitBtn.style.pointerEvents = "none";
  error.style.display = "none";
  let value = titleInput.value.trim();
  
  if (value.length > 0) {
    let index = 0;
    
    for (let item of data) {
      if (value == item) {
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
}


// set noteList height.
function setHeight(height) {
  let newHeight = height - headHeight - footHeight - noteHeadHeight - 35;

 noteList.style.height = newHeight + "px";

}


// display recent notes.
function displayNote() {
  //first clear the notelist
  noteList.replaceChildren();
  // data, to keep track of note titles.
  data = [];
  
  const objectStore = db.transaction("noteStore").objectStore("noteStore");
  
  objectStore.openCursor().addEventListener("success", (e) => {
     const cursor = e.target.result;
     if (cursor) {
       // push note title into data array.
       data.push(cursor.value.title);
       
       let li = document.createElement('li');
       li.className = "note";
       li.innerHTML = templateFunction({
        "title": cursor.value.title,
        "content": cursor.value.content,
        "id": cursor.value.id
       });
       
       noteList.prepend(li);
       cursor.continue();
       
   } else {
     let noteCount = document.createElement('p');
     noteCount.innerHTML = data.length + " recent note";
     noteList.prepend(noteCount);
     
     const edit = document.querySelectorAll(".edit");
     for (let elem of edit) {
       elem.addEventListener("click", editfunc);
     }
 
     const delet = document.querySelectorAll(".delete");
     for (let elem of delet) {
       elem.addEventListener("click", delfunc, {once:true});
     }
     
   }
 });
}
   


// prompt a dialog for the modification of a note
function editfunc(e) {
     let parent = e.target.parentElement;
     let noteId = Number(parent.dataset.id);
     let noteTitle = parent.dataset.title;
     
     const transaction = db.transaction(["noteStore"], "readwrite");
     const objectStore = transaction.objectStore("noteStore");
     const getRequest = objectStore.get(noteId);
     
     transaction.addEventListener("error", () => {
       console.log("transaction fail in get request");
     });
     
     getRequest.addEventListener("success", (e) => {
       titleInput.value = noteTitle;
       contentInput.innerHTML = e.target.result.content;
       
       titleInput.disabled = true;
       error.style.display = "none";
       newNote.dataset.status = "old";
       newNote.dataset.id = noteId;
       newNoteHead.innerHTML = "Edit Note"
       newNote.showModal();
       submitBtn.style.opacity = 1;
       submitBtn.style.pointerEvents = "auto";
     });
     
     getRequest.addEventListener("error", () => {
       console.log("get transaction failed");
     });
}



// delete a note.
function delfunc(e) {
     let parent = e.target.parentElement;
     let note = parent.parentElement;
     let noteId = Number(parent.dataset.id);
     let noteTitle = parent.dataset.title;
     
    
     const transaction = db.transaction(["noteStore"], "readwrite");
     const objectStore = transaction.objectStore("noteStore");
     const deleteRequest = objectStore.delete(noteId);
     
     transaction.addEventListener("error", () => {
       console.log("transaction fail in delete request");
     });
     
     deleteRequest.addEventListener("success", () => {
       note.style.animationPlayState = "running";
       
       note.addEventListener("animationend", () => {
          noteList.removeChild(note);
          let index = 0;
          for (let item of data) {
           if (item == noteTitle) {
             data.splice(index, 1);
             let noteCount = document.querySelector('#noteList > p');
             noteCount.innerHTML = data.length + " recent note";
             break;
           }
           index ++;
          }
         
         let msg = noteTitle + " note deleted successfully";
         console.log(msg);
         notify.innerHTML = msg;
         notify.style.animationPlayState = "running";
         notify.addEventListener("animationend", resetNotify, {once:true});
         
      }, {once:true});
    });
     
     deleteRequest.addEventListener("error", () => {
       console.log("delete transaction failed");
    });
}


// register a service worker for your app.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").then((reg) => { 
    alert('Service Worker registration was successful with scope: ' + reg.scope);
    }, (err) => {
       alert('ServiceWorker registration failed: ' + err);
    });
}