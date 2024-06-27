import React from 'react';
import EnrollSubTable from "@/Components/tables/EnrollSubTable";
import { useState } from "react";

const EnrollSub = ({enroll_sub=null}) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("test")
      }


  return (
    <>
        <label htmlFor="blocksection" className="block  text-base font-medium text-gray-900 dark:text-white m-4">Enroll Sub</label>

        <div className="m-4">
            <form action="#" onSubmit={handleSubmit} method="post">
                <EnrollSubTable value={enroll_sub}></EnrollSubTable>
            <button type="submit" className="text-white bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right">submit</button>
            </form>
        </div>
    </>
  );
};

export default EnrollSub;