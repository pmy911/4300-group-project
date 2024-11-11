"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Logo from "@/app/components/Logo";

// Interface to define the structure of the form data
interface FormData {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    allDay: boolean;
}

// Main AddTask component for creating a new task
export default function AddTask() {
    const router = useRouter(); // Hook to handle navigation

    // Helper function to get the current date and time rounded to the next hour
    const getDefaultDateTime = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0); // Reset minutes and seconds to 0
        now.setHours(now.getHours() + 1); // Round to the next hour
        const startDate = now.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        const startTime = now.toTimeString().split(' ')[0].slice(0, 5); // Get time in HH:MM format

        const end = new Date(now);
        end.setHours(end.getHours() + 1); // Set end time to 1 hour later
        const endTime = end.toTimeString().split(' ')[0].slice(0, 5); // Get time in HH:MM format

        return { startDate, startTime, endTime };
    };

    // State to store form data
    const [formData, setFormData] = useState<FormData>({
        title: '',
        startDate: getDefaultDateTime().startDate,
        startTime: getDefaultDateTime().startTime,
        endDate: getDefaultDateTime().startDate,
        endTime: getDefaultDateTime().endTime,
        description: '',
        allDay: false,
    });

    // Handle changes in form input fields
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Special handling for checkbox input
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            const checked = e.target.checked;

            if (name === 'allDay') { // Handle 'all day' checkbox specifically
                if (checked) {
                    setFormData({
                        ...formData,
                        allDay: true,
                        startTime: '00:00', // Set to start at the beginning of the day
                        endTime: '23:59', // Set to end at the end of the day
                    });
                } else {
                    const { startTime, endTime } = getDefaultDateTime();
                    setFormData({
                        ...formData,
                        allDay: false,
                        startTime: startTime,
                        endTime: endTime,
                    });
                }
            } else {
                setFormData({
                    ...formData,
                    [name]: checked,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value, // Update form data with new value
            });
        }
    };

    // Handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        console.log(formData); // Log the form data for now

        // Reset form fields to initial state
        setFormData({
            title: '',
            startDate: getDefaultDateTime().startDate,
            startTime: getDefaultDateTime().startTime,
            endDate: getDefaultDateTime().startDate,
            endTime: getDefaultDateTime().endTime,
            description: '',
            allDay: false,
        });

        router.push('/tasks'); // Navigate to the tasks page after submission
    };

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header with logo */}
            <div className='flex flex-row p-1 justify-center items-center'>
                <Logo/>
            </div>
            {/* Divider line below the header */}
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>

            {/* Form container */}
            <div className="flex flex-grow p-10 space-x-5">
                {/* Close button that navigates back to the tasks page */}
                <Link href="/tasks">
                    <p className={'text-4xl cursor-pointer'}>×</p>
                </Link>
                <form onSubmit={onSubmit} className="w-full max-w-[40%] space-y-4 text-left">
                    {/* Title input field */}
                    <div className="flex flex-col space-y-2 text-3xl">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onChange} // Update state on change
                            placeholder="Add title"
                            className="border border-transparent bg-[#E4E2DD] p-2 rounded placeholder-[#232323]"
                            required // Mark field as required
                        />
                    </div>
                    <hr className="w-full h-0.5 bg-[#232323] border-none"/>
                    {/* Date and time input fields */}
                    <div className={'flex items-center space-x-5'}>
                        <div className="flex space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={onChange} // Update state on change
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required // Mark field as required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={onChange} // Update state on change
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required // Mark field as required
                                />
                            </div>
                        </div>
                        <p>to</p> {/* Separator between start and end times */}
                        <div className="flex space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={onChange} // Update state on change
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required // Mark field as required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={onChange} // Update state on change
                                    className="border border-[#232323] bg-[#E4E2DD] p-2 rounded"
                                    required // Mark field as required
                                />
                            </div>
                        </div>
                    </div>
                    {/* All Day checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="allDay"
                            name="allDay"
                            checked={formData.allDay}
                            onChange={onChange} // Update state on change
                            className="cursor-pointer"
                        />
                        <label htmlFor="allDay" className="cursor-pointer">All Day</label>
                    </div>
                    {/* Description input field */}
                    <div className="flex flex-col space-y-2 py-5">
                        <label className="font-bold text-3xl" htmlFor="description">Event Details</label>
                        <hr style={{height: '2px', backgroundColor: '#232323', border: 'none'}}/>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onChange} // Update state on change
                            placeholder="Add description..."
                            className="border border-[#232323] bg-[#E4E2DD] placeholder-[#232323] p-2 rounded h-32"
                        />
                    </div>
                    {/* Submit button for the form */}
                    <button type="submit"
                            className="border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-xl rounded">Save
                    </button>
                </form>
            </div>
        </div>
    );
}