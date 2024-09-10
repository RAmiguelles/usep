
import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from "react";
import Modal from '@/Components/Modal';
import ModalLogin from '@/Components/ModalLogin';
import SeconButton from '@/Components/SecondaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SdmdLogo from '@/Components/SdmdLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock,faSchool, faUser } from '@fortawesome/free-solid-svg-icons';


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };
    const [show, setShow] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isCapsLock, setIsCapsLock] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        IdNumber: '',
        password: '',
        campus:'',
        remember: false,
    });
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (e) => {
        if (e.getModifierState('CapsLock')) {
            setIsCapsLock(true);
        } else {
            setIsCapsLock(false);
        }
    };

    const handleFocus = (e) => {
        setIsCapsLock(e.getModifierState('CapsLock'));
    };
    
    return (
        <>
            <Head title="Welcome" />

            <header>
                <div className='bg-gradient-to-r from-primary-light to-primary-dark' style={{height:'15px'}}> </div>
                <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-14">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800"/>
                                    <div style={{height: '0px', width: '16px'}}></div><div className="border border-gray-500/50" style={{height: '32px', width: '1px'}}></div><div style={{height: '0px', width: '16px'}}></div>
                                    <div className="" style={{height: '100%', width: '100%', placeContent: 'unset', alignItems: 'unset', overflow: 'unset'}}>
                                        <div className="" style={{color: 'rgb(229, 156, 36)', fontWeight: '600', fontSize: '18px'}}>One <span className="" style={{color: 'rgb(151, 57, 57)', fontWeight: '600', fontSize: '18px'}}>Data. </span>One <span className="" style={{color: 'rgb(151, 57, 57)', fontWeight: '600', fontSize: '18px'}}>USeP. </span></div>
                                        <div className="" style={{color: 'rgb(87, 87, 87)', fontWeight: '600', fontSize: '14px'}}>Online Enrollment</div>
                                    </div>
                                </div>
                            </div>  

                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 flex relative">
                                    <SdmdLogo className="block h-9 w-auto fill-current text-gray-800"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
                        <main>
                        
                        <Modal show={show}>
                            <div className='header p-4 bg-gradient-to-r from-primary-light to-primary-dark'></div>
                            <div className='p-0'>
                                <a className="p-0 focus:outline-none" href="https://www.usep.edu.ph/usep-data-privacy-statement/">
                                <img className="w-auto m-0" href="https://www.usep.edu.ph/usep-data-privacy-statement/" src="img/DataPrivacy.jpg" alt="" />
                                </a>    
                                <div className='w-auto items-center justify-center p-12'>
                                <p className='text-center text-gray-400' >By continuing to browse this website, you agree to the University of Southeastern Philippines’ Data Privacy Statement. The full text of The Statement can be accessed by clicking the image above.</p>
                                </div>
                                <div className='w-auto flex justify-center'>
                                    <SecondaryButton className="justify-self-center" onClick={()=>setShow(false)}>
                                        Continue
                                    </SecondaryButton>
                                </div>
                            </div>
                            <div className='footer p-4 mt-12 bg-gradient-to-r from-primary-light to-primary-dark'></div>
                        </Modal>

                        <div className='w-full h-screen relative bg-gradient-to-r from-gray-200 to-gray-400'>
                          <img className='w-full h-screen object-cover absolute mix-blend-overlay animation-fade' src="img/eagle.jpg" alt="Background"/>
                          <div className='w-full h-screen flex flex-col justify-start items-center absolute'>
                                  <img className="my-24" src="img/USePLogo.png" alt="" srcset="" />
                                  <div className='text-5xl'>University of Southeastern Philippines</div>
                                  <div className='text-6xl'>Enrollment System</div>
                                  <div className="mt-24">
                                      <button type="button" onClick={()=>setShowLogin(true)} className={`${showLogin ? 'hidden' : ''} inline-flex items-center px-6 py-3 bg-white border border-block rounded-xl font-semibold text-md text-gray-100 uppercase tracking-widest bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:bg-red-800 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 transition ease-in-out duration-150 opacity-25transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 hover:scale-110 duration-300`}>Log in</button>
                                  </div>
                          </div>
                        </div>     
                        </main>
                        <ModalLogin show={showLogin} maxWidth='lg'>
                            <div className='p-6 backdrop-blur-sm'>
                                <div className='flex w-auto items-center justify-center'>
                                    <form onSubmit={submit}>
                                        {errors && <center><div className="mb-4 font-medium text-md text-red-600 delay-300 mt-6">{errors.status}</div></center>}
                                        <div className='m-3'>
                                            <div className="relative flex items-center border-2 border-gray-500/50 rounded-md">
                                                <FontAwesomeIcon
                                                    icon={faSchool}
                                                    className="text-gray-800 px-3 py-2"
                                                />
                                                <select name="campus" id="campus" className="focus focus:rounded-md focus:shadow-sm border-2 border-gray-500/50 rounded-md w-80 p-2 " onChange={(e) => setData('campus', e.target.value)}>
                                                    <option value="" disabled selected>Campus</option>
                                                    <option value="1">Obrero</option>
                                                    <option value="2">Mintal</option>
                                                    <option value="3">Tagum</option>
                                                    <option value="4">Mabini</option>
                                                </select>
                                            </div>
                                            <InputError message={errors.campus} className="mt-2" />
                                        </div>

                                        <div className='m-3'>
                                            <div className="relative flex items-center border-2 border-gray-500/50 rounded-md">
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className="text-gray-800 px-3 py-2"
                                                />
                                                <TextInput
                                                    id="IdNumber"
                                                    type="text"
                                                    name="IdNumber"
                                                    value={data.IdNumber}
                                                    className="block w-full border-none rounded-md pl-10 pr-12"
                                                    autoComplete="username"
                                                    isFocused={false}
                                                    placeholder="ID Number"
                                                    onChange={(e) => setData('IdNumber', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.IdNumber} className="mt-2" />
                                        </div>

                                        <div className="m-3">
                                            <div className="flex items-center border-2 border-gray-500/50 rounded-md">
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                    className={`${isCapsLock ? 'text-red-800':'text-gray-800'} px-3 py-2`}
                                                />
                                                <div className="relative flex-1">
                                                    <TextInput
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        onKeyDown={handleKeyDown}
                                                        onFocus={handleFocus}
                                                        value={data.password}
                                                        className="block w-full border-none rounded-md pl-10 pr-12"
                                                        autoComplete="current-password"
                                                        placeholder="Password"
                                                        onChange={(e) => setData('password', e.target.value)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showPassword ? faEye : faEyeSlash}
                                                        className="absolute inset-y-0 right-0 flex items-center p-3 text-gray-500 cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    />
                                                </div>
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="block mt-4">
                                            <label className="flex items-center">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                />
                                                <span className="ms-2 text-sm text-gray-600">Remember me</span>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-center mt-12">
                                            <PrimaryButton className="ms-0 md:ms-4" disabled={processing}>
                                                Log in
                                            </PrimaryButton>
                                            <button type="button" onClick={()=>setShowLogin(false)} className='ms-0 md:ms-4 inline-flex items-center px-6 py-3 bg-white border border-block rounded-xl font-semibold text-md text-gray-100 uppercase tracking-widest bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:bg-red-800 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 transition ease-in-out duration-150 '>Close</button>
                                        </div>
                                    </form>
                                </div>
                                <div className='w-auto flex justify-center'>
                                </div>
                            </div>
                        </ModalLogin>
        </>
    );
}
