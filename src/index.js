import { note } from './module';
import './style.css';
import icon from './img/logoBlack.png';
import data from './soil.csv';

import React from "react";
import ReactDOM from "react-dom";


const App = () => {

  return (
    <>
      {data.map(trip => (
        <City key={trip.Id} trip={trip} />
      ))}
    </>
  );


};

const City = ({ trip }) => {
  return (<div className='city'><h3>{trip.Trip}</h3><p>, {trip.City}</p></div>);
}

ReactDOM.render(<App />, document.getElementById("root"));
