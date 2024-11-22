"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
    const router = useRouter();
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Helper function to get the current date and time rounded to the next hour.
     * Used to set default values for the start and end times.
     */
    const getDefaultDateTime = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1);
        const startDate = now.toISOString().split("T")[0];
        const startTime = now.toTimeString().split(" ")[0].slice(0, 5);

        const end = new Date(now);
        end.setHours(end.getHours() + 1);
        const endTime = end.toTimeString().split(" ")[0].slice(0, 5);

        return { startDate, startTime, endTime };
    };

    // State to store form data
    const [formData, setFormData] = useState<FormData>({
        title: "",
        startDate: getDefaultDateTime().startDate,
        startTime: getDefaultDateTime().startTime,
        endDate: getDefaultDateTime().startDate,
        endTime: getDefaultDateTime().endTime,
        description: "",
        allDay: false,
    });

    /**
     * Handle changes in form input fields.
     * Updates the form state with the input values.
     */
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            const checked = e.target.checked;

            if (name === "allDay") {
                // Set times to the full day if "All Day" is checked
                if (checked) {
                    setFormData({
                        ...formData,
                        allDay: true,
                        startTime: "00:00",
                        endTime: "23:59",
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
                [name]: value,
            });
        }
    };

    /**
     * Validate the form data before submission.
     * Ensures the end time is after the start time.
     */
    const validateForm = () => {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
            setError("End time must be after start time.");
            return false;
        }

        return true;
    };

    /**
     * Handle form submission.
     * Sends a POST request to create a new task.
     */
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Ensure the user is logged in
        if (!session?.user?.id) {
            setError("You must be logged in to create tasks.");
            return;
        }

        // Validate form data
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    user: session.user.id,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create task.");
            }

            // Redirect to the tasks page upon successful submission
            router.push("/tasks");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create task.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header with logo */}
            <div className="flex flex-row p-1 justify-center items-center">
                <Logo />
            </div>
            <hr style={{ height: "2px", backgroundColor: "#A8A8A7", border: "none" }} />

            {/* Main form container */}
            <div className="flex flex-grow p-10 space-x-5">
                {/* Close button */}
                <Link href="/tasks">
                    <p className="text-4xl cursor-pointer">×</p>
                </Link>

                {/* Task creation form */}
                <form onSubmit={onSubmit} className="w-full max-w-[40%] space-y-4 text-left">
                    {/* Task title */}
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
                    <hr className="w-full h-0.5 bg-[#232323] border-none" />

                    {/* Date and time inputs */}
                    <div className="flex items-center space-x-5">
                        <div className="flex space-x-2.5">
                            {/* Start date and time */}
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
                        <div className="flex space-x-2.5">
                            {/* End date and time */}
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

                    {/* All-day event checkbox */}
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

                    {/* Event details */}
                    <div className="flex flex-col space-y-2 py-5">
                        <label className="font-bold text-3xl" htmlFor="description">Event Details</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            placeholder="Add description..."
                            className="border border-[#232323] bg-[#E4E2DD] placeholder-[#232323] p-2 rounded h-32"
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="text-red-500 text-center">{error}</div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`border border-[#232323] bg-[#E4E2DD] py-2 px-6 text-xl rounded w-full
                            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
}