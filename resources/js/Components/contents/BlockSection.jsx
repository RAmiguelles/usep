import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";
import Modal from '@/Components/Modalsubject';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { Schedule } from '@material-ui/icons';


const BlockSection = ({info,CurSubject , listOfSubject,addsubject, allow, show,setshow}) => {
    // const [blockSection, setblockSection]=useState([])
    // const [classsched, setClasssched]=useState([])
    // const [schedules, setSchedules]=useState([])
    // const [curSection,setcurSection]=useState([])
    const [enrolledSub,setenrolledSub]=useState([])
    const [loading,setloading]=useState(true)
    const [Availablescheds,setAvailablescheds]=useState([])
    const [defaultAvailableScheds,setDefaultAvailableScheds]=useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const params={
        'campusID':info.CampusID,
        'termID':info.TermID,
        'studentID':info.StudentNo,
        'collegeID':info.CollegeID,
        'progID':info.ProgID,
        'YearLevel':info.YearLevelID
    }
    useEffect(() => {
        const fetchData = async () => {                                                         //get blocksection
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    // setSchedules(Response.data['schedules']);
                    const schedules= Response.data['schedules'];
                    const Mscheds=[]
                    // const advise =Response.data['sections'].filter(item => item.ProgCode === info.ProgramCode && item.YearLevelID == info.YearLevelID).map(item => item.SectionID);
                    const filteredSchedules = schedules.filter(schedule => schedule.YearLevelID == info.YearLevelID && schedule.CurriculumID==info.CurriculumID);
                    Mscheds.unshift(...filteredSchedules);
                    const Ascheds=Response.data['schedules']
                    // Object.entries(schedules).forEach(([key, value]) => {
                    //     if (advise.includes(key)) {
                    //         Mscheds.unshift(...value)
                    //     }
                    //     Ascheds.push(...value)
                    // });
                    const Response2 = await axios.post(route("checkconflict"),{array1:Mscheds, array2:[]});
                    if (Response2.data) {
                        console.log(Response2)
                        listOfSubject(Response2.data)
                    }
                    // listOfSubject(Mscheds)
                    setDefaultAvailableScheds(Ascheds)
                    setloading(false)
                    // if(datas[3]==true){
                    //     Swal.fire({
                    //         title: 'Success!',
                    //         text: 'Registration submitted',
                    //         icon: 'success',
                    //         confirmButtonText: 'OK',
                    //         confirmButtonColor: '#28a745',
                    //     })
                    // }
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, []);


    // useEffect(() => {
    //     if(datas[1].RegID){
    //         const enrolledSubject = async () => {
    //             try {
    //                 const Response = await axios.post(route("getEnrollSubject"),{data:datas[1].RegID});
    //                 if (Response.data) {
    //                     setenrolledSub(Response.data)
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching profile data:", error);
    //             }
    //         };

    //         enrolledSubject();
    //     }
    // }, [datas]);

    // const handleSelectionChange = (selectedBlockScehds) => {
        // let total=curUnit
        // let error=false
        // selectedBlockScehds.forEach((item, index)=> {
        //     if(Number(total+Number(item.CreditUnits)) > info.MaxUnitsLoad){
        //         error=true
        //         selectedBlockScehds.splice(index);
        //         Swal.fire({
        //             title: 'Error!',
        //             text:"You exceeds "+info.MaxUnitsLoad+" unit limit subject: "+item.SubjectTitle+" cannot be add",
        //             icon: 'error',
        //             confirmButtonText: 'OK',
        //             confirmButtonColor: '#D75D5F',
        //         });
        //     }else{
        //         total+=Number(item.CreditUnits)
        //     }
        // });
        // if(error==false){
        //  Submit(selectedBlockScehds);
        // }
    // }
    
    // const Submit = (e) => {
    //     axios.post(route("saveSubjects"), {e, term: info.TermID, yearLevel:info.YearLevelID, RegID:datas[1].RegID})
    //     .then(response => {
    //         if (response.data.error) {
    //             const errorMessage = response.data.error.split('\n').join('<br />');
    //             Swal.fire({
    //                 html:errorMessage,
    //                 icon: 'warning',
    //                 confirmButtonText: 'OK',
    //                 confirmButtonColor: '#FFC107', 
    //             }).then(() => {
    //                 reload(true);
    //             });
    //         } else {
    //             Swal.fire({
    //                 title: 'Success!',
    //                 text: response.data.message || 'Subjects saved successfully.',
    //                 icon: 'success',
    //                 confirmButtonText: 'OK',
    //                 confirmButtonColor: '#28a745',
    //             }).then(() => {
    //                 if(!datas[1].RegID){
    //                     window.location.reload();
    //                 }
    //                 reload(true);
    //             });
    //         }
            
    //     }).catch(error => {
    //         console.error("Error saving subjects:", error);
    //         Swal.fire({
    //             title: 'Error!',
    //             text: 'There was a problem saving the subjects. Please try again.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //             confirmButtonColor: '#D75D5F',
    //         });
    //     });
    // }
    
    const filterData = (e) => {
        const searchQuery = e.target.value
        setSearchQuery(searchQuery)
        if(searchQuery == ''){
            setAvailablescheds([])
        }else{
            const schedID=CurSubject.map(sub => sub.ScheduleID)
            const filter=defaultAvailableScheds.filter(item =>
                item.SubjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.SubjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.SectionName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            const test=filter.filter(item=>!schedID.includes(item.ScheduleID))
            setAvailablescheds(test)
        }

      };
  return (
    <>
    {loading ? 
        (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            {/* <div class='flex space-x-2 justify-center items-center bg-white h-full dark:invert'>
                <span class='sr-only'>Loading...</span>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
            </div> */}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
            </div>
        </div>
        ):(
        <div>
            {/* <div className='m-4 p-2 border border-2 rounded-xl mt-12 hover:border-2 hover:shadow-md'>
                <label className="block  text-base font-medium text-gray-900 dark:text-white m-4 ">AVAILABLE CLASS SCHEDULE</label>
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
                        <BlockSchedule value={Availablescheds} onSelectionChange={handleSelectionChange} subs={CurSubject} allow={allow}></BlockSchedule>
                    </form>
                </div>
            </div> */}
            <Modal show={show}>
                <div className="w-full p-2 bg-primary-dark relative">
                    <label className="block text-2xl font-bold text-white text-center">List of Subject</label>
                    <button
                    className="absolute top-2 right-2 text-white text-2xl font-bold mr-2"
                    onClick={setshow} 
                    type="button"
                    >
                    x
                    </button>
                </div>
                <div className="page-content p-4">
                    <div className="flex justify-content-between justify-end mr-6">
                        <input
                            value={searchQuery}
                            onChange={(e) =>filterData(e)}
                            placeholder="Search by name or country"
                            className="p-inputtext-xl"
                        />
                    </div>
                    <form>
                        <BlockSchedule value={Availablescheds} onSelectionChange={addsubject} subs={CurSubject} allow={allow}></BlockSchedule>
                    </form>
                </div>
            </Modal>
        </div>
        )}        
    </>
  );
};

export default BlockSection;