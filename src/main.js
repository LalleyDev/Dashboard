import './style.css'
import image from './javascript.svg'
import jsonFile from './linkData.json'
import appendFile from 'fs';

document.querySelector('#app').innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'>
      <div>
        <h1>Test</h1>
        <a href="">
          <img src="${image}" alt="">
        </a>
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
  addLink(urlName, url);
  form.style.display = "none";
}

window.onclick = function(event){
  if (event.target == form) {
    form.style.display = "none";
  }
}

function addLink(Name,Link){
  links.table.push({name:Name.value,link:Link.value});
  var json = JSON.stringify(links,null,2);
  console.log(json);
  appendFile(jsonFile,json,(err)=>{
    if (err) throw err;
    console.log("success");
  });
}
