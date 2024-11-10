'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// The Login component handles user login functionality
export default function Login() {
    // State to store form data (name, email, password)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

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
        console.log(formData); // Log form data to the console (replace with actual login logic)
        // Navigate to the '/tasks' page after submission
        router.push('/tasks');
    };

    return (
        <div>
            {/* Header section with a logo and link back to the home page */}
            <div className='flex flex-row p-1 justify-center items-center'>
                <Link href="/">
                    <Image
                        src="/images/logo.png" // Path to the logo image
                        alt="syncro logo" // Alt text for the logo image
                        width={150} // Width of the image
                        height={30} // Height of the image
                        priority // Load the image with high priority
                    />
                </Link>
            </div>
            {/* Divider line below the header */}
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>

            {/* Main content area with the login form */}
            <div className='flex justify-center items-center min-h-[80vh]'>
                <div className='bg-[#E4E2DD] p-10 rounded w-[350px] border border-[#232323]'>
                    <h2 className='text-3xl mb-5 text-center'>Login</h2> {/* Form title */}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {/* Name input field */}
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
                        <button type='submit' className='w-full border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-2xl rounded'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}