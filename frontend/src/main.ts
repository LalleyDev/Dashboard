import "./style.css";
import { type link} from './types';
//import axios from 'axios';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'></div>
    <div class='openFormbtn'>
      <button id='openFormbtn' type='button'>Add New Link</button>
      <button id="rmvButton" type='button'>Remove Button</button>
    </div>
    <div class='linkForm' id='linkForm'>
      <h2>Add the name and URL of the website you want to add.</h2>
      <form class='linkFormElement'>
        <label class='label' for="name">Name:</label>
        <input class='input' type='text' id="name"></input>
        <label class='label' for="url">Link:</label>
        <input class='input' type='url' id="url" ></input>
        <button class='btn' id='submitBtn' type='button'>Add</button>
      </form>
    </div>
    <div class='removeForm' id='removeForm'> 
      <h2> Remove desired link by pressing the delete button</h2>
      <form class='removeFormElement' id='removeFormElement'>
      </form>
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

// Show link form upon click.
if (formBtn && form) {
  formBtn.onclick = function () {
    form.style.display = 'block';
  };
}

// Show remove form upon click.
if (rmvBtn && removeForm) {
  rmvBtn.onclick = function () {
    removeForm.style.display = 'block';
  };
}

// Add user input links upon click.
if (addBtn && form && urlName && url) {
  addBtn.onclick = function () {
    if(urlName.value == "" || url.value == ""){
      alert("Both fields are required.");
      return;
    }
    addLink(urlName.value, url.value);
    // Clear input fields and close form.
    urlName.value = '';
    url.value = '';
    form.style.display = 'none';
  };
}

// Close form if user clicks outside of it.
window.onclick = function (event) {
  if (event.target == form || event.target == removeForm) {
    form!.style.display = 'none';
    removeForm!.style.display = 'none';
  }
};

/**
 * This function takes a user input link and adds it to html 
 * and backend .json file for storage.
 */
async function addLink(usrName: string, usrUrl: string) {
  try {
    let userInputLink: link = {
      name: usrName,
      url: usrUrl,
    };
    // Adds to DOM
    renderLink(userInputLink);
    // Adds to backend
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
  // TODO: get favicon.
  linkdiv.innerHTML = `
    <form action="${link.url.startsWith('http') ? link.url : 'http://' + link.url}" target="_blank">
      <image src="${link.url}/favicon.ico" alt="Favicon">
      <button class="urlButton" id="${link.name}"type="submit">${link.name}</button>
    </form>
  `;
  websiteDiv.appendChild(linkdiv);
  saveToDeleteForm(link);
}

/**
 * This function saves the links to the delete form when they are created. 
 * This was done to avoid having to load the delete form with all the links
 * everytime. The button to open the delete form just makes it visible.
 * 
 * @param link - link to be added to delete form.
 * @returns If the remove form element is not found, it returns nothing.
 */
function saveToDeleteForm(link: link) {
  const removeFormElmnt = document.querySelector('.removeFormElement');
  if (!removeFormElmnt) return;
  const rmvDiv = document.createElement('div');
  rmvDiv.innerHTML = `
    <span id="${link.name}-deletespan"/>${link.name}</span>
    <button class="${link.name}-deletebtn" id="${link.name}-deletebtn" type="button">Delete</button>
  `;
  removeFormElmnt.appendChild(rmvDiv);
  const rmvBtn = document.getElementById(`${link.name}-deletebtn`);
  if (rmvBtn) {
    rmvBtn.onclick = function () {
      // Remove the link from the DOM and backend.
      removeLink(link);
      // Close the remove form.
      removeForm!.style.display = 'none';
    }
  }
}

/**
 * This function removes a link from the DOM and backend.
 * 
 * @param link - link to be removed from DOM and backend.
 */
async function removeLink(link: link) {
  // Grab the related element in the .websites and the coresponding delete button and span.
  const element = document.getElementById(link.name);
  const elementDeleteBtn = document.getElementById(link.name + "-deletebtn");
  const elementDeleteSpan = document.getElementById(link.name + "-deletespan");

  if (element && elementDeleteBtn && elementDeleteSpan) {
    console.log("Removing element:", link.name);
    element.remove();
    elementDeleteBtn.remove();
    elementDeleteSpan.remove();
  }
  // Remove from backend
  await removeFromBackend(link);
}

/**
 * Adds a link to the backend .json file for storage.
 * @param link - link to be added to backend.
 */
async function addToBackend(link: link) {
  const response = await fetch('http://localhost:3001/api/putUrls',{
    method:"POST",
    mode:"cors",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(link)
  });
  handleResponse(response);
};

/**
 * Fetches all links from the backend .json file and renders them to the DOM.
 */
async function getFromBackend(){
  const url = 'http://localhost:3001/api/getUrls';
  console.log("Fetching from backend:", url);
  const response = await fetch(url,{
    method:"POST",
    mode:"cors",
    body: JSON.stringify({}),
    headers:{
      "Content-Type":"application/json"
    }
  });
  handleResponse(response);
  renderLinks((await response.json()).links);
};

/**
 * Removes a link from the backend .json file.
 * @param link - link to be removed from backend.
 */
async function removeFromBackend(link: link) {
  const response = await fetch('http://localhost:3001/api/removeLink',{
    method:"DELETE",
    mode:"cors",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify({name: link.name})
  });
  handleResponse(await response);
};

/**
 * Takes an array of links and renders each of them to the DOM.
 * @param links - array of links to be rendered to DOM.
 */
function renderLinks(links: link[]) {
  for(let link of links){
    renderLink(link);
  }
}

/**
 * @param response - response from fetch request.
 * @throws Error if response is not ok.
 * @logs response status.
 */
function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  } else {
    console.log(`Response status: ${response.status}`);
  }
}
