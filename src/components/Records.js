import React from "react";

const Records = ({data}) => {

    //The component returns a table that will loop through each value
    //in the residentName array and display each name.
    //If there are no residents, a message is displayed saying that the user 
    //Needs to select another planet.
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
                            <td style={{color: "white"}}>{val}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default Records