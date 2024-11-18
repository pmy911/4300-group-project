import connectMongoDB from "@/libs/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    await connectMongoDB();
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json(
            { message: "Invalid email" },
            { status: 401 }
        );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json(
            { message: "Invalid password" },
            { status: 401 }
        );
    }
    return NextResponse.json({ message: "Login successful"}, { status: 200 });
}