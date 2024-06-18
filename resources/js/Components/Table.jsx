import React from 'react';

const Table = ({colname=null,items=null,children}) => {
  const columns = Array.from({ length: colname.length }, (_, index) => index);

  return (
    <div className="">
      <table className="w-full max-h-50vh table-auto">
        <thead className='bg-gray-300'>
          <tr>
            {columns.map((column) => (
              <th key={column} className="max:w-12 border border-gray-400 px-4 py-2 ml-2 mr-2">{colname[column]}</th>
            ))}
          </tr>
        </thead>
        {items !== null && (
        <tbody>
        {items.map((row, rowIndex) => (
            <tr key={rowIndex} className='hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'>
            {Object.values(row).map((col, colIndex) => (
                <td key={colIndex}  className="border border-gray-400 text-center p-1">{col}</td> 
            ))}
            </tr>
        ))}
        </tbody>
        )}
        {children}
      </table>
    </div>
  );
};

export default Table;