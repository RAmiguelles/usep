import React from 'react';
import BlockSchedule from "@/Components/tables/BlockSchedule";
import { useState, useEffect } from "react";

const BlockSection = ({datas, reload}) => {
    const [blockSection, setblockSection]=useState([])
    const [classsched, getClasssched]=useState([''])
    const [selectedClassSched, setSelectedClassSched] = useState([]);

    const params={
        0:datas[1].CampusID,
        1:datas[1].TermID,
        2:datas[0].studentID,
        3:datas[1].CollegeID,
        4:datas[1].ProgID
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
            2:datas[1].CollegeID,
            3:datas[1].ProgID,
            4:datas[1].RegID
        }
        axios.post(route("getBlockClassSchedule"), { data })
        .then(response => {
            getClasssched(response.data)
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
        axios.post(route("saveSubjects"), {selectedClassSched, RegID : datas[1].RegID})
        .then(response => {
            reload(true)
            setSelectedClassSched([])
        })
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
            <form action="#" onSubmit={handleSubmit} method="post">
                <BlockSchedule value={classsched} onSelectionChange={handleSelectionChange} select={selectedClassSched}></BlockSchedule>
                <button type="submit" className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right">submit</button>
            </form>
        </div>
    </>
  );
};

export default BlockSection;