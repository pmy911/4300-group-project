import Image from 'next/image';
import React from "react";

export default function Logo() {
    return (
        <Image
            src="/images/logo.png" // Path to the logo image
            alt="syncro logo" // Alt text for accessibility
            width={150}
            height={30}
            priority
        />
    )
}