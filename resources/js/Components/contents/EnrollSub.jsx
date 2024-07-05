import React from 'react';
import EnrollSubTable from "@/Components/tables/EnrollSubTable";
import { useState,useEffect } from "react";
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const EnrollSub = ({data, reload, load}) => {
    const[enrollSubject, setenrollSubject]=useState(['']);
    const [selectedSub, setSelectedSub] = useState([]);
    const [show, setShow] = useState(false);
   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const Response = await axios.post(route("getEnrollSubject"),{data});
                if (Response.data) {
                    setenrollSubject(Response.data);
                    console.log('test')
                    load(false)
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, [data, reload]);

    const handleSelectionChange = (selectedSubs) => {
        setSelectedSub(selectedSubs);
    }


    const handleDelete = (e) => {
        e.preventDefault();
        axios.post(route("deleteSubjects"), {selectedSub})
        .then(response => {
            setenrollSubject(response.data);
            setSelectedSub([])
        })
    }


  return (
    <>
        <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Enroll Sub</label>

        <div className="m-4">
            <form action="#" method="post">
                <EnrollSubTable value={enrollSubject} onSelectionChange={handleSelectionChange} select={selectedSub}></EnrollSubTable>
                <button type="button" onClick={handleDelete} className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right">Remove</button>
                <button type="button" onClick={()=>setShow(true)} className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right">Fees</button>
            </form>
        </div>
        
        <Modal show={show}>
                            <div className='header p-4 bg-gradient-to-r from-primary-light to-primary-dark'></div>
                            <div className='p-0'>
                                <div className='w-auto items-center justify-center p-12'>
                                    test
                                </div>
                                <div className='w-auto flex justify-center'>
                                    <SecondaryButton className="justify-self-center" onClick={()=>setShow(false)}>
                                        Close
                                    </SecondaryButton>
                                </div>
                            </div>
                            <div className='footer p-4 mt-12 bg-gradient-to-r from-primary-light to-primary-dark'></div>
            </Modal>
    </>
  );
};

export default EnrollSub;