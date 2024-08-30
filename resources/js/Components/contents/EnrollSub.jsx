import React from 'react';
import EnrollSubTable from "@/Components/tables/EnrollSubTable";
import { useState,useEffect, useRef } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useReactToPrint } from 'react-to-print';
import Print from '../print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons'

const EnrollSub = ({data, reload, isopen, load, curUnit}) => {
    const[enrollSubject, setenrollSubject]=useState([]);
    const [selectedSub, setSelectedSub] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const[Assessment, setAssessment]=useState([]);
    const[Total, setTotal]=useState('');
    const componentRef=useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const Response = await axios.post(route("getEnrollSubject"),{data: data.RegID });
                if (Response.data) {
                    let total=0
                    Response.data.forEach((item)=> {
                        total+=Number(item.CreditUnits)
                    });
                    curUnit(total)
                    setenrollSubject(Response.data);
                    load(false)
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        const fetchAssessment = async () => {
            try {
                const Response = await axios.post(route("getassessment"),{term:data.TermID,template:data.TableofFeeID});
                if (Response.data) {
                    setAssessment(Response.data.response);
                    setTotal(Response.data.total);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
        fetchAssessment();
    }, [data,reload]);

    const handleSelectionChange = (selectedSubs) => {
        setSelectedSub(selectedSubs);
    }


    const handleDelete = (e) => {
        e.preventDefault();
        axios.post(route("deleteSubjects"), {selectedSub})
        .then(response => {
            setenrollSubject(response.data);
            setSelectedSub([])
            setShowDelete(false)
        })
    }

    const printData=useReactToPrint({
        content:()=> componentRef.current,
        documentTittle:"COR"
    })


  return (
    <>
        <Print componentRef={componentRef} data={[enrollSubject,Assessment,Total]} style={{display:'none'}}></Print>
        <div className="flex items-center justify-between m-4"> {/* Container for label and print button */}
                {/* <button className="self-end ml-4 text-black font-bold py-2 px-4 rounded" type="button" onClick={printData}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>  Print</button> */}
            </div>
        <div className="m-4">
            <form action="#" method="post">
                <EnrollSubTable value={enrollSubject} onSelectionChange={handleSelectionChange} select={selectedSub}></EnrollSubTable>
                <button type="button" onClick={()=>setShowDelete(true)} disabled={selectedSub.length === 0 || !isopen} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${selectedSub.length === 0 || !isopen ? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Remove</button>
                <button type="button" onClick={printData} className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3"><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>  Print</button>
            </form>
        </div>
        
        <Modal show={showDelete} maxWidth='md'>
            <div className='p-0 m-3'>
                <div className='flex flex-column items-center justify-center p-3'>
                    <img className="self-center" src="/img/warning.png" alt="Warning" />
                    <p>Are you sure you want to delete this item?</p>
                </div>
                <div className='w-auto flex justify-center'>
                    <SecondaryButton className="m-2" onClick={()=>setShowDelete(false)}>
                    Close
                    </SecondaryButton>
                    <SecondaryButton className="m-2" onClick={handleDelete}>
                    Confirm
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    </>
  );
};

export default EnrollSub;