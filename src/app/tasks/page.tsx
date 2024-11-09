import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Tasks() {
    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            <div className='flex flex-row justify-between p-1 items-center text-4xl'>
                <Image
                    src="/images/logo.png"
                    alt="syncro logo"
                    width={150}
                    height={30}
                    priority
                />
                <p className={'border border-[#232323] p-3 rounded'}>Month</p>
                <p className={'text-6xl'}>‹</p>
                <Link href='/add-task'>
                    <p className={'text-5xl border border-[#232323] py-2 px-3 rounded'}>+</p>
                </Link>
                <p className={'text-6xl'}>›</p>
                <p className={'border border-[#232323] p-3 rounded'}>Year</p>
                <Link href="/">
                    <p className={'cursor-pointer border border-[#232323] p-3 rounded'}>logout</p>
                </Link>
            </div>
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>
            <div className="flex flex-grow p-10">

            </div>
        </div>
    );
}
