import connectMongoDB from "@/libs/mongodb";
import Task from "@/models/taskSchema"
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');

        console.log('Fetching tasks for userId:', userId);

        await connectMongoDB();

        if (!userId) {
            console.log('No user ID provided');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const tasks = await Task.find({ user: userId });
        console.log('Found tasks:', tasks);

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title, description,
            startDate, startTime,
            endDate, endTime,
            allDay, user
        } = body;

        await connectMongoDB();

        // Validate required fields
        if (!title || !startDate || !startTime || !endDate || !endTime || !user) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const task = await Task.create({
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
            user
        });

        console.log('Created task:', task);

        return NextResponse.json({
            message: "Task added successfully",
            task
        }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}