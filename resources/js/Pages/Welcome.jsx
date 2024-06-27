
import { Link, Head } from '@inertiajs/react';
import { useState } from "react";
import Modal from '@/Components/Modal';
import SeconButton from '@/Components/SecondaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };
    const [show, setShow] = useState(true);

    return (
        <>
            <Head title="Welcome" />

                        <header className="items-center p-3 bg-gradient-to-r from-primary-light to-primary-dark">
                            <nav className="-mx-3 flex flex-1 justify-end">
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-8 py-2 text-black ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                    </>
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
                                      <a href={route('login')} className='inline-flex items-center px-6 py-3 bg-white border border-block rounded-xl font-semibold text-md text-gray-100 uppercase tracking-widest bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:bg-red-800 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 transition ease-in-out duration-150 opacity-25transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 hover:scale-110 duration-300'>
                                          Log in
                                      </a>
                                  </div>
                          </div>
                        </div>     
                        </main>
        </>
    );
}
