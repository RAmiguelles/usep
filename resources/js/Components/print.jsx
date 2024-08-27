import React from 'react';
const Print= ({componentRef}) => {
  return (
    <>
        <div style={{ display: 'none' }}>
        <div ref={componentRef} className='m-6 p-6'>
          <div className="" >
            <div className="" >
              <div className="text-xl" >Registration #<span className=""> 0000239639</span></div>
            </div>
          </div>

          <div className="border bg-black" style={{height:'1px', width:'100%'}}></div>

          <div>
            <div className="grid grid-cols-2">
              <div className="bg-white">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Campus:</h3>
                      <p className="flex-1 text-xs">Obrero Campus, Davao City</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">College:</h3>
                      <p className="flex-1 text-xs">College of Engineering</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Program:</h3>
                      <p className="flex-1 text-xs">Bachelor of Science in Civil Engineering</p>
                  </div>
              </div>

              <div className="bg-white">
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Major Study:</h3>
                      <p className="flex-1 text-xs">Structural Engineering</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Year:</h3>
                      <p className="flex-1 text-xs">2023-2024</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Academic Term:</h3>
                      <p className="flex-1 text-xs">2nd Semester</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Year Level:</h3>
                      <p className="flex-1 text-xs">3rd Year</p>
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
                      <p className="flex-1 text-xs">January 17, 2024 1:15 PM</p>
                  </div>
                  
                  <div className="flex items-center">
                      <h3 className="text-xs font-semibold w-1/3">Date of Validation:</h3>
                      <p className="flex-1 text-xs">January 18, 2024 8:09 AM</p>
                  </div>
              </div>
            </div>
          </div>

          <div className="border bg-black" style={{height:'1px', width:'100%'}}></div>

          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-8 bg-white p-4">
                <h2 class="text-lg font-bold mb-4">Enrolled Subjects</h2>
                <table class="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 p-2 text-left">Subject Code</th>
                            <th class="border border-gray-300 p-2 text-left">Subject Name</th>
                            <th class="border border-gray-300 p-2 text-left">Units</th>
                            <th class="border border-gray-300 p-2 text-left">Schedule</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-300 p-2">CIVIL101</td>
                            <td class="border border-gray-300 p-2">Introduction to Civil Engineering</td>
                            <td class="border border-gray-300 p-2">3</td>
                            <td class="border border-gray-300 p-2">MWF 9:00 AM - 10:30 AM</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 p-2">CIVIL102</td>
                            <td class="border border-gray-300 p-2">Structural Analysis</td>
                            <td class="border border-gray-300 p-2">4</td>
                            <td class="border border-gray-300 p-2">TTh 1:00 PM - 3:00 PM</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="col-span-4 bg-white p-4">
                <h2 class="text-lg font-bold mb-4">Billing Information</h2>
                <table class="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 p-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-300 p-2">Tuition Fee</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 p-2">Laboratory Fee</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 p-2">Miscellaneous Fees</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default Print;