import './style.css'
import image from './javascript.svg'

document.querySelector('#app').innerHTML = `
  <div class='mainWindow'>
    <div class'header'>
      <h1>My Dashboard</h1>
    </div>
    <div class='websites'>
      <div>
        <h1>Name</h1>
        <a href="">
          <img src="${image}" alt="">
        </a>
      </div>
      <div>
        <h1>Name</h1>
        <a href="">link name</a>
      </div>
      <div>
        <h1>Name</h1>
        <a href="">link name</a>
      </div>
      <div>
        <h1>Name</h1>
        <a href="">link name</a>
      </div>
      <div>
        <h1>Name</h1>
        <a href="">link name</a>
      </div>
      <div>
        <h1>Name</h1>
        <a href="">link name</a>
      </div>
    </div>
  </div>
`

