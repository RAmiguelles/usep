import React from 'react';
const Print= ({componentRef, data=[]}) => {
    const totals = data[0].reduce((acc, item) => {
        acc.acadUnits += Number(item.AcadUnits) || 0;
        acc.labUnits += Number(item.LabUnits) || 0;
        return acc;
    }, { acadUnits: 0, labUnits: 0 });
    const totalUnits = totals.acadUnits + totals.labUnits;
  return (
    <>
        <div style={{ display: 'none' }}>
        <div ref={componentRef} className='m-6 p-6'>
          <div className="" >
            <div className="" >
              <div className="text-xl" >Registration #<span className=""> {data[3].RegID}</span></div>
            </div>
          </div>

          <div className="border bg-black" style={{height:'1px', width:'100%'}}></div>

          <div>
            <div className="grid grid-cols-2">
              <div className="bg-white">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Campus:</h3>
                      <p className="flex-1 text-xs">{data[3].CampusName}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">College:</h3>
                      <p className="flex-1 text-xs">{data[3].CollegeName}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Program:</h3>
                      <p className="flex-1 text-xs">{data[3].ProgramName}</p>
                  </div>
              </div>

              <div className="bg-white">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Major Study:</h3>
                      <p className="flex-1 text-xs">{data[3].MajorName}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Year:</h3>
                      <p className="flex-1 text-xs">{data[3].SchoolYear}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Term:</h3>
                      <p className="flex-1 text-xs">{data[3].SchoolTerm}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Year Level:</h3>
                      <p className="flex-1 text-xs">{data[3].YearLevel}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Scholarship:</h3>
                      <p className="flex-1 text-xs">None</p>
                  </div>
              </div>

              <div className="bg-white mt-1">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Lecture Units:</h3>
                      <p className="flex-1 text-xs">17 Units</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Laboratory Units:</h3>
                      <p className="flex-1 text-xs">3 Units</p>
                  </div>
              </div>

              <div className="bg-white mt-1">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Date of Registration:</h3>
                      <p className="flex-1 text-xs">{data[3].RegDate}</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Date of Validation:</h3>
                      <p className="flex-1 text-xs">January 18, 2024 8:09 AM</p>
                  </div>
              </div>
            </div>
          </div>

          <div className="border bg-black" style={{height:'1px', width:'100%'}}></div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-white">
                <h2 className="text-lg font-bold mb-4">Enrolled Subjects</h2>
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Subject Code</th>
                            <th className="border border-gray-300 p-2 text-left">Subject Name</th>
                            <th className="border border-gray-300 p-2 text-left">Lec</th>
                            <th className="border border-gray-300 p-2 text-left">Lab</th>
                            <th className="border border-gray-300 p-2 text-left">Schedule</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data[0].map((item, index) => {
                        const schedules = [];
                        for (let i = 1; i <= 5; i++) {
                            const schedule = item[`Sched_${i}`];
                            if (schedule) {
                            schedules.push(schedule);
                            }
                        }
                        return (
                            <tr key={index}>
                            <td className="border border-gray-300 p-2">{item.SubjectCode}</td>
                            <td className="border border-gray-300 p-2">{item.SubjectTitle}</td>
                            <td className="border border-gray-300 p-2">{item.AcadUnits}</td>
                            <td className="border border-gray-300 p-2">{item.LabUnits}</td>
                            <td className="border border-gray-300 p-2">
                                {schedules.length > 0 ? schedules.join(', ') : 'No schedule available'}
                            </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className="border border-gray-300 font-bold">Total:</td>
                        <td className="border border-gray-300"></td>
                        <td className="border border-gray-300 text-center">{totals.acadUnits}</td>
                        <td className="border border-gray-300 text-center">{totals.labUnits}</td>
                        <td className="border border-gray-300"></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div className="col-span-4 bg-white">
                <h2 className="text-lg font-bold mb-4">Billing Information</h2>
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Description</th>
                            <th className="border border-gray-300 p-2 text-left">Ammount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data[1].map((item, index) => {
                        if (item.AcctName =="Tuition Fee" ) {
                            item.AcctName="Tuition Fee "+totalUnits+"@"+Number(item.Amount);
                            item.Amount=Number(item.Amount)*totalUnits
                        } else if(item.AcctName =="Laboratory Fee"){
                            item.AcctName="Laboratory Fee "+totals.labUnits+"@"+Number(item.Amount);
                            item.Amount=Number(item.Amount)*totals.labUnits
                        }
                        return(
                        <tr key={index}>
                            <td className="border border-gray-300 ">{item.AcctName}</td>
                            <td className="border border-gray-300 text-right">{ Number(item.Amount)}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border border-gray-300 font-bold">Total : </td>
                            <td className="border border-gray-300 text-right">{Number(data[2])}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default Print;