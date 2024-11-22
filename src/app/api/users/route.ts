import connectMongoDB from "@/libs/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

/**
 * Handles user registration via POST request.
 *
 * @param {NextRequest} request - The incoming request containing user details.
 * @returns {Promise<NextResponse>} - The server's response.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the incoming JSON request body
        const { name, email, password } = await request.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required." },
                { status: 400 } // Bad Request
            );
        }

        // Establish a connection to the MongoDB database
        await connectMongoDB();

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists." },
                { status: 409 } // Conflict
            );
        }

        // Hash the user's password using bcrypt for security
        const saltRounds = 10; // Security level for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user in the database
        const newUser = await User.create({ name, email, password: hashedPassword });

        // Respond with success message
        return NextResponse.json(
            { message: "User added successfully.", userId: newUser._id },
            { status: 201 } // Created
        );
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again later." },
            { status: 500 } // Internal Server Error
        );
    }
}

/**
 * Handles fetching all users via GET request.
 *
 * @returns {Promise<NextResponse>} - The server's response with a list of users.
 */
export async function GET() {
    try {
        // Establish a connection to the MongoDB database
        await connectMongoDB();

        // Fetch all users from the database
        const users = await User.find({}, { password: 0 }); // Exclude passwords for security

        // Respond with the list of users
        return NextResponse.json({ users }, { status: 200 }); // OK
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Failed to fetch users. Please try again later." },
            { status: 500 } // Internal Server Error
        );
    }
}