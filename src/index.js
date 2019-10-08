import { note } from './module';
import './style.css';
import icon from './img/logoBlack.png';
import data from './soil.csv';

const component = () => {
  const element = document.createElement('div');

  const myIcon = new Image();
  myIcon.src = icon;
  myIcon.classList.add('icon');

  element.appendChild(myIcon);
  element.innerHTML += note();
  element.classList.add('note');

  data.forEach(trip => {
    element.innerHTML += `<div class='city'><h3>${trip.Trip}</h3><p>, ${trip.City}</p></div>`;
  });

  return element;
}

document.body.appendChild(component());

// console.log('Hi. How do you do?');
//
// import mapProp from './mapProp.js';
// import { render } from './mapFunctions.js';
// const csv = d3.csv;
// const map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
//
// const csvData = csv('./modules/soil.csv').then(mapData => {
//     render(mapData, map);
//   });
