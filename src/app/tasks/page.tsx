'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Tasks() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    const getStartOfWeek = (date: Date): Date => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
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

    const handlePreviousWeek = (): void => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
    };

    const handleNextWeek = (): void => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
    };

    const hours = Array.from({ length: 24 }, (_, i) => `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`);

    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            <div className='flex flex-row justify-between p-1 items-center text-4xl'>
                <Link href="/tasks">
                    <Image
                        src="/images/logo.png"
                        alt="syncro logo"
                        width={150}
                        height={30}
                        priority
                    />
                </Link>
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.toLocaleString('default', { month: 'long' })}</p>
                <p className={'text-6xl cursor-pointer px-6'} onClick={handlePreviousWeek}>‹</p>
                <Link href='/add-task'>
                    <p className={'text-5xl border border-[#232323] py-3 px-4 rounded'}>+</p>
                </Link>
                <p className={'text-6xl px-6 cursor-pointer'} onClick={handleNextWeek}>›</p>
                <p className={'border border-[#232323] p-3 rounded'}>{currentDate.getFullYear()}</p>
                <Link href="/">
                    <p className={'cursor-pointer border border-[#232323] p-3 rounded'}>logout</p>
                </Link>
            </div>
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>
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
                        {hours.map((hour, index) => (
                            <div key={index} className="relative h-10 flex items-center justify-center border border-transparent w-full font-medium">
                                <div className="absolute -top-2 text-xs">{index !== 0 && hour}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 flex-grow">
                        {Array.from({ length: 24 }).map((_, rowIndex: number) => (
                            <React.Fragment key={rowIndex}>
                                {Array.from({ length: 7 }).map((_, colIndex: number) => (
                                    <div key={`${rowIndex}-${colIndex}`} className="border border-[#A8A8A7] h-10"></div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
