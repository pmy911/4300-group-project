'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Logo from "@/app/components/Logo";

interface FormData {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    allDay: boolean;
}

export default function EditTask() {
    const router = useRouter();
    const { id } = useParams(); // Updated to use the useParams hook
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: '',
        allDay: false,
    });

    // Fetch task data when component mounts
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch task');
                }
                const { task } = await response.json();

                // Format dates for the form inputs
                const startDate = new Date(task.startDate).toISOString().split('T')[0];
                const endDate = new Date(task.endDate).toISOString().split('T')[0];

                setFormData({
                    title: task.title,
                    startDate,
                    startTime: task.startTime,
                    endDate,
                    endTime: task.endTime,
                    description: task.description || '',
                    allDay: task.allDay,
                });
            } catch (err) {
                setError('Failed to load task');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchTask(); // Only fetch if `id` is available
    }, [id]);

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            const checked = e.target.checked;

            if (name === 'allDay') {
                setFormData({
                    ...formData,
                    allDay: checked,
                    startTime: checked ? '00:00' : '09:00',
                    endTime: checked ? '23:59' : '17:00',
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: checked,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
            setError('End time must be after start time');
            return false;
        }

        return true;
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            router.push('/tasks');
            router.refresh();
        } catch (err) {
            setError('Failed to delete task');
            setIsDeleting(false);
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!session?.user?.id) {
            setError('You must be logged in to edit tasks');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            router.push('/tasks');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            <div className='flex flex-row p-1 justify-center items-center'>
                <Logo/>
            </div>
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>

            <div className="flex flex-grow p-10 space-x-5">
                <Link href="/tasks">
                    <p className={'text-4xl cursor-pointer'}>×</p>
                </Link>
                <form onSubmit={onSubmit} className="w-full max-w-[40%] space-y-4 text-left">
                    <div className="flex flex-col space-y-2 text-3xl">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            placeholder="Add title"
                            className="border border-transparent bg-[#E4E2DD] p-2 rounded placeholder-[#232323]"
                            required
                        />
                    </div>
                    <hr className="w-full h-0.5 bg-[#232323] border-none"/>
                    <div className={'flex items-center space-x-5'}>
                        <div className="flex space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={onChange}
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={onChange}
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required
                                />
                            </div>
                        </div>
                        <p>to</p>
                        <div className="flex space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={onChange}
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={onChange}
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="allDay"
                            name="allDay"
                            checked={formData.allDay}
                            onChange={onChange}
                            className="cursor-pointer"
                        />
                        <label htmlFor="allDay" className="cursor-pointer">All Day</label>
                    </div>
                    <div className="flex flex-col space-y-2 py-5">
                        <label className="font-bold text-3xl" htmlFor="description">Event Details</label>
                        <hr style={{height: '2px', backgroundColor: '#232323', border: 'none'}}/>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            placeholder="Add description..."
                            className="border border-[#232323] bg-[#E4E2DD] placeholder-[#232323] p-2 rounded h-32"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-center">{error}</div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-xl rounded
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`border border-red-500 text-red-500 py-2 px-6 text-xl rounded
                                ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
