import React from 'react';
import { useState, useEffect } from "react";
import EnrollSubTable from '../tables/EnrollSubTable';
import Modal from '../Modalsubject';
import Print from '../print';
import BlockSchedule from '../tables/BlockSchedule';

const EnrollmentPage = ({reg,curUnit,status,subject,Assessment,allow,CurSubject,defaultAvailableScheds,addSubject,SwalConfirm,Submit}) => { //REG,CURUNIT,STATUS,ASSESSMENT,ALLOW,SURSUBJECT,AVAILABLESCHED,onSelectionChange
    const [searchQuery, setSearchQuery] = useState('');
    const [Availablescheds,setAvailablescheds]=useState([])
    const [show,setshow]=useState(false)
    
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
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">{!(Object.entries(reg).length > 0)?"List of Courses to be Enrolled":"List of Courses Enrolled"}</label></div>
                <div className="m-4">
                <form action="#" method="post">
                    <EnrollSubTable value={subject} onSelectionChange={SwalConfirm} TUnit={curUnit} allow={(!(Object.entries(reg).length > 0))}></EnrollSubTable>
                    <button type="button" onClick={Submit} disabled={((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Submit</button>
                    <button type="button" onClick={()=>{setshow(true)}} disabled={((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-left mt-3 ${((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Add Course</button>
                    <button type="button"   onClick={() => {
                                                    const currentURL = window.location.origin;  
                                                    const newURL = currentURL + '/evaluation';  
                                                    window.open(newURL, '_blank');  
                                                }} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-left mt-3 bg-gradient-to-r from-primary-light to-primary-dark`}>Evaluation</button>
                </form>
                </div>
            </div>

            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Billing Information</label></div>
                <Print data={[subject,Assessment]}></Print>
            </div>

        <div>
            <Modal show={show}>
                <div className="w-full p-2 bg-primary-dark relative">
                    <label className="block text-2xl font-bold text-white text-center">List of Subject</label>
                    <button
                    className="absolute top-2 right-2 text-white text-2xl font-bold mr-2"
                    onClick={()=>{setshow(false)}} 
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
                        <BlockSchedule value={Availablescheds} onSelectionChange={addSubject} subs={CurSubject} allow={allow}></BlockSchedule>
                    </form>
                </div>
            </Modal>
        </div>
    </>
  );
};

export default EnrollmentPage;