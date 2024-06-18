import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Image from '@/Components/Image';

export default function Enrollment({ auth,test }) {
    const [tests, settest]=useState(test)
    const [value,setVal]=useState('')

    const next=(e)=>{
        e.preventDefault()
        axios.get(tests.next)
            .then(response => {
                // Handle successful response
                settest(response.data); // Output the response data to the console
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching data:', error);
            });
    }
    const prev=(e)=>{
        e.preventDefault()
        axios.get(tests.previous)
            .then(response => {
                // Handle successful response
                settest(response.data); // Output the response data to the console
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching data:', error);
            });
    }

    const select=(event)=>{
        setVal(event.target.value)
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg m-6 p-6">
                        <Image url={value}></Image>  
                       <select className="w-96 sm:w-48 rounded-xl focus:ring-primary-dark focus:border-primary-dark shadow-md border-1 m-3" name="" id="" onChange={select}>
                        {tests.results.map((item,index)=>(
                            <option key={index} value={item.url}>{item.name}</option>
                        ))}
                       </select>
                       <button className="border-2 border-primary-dark p-2 m-3 rounded-xl" type="button" onClick={next}>next</button>
                       <button className="border-2 border-primary-dark p-2 m-3 rounded-xl disabled:text-gray-300 disabled:border-gray-300" type="button" onClick={prev} disabled={tests.previous?false:true}>prev</button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
