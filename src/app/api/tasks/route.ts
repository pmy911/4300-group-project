import connectMongoDB from "@/libs/mongodb";
import Task from "@/models/taskSchema"
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const {
        title, description,
        startDate, startTime,
        endDate, endTime,
        allDay, user
    } = await request.json();
    await connectMongoDB();
    await Task.create({
        title, description,
        startDate, startTime,
        endDate, endTime,
        allDay, user
    });
    return NextResponse.json({ message: "Task added successfully" }, { status: 201 });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user'); // Retrieve the `user` query parameter
    await connectMongoDB();
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }
    const tasks = await Task.find({ user: userId }); // Find tasks for the specific user
    return NextResponse.json({ tasks }, { status: 200 });
}