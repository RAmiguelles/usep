import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const FreeSchedule = ({value=null}) => {
  return (
      <DataTable value={value} scrollable selectionMode='checkbox' onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" frozen headerStyle={{ width: '3rem' }}></Column>
          <Column field="ScheduleID" header="ScheduleID" frozen style={{ minWidth: '100px', backgroundColor:'white' }}></Column>
          <Column field="SubjectCode" header="Subject Code" frozen style={{ minWidth: '150px', backgroundColor:'white'  }}></Column>
          <Column field="SubjectTitle" header="Subject Title" style={{ minWidth: '400px' }}></Column>
          <Column field="SectionName" header="Section" style={{ minWidth: '200px' }}></Column>
          <Column field="LectHrs" header="Lec Unit" style={{ minWidth: '100px' }}></Column>
          <Column field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' }}></Column>
          <Column field="CreditUnits" header="Credit Unit" style={{ minWidth: '100px' }}></Column>
          <Column field="Sched_1" header="Sched 1" style={{ minWidth: '300px' }}></Column>
          <Column field="Room1" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column field="Sched_2" header="Sched 2" style={{ minWidth: '300px' }}></Column>
          <Column field="Room2" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column field="Sched_3" header="Sched 3" style={{ minWidth: '300px' }}></Column>
          <Column field="Room3" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column field="Sched_4" header="Sched 4" style={{ minWidth: '300px' }}></Column>
          <Column field="Room4" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column field="Sched_5" header="Sched 5" style={{ minWidth: '300px' }}></Column>
          <Column field="Room5" header="Room" style={{ minWidth: '300px' }}></Column>
          <Column field="Faculty1" header="Faculty" style={{ minWidth: '200px' }}></Column>
          <Column field="LectHrs" header="Lec Hours" style={{ minWidth: '100px' }}></Column>
          <Column field="LabHrs" header="Lab Hours" style={{ minWidth: '100px' }}></Column>
          <Column field="SchedRegistered" header="Registered" style={{ minWidth: '100px' }}></Column>
          <Column field="Limit" header="Limit" style={{ minWidth: '100px' }}></Column>
          <Column field="SectionID" header="Section ID" style={{ minWidth: '100px' }}></Column>
          <Column field="SubjectID" header="Subject ID" style={{ minWidth: '100px' }}></Column>
          <Column field="SchedIsFull" header="Sched.ISFull" style={{ minWidth: '100px' }}></Column>
          <Column field="IsSpecialClass" header="Special Class" style={{ minWidth: '100px' }}></Column>
          <Column field="InclTFCompute" header="Include TF" style={{ minWidth: '100px' }}></Column>
          <Column field="InclLFCompute" header="Include LF" style={{ minWidth: '100px' }}></Column>
          <Column field="SubjectComputer" header="Computer Sub" v></Column>
          <Column field="Cntr" header="Seq. No" style={{ minWidth: '100px' }}></Column>
          
      </DataTable>
  );
};

export default FreeSchedule;