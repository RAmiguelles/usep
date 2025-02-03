import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import "./../../../css/enrollmentPageStyle.css"
import ProfilePage from '@/Components/contents/ProfilePage';
import EnrollmentPage from '@/Components/contents/EnrollmentPage';

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-dark"></div>
    </div>
);

export default function Main({reg,data,enrollment,info,status}) {
    const [activeContent, setActiveContent] = useState('Profile');
    const [profilePic, setprofilePic] = useState('');
    const [profile, setprofile] = useState([]);
    const [subject, setSubject] = useState([]);
    const [major, setMajor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [curUnit, setcurUnit] = useState(0);
    const[Assessment, setAssessment]=useState([]);
    const[Total, setTotal]=useState('');
    const[disable, setdisable]=useState(false);

    const [defaultAvailableScheds,setDefaultAvailableScheds]=useState([])
    const [Availablescheds,setAvailablescheds]=useState([])

    const params={
        'campusID':info.CampusID,
        'termID':info.TermID,
        'studentID':info.StudentNo,
        'collegeID':info.CollegeID,
        'progID':info.ProgID,
        'YearLevel':info.YearLevelID
    }

    const toggleCollapse = () => {
      setIsCollapsed(prevState => !prevState);
    };

    const url = `https://api.usep.edu.ph/student/`;

    const handleNavClick = (page) => {
      setActivePage(page);
    };

    const getHTTPConfig = (token) => {
        return {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
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
                offersubject([])
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
                setLoading(true);
                if (data && data.user && data.campus && data.token) {
                    const profilePicResponse = await axios.get(`${url}getProfilePic/${data.user}/${data.campus}`, getHTTPConfig(data.token));
                    if (profilePicResponse.data) {
                        const date = new Date(reg.RegDate);
                        setprofilePic(profilePicResponse.data);
                        setprofile(info)
                    }
                }
                    setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false); 
            }
        };
        fetchData();

        const fetchAssessment = async () => {
            try {
                const response = await axios.post(route("getassessment"), { term: info.TermID, template: info.TblFeesID });
                if (response.data) {
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
        const totalAcadUnits = subs.reduce((total, sub) => total + Math.abs(parseFloat(sub.CreditUnits)), 0);
        setcurUnit(totalAcadUnits)
    }

    async function offersubject(subjects){
        const subs=subjects.filter(item =>
            Number(item.Limit) > Number(item.Registered)
        )
        console.log(subs)
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
            setSubject(subs)
            Maxlimit(subs)
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
        setdisable(!disable)
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

    const handleClick = (content) => {
        setActiveContent(content);
      };
    
    useEffect(() => {
        const fetchData = async () => {                                                         //get blocksection
            try {
                const Response = await axios.post(route("getBlockSection"),{params});
                if (Response.data) {
                    const schedules= Response.data['schedules'];
                    const Mscheds=[]
                    const filteredSchedules = schedules.filter(schedule => schedule.YearLevelID == info.YearLevelID && schedule.CurriculumID==info.CurriculumID);
                    Mscheds.unshift(...filteredSchedules);
                    const Ascheds=Response.data['schedules']
                    const Response2 = await axios.post(route("checkconflict"),{array1:Mscheds, array2:[]});
                    if (Response2.data) {
                        offersubject(Response2.data)
                    }
                    setDefaultAvailableScheds(Ascheds)
                    setLoading(false)

                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        if((Object.entries(reg).length < 1)){
            fetchData();
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-red-500 leading-tight"></h2>}
        >{loading ? (
            <LoadingSpinner /> 
        ) : (
            <>
            <Head title="Enrollment" />
            <div>
                <div  style={{height:'200px',background:'linear-gradient(0deg,rgba(151, 57, 57, 0.1),rgba(151, 57, 57, 0.1)),url(/img/banner.jpg)',backgroundSize:'cover', backgroundPosition:'center'}}></div>
                <div className="profile">
                    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'unset', justifyContent: 'center', alignItems: 'center', alignContent: 'unset', overflow: 'unset'}}>
                        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'unset', justifyContent: 'center', alignItems: 'center', alignContent: 'unset', overflow: 'unset'}}>
                            <div className="slide-in-fwd-center"> 
                                <img src={profilePic} alt="Profile" className="rounded-full border-4 border-primary-dark p-2" style={{height: '150px', width: '150px', marginTop: '-93px'}}/> 
                            </div>
                            <div className="text-2xl text-primary-dark ">{profile.studentID}</div>
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.StudentNo}</div>
                            <div className="text-2xl text-gray-800 font-semibold" >{profile.StudentName}</div><br /><br />
                            {/* <div className="text-2xl text-gray-800 font-semibold" >
                                <ol class="flex items-center w-full text-sm text-gray-600 font-medium sm:text-base">
                                    <li class={`flex md:w-full items-center ${(Object.entries(reg).length > 0) ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 `}>
                                        <div class="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                                            <span class={`w-6 h-6 border ${(Object.entries(reg).length > 0) ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>1</span> Submitted
                                        </div>
                                    </li>
                                    <li class={`flex md:w-full items-center ${reg.ValidationDate && reg.ValidationDate !== ''  ? 'border-indigo-600 text-indigo-600' : 'border-gray-600 '}`}>
                                        <div class="flex items-center  ">
                                            <span class={`w-6 h-6 border ${reg.ValidationDate && reg.ValidationDate !== ''  ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>2</span> Officially Enrolled
                                        </div>
                                    </li>
                                </ol>  
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className='navbutton'>
                    <nav className="navbar">
                        <button className="nav-button hover:bg-gradient-to-br bg-gradient-to-r from-primary-light to-primary-dark" onClick={() => handleClick('Profile')}>Profile</button>
                        <button className="nav-button hover:bg-gradient-to-br bg-gradient-to-r from-primary-light to-primary-dark" onClick={() => handleClick('Grade')}>Grade</button>
                        <button className="nav-button hover:bg-gradient-to-br bg-gradient-to-r from-primary-light to-primary-dark" onClick={() => handleClick('Evaluation')}>Evaluation</button>
                        <button className="nav-button hover:bg-gradient-to-br bg-gradient-to-r from-primary-light to-primary-dark" onClick={() => handleClick('Enrollment')}>Enrollment</button>
                    </nav>
                </div>
            </div>   
            {activeContent === 'Profile' && <ProfilePage reg={reg} profile={profile} status={status}></ProfilePage>}
            {activeContent === 'Grade' && <div>Grade Content</div>}
            {activeContent === 'Evaluation' && <div>Evaluation Content</div>}
            {activeContent === 'Enrollment' && <EnrollmentPage reg={reg} defaultAvailableScheds={defaultAvailableScheds} status={status}subject={subject} Assessment={Assessment} curUnit={curUnit} CurSubject={subject} addSubject={addSubject} SwalConfirm={SwalConfirm}  allow={(!(Object.entries(reg).length > 0))} Submit={Submit}></EnrollmentPage>}
            </> 
        )}
        </AuthenticatedLayout>
    );
}
