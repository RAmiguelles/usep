import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';


export default function Guest({ children }) {
    return (
        <>
        <header>
            <div className='bg-gradient-to-r from-primary-light to-primary-dark p-4'> </div>
        </header>
        <div className="min-h-screen flex sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">

            <div className="w-full h-auto sm:max-w-6xl mt-6 bg-white shadow-md overflow-hidden sm:rounded-lg flex flex-raw ">
                {children}
            </div>

        </div>
        </>
    );
}
