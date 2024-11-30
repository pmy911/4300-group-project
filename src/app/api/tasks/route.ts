import connectMongoDB from "@/libs/mongodb";
import Task from "@/models/taskSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * Handles GET requests to fetch tasks for a specific user.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');

        await connectMongoDB();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required.' },
                { status: 400 }
            );
        }

        const tasks = await Task.find({ user: userId });

        return NextResponse.json(
            { tasks },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in GET /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error. Please try again later.' },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to create a new task.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
            imageUrl,
            user,
        } = body;

        await connectMongoDB();

        if (!title || !startDate || !startTime || !endDate || !endTime || !user) {
            return NextResponse.json(
                { error: 'Missing required fields: title, startDate, startTime, endDate, endTime, or user.' },
                { status: 400 }
            );
        }

        // Create task with imageUrl (it will use the default if not provided)
        const task = await Task.create({
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
            imageUrl,
            user,
        });

        return NextResponse.json(
            {
                message: "Task added successfully.",
                task,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error. Please try again later.' },
            { status: 500 }
        );
    }
}