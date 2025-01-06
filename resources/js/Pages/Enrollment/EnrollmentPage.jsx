import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Print from '@/Components/print';
import axios from "axios";
import { useState, useEffect } from "react";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import BlockSection from "@/Components/contents/BlockSection";
// import FreeSection from "@/Components/contents/FreeSection";
// import EnrollSub from '@/Components/contents/EnrollSub';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons'
// import { format } from 'date-fns';
import Swal from 'sweetalert2';
import EnrollSubTable from "@/Components/tables/EnrollSubTable";
import Modal from '@/Components/Modal';

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
    </div>
);

export default function Main({reg,data,enrollment,info,status}) {
    const [validated, setvalidated] = useState(reg.ValidationDate);
    const [profilePic, setprofilePic] = useState('');
    const [profile, setprofile] = useState([]);
    const [subject, setSubject] = useState([]);
    const [major, setMajor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setshow] = useState(false);
    const [curUnit, setcurUnit] = useState(0);
    const[Assessment, setAssessment]=useState([]);
    const[Total, setTotal]=useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => {
      setIsCollapsed(prevState => !prevState);
    };
    const url = `https://api.usep.edu.ph/student/`;
    const handleNavClick = (page) => {
      setActivePage(page);
    };
console.log(info)
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

        if (!status.isOpen['isOpen']) {
            Swal.fire({
                title: 'Enrollment Closed',
                text: `The Enrollment has been closed since ${status.isOpen['EndEnrollment']}`,
                icon: 'info',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#D75D5F',
                iconColor: '#D75D5F',
            })
        }

        if (status.allowWithBalance==false) {
            Swal.fire({
                title: 'Warning!',
                text: "Ensure that any unpaid balance is settled with the cashier.",
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#D75D5F',
            })
        }
        if (Object.entries(reg).length > 0) {
            try {
                if(info.isPaying=="Paying"){
                    Swal.fire({
                        title: 'Warning!',
                        text: "You may now settle your enrollment fee at the cashier's office.",
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#D75D5F',
                    });
                }
            } catch (error) {
                console.error("Error sending request:", error);
                // Optionally handle the error (e.g., showing a message to the user)
            }
        }

        const Major=()=>{
            const stopWords = ["and", "the", "of", "a", "an"];
            const words = info.MajorStudy.split(" ");
            const firstLetters =words.filter(word => !stopWords.includes(word.toLowerCase())).map(word => word.charAt(0).toUpperCase());
            const result = firstLetters.join("");
            setMajor(result)
        }
        Major();
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when fetching starts
                if (data && data.user && data.campus && data.token) {
                    const profilePicResponse = await axios.get(`${url}getProfilePic/${data.user}/${data.campus}`, getHTTPConfig(data.token));
                    if (profilePicResponse.data) {
                        const date = new Date(reg.RegDate);
                        // reg.RegDate = format(date, 'MM/dd/yyyy');
                        // setyearlevel(profileResponse.data.yearLevel);
                        setprofilePic(profilePicResponse.data);
                        setprofile(info)
                    }
                }
                    setLoading(false); // Set loading to false when fetching is complete
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false); // Set loading to false on error
            }
        };
        fetchData();

        const fetchAssessment = async () => {
            try {
                const response = await axios.post(route("getassessment"), { term: info.TermID, template: info.TblFeesID });
                if (response.data) {
                    console.log(response.data)
                    setAssessment(response.data.response);
                    setTotal(response.data.total);
                }
            } catch (error) {
                console.error("Error fetching assessment data:", error);
            }
        };
        fetchAssessment()

    },[data]);
     
    function Maxlimit(subs){
        const totalAcadUnits = subs.reduce((total, sub) => total + parseFloat(sub.CreditUnits), 0);
        setcurUnit(totalAcadUnits)
    }
    async function offersubject(subjects){
        const subs=subjects.filter(item =>
            item.Registered < item.Limit
        )
        if((Object.entries(reg).length > 0)){
            try {
                const response = await axios.post(route("getEnrollSubject"), { data: reg.RegID });
                if (response.data) {
                    setSubject(Object.values(response.data));
                    Maxlimit(Object.values(response.data))
                }
            } catch (error) {
                console.error("Error fetching enroll subjects:", error);
            }
        }else{
            const filter=subs.filter(item =>
                item.SectionName.toLowerCase().includes(major.toLowerCase())
            )
            if(filter.length > 0){
                setSubject(filter)
                Maxlimit(filter)
            }else{
                setSubject(subs)
                Maxlimit(subs)
            }

        }
    }
    async function addSubject(sub) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to add " + sub[0].SubjectTitle + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#D75D5F',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const Response2 = await axios.post(route("checkconflict"), { array1: sub, array2: subject });
                    console.log(Response2)
                    if (Response2.data.error) {
                        Swal.fire({
                            title: 'Conflict Detected',
                            text: Response2.data.error,
                            icon: 'error',
                            confirmButtonColor: '#D75D5F'
                        });
                    }else{
                        setSubject(subject.concat(sub));
                        Maxlimit(subject.concat(sub));
                    }
                } catch (error) {
                    console.error('Error adding subject:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error processing your request.',
                        icon: 'error'
                    });
                }
            }
        });
    }

    function removeSubject(sub){
        const updatedsub = subject.filter(item => 
            item.ScheduleID !== sub[0].ScheduleID
        );
        setSubject(updatedsub)
        Maxlimit(updatedsub)
    }

    function Submit(e){
        if(curUnit > info.MaxUnitsLoad){
            Swal.fire({
                title: 'Error!',
                text: 'Exceed the Maximum limit',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#D75D5F',
            });
        }else{
            Swal.fire({
                title: 'Data Privacy Consent',
                html: `<div style="text-align:left;padding-left: 20px;">You are about to submit your chosen courses. By clicking "Yes", you hereby confirm that you will abide and comply with all the rules and regulation laid down by competent authorities in the University of Southeastern Philippines (USeP) and in the College/School in which you will enroll. <br></br>You also confirm that you have read the USeP Data Privacy Statement and that you allow the University to collect, use and store your personal information through its official channels for legitimat purpose. Further, you affirm your fundamental right to privacy and your constitutional data privacy right as stated in Republic Act No. 10173 of the Philippines.<br></br><a href="https://www.usep.edu.ph/usep-data-privacy-statement/" target="_blank">Click to read Data Privacy Statement</a></div>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#D75D5F',
                cancelButtonText: 'No',
            }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post(route("saveSubjects"), {subject, term: info.TermID, yearLevel:info.YearLevelID,})
                        .then(response => {
                            console.log(response)
                            if (response.data.error) {
                                const errorMessage = response.data.error.split('\n').join('<br />');
                                Swal.fire({
                                    html:errorMessage,
                                    icon: 'warning',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#FFC107', 
                                }).then(() => {
                                    window.location.reload();
                                });
                            } else {
                                if(response.data[1]){
                                    const errorMessages = response.data[1].map((error, index) => `${index + 1}. ${error}`).join("<br><br>");
                                    console.log(errorMessages)
                                    Swal.fire({
                                        title: 'Conflict!',
                                        html: `There was a problem saving the subjects. Please try again.<br><br>${errorMessages}`, 
                                        icon: 'warning',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: '#D75D5F',
                                      });
                                    setSubject(response.data[0])
                                    Maxlimit(response.data[0])
                                }else{
                                    if(info.isPaying=='Paying'){
                                        window.location.reload();
                                    }else{
                                        Swal.fire({
                                            title: 'Success!',
                                            text: 'You are officially enrolled.',
                                            icon: 'success',
                                            confirmButtonText: 'OK',
                                            confirmButtonColor: '#28a745',
                                        }).then(() => {
                                            window.location.reload();
                                        });
                                    }
                                }
                            }
                            
                        }).catch(error => {
                            console.error("Error saving subjects:", error);
                            Swal.fire({
                                title: 'Error!',
                                text: 'There was a problem saving the subjects. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#D75D5F',
                            });
                        });
                    } 
            });
        }
    }

    function SwalConfirm(sub){
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to remove "+sub[0].SubjectTitle+"?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            confirmButtonColor: '#D75D5F',
            cancelButtonText: 'No, keep it',
          }).then((result) => {
            if (result.isConfirmed) {
                const updatedsub = subject.filter(item => 
                    item.ScheduleID !== sub[0].ScheduleID
                );
                setSubject(updatedsub)
                Maxlimit(updatedsub)
            } 
          });
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
                                <img src={profilePic} alt="Profile" className="rounded-full border-4 border-primary-dark p-2" style={{height: '150px', width: '150px', marginTop: '-93px'}}/> 
                            </div>
                            <div className="text-2xl text-primary-dark">{profile.studentID}</div>
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.StudentNo}</div>
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.StudentName}</div><br /><br />
                            
                            <div className="text-2xl text-gray-800 font-semibold" >
                                <ol class="flex items-center w-full text-sm text-gray-600 font-medium sm:text-base">
                                    <li class={`flex md:w-full items-center ${(Object.entries(reg).length > 0) ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 `}>
                                        <div class="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                                            <span class={`w-6 h-6 border ${(Object.entries(reg).length > 0) ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>1</span> Submitted
                                        </div>
                                    </li>
                                    {/* <li class={`flex md:w-full items-center ${(Object.entries(reg).length > 0) ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 `}>
                                        <div class="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                                            <span class={`w-6 h-6 border ${(Object.entries(reg).length > 0) ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>2</span> OSAS
                                        </div>
                                    </li>
                                    <li class={`flex md:w-full items-center ${(Object.entries(reg).length > 0) ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 `}>
                                        <div class="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                                            <span class={`w-6 h-6 border ${(Object.entries(reg).length > 0) ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>3</span> Cashier
                                        </div>
                                    </li> */}
                                    <li class={`flex md:w-full items-center ${validated && validated !== ''  ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}`}>
                                        <div class="flex items-center  ">
                                            <span class={`w-6 h-6 border ${validated && validated !== ''  ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>2</span> Officially Enrolled
                                        </div>
                                    </li>
                                </ol>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md items-center bg-white relative">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Profile information</label></div>
                <button
                    onClick={toggleCollapse}
                    className="absolute top-2 right-2 text-white text-2xl font-bold mr-2 rotate-90"
                    type="button"
                    >
                    |||
                    </button>
                {!isCollapsed && (<div className=" m-3" data-collapse="collapse">
                    <table className="min-w-auto bg-white">
                        <tbody>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Registration No.</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.RegID}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Registration Date</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.RegDate}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">College Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.CollegeName}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Program Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.ProgramName}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Major Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.MajorStudy}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Year Level Description</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2" >{profile.YearLevel}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Curriculum Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.CurriculumCode}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Max. Load</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.MaxUnitsLoad}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Year of Entry</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.yearOfEntry}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Status</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.isPaying}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Balance</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">Php  {Number(profile.PrevBalance).toLocaleString()+".00"} <span className={`font-bold ${status.allowWithBalance?'':'text-red-600'}`}>{status.allowWithBalance?"(Cleared to enroll)":"(Not clear to enroll)"}</span></td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Gender</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.Gender=='F'? "Female":"Male"}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Scholarship Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.ScholarProviderName}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className='px-3 py-2 font-bold text-xl'>Overall Progress:</h1>
                    <div className="flex flex-col items-center">
                        <div className="flex justify-between w-full">
                            <div className='font-bold'><p className='text-lg'>{profile.UnitsEarned} <span className='text-xs'>Units Earned</span></p></div>
                            <div className='font-bold'><p className='text-lg'>{profile.CurrTotalCreditUnits} <span className='text-xs'>Total Units</span></p></div>
                        </div>
                        <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                            <div 
                                className="h-6 bg-gradient-to-r from-green-500 to-green-600 text-xl font-medium text-gray-700 text-center p-0.5 leading-none dark:bg-blue-500 rounded-full" 
                                style={{ width: ((profile.UnitsEarned / profile.CurrTotalCreditUnits)*100) + "%" }}
                            >
                                {((profile.UnitsEarned / profile.CurrTotalCreditUnits)*100).toFixed(2)+'%'}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            
            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">{!(Object.entries(reg).length > 0)?"List of Courses to be Enrolled":"List of Courses Enrolled"}</label></div>
                <div className="m-4">
                <form action="#" method="post">
                    <EnrollSubTable value={subject} onSelectionChange={SwalConfirm} TUnit={curUnit} allow={(!(Object.entries(reg).length > 0))}></EnrollSubTable>
                    <button type="button" onClick={Submit} disabled={((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-3 ${((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Submit</button>
                    <button type="button" onClick={()=>{setshow(true)}}disabled={((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)} className={`text-white hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-left mt-3 ${((Object.entries(reg).length > 0) || status.allowWithBalance==false || status.isOpen['isOpen'] == false)? 'bg-gray-400' : ' bg-gradient-to-r from-primary-light to-primary-dark'}`}>Add Subject</button>
                </form>
                </div>
            </div>

            <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Billing Information</label></div>
                <Print data={[subject,Assessment]}></Print>
            </div>
            <BlockSection info={info} CurSubject={subject} listOfSubject={offersubject} addsubject={addSubject} allow={(!(Object.entries(reg).length > 0))} show={show} setshow={()=>{setshow(false)}}></BlockSection>

            </> 
        )}
        </AuthenticatedLayout>
    );
}
