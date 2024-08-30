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
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
    </div>
);

export default function Main({reg,data,enrollment}) {
    const [activePage, setActivePage] = useState('Page1');
    const [profilePic, setprofilePic] = useState('');
    const [profile, setprofile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setreload] = useState(false);
    const [curUnit, setcurUnit] = useState(0);
    const [yearLevel, setyearlevel] = useState('');
    const url = `https://api.usep.edu.ph/student/`;
    const handleNavClick = (page) => {
      setActivePage(page);
    };
    // console.log(reg)
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
                    if (profileResponse.data) {
                        const date = new Date(reg.RegDate);
                        reg.RegDate = format(date, 'MM/dd/yyyy');
                        setyearlevel(profileResponse.data.yearLevel);
                        setprofile(profileResponse.data);
                        // console.log(profileResponse.data)
                        // Fetch profile picture only when profile data is ready
                        const profilePicResponse = await axios.get(`${url}getProfilePic/${data.user}/${data.campus}`, getHTTPConfig(data.token));
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
    },[data]);

    useEffect(() => {
        if (!enrollment['isOpen']) {
            Swal.fire({
                title: 'Enrollment Closed',
                text: `The Enrollment for ${reg.YearTerm} has been closed since ${enrollment['EndEnrollment']}`,
                icon: 'info',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#D75D5F',
                iconColor: '#D75D5F',
            })
        }
    }, [enrollment]);

    const handlereload = (x) =>{
        setreload(x)
    }

    const handleChange = (e) =>{
        setyearlevel(e.target.value)
    }

    const CurrentUnit=(e)=>{
        setcurUnit(e)
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-red-500 leading-tight"></h2>}
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
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.Ms365Username}</div>
                        </div>
                    </div>
                </div>
            </div>   
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md items-center bg-white">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Profile information</label></div>
                <div class="overflow-x-auto m-3">
                    <table class="min-w-auto bg-white">
                        <tbody>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Registration No.</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{reg.RegID}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Registration Date</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{reg.RegDate}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">College Name</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.college}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Program Name</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.program}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Major Name</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.major}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Year Level Description</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">
                                <select name="" id="" onChange={handleChange} value={yearLevel} className='rounded-xl border-none'>
                                    <option value="1st Year" >1st Year</option>
                                    <option value="2nd Year" >2nd Year</option>
                                    <option value="3rd Year" >3rd Year</option>
                                    <option value="4th Year" >4th Year</option>
                                    <option value="5th Year" >5th Year</option>
   
                                </select>
                                </td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Curriculum Name</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{reg.CurriculumCode}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Max. Load</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.maxUnitsLoad}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Status</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.status}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Gender</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{profile.sex=='F'? "Female":"Male"}</td>
                            </tr>
                            <tr class="info-cell">
                                <td class="px-3 py-2 font-bold">Scholarship Name</td>
                                <td class="px-3 py-2">:</td>
                                <td class="px-3 py-2">{reg.ScholarProviderName}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">List of Enrolled Subject for {reg.YearTerm}</label></div>
                <EnrollSub data={reg} reload={reload} isopen={enrollment['isOpen']} load={handlereload} curUnit={CurrentUnit}></EnrollSub>
            </div>

            {enrollment['isOpen'] == 1 && <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">List of Sections for {reg.YearTerm}</label></div>
                <nav className="nav-bar m-4">
                    <button onClick={() => handleNavClick('Page1')} className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${activePage == 'Page1' ? 'bg-gray-400' : 'bg-gray-300'}`}>Block Section</button>
                    <button onClick={() => handleNavClick('Page2')}  className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${activePage == 'Page2' ? 'bg-gray-400' : 'bg-gray-300'}`}>Free Section</button>
                </nav>
                <div className="page-content">
                    {activePage === 'Page1' && <BlockSection datas={[profile,reg]} reload={handlereload} curUnit={curUnit}></BlockSection>}
                    {activePage === 'Page2' && <FreeSection datas={[profile,reg]} reload={handlereload}></FreeSection>}
                </div>
            </div>}
            </> 
        )}
        </AuthenticatedLayout>
    );
}
