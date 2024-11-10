'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Logo from "@/app/components/Logo";

// The main Tasks component that displays the authenticated view with a weekly calendar layout
export default function Tasks() {
    // State to store the current date
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // Effect to set the current date on component mount
    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    // Helper function to get the start of the week (Sunday) for a given date
    const getStartOfWeek = (date: Date): Date => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay()); // Adjust to the nearest Sunday
        return start;
    };

    // Helper function to format a date as 'Day, MM/DD'
    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    // Get the start of the current week and generate an array of week dates
    const startOfWeek: Date = getStartOfWeek(currentDate);
    const weekDates: Date[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i); // Increment for each day of the week
        return date;
    });

    // Function to navigate to the previous week
    const handlePreviousWeek = (): void => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7); // Subtract 7 days
        setCurrentDate(prevWeek);
    };

    // Function to navigate to the next week
    const handleNextWeek = (): void => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7); // Add 7 days
        setCurrentDate(nextWeek);
    };

    // Array of hours for the day labels
    const hours = Array.from({ length: 24 }, (_, i) => `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`);

    return (
        // Main container for the entire authenticated page
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section with navigation and logo */}
            <div className='flex flex-row justify-between p-1 items-center text-4xl'>
                <Link href="/tasks">
                    <Logo/>
                </Link>
                {/* Display the current month */}
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.toLocaleString('default', { month: 'long' })}</p>
                {/* Button to navigate to the previous week */}
                <p className={'text-6xl cursor-pointer px-6'} onClick={handlePreviousWeek}>‹</p>
                {/* Link to add a new task */}
                <Link href='/add-task'>
                    <p className={'text-5xl border border-[#232323] py-3 px-4 rounded'}>+</p>
                </Link>
                {/* Button to navigate to the next week */}
                <p className={'text-6xl px-6 cursor-pointer'} onClick={handleNextWeek}>›</p>
                {/* Display the current year */}
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.getFullYear()}</p>
                {/* Link to log out */}
                <Link href="/">
                    <p className={'cursor-pointer border border-[#232323] p-3 rounded'}>logout</p>
                </Link>
            </div>
            {/* Divider line below the header */}
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>

            {/* Main content area for the calendar layout */}
            <div className="flex flex-col p-10 space-y-2">
                {/* Header row with days of the week */}
                <div className="grid grid-cols-[100px_repeat(7,_1fr)] text-center">
                    <div className="border-b-2 border-[#232323] py-2"></div> {/* Empty cell for hour labels */}
                    {weekDates.map((date: Date, index: number) => (
                        <div key={index} className="font-bold text-xl border-b-2 border-[#232323] py-2">
                            {formatDate(date)} {/* Display formatted date */}
                        </div>
                    ))}
                </div>
                {/* Grid for displaying hours and time slots */}
                <div className="flex">
                    {/* Column for hour labels */}
                    <div className="flex flex-col w-[100px]">
                        {hours.map((hour, index) => (
                            <div key={index} className="relative h-10 flex items-center justify-center border border-transparent w-full font-medium">
                                <div className="absolute -top-2 text-xs">{index !== 0 && hour}</div> {/* Display hour label */}
                            </div>
                        ))}
                    </div>
                    {/* Grid for the 7 days of the week, each with 24 rows for time slots */}
                    <div className="grid grid-cols-7 flex-grow">
                        {Array.from({ length: 24 }).map((_, rowIndex: number) => (
                            <React.Fragment key={rowIndex}>
                                {Array.from({ length: 7 }).map((_, colIndex: number) => (
                                    <div key={`${rowIndex}-${colIndex}`} className="border border-[#A8A8A7] h-10"></div> // Time slot cell
                                    ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}