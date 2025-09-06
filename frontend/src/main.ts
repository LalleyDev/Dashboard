import "./style.css";
import { type link} from './types';
//import axios from 'axios';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'>
      <div class='linkForm' id='linkForm'>
        <div id='linkForm-content'>
          <h2>Add the name and URL of the website you want to add.</h2>
          <form class='linkFormElement'>
            <label class='label' for="name">Name:</label>
            <input class='input' type='text' id="name"></input><br>
            <label class='label' for="url">Link:</label>
            <input class='input' id="url" type='url'></input>
            <button class='btn' id='submitBtn' type='button'>Add</button>
          </form>
        </div>
      </div>
    </div>
    <div class='removeForm' id='removeForm'> 
      <div id='removeFormElement-content'>
        <h2> Remove desired link by pressing the delete button</h2>
        <form class='removeFormElement' id='removeFormElement'>
        </form>
      </div>
    </div>
    <div class='openFormbtn'>
      <button id='openFormbtn' type='button'>Add New Link</button>
      <button id="rmvButton" type='button'>Remove Button</button>
    </div>
  </div>
`;

// On startup, get links from backend
document.addEventListener('DOMContentLoaded', getFromBackend);

let form = document.getElementById('linkForm');
let removeForm = document.getElementById('removeForm');
let formBtn = document.getElementById('openFormbtn');
let rmvBtn = document.getElementById('rmvButton');
let addBtn = document.getElementById('submitBtn');

let urlName = document.getElementById('name') as HTMLInputElement;
let url = document.getElementById('url') as HTMLInputElement;

// HTML Element Event Listeners
if (formBtn && form) {
  formBtn.onclick = function () {
    form.style.display = 'block';
  };
}

formBtn!.onclick = function () {
  form!.style.display = 'block';
};

if (rmvBtn && removeForm) {
  rmvBtn.onclick = function () {
    removeForm.style.display = 'block';
  };
}

if (addBtn && form && urlName && url) {
  addBtn.onclick = function () {
    if(urlName.value == "" || url.value == ""){
      alert("Both fields are required.");
      return;
    }
    //Add error check for url format
    // 
    addLink(urlName.value, url.value);
    urlName.value = '';
    url.value = '';
    form.style.display = 'none';
  };
}

// When the user clicks anywhere outside of the form, close it
window.onclick = function (event) {
  if (event.target == form || event.target == removeForm) {
    form!.style.display = 'none';
    removeForm!.style.display = 'none';
  }
};

// Before unload event to save links to backend
// This might be implemented in the future
//window.onbeforeunload = syncBackend;


// HTTP Requests and DOM Manipulation

/**
 * This function takes a user input link and adds it to the html 
 * and also to the backend .json file for storage.
 */
async function addLink(usrName: string, usrUrl: string) {
  try {
    let userInputLink: link = {
      name: usrName,
      url: usrUrl,
    };
    renderLink(userInputLink);
    addToBackend(userInputLink);
  } catch (error) {
    console.error('Error adding link:', error);
  }
}

/**
  * This function should take whatever link given to it and 
  * properly add it to the dom.
  */
function renderLink(link: link) {
  const websiteDiv = document.querySelector('.websites');
  if (!websiteDiv) return;
  const linkdiv = document.createElement('div');
  // process the link.url
  //grab the base domain for the image.
  linkdiv.innerHTML = `
    <form action="${link.url.startsWith('http') ? link.url : 'http://' + link.url}" target="_blank">
      <image src="${link.url}/favicon.ico" alt="Favicon">
      <button class="urlButton" id="${link.name}"type="submit">${link.name}</button>
    </form>
  `;
  websiteDiv.appendChild(linkdiv);
  saveToDeleteForm(link);
}

function saveToDeleteForm(link: link) {
  const removeForm = document.querySelector('.removeFormElement');
  if (!removeForm) return;
  const rmvDiv = document.createElement('div');
  rmvDiv.innerHTML = `
    <span id="${link.name}-deletespan"/>${link.name}</span>
    <button class="${link.name}-deletebtn" id="${link.name}-deletebtn" type="button">Delete</button>
  `;
  removeForm.appendChild(rmvDiv);
  const rmvBtn = document.getElementById(`${link.name}-deletebtn`);
  if (rmvBtn) {
    rmvBtn.onclick = function () {
      removeLink(link);
    }
  }
}

async function removeLink(link: link) {
  const element = document.getElementById(link.name);
  const elementDeleteBtn = document.getElementById(link.name + "-deletebtn");
  const elementDeleteSpan = document.getElementById(link.name + "-deletespan");
  if (element && elementDeleteBtn && elementDeleteSpan) {
    console.log("Removing element:", link.name);
    element.remove();
    elementDeleteBtn.remove();
    elementDeleteSpan.remove();
  }
  // Also remove from backend
  await removeFromBackend(link);
}

async function addToBackend(link: link) {
  const js = await fetch('http://localhost:3001/api/putUrls',{
    method:"POST",
    mode:"cors",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(link)
  });
  return js.json();
};

async function getFromBackend(){
  const url = 'http://localhost:3001/api/getUrls';
  console.log("Fetching from backend:", url);
  try{
    const response = await fetch(url,{
      method:"POST",
      mode:"cors",
      body: JSON.stringify({}),
      headers:{
        "Content-Type":"application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }else{
      console.log("Response OK");
    }
    renderLinks((await response.json()).links);

  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
  }
};

async function removeFromBackend(link: link) {
  const js = await fetch('http://localhost:3001/api/removeLink',{
    method:"DELETE",
    mode:"cors",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify({name: link.name})
  });
  return js.json();
};

function renderLinks(links: link[]) {
  for(let link of links){
    renderLink(link);
  }
}
