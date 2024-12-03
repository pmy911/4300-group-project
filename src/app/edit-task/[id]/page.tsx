'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Logo from '@/app/components/Logo';
import TaskForm from '@/app/components/TaskForm';

// Define the shape of the task data expected by the form
interface TaskData {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    imageUrl: string;
    allDay: boolean;
}

// Main component for editing a task
export default function EditTask() {
    const { id } = useParams(); // Extract the 'id' parameter from the URL
    const [initialData, setInitialData] = useState<TaskData | null>(null); // State to hold the initial task data
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
    const [error, setError] = useState<string | null>(null); // Error state for handling fetch errors

    // useEffect hook to fetch the task data when the component mounts or when 'id' changes
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`); // Fetch the task data from the API
                if (!response.ok) {
                    throw new Error('Failed to fetch task data.');
                }

                const { task } = await response.json(); // Parse the JSON response

                // Format the start and end dates to 'YYYY-MM-DD' format for the date input fields
                const startDate = new Date(task.startDate).toISOString().split('T')[0];
                const endDate = new Date(task.endDate).toISOString().split('T')[0];

                // Set the initial data for the form, providing default empty strings if some fields are missing
                setInitialData({
                    title: task.title,
                    startDate,
                    startTime: task.startTime,
                    endDate,
                    endTime: task.endTime,
                    description: task.description || '',
                    imageUrl: task.imageUrl || '',
                    allDay: task.allDay,
                });
            } catch (err) {
                setError('Failed to load task. Please try again later.'); // Set an error message if fetch fails
            } finally {
                setIsLoading(false); // Stop the loading state once fetching is done
            }
        };

        if (id) fetchTask(); // Call fetchTask if 'id' is available
    }, [id]); // Dependency array includes 'id' so it re-runs if 'id' changes

    // If data is still loading, display a loading message
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // If there's an error, display the error message
    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    // Render the edit task form when initialData is available
    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section with the logo */}
            <div className="flex flex-row p-1 justify-center items-center">
                <Logo />
            </div>
            {/* Horizontal line separator */}
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />
            {/* Render the TaskForm component with the fetched data */}
            {initialData && (
                <TaskForm
                    mode="edit"                   // Set the form mode to 'edit'
                    initialData={initialData}     // Pass the fetched task data as initial values
                    taskId={id as string}         // Pass the task ID for identification
                />
            )}
        </div>
    );
}