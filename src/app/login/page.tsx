'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/app/components/Logo';
import { signIn } from 'next-auth/react';

export default function Login() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (isSignup) {
            // Handle signup
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                if (response.ok) {
                    const signInResponse = await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        redirect: false,
                    });

                    if (signInResponse?.ok) {
                        router.push('/tasks');
                    } else {
                        setError('Signup successful, but auto-login failed. Please try logging in.');
                    }
                } else {
                    const data = await response.json();
                    setError(data.message || 'Signup failed. Please try again.');
                }
            } catch (err) {
                setError('An unexpected error occurred. Please try again.');
            }
        } else {
            // Handle login
            try {
                const signInResponse = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (signInResponse?.ok) {
                    router.push('/tasks');
                } else {
                    setError('Invalid email or password. Please try again.');
                }
            } catch (err) {
                setError('An unexpected error occurred during login. Please try again.');
            }
        }
    };

    return (
        <div>
            <div className="flex flex-row p-1 justify-center items-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />

            <div className="flex justify-center mt-5">
                <button
                    className={`px-4 py-2 border ${isSignup ? '' : 'bg-[#D3D3D3]'} rounded-l text-2xl border-[#232323]`}
                    onClick={() => {
                        setIsSignup(false);
                        setError(null);
                    }}
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 border ${isSignup ? 'bg-[#D3D3D3]' : ''} rounded-r text-2xl border-[#232323]`}
                    onClick={() => {
                        setIsSignup(true);
                        setError(null);
                    }}
                >
                    Sign Up
                </button>
            </div>

            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="bg-[#E4E2DD] p-10 rounded w-[350px] border border-[#232323]">
                    <h2 className="text-3xl mb-5 text-center">{isSignup ? 'Signup' : 'Login'}</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {isSignup && (
                            <div className="flex flex-col text-2xl">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex flex-col text-2xl">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                className="border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="flex flex-col text-2xl">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                className="border border-[#232323] bg-[#E4E2DD] p-2 rounded mt-1"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-center text-xl">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-2xl rounded"
                        >
                            {isSignup ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
