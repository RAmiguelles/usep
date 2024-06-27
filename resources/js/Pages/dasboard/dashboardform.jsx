import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Dashform(){
    const { data, setData, post, processing, errors, reset } = useForm({
        text: '',text2:''
    });

    const submit = (e) => {
        e.preventDefault();
        console.log(data)
        // post(route('#'));
    };
    return(
        <>
        <h1>DASHBOARD</h1>
        </>
    )
}
