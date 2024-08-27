import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';         // Core CSS
// import 'primeicons/primeicons.css';    
import "./../../../css/style.css"
import { useState } from 'react';

const BlockSchedule = ({value=[],  onSelectionChange, select}) => {
  const [selectedBlockScehds, setSelectedBlockScehds] = useState([]);

  const handleSelectionChange = (e) => {
      setSelectedBlockScehds(e.value);
      onSelectionChange(e.value);
  };

  return (
      <DataTable value={value} scrollable selectionMode='checkbox' selection={select} onSelectionChange={handleSelectionChange} datakey="id" tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode={value[0]==""?"null": "multiple"} frozen headerStyle={{ width: '3rem'}}></Column>
          <Column datakey="SubjectID" field="ScheduleID" header="ScheduleID" frozen style={{ minWidth: '100px'}}  body={(rowData) => rowData.ScheduleID || 'N/A'}></Column>
          <Column datakey="SubjectID" field="SubjectCode" header="Subject Code" frozen style={{ minWidth: '150px'}}></Column>
          <Column datakey="SubjectID" field="SubjectTitle" header="Subject Title" style={{ minWidth: '400px' }}></Column>
          <Column datakey="SubjectID" field="SectionName" header="Section" style={{ minWidth: '200px' }}></Column>
          <Column datakey="SubjectID" field="LectHrs" header="Lec Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="CreditUnits" header="Credit Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="Sched_1" header="Sched 1" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Room1" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Sched_2" header="Sched 2" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Room2" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Sched_3" header="Sched 3" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Room3" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Sched_4" header="Sched 4" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Room4" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Sched_5" header="Sched 5" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Room5" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column datakey="SubjectID" field="Faculty1" header="Faculty" style={{ minWidth: '200px' }}></Column>
          <Column datakey="SubjectID" field="LectHrs" header="Lec Hours" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabHrs" header="Lab Hours" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="Registered" header="Registered" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="Limit" header="Limit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SectionID" header="Section ID" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SubjectID" header="Subject ID" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SchedIsFull" header="Sched.ISFull" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="IsSpecialClass" header="Special Class" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="InclTFCompute" header="Include TF" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="InclLFCompute" header="Include LF" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="SubjectComputer" header="Computer Sub" v></Column>
          <Column datakey="SubjectID" field="Cntr" header="Seq. No" style={{ minWidth: '100px' }}></Column>
          
      </DataTable>
  );
};

export default BlockSchedule;