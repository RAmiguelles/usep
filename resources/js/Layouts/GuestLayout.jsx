import ApplicationLogo from '@/Components/ApplicationLogo';
import BrandLogo from '@/Components/BrandLogo';
import SdmdLogo from '@/Components/SdmdLogo';
import { Link } from '@inertiajs/react';


export default function Guest({ children }) {
    return (
        <>
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
                                    <div class="" style={{color: 'rgb(229, 156, 36)', fontWeight: '600', fontSize: '18px'}}>One <span class="" style={{color: 'rgb(151, 57, 57)', fontWeight: '600', fontSize: '18px'}}>Data. </span>One <span class="" style={{color: 'rgb(151, 57, 57)', fontWeight: '600', fontSize: '18px'}}>USeP. </span></div>
                                    <div class="" style={{color: 'rgb(87, 87, 87)', fontWeight: '600', fontSize: '14px'}}>Online Enrollment</div>
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

        <div className="h-screen flex justify-center sm:pt-0 bg-gray-100">
            <div className="w-full h-auto sm:max-w-6xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg flex flex-raw sm:justify-center">
                {children}
            </div>

        </div>
        </>
    );
}
