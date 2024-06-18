import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from "@/Components/Table";
import axios from "axios";
import { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BlockSection from "@/Components/contents/BlockSection";
import FreeSection from "@/Components/contents/FreeSection";

export default function Main({auth, student, enroll_sub, reg, blockSec,freeSec}) {
    const [activePage, setActivePage] = useState('Page1');
    const handleNavClick = (page) => {
      setActivePage(page);
    };
  

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="">
                <div className="m-6 flex flex-col shadow-md">
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
                    </div>
                </div>

                <div className="m-6 flex flex-col shadow-md">
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
                <div className="m-6 flex flex-col shadow-md">
                    <div className="w-full p-2 bg-primary-dark"></div>
                    {/* <Table colname={Object.keys(enroll_sub[0])} items={enroll_sub} >
                    </Table> */}
                    <DataTable value={enroll_sub} tableStyle={{ minWidth: '50rem' }}>
                        {Object.keys(enroll_sub[0]).map((item,key)=>(
                            <Column key={key} field={item} header={item} style={{ minWidth: '200px' }}></Column>
                        ))}
                    </DataTable>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
