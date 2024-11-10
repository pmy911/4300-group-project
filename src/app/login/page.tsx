'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from "@/app/components/Logo";

// The Login component handles both login and signup functionality
export default function Login() {
    // State to store form data (name, email, password)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State to toggle between login and signup
    const [isSignup, setIsSignup] = useState(false);

    // Router hook to programmatically navigate between pages
    const router = useRouter();

    // Handle change in form input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Update the state with the new input value
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log(isSignup ? 'Signup data:' : 'Login data:', formData); // Log form data for now
        // Navigate to the '/tasks' page after submission
        router.push('/tasks');
    };

    return (
        <div>
            {/* Header section with a logo and link back to the home page */}
            <div className='flex flex-row p-1 justify-center items-center'>
                <Link href="/">
                    <Logo/>
                </Link>
            </div>
            {/* Divider line below the header */}
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />

            {/* Toggle buttons for login and signup */}
            <div className='flex justify-center mt-5'>
                <button
                    className={`px-4 py-2 border ${isSignup ? '' : 'bg-[#D3D3D3]'} rounded-l text-2xl border-[#232323]`}
                    onClick={() => setIsSignup(false)}
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 border ${isSignup ? 'bg-[#D3D3D3]' : ''} rounded-r text-2xl border-[#232323]`}
                    onClick={() => setIsSignup(true)}
                >
                    Sign Up
                </button>
            </div>

            {/* Main content area with the form */}
            <div className='flex justify-center items-center min-h-[70vh]'>
                <div className='bg-[#E4E2DD] p-10 rounded w-[350px] border border-[#232323]'>
                    <h2 className='text-3xl mb-5 text-center'>{isSignup ? 'Signup' : 'Login'}</h2> {/* Form title */}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {/* Name input field, visible only for signup */}
                        {isSignup && (
                            <div className='flex flex-col text-2xl'>
                                <label htmlFor='name'>Name</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange} // Update state on change
                                    className='border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1'
                                    required // Mark field as required
                                />
                            </div>
                        )}

                        {/* Email input field */}
                        <div className='flex flex-col text-2xl'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange} // Update state on change
                                className='border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1'
                                required // Mark field as required
                            />
                        </div>

                        {/* Password input field */}
                        <div className='flex flex-col text-2xl'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange} // Update state on change
                                className='border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1'
                                required // Mark field as required
                            />
                        </div>

                        {/* Submit button */}
                        <button type='submit' className='w-full border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-2xl rounded'>
                            {isSignup ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
