'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Logo from "@/app/components/Logo";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Interface for Task data structure
interface Task {
    _id: string;
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    allDay: boolean;
    user: string;
}

// Interface for task positioning within the time grid
interface TaskPosition {
    top: number;       // Position of the task from the top of the cell
    height: number;    // Height of the task's box
    task: Task;        // The task associated with this position
}

export default function Tasks() {
    const { data: session } = useSession(); // Session data for the logged-in user
    const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Current week reference date
    const [tasks, setTasks] = useState<Task[]>([]); // List of tasks for the user
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch tasks when the component mounts or when the session/currentDate changes
    useEffect(() => {
        const fetchTasks = async () => {
            // Ensure the user is logged in
            if (!session?.user?.id) {
                setLoading(false);
                setError('No active session found. Please log in.');
                return;
            }

            try {
                const response = await fetch(`/api/tasks?user=${session.user.id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
                }

                const data = await response.json();
                setTasks(data.tasks); // Update tasks state
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [session]);

    /**
     * Calculate the start of the week for a given date.
     * @param date - Reference date
     * @returns The start of the week (Sunday)
     */
    const getStartOfWeek = (date: Date): Date => {
        const start = new Date(date);
        // Add timezone offset to keep the date in local time
        start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
        start.setDate(date.getDate() - date.getDay());
        start.setHours(0, 0, 0, 0);
        return start;
    };

    /**
     * Format a date into a readable string.
     * @param date - Date object to format
     * @returns A formatted string (e.g., "Sun, 11/19")
     */
    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    // Generate week dates based on the current date
    const startOfWeek: Date = getStartOfWeek(currentDate);
    const weekDates: Date[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    // Navigate to the previous week
    const onPreviousWeek = (): void => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
    };

    // Navigate to the next week
    const onNextWeek = (): void => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
    };

    /**
     * Calculate the positions of tasks for a specific time slot.
     * @param date - Date of the time slot
     * @param hour - Hour of the time slot
     * @returns Array of task positions
     */
    const getTasksForTimeSlot = (date: Date, hour: number): TaskPosition[] => {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        return tasks
            .filter(task => {
                // Convert UTC date to local time by adding timezone offset
                const taskDate = new Date(task.startDate);
                taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset());

                // Format both dates to compare just the date portion
                const taskDateString = taskDate.toISOString().split('T')[0];
                const slotDateString = date.toISOString().split('T')[0];

                const taskStart = new Date(taskDate);
                const [startHour, startMinute] = task.startTime.split(':');
                taskStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

                const taskEnd = new Date(taskDate); // Use same base date for end
                const [endHour, endMinute] = task.endTime.split(':');
                taskEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                return (
                    (taskDateString === slotDateString &&
                        (task.allDay || (taskStart <= slotEnd && taskEnd > slotStart)))
                );
            })
            .map(task => {
                const taskStart = new Date(task.startDate);
                taskStart.setMinutes(taskStart.getMinutes() + taskStart.getTimezoneOffset());
                const [startHour, startMinute] = task.startTime.split(':');
                taskStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

                const taskEnd = new Date(task.startDate);
                taskEnd.setMinutes(taskEnd.getMinutes() + taskEnd.getTimezoneOffset());
                const [endHour, endMinute] = task.endTime.split(':');
                taskEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                if (hour !== parseInt(startHour)) return null;

                const durationHours = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60);
                const topPercentage = (parseInt(startMinute) / 60) * 100;
                const heightPercentage = durationHours * 100;

                return {
                    top: topPercentage,
                    height: heightPercentage,
                    task
                };
            })
            .filter((position): position is TaskPosition => position !== null);
    };

    /**
     * TaskItem component to render individual tasks within the grid.
     * @param position - Task position properties
     */
    const TaskItem: React.FC<{ position: TaskPosition }> = ({ position }) => {
        const router = useRouter();

        const handleClick = () => {
            router.push(`/edit-task/${position.task._id}`);
        };

        return (
            <div
                onClick={handleClick}
                className="absolute left-0 right-0 bg-blue-200 border border-blue-300 rounded px-1
                         overflow-hidden text-xs cursor-pointer hover:bg-blue-300 transition-colors"
                style={{
                    top: `${position.top}%`,
                    height: `${position.height}%`,
                    zIndex: 10
                }}
                title={`${position.task.title}${position.task.description ? '\n' + position.task.description : ''}`}
            >
                <span className="block truncate">
                    {position.task.allDay ? '📅 ' : '🕒 '}
                    {position.task.title}
                </span>
            </div>
        );
    };

    const hours = Array.from({ length: 24 }, (_, i) => ({
        label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`,
        value: i
    }));

    // Loading and error handling
    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section */}
            <div className="flex flex-row justify-between p-1 items-center text-4xl">
                <Link href="/tasks">
                    <Logo />
                </Link>
                <p className="border border-[#232323] p-3 rounded">
                    {currentDate.toLocaleString('default', { month: 'long' })}
                </p>
                <p className="text-6xl cursor-pointer px-6" onClick={onPreviousWeek}>‹</p>
                <Link href="/add-task">
                    <p className="text-5xl border border-[#232323] py-3 px-4 rounded">+</p>
                </Link>
                <p className="text-6xl px-6 cursor-pointer" onClick={onNextWeek}>›</p>
                <p className="border border-[#232323] p-3 rounded">{currentDate.getFullYear()}</p>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer border border-[#232323] p-3 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Divider */}
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />

            {/* Time grid */}
            <div className="flex flex-col p-10 space-y-2">
                <div className="grid grid-cols-[100px_repeat(7,_1fr)] text-center">
                    <div className="border-b-2 border-[#232323] py-2"></div>
                    {weekDates.map((date, index) => (
                        <div key={index} className="font-bold text-xl border-b-2 border-[#232323] py-2">
                            {formatDate(date)}
                        </div>
                    ))}
                </div>
                <div className="flex">
                    {/* Hour labels */}
                    <div className="flex flex-col w-[100px]">
                        {hours.map(({ label, value }) => (
                            <div key={value} className="relative h-10 flex items-center justify-center border border-transparent w-full font-medium">
                                <div className="absolute -top-2 text-xs">{value !== 0 && label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Weekly task grid */}
                    <div className="grid grid-cols-7 flex-grow">
                        {hours.map((hour) => (
                            <React.Fragment key={hour.value}>
                                {weekDates.map((date, dateIndex) => (
                                    <div key={`${hour.value}-${dateIndex}`}
                                         className="border border-[#A8A8A7] h-10 relative">
                                        {getTasksForTimeSlot(date, hour.value).map((position) => (
                                            <TaskItem
                                                key={position.task._id}
                                                position={position}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}