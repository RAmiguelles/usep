import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState } from "react";

const BlockSection = ({blockSec,student,reg}) => {
    const [classsched, getClasssched]=useState([''])
    const [selectedClassSched, setSelectedClassSched] = useState([]);

    const test=(e)=>{
        e.preventDefault()
        const data={
            0:e.currentTarget.value,
            1:student.StudentNo,
            2:reg.CollegeID,
            3:reg.ProgID,
            4:reg.RegID
        }
        console.log(data)
        axios.post(route("getBlockClassSchedule"), { data })
        .then(response => {
            getClasssched(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const handleSelectionChange = (selectedBlockScehds) => {
        setSelectedClassSched(selectedBlockScehds);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(selectedClassSched)
      }


  return (
    <>
        <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Block Section</label>
            <select id="blocksection" onChange={test} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue=''>Choose</option>
            {blockSec.map((row, rowIndex)=>(
                <option key={rowIndex} id={row.SectionID} value={row.SectionID} >{row.SectionName}</option>
            ))}
            </select>
        <div className="m-4">
            <form action="#" onSubmit={handleSubmit} method="post">
                <BlockSchedule value={classsched} onSelectionChange={handleSelectionChange}></BlockSchedule>
                <button type="submit" className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right">submit</button>
            </form>
        </div>
    </>
  );
};

export default BlockSection;