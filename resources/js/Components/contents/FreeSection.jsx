import React from 'react';
import FreeSchedule from "@/Components/tables/FreeSchedule";
<<<<<<< Updated upstream
import { useState } from "react";

const FreeSection = ({blockSec,student,reg}) => {
=======
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const FreeSection = ({datas, reload}) => {
    const [freeSection, setfreeSection]=useState([])
>>>>>>> Stashed changes
    const [classsched, getClasssched]=useState([''])
    const [selectedClassSched, setSelectedClassSched] = useState([]);
    const [showConfirm,setShowConfirm]=useState(false)

    const test=(e)=>{
        e.preventDefault()
        const data={
            0:e.currentTarget.value,
            1:student.StudentNo,
            2:reg.CollegeID,
            3:reg.ProgID,
            4:reg.RegID
        }
        axios.post(route("getBlockClassSchedule"), { data })
        .then(response => {
            getClasssched(response.data)
            console.log(classsched); 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const handleSelectionChange = (selectedFreeScehds) => {
        setSelectedClassSched(selectedFreeScehds);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(route("saveSubjects"), {selectedClassSched, RegID : datas[1].RegID})
        .then(response => {
            reload(true)
            setSelectedClassSched([])
            setShowConfirm(false)
        })
      }


  return (
    <>
        <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Free Section</label>
            <select id="blocksection" onChange={test} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue='' >Choose</option>
            {blockSec.map((row, rowIndex)=>(
                <option key={rowIndex} id={row.SectionID} value={row.SectionID} >{row.SectionName}</option>
            ))}
            </select>
        <div className="m-4">
            <form method="post">
                <FreeSchedule value={classsched} onSelectionChange={handleSelectionChange}></FreeSchedule>
            <button type="button" onClick={()=>setShowConfirm(true)} className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3">submit</button>
            </form>
        </div>
        
        <Modal show={showConfirm} maxWidth='md'>
            <div className='p-0 m-3'>
                <div className='flex flex-column items-center justify-center p-3'>
                    <img className="self-center" src="/img/warning.png" alt="Warning" />
                    <p>Are you sure you want to Add this item?</p>
                </div>
                <div className='w-auto flex justify-center'>
                    <SecondaryButton className="m-2" onClick={()=>setShowConfirm(false)}>
                    Close
                    </SecondaryButton>
                    <SecondaryButton className="m-2" onClick={handleSubmit}>
                    Confirm
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    </>
  );
};

export default FreeSection;