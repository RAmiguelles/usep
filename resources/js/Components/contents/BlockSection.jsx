import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

const BlockSection = ({datas, reload}) => {
    const [blockSection, setblockSection]=useState([])
    const [classsched, getClasssched]=useState([''])
    const [selectedClassSched, setSelectedClassSched] = useState([])
    const [showConfirm,setShowConfirm]=useState(false)
    const params={
        0:datas[1].CampusID,
        1:datas[1].TermID,
        2:datas[0].studentID,
        3:datas[0].collegeID,
        4:datas[0].progID
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    setblockSection(Response.data);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, [datas]);



    const test=(e)=>{
        e.preventDefault()
        const data={
            0:e.currentTarget.value,
            1:datas[0].studentID,
            2:datas[0].collegeID,
            3:datas[0].progID,
            4:datas[1].RegID
        }
        axios.post(route("getBlockClassSchedule"), { data })
        .then(response => {
            getClasssched(response.data)
            setSelectedClassSched([])
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
        setShowConfirm(false)
        axios.post(route("saveSubjects"), {selectedClassSched, cID : datas[1].CurriculumID,RegID:datas[1].RegID})
        .then(response => {
            if (response.data.error) {
                const errorMessage = response.data.error
                Swal.fire({
                    title: 'Conflict!',
                    text: errorMessage,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#FFC107',  // Yellow color for warning
                }).then(() => {
                    // Actions to perform after user confirms the success alert
                    reload(true);
                    setSelectedClassSched([]);
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Subjects saved successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745',  // Green color for success
                }).then(() => {
                    // Actions to perform after user confirms the success alert
                    reload(true);
                    setSelectedClassSched([]);
                });
            }
        }).catch(error => {
            console.error("Error saving subjects:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was a problem saving the subjects. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#D75D5F',
            });
        });
    }


  return (
    <>
        <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Block Section</label>
            <select id="blocksection" onChange={test} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue=''>Choose</option>
            {blockSection.map((row, rowIndex)=>(
                <option key={rowIndex} id={row.SectionID} value={row.SectionID} >{row.SectionName}</option>
            ))}
            </select>
        <div className="m-4">
            <form>
                <BlockSchedule value={classsched} onSelectionChange={handleSelectionChange} select={selectedClassSched}></BlockSchedule>
                <button type="button" onClick={()=>setShowConfirm(true)} disabled={selectedClassSched.length == []} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${selectedClassSched.length == [] ? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>submit</button>
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

export default BlockSection;