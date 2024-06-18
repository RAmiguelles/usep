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
        <form onSubmit={submit}>
            <div>
                <InputLabel htmlFor="text" value="text" />
                <TextInput
                    id="text"
                    type="text"
                    name="text"
                    value={data.text}
                    className="mt-1 block w-full"
                    autoComplete="text"
                    isFocused={true}
                    onChange={(e) => setData('text', e.target.value)}
                />
                <InputError message={errors.text} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="text2" value="text2" />
                <TextInput
                    id="text2"
                    type="text"
                    name="text2"
                    value={data.text2}
                    className="mt-1 block w-full"
                    autoComplete="text2"
                    isFocused={true}
                    onChange={(e) => setData('text2', e.target.value)}
                />
                <InputError message={errors.text2} className="mt-2" />
            </div>
            <div className="flex items-center justify-center mt-4">
                <PrimaryButton className="ms-4" disabled={processing}>
                    Log in
                </PrimaryButton>
            </div>
        </form>
    )
}
