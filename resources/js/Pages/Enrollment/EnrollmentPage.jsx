import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from "@/Components/Table";
import axios from "axios";
import { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BlockSection from "@/Components/contents/BlockSection";
import FreeSection from "@/Components/contents/FreeSection";
import EnrollSub from '@/Components/contents/EnrollSub';

<<<<<<< Updated upstream
export default function Main({auth, student, enroll_sub, reg, blockSec,freeSec}) {
=======
const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
    </div>
);

export default function Main({reg,data}) {
>>>>>>> Stashed changes
    const [activePage, setActivePage] = useState('Page1');
    const handleNavClick = (page) => {
      setActivePage(page);
    };
  

    return (
        <AuthenticatedLayout
<<<<<<< Updated upstream
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Enrollment</h2>}
        >
            <Head title="Enrollment" />
            <div className="">
                <div className="m-6 flex flex-col shadow-md justify-center items-centers bg-gray-50 rounded-md">
                    <div className="w-full p-2 bg-primary-dark"></div>
                    <div className="p-2">                    
                        <ul className="flex items-center mr-8">
                        <li className="mr-4">
                            <p className="font-bold">College:<span>{student.CollegeCode}</span></p>
                        </li>
                        <li className="mr-4">
                            <p className="font-bold">Academic Program:<span>{student.ProgCode}</span></p>
                        </li>
                        <li className="mr-4">
                            <p className="font-bold">Major Study:<span>{student.MajorDiscDesc}</span></p>
                        </li>
                        <li className="mr-4">
                            <p className="font-bold">C.Code:<span>{student.CurriculumCode}</span></p>
                        </li>
                        <li className="mr-4">
                            <p className="font-bold">Reg. Date: <span>{reg.RegDate}</span></p>
                        </li>
                        </ul>
                    </div>
                    <div className="p-2">
                        <ul className="flex items-center">
                            <li className="mr-4">
                                <p className="font-bold">Year level: <span>{student.YearLevelID}</span></p>
                            </li>
                            <li className="mr-4">
                                <p className="font-bold">Max load: <span>{student.MaxUnitsLoad}</span></p>
                            </li>
                            <li className="mr-4">
                                <p className="font-bold">Session:<span>{student.SessionType}</span></p>
                            </li>
                            <li className="mr-4">
                                <p className="font-bold">Status:<span>{}</span></p>
                            </li>
                            <li className="mr-4">
                                <p className="font-bold">Gender: <span>{student.Gender}</span></p>
                            </li>
                            <li className="mr-4">
                                <p className="font-bold">Scholarship:<span>{}</span></p>
                            </li>
                            <li>
                                <p className="font-bold">Expiry Date:<span>{}</span></p>
                            </li>
                        </ul>
=======
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">#:{reg.RegID}</h2>}
        >{loading ? (
            <LoadingSpinner /> // Render loading spinner while loading is true
        ) : (
            <>
            <Head title="Enrollment" />
            <div className="">
                <div className="" style={{height:'200px',background:'linear-gradient(0deg,rgba(151, 57, 57, 0.1),rgba(151, 57, 57, 0.1)),url(/img/banner.jpg)',backgroundSize:'cover', backgroundPosition:'center'}}></div>
                <div className="profile">
                    <div className="" style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'unset', justifyContent: 'center', alignItems: 'center', alignContent: 'unset', overflow: 'unset'}}>
                        <div className="" style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'unset', justifyContent: 'center', alignItems: 'center', alignContent: 'unset', overflow: 'unset'}}>
                            {/* <img className="w-full " src="/img/banner.jpg" alt=""/> */}
                            <div className="slide-in-fwd-center"> 
                                <img src={profilePic} alt="Profile" className="rounded-full border-4 border-primary-dark p-2 hover:animate-spin" style={{height: '150px', width: '150px', marginTop: '-93px'}}/> 
                            </div>
                            <div className="text-2xl text-primary-dark">{profile.studentID}</div>
    
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.fullName}</div>
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.program}</div>

                        </div>
                        <div className="w-screen m-6 flex flex-col shadow-md justify-center items-center bg-gray-50 rounded-md">
                            <div className="w-full p-2 bg-primary-dark"></div>
                            <div className="p-2">                    
                                <ul className="flex items-center mr-8">
                                <li className="mr-4">
                                    <p className="font-bold">College:<span>{profile.college}</span></p>
                                </li>
                                <li className="mr-4">
                                    <p className="font-bold">Major Study:<span>{profile.major}</span></p>
                                </li>
                                <li className="mr-4">
                                    <p className="font-bold">C.Code:<span>{profile.curriculumCode}</span></p>
                                </li>
                                <li className="mr-4">
                                    <p className="font-bold">Reg. Date: <span>{profile.studentID}</span></p>
                                </li>
                                </ul>
                            </div>
                            <div className="p-2">
                                <ul className="flex items-center">
                                    <li className="mr-4">
                                        <p className="font-bold">Year level: <span>{profile.yearLevel}</span></p>
                                    </li>
                                    <li className="mr-4">
                                        <p className="font-bold">Max load: <span>{profile.maxUnitsLoad}</span></p>
                                    </li>
                                    <li className="mr-4">
                                        <p className="font-bold">Session:<span>{profile.studentID}</span></p>
                                    </li>
                                    <li className="mr-4">
                                        <p className="font-bold">Status:<span>{}</span></p>
                                    </li>
                                    <li className="mr-4">
                                        <p className="font-bold">Gender: <span>{profile.sex}</span></p>
                                    </li>
                                    <li className="mr-4">
                                        <p className="font-bold">Scholarship:<span>{}</span></p>
                                    </li>
                                    <li>
                                        <p className="font-bold">Expiry Date:<span>{}</span></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
