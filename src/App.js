import React from 'react';
import { useState, useEffect} from 'react';
import Select from "react-select";
import Pagination from './components/Pagination';
import Records from './components/Records';


function App() {

  // The data for planets, the names of residents on a planet,
  // the initial url, and a loading variable are stored here
  const [planets, setPlanets] = useState([]);
  const [url, setUrl] = useState("https://swapi.dev/api/planets/");
  const [isLoading, setLoading] = useState(true);
  const [residentNames, setResidentNames] = useState([]);

  // When a user goes to another page of the list of residents
  // These variables will updates
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;


  // The useEffect function runs as soon as the server starts
  useEffect(() => {
    // The data for planets is stored across multiple pages
    // The data is fetched from the first page, then added to planet variable
    // so that it can start displaying part of the full list.
    // The rest of the pages will continue to be fetched and added to the 
    // already existing list.
    async function fetchPlanets() { 
      let res = await fetch(url);
      let temp = await res.json();
      setUrl(temp.next);
      setPlanets(planets.concat(temp.results));
    }
    fetchPlanets();
    // eslint-disable-next-line
  }, [planets]);

  // Once a planet has been selected, the resident array is sent to get the data
  // for each url within it.
  // After the data is returned, loading is set to false that it can be displayed
  async function getResidentNames(planet) { 
    setResidentNames(await fetchPeople(planet.residents));
    setLoading(false);
  }

  // If a resident array has no entries, the empty array will be returned.
  async function fetchPeople(residents) { 
    if (residents.length > 0) {
      let i = 0;
      while (i < residents.length) {
        let res = await fetch(residents[i]);
        let temp = await res.json();
        residents[i] = temp.name;
        i++;
      }
    }
    return residents;
  }

  // This function will store the value of which planet is selected
  // from the dropdown menu
  function handleSelect(event) {
    setLoading(true);
    getResidentNames(planets[event.value]);
  }
  /*
  The data for planets is not loaded instantly. To prevent the code from 
  crashing, an if-else statement is used to control when the dropdown menu is
  displayed.
  After a planet is selected, the list of residents will then be displayed.

  */
  return (
    <div className='container mt=5' >

      <div style={{color: 'yellow'}}>
        <h1>Star Wars Planet Directory</h1>
        <br />
        <h4>Select a planet from the planet list:</h4>
      </div>

      <div>
        {(() => {
          if (typeof planets[0] != typeof undefined) {
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
          if (!isLoading) {
            return (
              <div>
                <div>                 
                  <Records data={residentNames.slice(indexOfFirstRecord, indexOfLastRecord)}/>
                </div>
                  <div>
                  <Pagination
                    nPages = { Math.ceil(residentNames.length / recordsPerPage) }
                    currentPage = { currentPage }
                    setCurrentPage = { setCurrentPage }
                    residents = {residentNames}
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
