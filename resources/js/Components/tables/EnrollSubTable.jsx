import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';

const EnrollSubTable = ({value=[], onSelectionChange,select}) => {
  // const [selectedSubs, setSelectedSubs] = useState([]);

  const handleSelectionChange = (e) => {
        // setSelectedSubs(e.value);
        onSelectionChange(e.value);
  };
  return (
        <DataTable value={value} scrollable selectionMode='checkbox'   selection={select} onSelectionChange={handleSelectionChange} dataKey="SubjectCode" tableStyle={{ minWidth: '50rem' }}     rowClassName='no-data' columnSelection= 'none'>
          <Column selectionMode="multiple" frozen headerStyle={{ width: '3rem' }}></Column>
          <Column datakey="SubjectID" field="SubjectCode" header="Subject Code" frozen style={{ minWidth: '150px'}} body={(rowData) => rowData.ScheduleID || 'N/A'}></Column>
          <Column datakey="SubjectID" field="SubjectTitle" header="Subject Title" style={{ minWidth: '400px' }}></Column>
          <Column datakey="SubjectID" field="LectHrs" header="Lec Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' }}></Column>
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
          <Column datakey="SubjectID" field="FacultyName" header="Faculty" style={{ minWidth: '200px' }}></Column>
        </DataTable>
  );
};

export default EnrollSubTable;