import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';         // Core CSS
// import 'primeicons/primeicons.css';    
import "./../../../css/style.css"
import { useState, useEffect } from "react";


const BlockSchedule = ({value=[],allow, onSelectionChange, select, subs}) => {
  const [selectedBlockScehds, setSelectedBlockScehds] = useState([]);
  const[disabledSubjectCodes,setdisabledSubjectCodes]=useState([])
  const getVisibleColumns = (data) => {
    const columns = [];
    const hasData = (key) => data.some(row => row[key] != null && row[key] !== '');

    if (hasData('Sched_1')) columns.push({ field: 'Sched_1', header: 'Sched' });
    if (hasData('Room1')) columns.push({ field: 'Room1', header: 'Room' });
    if (hasData('Sched_2')) columns.push({ field: 'Sched_2', header: 'Sched' });
    if (hasData('Room2')) columns.push({ field: 'Room2', header: 'Room' });
    if (hasData('Sched_3')) columns.push({ field: 'Sched_3', header: 'Sched' });
    if (hasData('Room3')) columns.push({ field: 'Room3', header: 'Room' });
    if (hasData('Sched_4')) columns.push({ field: 'Sched_4', header: 'Sched' });
    if (hasData('Room4')) columns.push({ field: 'Room4', header: 'Room' });
    if (hasData('Sched_5')) columns.push({ field: 'Sched_5', header: 'Sched' });
    if (hasData('Room5')) columns.push({ field: 'Room5', header: 'Room' });

    return columns;
  };
  const columns = getVisibleColumns(value);
  const handleSelectionChange = (e) => {
      setSelectedBlockScehds(e.value);
      onSelectionChange(e.value);
  };
  useEffect(() => {
    const subjectcode=()=>{
      setdisabledSubjectCodes(subs.map(sub => sub.SubjectCode));
    }
    subjectcode()
  },[subs])
  return (
      <DataTable value={value} scrollable selectionMode={value[0]=="" || !allow ? null: "checkbox"} selection={select} onSelectionChange={handleSelectionChange} datakey="id" tableStyle={{ minWidth: '50rem' }} rowClassName={(data) => disabledSubjectCodes.includes(data.SubjectCode) ? 'disabled-row' : ''}>
          <Column selectionMode={value[0]=="" || !allow ? null: "multiple"} frozen headerStyle={{ width: '3rem'}}></Column>
          {/* <Column datakey="SubjectID" field="ScheduleID" header="ScheduleID" frozen style={{ minWidth: '100px'}}  body={(rowData) => rowData.ScheduleID || 'N/A'}></Column> */}
          <Column datakey="SubjectID" field="SubjectCode" header="Subject Code" frozen style={{ minWidth: '150px'}}></Column>
          <Column datakey="SubjectID" field="SubjectTitle" header="Subject Title" style={{ minWidth: '400px' }}></Column>
          {/* <Column datakey="SubjectID" field="SectionName" header="Section" style={{ minWidth: '200px' }}></Column> */}
          <Column datakey="SubjectID" field="AcadUnits" header="Lec Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="CreditUnits" header="Credit Unit" style={{ minWidth: '100px' }}></Column>
          {columns.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} style={{ minWidth: '300px' }}></Column>
          ))}
          {/* <Column datakey="SubjectID" field="Faculty1" header="Faculty" style={{ minWidth: '200px' }}></Column>
          <Column datakey="SubjectID" field="LectHrs" header="Lec Hours" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabHrs" header="Lab Hours" style={{ minWidth: '100px' }}></Column> */}
          {/* <Column datakey="SubjectID" field="Registered" header="Registered" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="Limit" header="Limit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SectionID" header="Section ID" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SubjectID" header="Subject ID" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SchedIsFull" header="Sched.ISFull" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="IsSpecialClass" header="Special Class" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="InclTFCompute" header="Include TF" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="InclLFCompute" header="Include LF" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SubjectComputer" header="Computer Sub" v></Column>
          <Column datakey="SubjectID" field="Cntr" header="Seq. No" style={{ minWidth: '100px' }}></Column> */}
      </DataTable>
  );
};

export default BlockSchedule;