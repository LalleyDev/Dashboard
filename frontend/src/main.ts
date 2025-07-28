import './style.css'
import axios from 'axios';

document.querySelector('#app').innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'>
      <div>
        <h1>Test</h1>
        <p>Test</p>
      </div>
      <div class='openFormbtn'>
        <button id='openFormbtn' type='button'>Add New Link</button>
      </div>
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
  </div>
`

getLinks().then(renderLinks);

// Form functions
var form = document.getElementById("linkForm"); 
var formBtn = document.getElementById("openFormbtn"); 
var addBtn = document.getElementById("submitBtn"); 

var urlName = document.getElementById("urlName");
var url = document.getElementById("linkName");

var links = {
  table: []
};

formBtn.onclick = function (){
  form.style.display = "block";
}

addBtn.onclick = function (){
  window.log("button clicked");
  console.log('addBtn clicked');
  addLink(urlName, url);
  form.style.display = "none";
}

window.onclick = function(event){
  if (event.target == form) {
    form.style.display = "none";
  }
}

async function getLinks(){  
  try {
    const response = await axios.get('http://localhost:3001/api/urls');
    console.log(response.data);
  } catch (error) {
    console.error('Error getting links:', error);
  }
}

function renderLinks(links){
  const websiteDiv = document.querySelector('.websites');
  links.forEach(link => {
    const linkdiv = document.createElement('div');
    linkdiv.innerHTML = `
      <h1>${link.name}</h1>
      <a href="${link.url}" target="_blank">${link.url}</a>
    `;
    websiteDiv.appendChild(linkdiv);
  });
}

async function addLink(name, url){
  try {
    const response = await axios.post('http://localhost:3001/api/urls',{
      name: name.value,
      url: url.value
    });
    if (response.data.success){
      console.log('Link added successfully');
    }else{
      console.error('Failed to add link', response.data.error);
    }
  } catch (error) {
    console.error('Error adding link:', error);
  }
}
