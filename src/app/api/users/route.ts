import connectMongoDB from "@/libs/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();
    await connectMongoDB();
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json(
            { message: "User with this email already exists" },
            { status: 409 }
        );
    }
    // Hash the password
    const saltRounds = 10; // Adjust the salt rounds as needed for your security needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create the new user
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ message: "User added successfully" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users });
}