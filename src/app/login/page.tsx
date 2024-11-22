'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/app/components/Logo';
import { signIn } from 'next-auth/react';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State to manage form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // State to toggle between Login and Signup views
    const [isSignup, setIsSignup] = useState(false);

    // State to store error messages
    const [error, setError] = useState<string | null>(null);

    // State to manage submission loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles form input changes and updates the form data state.
     * @param e - React change event for input elements
     */
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handles form submission for login or signup.
     * Performs validation, calls the signIn or API, and manages UI feedback.
     * @param e - Form submission event
     */
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); // Clear any previous errors

        try {
            // Validate that required fields are filled
            if (!formData.email || !formData.password || (isSignup && !formData.name)) {
                setError('Please fill out all fields.');
                setIsSubmitting(false);
                return;
            }

            if (isSignup) {
                // Handle Signup
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                if (!response.ok) {
                    const { message } = await response.json();
                    setError(message || 'Failed to sign up. Please try again.');
                    setIsSubmitting(false);
                    return;
                }

                // Automatically log in the user after successful signup
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false, // Prevent automatic redirection
                });

                if (!result || result.error) {
                    setError('Signup succeeded, but login failed.');
                } else {
                    router.push('/tasks'); // Redirect to tasks page after signup
                }
            } else {
                // Handle Login
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false, // Prevent automatic redirection
                });

                if (!result || result.error) {
                    setError('Invalid email or password.');
                } else {
                    const callbackUrl = searchParams.get('from') || '/tasks';
                    router.push(callbackUrl); // Redirect to intended page
                }
            }
        } catch (err) {
            // Handle unexpected errors
            console.error('Unexpected error during submission:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Logo and navigation section */}
            <div className="flex flex-row p-1 justify-center items-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />

            {/* Toggle between Login and Signup */}
            <div className="flex justify-center mt-5">
                <button
                    className={`px-4 py-2 border ${isSignup ? '' : 'bg-[#D3D3D3]'} rounded-l text-2xl border-[#232323]`}
                    onClick={() => {
                        setIsSignup(false);
                        setError(null); // Clear errors on toggle
                    }}
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 border ${isSignup ? 'bg-[#D3D3D3]' : ''} rounded-r text-2xl border-[#232323]`}
                    onClick={() => {
                        setIsSignup(true);
                        setError(null); // Clear errors on toggle
                    }}
                >
                    Sign Up
                </button>
            </div>

            {/* Login/Signup form */}
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="bg-[#E4E2DD] p-10 rounded w-[350px] border border-[#232323]">
                    <h2 className="text-3xl mb-5 text-center">{isSignup ? 'Signup' : 'Login'}</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Show name input only for signup */}
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

                        {/* Email input */}
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

                        {/* Password input */}
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

                        {/* Error message display */}
                        {error && (
                            <div className="text-red-500 text-center text-xl mt-4">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
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