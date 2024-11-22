'use client'
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

interface TaskPosition {
    top: number;
    height: number;
    task: Task;
}

export default function Tasks() {
    const { data: session } = useSession();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tasks when component mounts or when session/currentDate changes
    useEffect(() => {
        const fetchTasks = async () => {
            if (!session?.user?.id) {
                console.log('No user session found');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching tasks for user:', session.user.id);
                const response = await fetch(`/api/tasks?user=${session.user.id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched tasks:', data.tasks);
                setTasks(data.tasks);
                setError(null);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(err instanceof Error ? err.message : 'Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [session]);

    const getStartOfWeek = (date: Date): Date => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const startOfWeek: Date = getStartOfWeek(currentDate);
    const weekDates: Date[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    const onPreviousWeek = (): void => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
    };

    const onNextWeek = (): void => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
    };

    const getTasksForTimeSlot = (date: Date, hour: number): TaskPosition[] => {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        return tasks
            .filter(task => {
                // Convert task dates to Date objects
                const taskStartDate = new Date(task.startDate);
                const taskEndDate = new Date(task.endDate);

                // Set the time components
                const taskStart = new Date(taskStartDate);
                const [startHour, startMinute] = task.startTime.split(':');
                taskStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

                const taskEnd = new Date(taskEndDate);
                const [endHour, endMinute] = task.endTime.split(':');
                taskEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                // Check if this slot is within the task's time range
                return (
                    (taskStart <= slotEnd && taskEnd > slotStart) ||
                    (task.allDay &&
                        taskStartDate.toDateString() === date.toDateString())
                );
            })
            .map(task => {
                // Calculate position and height for the task
                const taskStartDate = new Date(task.startDate);
                const taskEndDate = new Date(task.endDate);

                const taskStart = new Date(taskStartDate);
                const [startHour, startMinute] = task.startTime.split(':');
                taskStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

                const taskEnd = new Date(taskEndDate);
                const [endHour, endMinute] = task.endTime.split(':');
                taskEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                // Only show the task if this is its starting hour
                if (hour !== parseInt(startHour)) {
                    return null;
                }

                // Calculate task duration in hours
                const durationHours = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60);

                // Calculate position properties
                const minuteOffset = parseInt(startMinute);
                const topPercentage = (minuteOffset / 60) * 100;
                const heightPercentage = (durationHours * 100);

                return {
                    top: topPercentage,
                    height: heightPercentage,
                    task: task
                };
            })
            .filter((position): position is TaskPosition => position !== null);
    };

    // Update the TaskItem component
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

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            <div className='flex flex-row justify-between p-1 items-center text-4xl'>
                <Link href="/tasks">
                    <Logo/>
                </Link>
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.toLocaleString('default', { month: 'long' })}</p>
                <p className={'text-6xl cursor-pointer px-6'} onClick={onPreviousWeek}>‹</p>
                <Link href='/add-task'>
                    <p className={'text-5xl border border-[#232323] py-3 px-4 rounded'}>+</p>
                </Link>
                <p className={'text-6xl px-6 cursor-pointer'} onClick={onNextWeek}>›</p>
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.getFullYear()}</p>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={'cursor-pointer border border-[#232323] p-3 rounded'}
                >
                    Logout
                </button>
            </div>
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />
            <div className="flex flex-col p-10 space-y-2">
                <div className="grid grid-cols-[100px_repeat(7,_1fr)] text-center">
                    <div className="border-b-2 border-[#232323] py-2"></div>
                    {weekDates.map((date: Date, index: number) => (
                        <div key={index} className="font-bold text-xl border-b-2 border-[#232323] py-2">
                            {formatDate(date)}
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <div className="flex flex-col w-[100px]">
                        {hours.map(({ label, value }) => (
                            <div key={value} className="relative h-10 flex items-center justify-center border border-transparent w-full font-medium">
                                <div className="absolute -top-2 text-xs">{value !== 0 && label}</div>
                            </div>
                        ))}
                    </div>
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