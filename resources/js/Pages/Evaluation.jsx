import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMinus} from '@fortawesome/free-solid-svg-icons'
import "./../../css/style2.css"

const Evaluation = ({data}) => {
  console.log(data)

  return (
    <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
    <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Academic Program Evaluation</label></div>
      <div className='p-6'>
        <DataTable value={data} scrollable dataKey="CourseID" tableStyle={{ minWidth: '50rem' }} className='p-2'  rowClassName="table-row-hover">
          <Column datakey="CourseID" field="AcademicYearTermTaken" header="YEAR / TERM" style={{ minWidth: '250px' }} body={(rowData) => (rowData.AcademicYearTermTaken == ""?rowData.Semester:rowData.AcademicYearTermTaken )}></Column>
          <Column datakey="CourseID" field="CourseCode" header="CODE" style={{ minWidth: '250px' }}></Column>
          <Column datakey="CourseID" field="CourseTitle" header="Title" style={{ minWidth: '250px' }}></Column>
          <Column datakey="CourseID" field="CreditUnits" header="Credit Units" style={{ minWidth: '250px' }}></Column>
          <Column datakey="CourseID" field="Final" header="Final" style={{ minWidth: '250px' }}></Column>
          <Column datakey="CourseID" field="ReExam" header="Re Exam" style={{ minWidth: '250px' }}></Column>
          <Column datakey="CourseID" field="Remarks" header="Remark" style={{ minWidth: '250px' }}></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Evaluation;