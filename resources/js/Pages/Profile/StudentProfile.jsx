import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({student }) {
    return (
        <>
            <Head title="Profile" />

            <div className="py-12">
                <h1>{student.StudentName}</h1>
            </div>

        </>
    );
}
