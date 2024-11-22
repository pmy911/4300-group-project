import connectMongoDB from "@/libs/mongodb";
import Task from "@/models/taskSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * Handles GET requests to fetch tasks for a specific user.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A response containing the tasks or an error message.
 */
export async function GET(request: NextRequest) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');

        // Connect to MongoDB
        await connectMongoDB();

        // Validate the presence of user ID
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required.' },
                { status: 400 } // Bad Request
            );
        }

        // Fetch tasks for the given user ID
        const tasks = await Task.find({ user: userId });

        // Respond with the list of tasks
        return NextResponse.json(
            { tasks },
            { status: 200 } // OK
        );
    } catch (error) {
        // Log unexpected errors and respond with a generic message
        console.error('Error in GET /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error. Please try again later.' },
            { status: 500 } // Internal Server Error
        );
    }
}

/**
 * Handles POST requests to create a new task.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A response indicating the success or failure of the operation.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the JSON body from the request
        const body = await request.json();
        const {
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
            user,
        } = body;

        // Connect to MongoDB
        await connectMongoDB();

        // Validate the presence of all required fields
        if (!title || !startDate || !startTime || !endDate || !endTime || !user) {
            return NextResponse.json(
                { error: 'Missing required fields: title, startDate, startTime, endDate, endTime, or user.' },
                { status: 400 } // Bad Request
            );
        }

        // Create a new task in the database
        const task = await Task.create({
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
            user,
        });

        // Respond with success message and the created task
        return NextResponse.json(
            {
                message: "Task added successfully.",
                task,
            },
            { status: 201 } // Created
        );
    } catch (error) {
        // Log unexpected errors and respond with a generic message
        console.error('Error in POST /api/tasks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error. Please try again later.' },
            { status: 500 } // Internal Server Error
        );
    }
}