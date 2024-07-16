import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';

<<<<<<< Updated upstream
const EnrollSubTable = ({value=null}) => {
  const [selectedSubs, setSelectedSubs] = useState([]);
=======
const EnrollSubTable = ({value=[], onSelectionChange,select}) => {
  // const [selectedSubs, setSelectedSubs] = useState([]);
>>>>>>> Stashed changes

//   const handleSelectionChange = (e) => {
//         setSelectedSubs(e.value);
//         console.log(selectedSubs)
//     //   onSelectionChange(e.value);
//   };
  return (
        <DataTable value={value} scrollable selectionMode='checkbox' selection={selectedSubs} onSelectionChange={(e)=>setSelectedSubs(e.value)} dataKey="SubjectCode" tableStyle={{ minWidth: '50rem' }}>
            <Column selectionMode="multiple" frozen headerStyle={{ width: '3rem' }}></Column>
<<<<<<< Updated upstream
            {Object.keys(value[0]).map((item,key)=>(
                                <Column field={item} header={item} style={{ minWidth: '200px' }}></Column>
                            ))}
      </DataTable>
=======
            {value.length > 0 && Object.keys(value[0]).map((item, key) => (
              <Column key={key} field={item} header={item} style={{ minWidth: '200px' }} />
            ))}
        </DataTable>
>>>>>>> Stashed changes
  );
};

export default EnrollSubTable;