>>>>>>> Stashed changes
                    </div>
                </div>

<<<<<<< Updated upstream
                <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                    <div className="w-full p-2 bg-primary-dark"></div>
                    <nav className="nav-bar m-4">
                        <button onClick={() => handleNavClick('Page1')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">Block Section</button>
                        <button onClick={() => handleNavClick('Page2')}  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">Free Section</button>
                    </nav>
                    <div className="page-content">
                        {activePage === 'Page1' && <BlockSection blockSec={blockSec} student={student} reg={reg}></BlockSection>}
                        {activePage === 'Page2' && <FreeSection blockSec={freeSec} student={student} reg={reg}></FreeSection>}
                    </div>
                </div>
                <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                    <div className="w-full p-2 bg-primary-dark"></div>
                        <EnrollSub enroll_sub={enroll_sub}></EnrollSub>
                    {/* <DataTable value={enroll_sub} tableStyle={{ minWidth: '50rem' }}>
                        {Object.keys(enroll_sub[0]).map((item,key)=>(
                            <Column key={key} field={item} header={item} style={{ minWidth: '200px' }}></Column>
                        ))}
                    </DataTable> */}
                </div>
            </div>
=======
            
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"></div>
                <EnrollSub data={reg.RegID} reload={reload} load={handlereload}></EnrollSub>
            </div>

            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"></div>
                <nav className="nav-bar m-4">
                    <button onClick={() => handleNavClick('Page1')} className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${activePage == 'Page1' ? 'bg-gray-400' : 'bg-gray-300'}`}>Block Section</button>
                    <button onClick={() => handleNavClick('Page2')}  className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${activePage == 'Page2' ? 'bg-gray-400' : 'bg-gray-300'}`}>Free Section</button>
                </nav>
                <div className="page-content">
                    {activePage === 'Page1' && <BlockSection datas={[profile,reg]} reload={handlereload} ></BlockSection>}
                    {activePage === 'Page2' && <FreeSection datas={[profile,reg]} reload={handlereload}></FreeSection>}
                </div>
            </div>
            </> 
        )}
>>>>>>> Stashed changes
        </AuthenticatedLayout>
    );
}
