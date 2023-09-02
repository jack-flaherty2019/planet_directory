import React from 'react';
import { useState, useEffect} from 'react';
import Select from "react-select";
import Pagination from './components/Pagination';
import Records from './components/Records';


function App() {

  // The data for planets and people are stored in these variables
  const [planets, setPlanets] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState();

  // When a user goes to another page of the list of residents
  // These variables will updates
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // The useEffect function runs as soon as the server starts
  useEffect(() => {
    // The data for planets and people are stored across multiple pages
    // The data is fetched from the API and then appended 
    // to the respective array until all data is gathered from each page.
    async function fetchPlanets() { 
      let url = "https://swapi.dev/api/planets/";
      let res = await fetch(url);
      let temp = await res.json();
      let data = temp.results;
      url = temp.next;
      while (url != null) {
        res = await fetch(url);
        temp = await res.json();
        data = data.concat(temp.results);
        url = temp.next;
      }
      setPlanets(data);
    }

    async function fetchPeople() { 
      let url = "https://swapi.dev/api/people/";
      let res = await fetch(url);
      let temp = await res.json();
      let data = temp.results;
      url = temp.next;
      while (url != null) {
        res = await fetch(url);
        temp = await res.json();
        data = data.concat(temp.results);
        url = temp.next;
      }
      setPeople(data);
    }

    fetchPeople();
    fetchPlanets();
  }, []);

  // This function will store the value of which planet is selected
  // from the dropdown menu
  function handleSelect(event) {
    setSelectedPlanet(event.value);
  }
  /*
  The data for planets and people are not loaded instantly. To prevent the code from 
  crashing, an if-else statement is used to control when the dropdown menu is
  displayed. The planet data will load before the people data, so the menu
  will not appear until the people data is loaded. 
  After a planet is selected, the list of residents will then be displayed.

  */
  return (
    <div className='container mt=5' 
          >

      <div style={{color: 'yellow'}}>
        <h1>Star Wars Planet Directory</h1>
        <br />
        <h4>Select a planet from the planet list:</h4>
      </div>

      <div>
        {(() => {
          if (typeof people[0] != typeof undefined) {
            return (
              <div>
                <Select 
                  options={planets.map((val, key) => ({ label: val.name, value: key}))}
                  placeholder='Select Planet'
                  onChange={handleSelect}
                  defaultMenuIsOpen={true}
                />
                <br />
              </div>
            )
          }else {
            return (
              <p style={{color: 'yellow'}}>Loading Data...</p>
            )
          }  
        })()}
      </div>

      <div>
        {(() => {
          if (typeof selectedPlanet != typeof undefined) {
            return (
              <div>
                <div>                 
                  <Records data={planets[selectedPlanet].residents.slice(indexOfFirstRecord, indexOfLastRecord)}
                          people={people}/>
                </div>
                  <div>
                  <Pagination
                    nPages = { Math.ceil(planets[selectedPlanet].residents.length / recordsPerPage) }
                    currentPage = { currentPage }
                    setCurrentPage = { setCurrentPage }
                    residents = {planets[selectedPlanet].residents}
                  />
                </div>
              </div>
            )
          }else {
            return (
              <p></p>
            )
          }  
        })()}
      </div>
    </div>
  )
}

export default App;
