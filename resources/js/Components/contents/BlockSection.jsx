import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { Schedule } from '@material-ui/icons';


const BlockSection = ({datas, reload, curUnit}) => {
    const [blockSection, setblockSection]=useState([])
    const [classsched, setClasssched]=useState([])
    const [schedules, setSchedules]=useState([])
    const [curSection,setcurSection]=useState([])
    const [enrolledSub,setenrolledSub]=useState([])
    const [loading,setloading]=useState(true)
    const params={
        'campusID':datas[0].CampusID,
        'termID':datas[0].TermID,
        'studentID':datas[0].StudentNo,
        'collegeID':datas[0].CollegeID,
        'progID':datas[0].ProgID
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    setblockSection(Response.data['sections']);
                    setSchedules(Response.data['schedules']);
                    const Response2 = await axios.post(route("getSection"),{params});
                    if (Response2.data) {
                        setcurSection(Response2.data[0].SectionID)
                        setloading(false)
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

    useEffect(() => {
        const Section=()=>{
            setClasssched(schedules[curSection])
    
        }
        Section()
    },[curSection]);

    const handleSelectionChange = (selectedBlockScehds) => {
        let total=curUnit
        let error=false
        selectedBlockScehds.forEach((item, index)=> {
            if(item.Registered==item.Limit){
                error=true
                selectedBlockScehds.splice(index);

                Swal.fire({
                    title: 'Error!',
                    text: item.SubjectTitle+" exceeds the maximum limit",
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#D75D5F',
                });
                
            }

            if(Number(total+Number(item.CreditUnits)) > datas[0].MaxUnitsLoad){
                error=true
                selectedBlockScehds.splice(index);
                Swal.fire({
                    title: 'Error!',
                    text:"You exceeds "+datas[0].MaxUnitsLoad+" unit limit subject: "+item.SubjectTitle+" cannot be add",
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#D75D5F',
                });
            }else{
                total+=Number(item.CreditUnits)
            }
        });
        if(error==false){
         Submit(selectedBlockScehds);
        }
    }
    
    const Submit = (e) => {
        axios.post(route("saveSubjects"), {e, term: datas[0].TermID, yearLevel:datas[0].YearLevelID, RegID:datas[1].RegID})
        .then(response => {
            if (response.data.error) {
                const errorMessage = response.data.error.split('\n').join('<br />');
                Swal.fire({
                    html:errorMessage,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#FFC107', 
                })
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
    {loading ? 
        (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 border-primary-dark"></div>
          <p className="ml-2 text-xl font-bold">Loading...</p>
        </div>
        ):(
        <div>
            <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Block Section</label>
                <select id="blocksection" onChange={(e)=>{setcurSection(e.currentTarget.value)}} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {blockSection.map((row, rowIndex) => (
                    <option key={rowIndex} id={row.SectionID} value={row.SectionID} selected={row.SectionID === curSection}>
                        {row.SectionName}
                    </option>
                ))}
                </select>
            <div className="m-4">
                <form>
                    <BlockSchedule value={classsched} onSelectionChange={handleSelectionChange} subs={enrolledSub} allow={datas[2]}></BlockSchedule>
                </form>
            </div>
        </div>
        )}        
    </>
  );
};

export default BlockSection;