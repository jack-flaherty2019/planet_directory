import React from "react";

const Records = ({data, people}) => {

    //This function takes the url for each resident and returns their
    //name to be displayed in the list
    function displayResidents(resident) {
        //the url for people include a number, the number is extracted
        //to then be used as the id for finding it in the array for people
        let id = (resident.slice(29, -1));
        //'id' needs to be subtracted by 1 as their location in the people
        //array is 1 less than then their location in the API
        //it is subtracted by 2 for higher numbers because it goes from
        //person 16 to 18 in API data
        id < 17 ? id-- : id = id - 2;
        return (people[id].name);
      }

    //The component returns a table that will loop through each value
    //in the resident array and display each entry with their name
    if (data.length === 0) {
        return (
            <p style={{color: "yellow"}}>Error: No resident data, try another planet!</p>
        )
    } else {
        return (
            <table className="table" style={{backgroundColor: 'grey'}}>
                <thead>
                    <tr>
                        <th scope="col">Residents: </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((val, key) => 
                        <tr key={key}>
                            <td style={{color: "white"}}>{displayResidents(val)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default Records