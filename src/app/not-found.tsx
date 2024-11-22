import Link from 'next/link';
import React from 'react';
import Logo from "@/app/components/Logo";

export default function NotFound() {
    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section with the logo */}
            <div className="flex flex-row p-1 justify-center items-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <hr style={{ height: '2px', backgroundColor: '#A8A8A7', border: 'none' }} />
            {/* Main content area for the error message */}
            <div className="flex flex-col flex-grow justify-center p-10 space-y-5">
                <p className="text-[125px] leading-tight">not found:</p>
                <p className="text-[125px] leading-tight">could not find requested resource.</p>
                <Link href="/">
                    <p className="text-[125px] leading-tight underline">› Return Home ‹</p>
                </Link>
            </div>
        </div>
    );
}