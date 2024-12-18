import React from 'react';
import EnrollSubTable from "@/Components/tables/EnrollSubTable";
import { useState,useEffect, useRef } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useReactToPrint } from 'react-to-print';
import Print from '../print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

const EnrollSub = ({data, curUnit, isopen, load, reload}) => {
    const[enrollSubject, setenrollSubject]=useState([]);
    const [selectedSub, setSelectedSub] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const[Assessment, setAssessment]=useState([]);
    const[Total, setTotal]=useState('');
    const componentRef=useRef();
    
    useEffect(() => {
        if(data.RegID){
            const fetchData = async () => {
                try {
                    const response = await axios.post(route("getEnrollSubject"), { data: data.RegID });
                    if (response.data) {
                        let total = 0;
                        response.data.forEach((item) => {
                            total += Number(item.CreditUnits);
                        });
                        curUnit(total);
                        setenrollSubject(response.data);
                        load(false);
                    }
                } catch (error) {
                    console.error("Error fetching enroll subjects:", error);
                }
            };
    
            // const fetchAssessment = async () => {
            //     try {
            //         const response = await axios.post(route("getassessment"), { term: data.TermID, template: data.TableofFeeID });
            //         if (response.data) {
            //             setAssessment(response.data.response);
            //             setTotal(response.data.total);
            //         }
            //     } catch (error) {
            //         console.error("Error fetching assessment data:", error);
            //     }
            // };
    
            fetchData();
            // fetchAssessment();
        }else{
            Swal.fire({
                title: 'Warning!',
                text: "Ensure that any unpaid balance is settled with the cashier.",
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#D75D5F',
            });
        }
    }, [reload]);

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
            Swal.fire({
                title: 'Success!',
                text: "Schedules removed",
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#28a745',
            }).then(() => {
                load(true);
            });
        })
    }

    const isFinal = () => {
        axios.post(route("isFinal"), {regID:data.RegID})
        .then(response => {
            window.location.reload();   
        })
    }

    // const printData=useReactToPrint({
    //     content:()=> componentRef.current,
    //     documentTittle:"COR"
    // })

  return (
    <>
        {/* <Print componentRef={componentRef} data={[enrollSubject,Assessment,Total,data]} style={{display:'none'}}></Print> */}
        <div className="flex items-center justify-between m-4"> {/* Container for label and print button */}
            </div>
        <div className="m-4">
            <form action="#" method="post">
                <EnrollSubTable value={enrollSubject} onSelectionChange={handleSelectionChange} select={selectedSub}></EnrollSubTable>
                <button type="button" onClick={()=>setShowDelete(true)} disabled={selectedSub.length === 0 || !isopen || isallow} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${selectedSub.length === 0 || !isopen || isallow ? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Remove</button>
                <button type="button" onClick={()=>isFinal()} disabled={enrollSubject.length === 0 || !isopen || isallow} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${enrollSubject.length === 0 || !isopen || isallow ? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Submit</button>
                {/* <button type="button" onClick={printData} disabled={enrollSubject.length===0 || !isopen } className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${enrollSubject.length===0 || !isopen ? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>  Print</button> */}
            </form>
        </div>
        
        <Modal show={showDelete} maxWidth='md'>
            <div className='p-0 m-3'>
                <div className='flex flex-column items-center justify-center p-3'>
                    <img className="self-center" src="/img/warning.png" alt="Warning" />
                    <p>Are you sure you want to delete this item?</p>
                </div>
                <div className='w-auto flex justify-center'>
                <SecondaryButton className="m-2" onClick={handleDelete}>
                    Confirm
                    </SecondaryButton>
                    <SecondaryButton className="m-2" onClick={()=>setShowDelete(false)}>
                    Cancel
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    </>
  );
};

export default EnrollSub;