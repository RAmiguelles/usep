import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        IdNumber: '',
        password: '',
        campus:'',
        remember: false,
    });
console.log(errors)
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));

    };

    return (
        <GuestLayout>
            <Head title="Log in" />
                <div className="lg:flex">
                    <div class="flex-1 h-auto pt-6">
                        <div class="text-5xl text-gray-600 m-3">Hello There!</div>
                        <div class="text-4xl text-gray-400 m-3">Please login to get started.</div>
                        {errors && <div className="mb-4 font-medium text-sm text-red-600 delay-300">{errors.status}</div>}
                        <form onSubmit={submit}>
                                    <div className='m-3'>
                                        <select name="campus" id="campus" className="focus:rounded-md focus:shadow-sm border-2 border-gray-500/50 rounded-md w-80 p-2.5 " onChange={(e) => setData('campus', e.target.value)}>
                                            <option value="" disabled selected>Campus</option>
                                            <option value="1">Obrero</option>
                                            <option value="2">Mintal</option>
                                            <option value="3">Tagum</option>
                                            <option value="4">Mabini</option>
                                        </select>
                                        <InputError message={errors.campus} className="mt-2" />
                                    </div>
                                    <div className='m-3'>
                                       <TextInput
                                            id="IdNumber"
                                            type="text"
                                            name="IdNumber"
                                            value={data.IdNumber}
                                            className="mt-1 block w-80 border-2 rounded-md border-gray-500/50"
                                            autoComplete="username"
                                            isFocused={true}
                                            placeholder="ID Number"
                                            onChange={(e) => setData('IdNumber', e.target.value)}
                                        />

                                        <InputError message={errors.IdNumber} className="mt-2" />
                                    </div>

                                    <div className='m-3'>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-80 border-2 rounded-md border-gray-500/50"
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />

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

                                    <div className="flex items-center justify-start mt-12">
                                        <PrimaryButton className="ms-0 md:ms-4" disabled={processing}>
                                            Log in
                                        </PrimaryButton>
                                    </div>
                        </form>
                        <div className='self-end py-40'>
                            <div style={{height: '64px', width: '0px'}}></div>
                            <div class="jss33" style={{color: 'rgb(87, 87, 87)', fontWeight: '500', textAlign: 'left'}}>Copyright © 2024. All Rights Reserved.</div>
                            <div class="jss33" style={{color: 'rgb(87, 87, 87)', fontWeight: '500', textAlign: 'left'}}>
                                <span class="jss16"><span class="jss33" style={{color: 'rgb(87, 87, 87)', fontWeight:'bold', textDecoration: 'underline'}}>Terms of Use</span></span>&nbsp; | &nbsp;<a class="jss72" target="_blank" rel="noopener noreferrer" href="https://www.usep.edu.ph/usep-data-privacy-statement/">
                                <span class="jss33" style={{color: 'rgb(87, 87, 87)', fontWeight:'bold', textDecoration: 'underline'}}>Privacy Policy</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 self-end py-40">
                        <img class="h-48 w-full object-scale-down md:h-full md:w-full" src="/img/loginImg.png" alt="Modern building architecture"/>
                    </div>
                </div>
            {/* <div className='flex-col'>
                <div className='w-full h-full mt-12 px-12 py-4'>
                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full border-t-0 border-l-0 border-r-0 rounded-none"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full border-t-0 border-l-0 border-r-0 rounded-none text-lg"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

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

                            <div className="flex items-center justify-end mt-4">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}

                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Log in
                                </PrimaryButton>
                            </div>
                        </form>
                </div> 
            </div>
            <div className='m-0 p-0 flex-col'>
                <img src="img/login.jpg" alt="" srcset="" />
            </div> */}
        </GuestLayout>
    );
}
