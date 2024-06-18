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
        UserID: '',
        password: '',
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

    return (
        <GuestLayout>
            <Head title="Log in" />
                <div class="md:flex">
                    <div class="md:shrink-0">
                        <img class="h-48 w-full object-cover md:h-full md:w-full" src="/img/login.jpg" alt="Modern building architecture"/>
                    </div>

                    <div class="p-8 ml-6 pl-6 md:ml-12 md:pl-12">
                        <div class="uppercase tracking-wide text-5xl text-indigo-500 font-semibold">Welcome!</div>
                        <div>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="UserID" value="UserID" />
                                    <TextInput
                                        id="UserID"
                                        type="text"
                                        name="UserID"
                                        value={data.UserID}
                                        className="mt-1 block w-full border-t-0 border-l-0 border-r-0 rounded-none"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('UserID', e.target.value)}
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

                                <div className="flex items-center justify-center mt-12">
                                    <PrimaryButton className="ms-0 md:ms-4" disabled={processing}>
                                        Log in
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

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
