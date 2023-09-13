import React from 'react';
import { useState, useEffect} from 'react';
import Select from "react-select";
import Pagination from './components/Pagination';
import Records from './components/Records';


function App() {

  // The data for planets, the names of residents on a planet,
  // the initial url, and a loading variable are stored here
  const [planets, setPlanets] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDisabled, setDisabled] = useState(false);
  const [index, setIndex] = useState();
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
      let url = "https://swapi.dev/api/planets/"
      let data = [];
      while (url != null) {
        let res = await fetch(url);
        let temp = await res.json();
        url = temp.next;
        data = data.concat(temp.results)
        setPlanets(data);
      }
    }
    fetchPlanets();
  }, []);

  // When a user goes to another page of residents, 
  // the data for that page will then be pulled from the api. 
  useEffect(() => {
    if (index !== undefined && currentPage !== 1) {
      getResidentNames2(planets[index].residents.slice(indexOfFirstRecord, indexOfLastRecord));
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // Once a planet has been selected, the first 10 residents are sent to 
  // this function to get their name for each url.
  // After the data is returned, loading is set to false that it can be displayed
  async function getResidentNames1(residents) {
    setLoading(true);
    setDisabled(true);

    setResidentNames(await fetchPeople(residents));

    setDisabled(false);
    setLoading(false);
    return;
  }

  // This function serves to add to the residentName array after the user
  // goes to another page of the list. The data is stored until another
  // planet is chosen so that the user may go back and forth without any
  // load times.
  async function getResidentNames2(residents) {
    setLoading(true);
    setDisabled(true);
    if (!(residentNames.length > (indexOfLastRecord))) {
      setResidentNames(residentNames.concat(await fetchPeople(residents)));
    }

    setDisabled(false);
    setLoading(false);
    return;
  }

  // If a resident array has no entries, the empty resident array will be returned.
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
  // from the dropdown menu. The first set of 10 residents is also 
  // fetched after the planet is selected.
  function handleSelect(event) {
    setIndex(event.value);
    setCurrentPage(1);
    getResidentNames1(planets[event.value].residents.slice(0, 10));
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
                  isDisabled={isDisabled}
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
                    nPages = { Math.ceil(planets[index].residents.length / recordsPerPage) }
                    currentPage = { currentPage }
                    setCurrentPage = { setCurrentPage }
                    nPeople = {planets[index].residents}
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
