import React from "react";

const Pagination = ({ nPages, currentPage, setCurrentPage, residents }) => {

    //This creates an array of numbers that go up to the number of residents
    // for the selected planet
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    //The next 2 functions are called when the 'next' or 'previous' buttons are clicked
    const nextPage = () => {
        if (currentPage !== nPages) setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }

    //The component will return a set of buttons that allow for pagination
    //to each page of the list of residents for a certain planet.
    //If there are no residents, the buttons will not be displayed.
    if (residents.length === 0) {
        return (
            <p></p>
        )
    } else {
        return (
            <nav>
                <ul className='pagination justify-content-center'>
                    <li className="page-item">
                        <button style={{backgroundColor: 'darkgray'}} className="page-link" onClick={prevPage}> Previous</button>
                    </li>
                
                    {pageNumbers.map(pgNumber => (
                        <li key={pgNumber} >

                            <button style={{backgroundColor: "darkgray"}} onClick={() => setCurrentPage(pgNumber)} className='page-link'>
                                {pgNumber}
                            </button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button style={{backgroundColor: "darkgray"}} className='page-link' onClick={nextPage}>next</button>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Pagination