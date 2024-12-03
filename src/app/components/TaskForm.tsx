'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Define the shape of the form data
interface FormData {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    imageUrl: string;
    allDay: boolean;
}

// Define the props that the TaskForm component expects
interface TaskFormProps {
    initialData?: FormData; // Optional initial data for editing
    mode: 'add' | 'edit';    // Mode can be 'add' or 'edit'
    taskId?: string;         // Task ID for editing
}

// The main TaskForm component
export default function TaskForm({ initialData, mode, taskId }: TaskFormProps) {
    const router = useRouter();                 // Next.js router for navigation
    const { data: session } = useSession();     // User session data
    const [error, setError] = useState<string | null>(null);     // Error message state
    const [isSubmitting, setIsSubmitting] = useState(false);     // Submission loading state
    const [isDeleting, setIsDeleting] = useState(false);         // Deletion loading state
    const [imageError, setImageError] = useState(false);         // Image loading error state

    // Function to get default start and end dates/times
    const getDefaultDateTime = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0); // Round to the nearest hour
        now.setHours(now.getHours() + 1); // Set start time to the next hour

        // Format date as 'YYYY-MM-DD' in local time
        const startDate = now.toLocaleDateString('en-CA');
        const startTime = now.toTimeString().split(" ")[0].slice(0, 5); // Format as 'HH:MM'

        const end = new Date(now);
        end.setHours(end.getHours() + 1); // Set end time one hour after start
        const endTime = end.toTimeString().split(" ")[0].slice(0, 5); // Format as 'HH:MM'

        return { startDate, startTime, endTime };
    };

    // Default form data if no initialData is provided
    const defaultData = {
        title: "",
        startDate: getDefaultDateTime().startDate,
        startTime: getDefaultDateTime().startTime,
        endDate: getDefaultDateTime().startDate,
        endTime: getDefaultDateTime().endTime,
        description: "",
        imageUrl: "",
        allDay: false,
    };

    // State to manage form data
    const [formData, setFormData] = useState<FormData>(initialData || defaultData);

    // Handle changes to form inputs
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            const checked = e.target.checked;

            if (name === "allDay") {
                // If 'All Day' is checked, adjust times accordingly
                setFormData({
                    ...formData,
                    allDay: checked,
                    startTime: checked ? "00:00" : getDefaultDateTime().startTime,
                    endTime: checked ? "23:59" : getDefaultDateTime().endTime,
                });
            } else {
                // Update other checkbox values
                setFormData({
                    ...formData,
                    [name]: checked,
                });
            }
        } else {
            // Update text and textarea inputs
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (name === 'imageUrl') {
            setImageError(false); // Reset image error when imageUrl changes
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
            setError("End time must be after start time.");
            return false;
        }

        return true;
    };

    // Handle task deletion
    const handleDelete = async () => {
        if (!taskId || !confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the task.');
            }

            router.push('/tasks'); // Redirect to tasks page after deletion
        } catch (err) {
            setError('Failed to delete task. Please try again later.');
            setIsDeleting(false);
        }
    };

    // Handle form submission for adding or editing tasks
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!session?.user?.id) {
            setError("You must be logged in to create tasks.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const url = mode === 'add' ? '/api/tasks' : `/api/tasks/${taskId}`;
            const method = mode === 'add' ? 'POST' : 'PUT';
            const errorMessage = mode === 'add' ? 'Failed to create task.' : 'Failed to update task.';

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mode === 'add' ? {
                    ...formData,
                    user: session.user.id, // Include user ID when creating a new task
                } : formData),
            });

            if (!response.ok) {
                throw new Error(errorMessage);
            }

            router.push("/tasks"); // Redirect to tasks page after successful submission
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit task.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-grow p-10 space-x-5">
            {/* Close button to go back to tasks page */}
            <Link href="/tasks">
                <p className="text-4xl cursor-pointer">×</p>
            </Link>

            {/* Task form */}
            <form onSubmit={onSubmit} className="w-full max-w-[40%] space-y-4 text-left">
                {/* Task title input */}
                <div className="flex flex-col space-y-2 text-3xl">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        placeholder={`${mode === 'add' ? 'Add' : 'Edit'} title`}
                        className="border border-transparent bg-[#E4E2DD] p-2 rounded placeholder-[#232323]"
                        required
                    />
                </div>
                <hr className="w-full h-0.5 bg-[#232323] border-none" />

                {/* Date and time inputs */}
                <div className="flex items-center space-x-5">
                    {/* Start date and time */}
                    <div className="flex space-x-2.5">
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={onChange}
                            className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                            required
                        />
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
                    <p>to</p>
                    {/* End date and time */}
                    <div className="flex space-x-2.5">
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={onChange}
                            className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                            required
                        />
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

                {/* 'All Day' checkbox */}
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

                {/* Event details textarea */}
                <div className="flex flex-col space-y-2 py-5">
                    <label className="font-bold text-3xl" htmlFor="description">Event Details</label>
                    <hr style={{ height: '2px', backgroundColor: '#232323', border: 'none' }} />
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder={`${mode === 'add' ? 'Add' : 'Edit'} description...`}
                        className="border border-[#232323] bg-[#E4E2DD] placeholder-[#232323] p-2 rounded h-32"
                    />
                </div>

                {/* Image URL input and preview */}
                <div className="flex flex-col space-y-2 py-5">
                    <label className="font-bold text-3xl" htmlFor="imageUrl">Image URL</label>
                    <hr style={{ height: '2px', backgroundColor: '#232323', border: 'none' }} />
                    <textarea
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={onChange}
                        placeholder={`${mode === 'add' ? 'Add' : 'Edit'} image URL...`}
                        className="border border-[#232323] bg-[#E4E2DD] placeholder-[#232323] p-2 rounded h-32"
                    />
                    {/* Display image preview if imageUrl is provided */}
                    {formData.imageUrl && (
                        <div className="relative w-full h-64 mt-4">
                            <Image
                                src={formData.imageUrl}
                                alt="Task image"
                                width={500}
                                height={300}
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                onError={() => setImageError(true)}
                                className={`rounded ${imageError ? 'hidden' : ''}`}
                                unoptimized
                            />
                            {/* Show error message if image fails to load */}
                            {imageError && (
                                <div className="w-full h-full flex items-center justify-center border border-red-500 rounded">
                                    <p className="text-red-500">Failed to load image</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Display any error messages */}
                {error && (
                    <div className="text-red-500 text-center">{error}</div>
                )}

                {/* Form action buttons */}
                <div className="flex space-x-4">
                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-xl rounded
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                        {isSubmitting ? 'Saving...' : mode === 'add' ? 'Save' : 'Save Changes'}
                    </button>

                    {/* Delete button (only in edit mode) */}
                    {mode === 'edit' && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`border border-red-500 text-red-500 py-2 px-6 text-xl rounded
                                ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}