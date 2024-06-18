import { Link, Head } from '@inertiajs/react';
import { useState } from "react";
import Modal from '@/Components/Modal';
import SeconButton from '@/Components/SecondaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

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
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-8 py-2 text-black ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                    </>
                                )}
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
                        </main>
        </>
    );
}
