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

    const getHTTPConfig = (token) => {
        return {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
                // Add other headers if needed
            }
        };
    };
    const URl='https://api.usep.edu.ph/'
    const submit = (e) => {
        const data = {
            username: "2015-21713",
            password: "portal@SDMD123",
            campusID: 1,
        };
        
        const payload = {};
        
        let url = `https://api.usep.edu.ph/user/auth`;
        axios
            .post(url, data)
            .then((result) => {
            console.log("LOGIN", result);

            if (result.data.success) {
                const token = result.data.token;
                url = `https://api.usep.edu.ph/student/getProfilePic/2015-21713/1`;
                axios
                .get(url, getHTTPConfig(token))
                .then((result) => {
                    console.log("GET PROFILE PIC", result);
        
                    if (result.data) {
                    payload["profilePicture"] = result.data;
                    }
        
                    url = `https://api.usep.edu.ph/student/getProfile/2015-21713/1`;
                    axios
                    .get(url, getHTTPConfig(token))
                    .then((result) => {
                        console.log("GET PROFILE", result);
                        const data = result.data;
        
                        for (let i of campuses) {
                        if (i.id === data.campusID) {
                            payload["campus"] = i.label?.toLowerCase();
                        }
                        }
                        console.log(result.data)
        
                    })
                    .catch((error) => {
                        console.log("GET PROFILE", error);
                    });
                })
                .catch((error) => {
                    console.log("GET PROFILE PIC", error);
                });
            } else {
                console.log("GET PROFILE PIC", error);
            }
            })
            .catch((error) => {
            console.log("LOGIN", error);
            });
    };

    return(
        <>
        <button onClick={submit}>click</button>
        </>
    )
}
