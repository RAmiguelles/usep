import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { Schedule } from '@material-ui/icons';


const BlockSection = ({datas, reload, curUnit}) => {
    // const [blockSection, setblockSection]=useState([])
    // const [classsched, setClasssched]=useState([])
    // const [schedules, setSchedules]=useState([])
    // const [curSection,setcurSection]=useState([])
    const [enrolledSub,setenrolledSub]=useState([])
    const [loading,setloading]=useState(true)
    const [scheds,setscheds]=useState([])
    const [Availablescheds,setAvailablescheds]=useState([])
    const [defaultAvailableScheds,setDefaultAvailableScheds]=useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const params={
        'campusID':datas[0].CampusID,
        'termID':datas[0].TermID,
        'studentID':datas[0].StudentNo,
        'collegeID':datas[0].CollegeID,
        'progID':datas[0].ProgID
    }
    useEffect(() => {
        const fetchData = async () => {                                                         //get blocksection
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    // setSchedules(Response.data['schedules']);
                    const schedules= Response.data['schedules'];
                    const test =Response.data['sections'].filter(item => item.ProgCode === datas[0].ProgramCode).map(item => item.SectionID);
                    const Mscheds=[] 
                    const Ascheds=[]
                    Object.entries(schedules).forEach(([key, value]) => {
                        if (test.includes(key)) {
                            Mscheds.push(...value)
                        }else{
                            Ascheds.push(...value)
                        }
                    });
                    setscheds(Mscheds)
                    setAvailablescheds(Ascheds)
                    setDefaultAvailableScheds(Ascheds)
                    setloading(false)
                    if(datas[3]==true){
                        Swal.fire({
                            title: 'Success!',
                            text: 'Registration submitted',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#28a745',
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
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
    }, [datas]);

    const handleSelectionChange = (selectedBlockScehds) => {
        let total=curUnit
        let error=false
        selectedBlockScehds.forEach((item, index)=> {
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
                }).then(() => {
                    reload(true);
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
    const filterData = (e) => {
        const searchQuery = e.target.value
        setSearchQuery(searchQuery)
        const filter=defaultAvailableScheds.filter(item =>
            item.SubjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.SubjectTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setAvailablescheds(filter)
      };
  return (
    <>
    {loading ? 
        (
        // <div className="flex items-center">
        //   <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 border-primary-dark"></div>
        //   <p className="ml-2 text-xl font-bold">Loading...</p>
        // </div>
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
                <span class='sr-only'>Loading...</span>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
            </div>
        </div>
        ):(
        <div>
            <div className='m-4 p-2 border border-2 rounded-xl hover:border-2 hover:shadow-md'>
                <label className="block  text-base font-medium text-gray-900 dark:text-white m-4">CLASS SCHEDULE FOR {datas[0].ProgramCode}</label>
                    {/* <select id="blocksection" onChange={(e)=>{setcurSection(e.currentTarget.value)}} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {blockSection.map((row, rowIndex) => (
                        <option key={rowIndex} id={row.SectionID} value={row.SectionID} selected={row.SectionID === curSection}>
                            {row.SectionName}
                        </option>
                    ))}
                    </select> */}
                <div className="m-4">
                    <form>
                        <BlockSchedule value={scheds} onSelectionChange={handleSelectionChange} subs={enrolledSub} allow={[datas[2],datas[3]]}></BlockSchedule>
                    </form>
                </div>
            </div>

            <div className='m-4 p-2 border border-2 rounded-xl mt-12 hover:border-2 hover:shadow-md'>
                <label className="block  text-base font-medium text-gray-900 dark:text-white m-4 ">AVAILABLE CLASS SCHEDULE</label>
                    {/* <select id="blocksection" onChange={(e)=>{setcurSection(e.currentTarget.value)}} className=" m-4 w-1/4 block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {blockSection.map((row, rowIndex) => (
                        <option key={rowIndex} id={row.SectionID} value={row.SectionID} selected={row.SectionID === curSection}>
                            {row.SectionName}
                        </option>
                    ))}
                    </select> */}
                <div className="m-4">
                    <div className="flex justify-content-between justify-end mr-6">
                        <input
                            value={searchQuery}
                            onChange={(e) =>filterData(e)}
                            placeholder="Search by name or country"
                            className="p-inputtext-xl"
                        />
                    </div>
                    <form>
                        <BlockSchedule value={Availablescheds} onSelectionChange={handleSelectionChange} subs={enrolledSub} allow={[datas[2],datas[3]]}></BlockSchedule>
                    </form>
                </div>
            </div>
        </div>
        )}        
    </>
  );
};

export default BlockSection;