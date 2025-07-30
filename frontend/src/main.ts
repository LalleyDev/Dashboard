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

// Form functions - moved after HTML creation
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

async function getLinks() {
 try {
   const response = await axios.get('http://localhost:3001/api/urls');
   console.log(response.data);
   return response.data as link[];
 } catch (error) {
   console.error('Error getting links:', error);
 }
}


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

function renderLinks(links: link[]) {
    //const response = await axios.post('http://localhost:3001/api/urls', {
    //  userInputLink,
    //});
    //if (response.data.success) {
    //  console.log('Link added successfully');
    //} else {
    //  console.error('Failed to add link', response.data.error);
    //}
  const websiteDiv = document.querySelector('.websites');
  if (!websiteDiv) return;
  links.forEach((link) => {
   const linkdiv = document.createElement('div');
   linkdiv.innerHTML = `
     <h1>${link.name}</h1>
     <a href="${link.url}" target="_blank">${link.url}</a>
   `;
   websiteDiv.appendChild(linkdiv);
  });
}

async function addLink(usrName: string, usrUrl: string) {
  try {
    let userInputLink: link = {
      name: usrName,
      url: usrUrl,
    };
    renderLink(userInputLink);
  } catch (error) {
    console.error('Error adding link:', error);
  }
}
