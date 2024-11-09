import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            <div className='flex flex-row justify-between p-1 items-center'>
                <Image
                    src="/images/logo.png"
                    alt="syncro logo"
                    width={150}
                    height={30}
                    priority
                />
                <Link href="/login">
                    <p className={'text-4xl cursor-pointer border border-[#232323] p-3 rounded'}>login/signup</p>
                </Link>
            </div>
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>
            <div className="flex flex-grow p-10">

            </div>
        </div>
    );
}
