'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/app/components/Logo';
import { signIn } from 'next-auth/react';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.email || !formData.password) {
                setError('Please fill out all fields.');
                setIsSubmitting(false);
                return;
            }

            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false, // Disable automatic redirection
            });

            console.log('SignIn Result:', result);

            // Check if result is undefined or contains an error
            if (!result || result.error) {
                console.error('Login failed:', result?.error || 'Unknown error');
                setError('Invalid email or password.');
            } else {
                // Successful login
                const callbackUrl = searchParams.get('from') || '/tasks';
                router.push(callbackUrl);
            }
        } catch (err) {
            console.error('Unexpected error during login:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                            <div className="text-red-500 text-center text-xl mt-4">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-2xl rounded
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                        >
                            {isSubmitting ? (isSignup ? 'Signing up...' : 'Logging in...') : isSignup ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
