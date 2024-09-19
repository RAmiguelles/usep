import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';

const EnrollSubTable = ({value=[], onSelectionChange,select}) => {

  const getVisibleColumns = (data) => {
    const columns = [];
    const hasData = (key) => data.some(row => row[key] != null && row[key] !== '');

    if (hasData('Sched_1')) columns.push({ field: 'Sched_1', header: 'Sched 1' });
    if (hasData('Room1')) columns.push({ field: 'Room1', header: 'Room' });
    if (hasData('Sched_2')) columns.push({ field: 'Sched_2', header: 'Sched 2' });
    if (hasData('Room2')) columns.push({ field: 'Room2', header: 'Room' });
    if (hasData('Sched_3')) columns.push({ field: 'Sched_3', header: 'Sched 3' });
    if (hasData('Room3')) columns.push({ field: 'Room3', header: 'Room' });
    if (hasData('Sched_4')) columns.push({ field: 'Sched_4', header: 'Sched 4' });
    if (hasData('Room4')) columns.push({ field: 'Room4', header: 'Room' });
    if (hasData('Sched_5')) columns.push({ field: 'Sched_5', header: 'Sched 5' });
    if (hasData('Room5')) columns.push({ field: 'Room5', header: 'Room' });

    return columns;
  };
  const columns = getVisibleColumns(value);

  const handleSelectionChange = (e) => {
        onSelectionChange(e.value);
  };
  if (value.length === 0) {
    return <div>No enrolled subject</div>; // Customize this message or component as needed
  }
  return (
        <DataTable value={value} scrollable selectionMode='checkbox'   selection={select} onSelectionChange={handleSelectionChange} dataKey="SubjectCode" tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" frozen headerStyle={{ width: '3rem' }}></Column>
          {/* <Column datakey="SubjectID" field="SubjectCode" header="Subject Code" frozen style={{ minWidth: '150px'}} body={(rowData) => rowData.ScheduleID || 'N/A'}></Column> */}
          <Column datakey="SubjectID" field="SubjectTitle" header="Subject Title" style={{ minWidth: '400px' }}></Column>
          {/* <Column datakey="SubjectID" field="LectHrs" header="Lec Unit" style={{ minWidth: '100px' }}></Column>
          <Column datakey="SubjectID" field="LabUnits" header="Lab Unit" style={{ minWidth: '100px' }}></Column> */}
          {columns.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} style={{ minWidth: '300px' }}></Column>
          ))}
          {/* <Column datakey="SubjectID" field="FacultyName" header="Faculty" style={{ minWidth: '200px' }}></Column> */}
        </DataTable>
  );
};

export default EnrollSubTable;