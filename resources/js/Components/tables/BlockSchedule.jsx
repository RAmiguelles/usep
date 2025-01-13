import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';         // Core CSS
// import 'primeicons/primeicons.css';    
import "./../../../css/style.css"
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons'


const BlockSchedule = ({value=[], onSelectionChange, subs, allow}) => {
  const[disabledSubjectCodes,setdisabledSubjectCodes]=useState([])
  const getVisibleColumns = (data) => {
    const columns = [];
    const hasData = (key) => data.some(row => row[key] != null && row[key] !== '');

    if (hasData('Sched_1')) columns.push({ field: 'Sched_1', header: 'Sched 1' });
    if (hasData('Room1')) columns.push({ field: 'Room1', header: 'Room 1' });
    if (hasData('Sched_2')) columns.push({ field: 'Sched_2', header: 'Sched 2' });
    if (hasData('Room2')) columns.push({ field: 'Room2', header: 'Room2' });
    if (hasData('Sched_3')) columns.push({ field: 'Sched_3', header: 'Sched 3' });
    if (hasData('Room3')) columns.push({ field: 'Room3', header: 'Room3' });
    if (hasData('Sched_4')) columns.push({ field: 'Sched_4', header: 'Sched 4' });
    if (hasData('Room4')) columns.push({ field: 'Room4', header: 'Room4' });
    if (hasData('Sched_5')) columns.push({ field: 'Sched_5', header: 'Sched 5' });
    if (hasData('Room5')) columns.push({ field: 'Room5', header: 'Room5' });

    return columns;
  };
  const columns = getVisibleColumns(value);
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  useEffect(() => {
    const subjectcode=()=>{
      setdisabledSubjectCodes(subs.map(sub => sub.SubjectCode));
    }
    subjectcode()
  },[subs])
  return (
    <>
      <DataTable 
        className="p-2 font-medium border-spacing-2" 
        value={value} 
        paginator 
        rows={5} 
        rowsPerPageOptions={[5, 10, 25, 50]} 
        scrollable  
        datakey="id" 
        tableStyle={{ minWidth: '50rem',minHeight : '484px'}} 
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" 
        paginatorLeft={paginatorLeft} 
        paginatorRight={paginatorRight}
        rowClassName={(data) => {
          const isDisabled = disabledSubjectCodes.includes(data.SubjectCode);
          return `border-y-2 hover:bg-gray-100 hover:text-black ${isDisabled || data.Registered >= data.Limit ? 'disabled-row' : ''}`;
        }}
      >
          {(allow) && <Column 
            body={(rowData) => (
                <button 
                    type='button'
                    onClick={(e) => {
                      e.preventDefault()
                      onSelectionChange([rowData]);
                    }} 
                    disabled={disabledSubjectCodes.includes(rowData.SubjectCode) || rowData.Registered >= rowData.Limit}
                    className='p-2 transition-transform duration-200 hover:scale-150 hover:text-green-500 scale-75'
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
            )} 
            frozen 
            headerStyle={{ width: '3rem' }} 
          />}
          <Column datakey="SubjectID" field="SubjectCode" header="Course Code" style={{ minWidth: '150px',minHeight : '82.2px'}}></Column>
          <Column datakey="SubjectID" field="SubjectTitle" header="Course Title" style={{ minWidth: '250px' ,minHeight : '82.2px'}}></Column>
          <Column datakey="SubjectID" field="SectionName" header="Section" style={{ minWidth: '250px' ,minHeight : '82.2px'}}></Column>
          <Column datakey="SubjectID" field="AcadUnits" header="Lec Unit" style={{ minWidth: '100px' ,minHeight : '82.2px'}}></Column>
          <Column datakey="SubjectID" field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' ,minHeight : '82.2px'}}></Column>
          <Column datakey="SubjectID" field="CreditUnits" header="Credit Unit" style={{ minWidth: '100px' ,minHeight : '82.2px'}}></Column>
          {columns.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} style={{ minWidth: '300px' ,minHeight : '82.2px'}}></Column>
          ))}
          <Column datakey="SubjectID"  header="Available slots" style={{ minWidth: '100px' ,minHeight : '82.2px'}} body={(rowData) => (rowData.Registered+"/"+rowData.Limit )}></Column>
          <Column datakey="SubjectID" field="remark" header="Remark" style={{ minWidth: '150px',maxHeight : '82.2px'}} 
            body={(rowData) => {
              // Check if the SubjectCode is in the disabledSubjectCodes array
              if (disabledSubjectCodes.includes(rowData.SubjectCode)) {
                  return 'Added';
              }else if(rowData.Registered == rowData.Limit){
                return 'Full';
              }
              // Return a default value (e.g., empty string) if not selected
              return ''; 
            }}
          ></Column>
      </DataTable>
    </>
  );
};

export default BlockSchedule;