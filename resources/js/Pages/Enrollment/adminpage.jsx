import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';

export default function Admin({ terminfo }) {
  const [startDate, setStartDate] = useState(terminfo['StartEnrollment']);
  const [endDate, setEndDate] = useState(terminfo['EndEnrollment']);
  const [isHidden, setIsHidden] = useState(terminfo['IsPerCollegeEnrollment'] == 1); 
  const [selectedCollege, setSelectedCollege] = useState('0');  // State for selected college
  const [colleges, setColleges]=useState([])

  useEffect(() => {
    const Colleges = async () => {
        try {
            const Response = await axios.post(route("colleges"));
            if (Response.data) {
                setColleges(Response.data)
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    Colleges()
  }, [terminfo]);

  const handleCheckboxChange = () => {
    setIsHidden(prev => !prev); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const data = {
        "isHidden":isHidden,
        "TermID": terminfo['TermID'],
        "CollegeID": selectedCollege,
        "ProgramID": "0",  
        "StartEnrollment": startDate,
        "EndEnrollment": endDate,
    };
  
    try {
        const response = await axios.post(route("SaveEnrollment"), {data:data});
        if (response.data) {
          Swal.fire({
            title: 'Success!',
            // text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745',
          })
        }
    } catch (error) {
        console.error("Error saving enrollment data:", error);
    }
};

  const handleCollegeChange = async (event) => {
    const selectedCollege = event.target.value;
    setSelectedCollege(selectedCollege);
    if (selectedCollege !== "" && selectedCollege !== "0") {
      setIsHidden(false)
      try {
        const response = await axios.post(route("college-Enrollment"), {
          collegeId: selectedCollege,
          termID:terminfo['TermID']
        });
        if (response.data) {
          if(response.data.length > 0){
            setStartDate(response.data[0]['StartEnrollment'])
            setEndDate(response.data[0]['EndEnrollment'])
          }else{
            setStartDate('')
            setEndDate('')
          }

        } 
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    }else{
      setIsHidden(terminfo['IsPerCollegeEnrollment'])
      setStartDate(terminfo['StartEnrollment'])
      setEndDate(terminfo['EndEnrollment'])
    }

    // if (selectedCollege !== "" && selectedCollege !== "0") {
    //   alert("1"); 
    //   try {
    //     const response = await axios.post(route("programs"), {
    //       collegeId: selectedCollege, 
    //     });

    //     if (response.data) {
    //       console.log(response.data);
    //     } else {
    //       console.error("No data received from the API");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching college data:", error);
    //   }
    // }
  }


  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-red-500 leading-tight">Hello Admin</h2>}
    >
      <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
        <div className="w-full p-2 bg-primary-dark">
          <label className="block text-2xl font-bold text-white text-center">Registration Configure</label>
        </div>

        <div className="flex justify-center items-center p-6">
          <form className="w-full max-w-md">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="term"
              >
                Term
              </label>
              <input
                type="text"
                id="term"
                value={terminfo['TermName']}
                disabled
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>


            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="college">
                College
              </label>
              <select
                id="college"
                onChange={handleCollegeChange}  
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="0">All College</option>
                {colleges.map((row, rowIndex) => (
                    <option key={rowIndex}  value={row.CollegeID}>
                        {row.CollegeName}
                    </option>
                ))}
              </select>
            </div>

            {/* {selectedCollege !== '0' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
                  Program
                </label>
                <select
                  id="program"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option defaultValue="">Program</option>
                </select>
              </div>
            )} */}

            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentType">
                Student Type
              </label>
              <select
                id="studentType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </div> */}
            
          {selectedCollege === '0' && (
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={isHidden}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2">Allow per College Enrollment</span>
              </label>
            </div>
          )}

          {!isHidden && (
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} // Correct arrow function syntax
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end-date">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} // Correct arrow function syntax
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          )}
            <div className="flex items-center justify-between">
              <button
                className="bg-primary-dark hover:bg-primary-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto mr-auto"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
