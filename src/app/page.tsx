import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// The main Home component that renders the unauthenticated home page
export default function Home() {
    return (
        // Main container for the entire home page with vertical layout
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section with the logo and login/signup link */}
            <div className='flex flex-row justify-between p-1 items-center'>
                {/* Logo image */}
                <Image
                    src="/images/logo.png" // Path to the logo image
                    alt="syncro logo" // Alt text for accessibility
                    width={150} // Width of the image
                    height={30} // Height of the image
                    priority // Ensures the image is loaded with high priority
                />
                {/* Link to the login/signup page */}
                <Link href="/login">
                    <p className={'text-4xl cursor-pointer border border-[#232323] p-3 rounded'}>login/signup</p>
                </Link>
            </div>
            {/* Divider line below the header */}
            <hr style={{height: '2px', backgroundColor: '#A8A8A7', border: 'none'}}/>

            {/* Main content area with the introductory text */}
            <div className="flex flex-grow p-10 items-center">
                <div className={'text-[125px] leading-tight'}>
                    {/* Large introductory text for the home page */}
                    <p>scheduling</p>
                    <p>made</p>
                    <p>simple.</p>
                </div>
            </div>
        </div>
    );
}
