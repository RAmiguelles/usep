import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

const BlockSection = ({datas, reload, curUnit}) => {
    const [blockSection, setblockSection]=useState([])
    const [classsched, getClasssched]=useState([''])
    const [selectedClassSched, setSelectedClassSched] = useState([])
    const [showConfirm,setShowConfirm]=useState(false)
    const [curSection,setcurSection]=useState([])
    const [enrolledSub,setenrolledSub]=useState([])
    const params={
        0:datas[0].campusID,
        1:datas[0].termID,
        2:datas[0].studentID,
        3:datas[0].collegeID,
        4:datas[0].progID
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    const filteredData = Response.data.filter(item => item.YearLevelID >= datas[0].yearLevel[0]);
                    setblockSection(filteredData);
                    const Response2 = await axios.post(route("getSection"),{params});
                    if (Response2.data) {
                        setcurSection(Response2.data[0])
                        test(Response2.data[0].SectionID)
                    }
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        if(datas[1].RegID){
            const enrolledSubject = async () => {
                try {
                    const Response = await axios.post(route("getEnrollSubject"),{data:datas[1].RegID});
                    if (Response.data) {
                        setenrolledSub(Response.data)
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            };

            enrolledSubject();
        }

        fetchData();
    }, [datas]);


    const test=(e)=>{
        let val = e.currentTarget ? e.currentTarget.value : e;
        const data={
            0:val,
            1:datas[0].studentID,
            2:datas[0].collegeID,
            3:datas[0].progID
        }
        axios.post(route("getBlockClassSchedule"), { data })
        .then(response => {
            const sortedData = [...response.data].sort((a, b) => {
                return a.SubjectCode.localeCompare(b.SubjectCode);
            });
            getClasssched(sortedData);
            setSelectedClassSched([]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
  
    const handleSelectionChange = (selectedBlockScehds) => {
        let total=curUnit
        selectedBlockScehds.forEach((item, index)=> {
            if(item.Registered==item.Limit){
                selectedBlockScehds.splice(index);

                Swal.fire({
                    title: 'Error!',
                    text: item.SubjectTitle+" exceeds the maximum limit",
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#D75D5F',
                });
            }

            if(Number(total+Number(item.CreditUnits)) > datas[0].maxUnitsLoad){
                selectedBlockScehds.splice(index);
                Swal.fire({
                    title: 'Error!',
                    text:"You exceeds "+datas[0].maxUnitsLoad+" unit limit subject: "+item.SubjectTitle+" cannot be add",
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#D75D5F',
                });
            }else{
                total+=Number(item.CreditUnits)
            }
        });
        setSelectedClassSched(selectedBlockScehds);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(false)
        axios.post(route("saveSubjects"), {selectedClassSched, term: datas[0].termID, cCode:datas[0].curriculumCode, yearLevel:datas[0].yearLevel, RegID:datas[1].RegID})
        .then(response => {
            if (response.data.error) {
                const errorMessage = response.data.error
                Swal.fire({
                    title: 'Conflict!',
                    text: errorMessage,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#FFC107', 
                }).then(() => {
                    reload(true);
                    setSelectedClassSched([]);
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Subjects saved successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745',
                }).then(() => {
                    if(!datas[1].RegID){
                        window.location.reload();
                    }
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
            {blockSection.map((row, rowIndex) => (
                <option key={rowIndex} id={row.SectionID} value={row.SectionID} selected={row.SectionName === curSection.SectionName}>
                    {row.SectionName}
                </option>
            ))}
            </select>
        <div className="m-4">
            <form>
                <BlockSchedule value={classsched} allow={datas[2]} onSelectionChange={handleSelectionChange} select={selectedClassSched} subs={enrolledSub}></BlockSchedule>
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
                    <SecondaryButton className="m-2" onClick={handleSubmit}>
                    Confirm
                    </SecondaryButton>
                    <SecondaryButton className="m-2" onClick={()=>setShowConfirm(false)}>
                    Cancel
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    </>
  );
};

export default BlockSection;