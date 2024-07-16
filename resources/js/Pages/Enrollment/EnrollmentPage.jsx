import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from "@/Components/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BlockSection from "@/Components/contents/BlockSection";
import FreeSection from "@/Components/contents/FreeSection";
import EnrollSub from '@/Components/contents/EnrollSub';

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
    </div>
);

export default function Main({reg,data}) {
    const [activePage, setActivePage] = useState('Page1');
    const [profilePic, setprofilePic] = useState('');
    const [profile, setprofile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setreload] = useState(false);
    const url = `https://api.usep.edu.ph/student/`;

    const handleNavClick = (page) => {
      setActivePage(page);
    };

    const getHTTPConfig = (token) => {
        return {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
                // Add other headers if needed
            }
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when fetching starts

                if (data && data.user && data.campus && data.token) {
                    const profileResponse = await axios.get(`${url}getProfile/${data.user}/${data.campus}`, getHTTPConfig(data.token));
                    console.log("GET PROFILE", profileResponse);
                    if (profileResponse.data) {
                        setprofile(profileResponse.data);
                        console.log(profileResponse.data)
                        // Fetch profile picture only when profile data is ready
                        const profilePicResponse = await axios.get(`${url}getProfilePic/${data.user}/${data.campus}`, getHTTPConfig(data.token));
                        console.log("GET PROFILE PIC", profilePicResponse);
                        if (profilePicResponse.data) {
                            setprofilePic(profilePicResponse.data);
                        }
                    }
                }

                setLoading(false); // Set loading to false when fetching is complete
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false); // Set loading to false on error
            }
        };

        fetchData();
    }, [data]);

    const handlereload = (x) =>{
        setreload(x)
    }
    return (
        <AuthenticatedLayout
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
                    </div>
                </div>
            </div>   

            
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
        </AuthenticatedLayout>
    );
}
