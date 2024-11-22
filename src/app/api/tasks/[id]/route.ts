import connectMongoDB from "@/libs/mongodb";
import Task from "@/models/taskSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

// Define the structure of route parameters
interface RouteParams {
    params: { id: string };
}

/**
 * Handle GET requests to fetch a task by its ID.
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {RouteParams} params - The route parameters containing the task ID.
 * @returns {Promise<NextResponse>} - A response containing the task or an error message.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = params;

    // Connect to MongoDB
    await connectMongoDB();

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid ID format." },
            { status: 400 } // Bad Request
        );
    }

    try {
        // Fetch the task by ID
        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { error: "Task not found." },
                { status: 404 } // Not Found
            );
        }

        return NextResponse.json({ task }, { status: 200 }); // OK
    } catch (error) {
        // Handle unexpected errors
        return NextResponse.json(
            { error: "Internal Server Error. Please try again later." },
            { status: 500 } // Internal Server Error
        );
    }
}

/**
 * Handle PUT requests to update a task by its ID.
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {RouteParams} params - The route parameters containing the task ID.
 * @returns {Promise<NextResponse>} - A response indicating the success or failure of the operation.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid ID format." },
            { status: 400 } // Bad Request
        );
    }

    try {
        const {
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            allDay,
        } = await request.json();

        // Validate required fields
        if (!title || !startDate || !startTime || !endDate || !endTime) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 } // Bad Request
            );
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Update the task by ID
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                description,
                startDate,
                startTime,
                endDate,
                endTime,
                allDay,
            },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return NextResponse.json(
                { error: "Task not found." },
                { status: 404 } // Not Found
            );
        }

        return NextResponse.json(
            { message: "Task updated successfully.", task: updatedTask },
            { status: 200 } // OK
        );
    } catch (error) {
        // Handle unexpected errors
        return NextResponse.json(
            { error: "Internal Server Error. Please try again later." },
            { status: 500 } // Internal Server Error
        );
    }
}

/**
 * Handle DELETE requests to remove a task by its ID.
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {RouteParams} params - The route parameters containing the task ID.
 * @returns {Promise<NextResponse>} - A response indicating the success or failure of the operation.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid ID format." },
            { status: 400 } // Bad Request
        );
    }

    try {
        // Connect to MongoDB
        await connectMongoDB();

        // Delete the task by ID
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json(
                { error: "Task not found." },
                { status: 404 } // Not Found
            );
        }

        return NextResponse.json(
            { message: "Task deleted successfully." },
            { status: 200 } // OK
        );
    } catch (error) {
        // Handle unexpected errors
        return NextResponse.json(
            { error: "Internal Server Error. Please try again later." },
            { status: 500 } // Internal Server Error
        );
    }
}