"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        // Implement login logic here
        router.push('/tasks');
    };

    return (
        <div>
            <div className='flex flex-row p-1 justify-center items-center'>
                <Link href="/">
                    <Image
                        src="/images/logo.png"
                        alt="syncro logo"
                        width={150}
                        height={30}
                        priority
                    />
                </Link>
            </div>
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>
            <div className='flex justify-center items-center min-h-[80vh]'>
                <div className='bg-[#E4E2DD] p-10 rounded w-[350px] border border-[#232323]'>
                    <h2 className='text-3xl mb-5 text-center'>Login</h2>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='flex flex-col text-2xl'>
                            <label htmlFor='name'>Name</label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='border border-[#232323] p-2 rounded mt-1'
                                required
                            />
                        </div>
                        <div className='flex flex-col text-2xl'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className='border border-[#232323] p-2 rounded mt-1'
                                required
                            />
                        </div>
                        <div className='flex flex-col text-2xl'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className='border border-[#232323] p-2 rounded mt-1'
                                required
                            />
                        </div>
                        <button type='submit' className='w-full border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-2xl rounded'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
