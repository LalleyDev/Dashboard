import "./style.css";
import axios from 'axios';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'>
      <div class='linkForm' id='linkForm'>
        <div id='linkForm-content'>
          <h1>Add the URL and the name of the website you want to add.</h1>
          <form>
            <label for="urlName">Name:</label>
            <input type='text' id="urlName" name="urlName"></input><br>
            <label for="linkName">Link:</label>
            <input type='text' id="linkName" name="linkName"></input>
            <button id='submitBtn' type='button'>Add</button>
          </form>
        </div>
      </div>
    </div>
    <div class='openFormbtn'>
      <button id='openFormbtn' type='button'>Add New Link</button>
    </div>
  </div>
`;

//getLinks().then(renderLinks);

type link = {
  name: string;
  url: string;
}

const links: link[] = [];

let form = document.getElementById('linkForm');
let formBtn = document.getElementById('openFormbtn');
let addBtn = document.getElementById('submitBtn');

let urlName = document.getElementById('urlName') as HTMLInputElement;
let url = document.getElementById('linkName') as HTMLInputElement;

if (formBtn && form) {
  formBtn.onclick = function () {
    console.log("Open form button clicked");
    form.style.display = 'block';
  };
}

if (addBtn && form && urlName && url) {
  addBtn.onclick = function () {
    console.log('addBtn clicked');
    addLink(urlName.value, url.value);
    form.style.display = 'none';
  };
}

window.onclick = function (event) {
  if (event.target == form) {
    form!.style.display = 'none';
  }
};

/**
 * This function takes a user input link and adds it to the html 
 * and also to the back end .json file for storage.
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
  linkdiv.innerHTML = `
   <h1>${link.name}</h1>
   <a href="${link.url}" target="_blank">${link.url}</a>
  `;
  websiteDiv.appendChild(linkdiv);
}

async function addToBackend(link: link) {
  const js = await fetch('http://localhost:3001/api/urls',{
    method:"POST",
    mode:"cors",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(link)
  });
  return js.json();
}

async function getFromBackend(){
  const js = await fetch('http://localhost:3001/api/urls',{
    method:"GET",
    mode:"cors",
  });
  // TODO: fill links with proper data type
  return js.json();
};

function renderLinks(links: link[]) {
  for(let link of links){
    addLink(link.name, link.url);
  }
}
