import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the User interface
interface IUser extends Document {
    name: string;       // The user's name
    email: string;      // The user's email
    password: string;   // The user's hashed password
    created_at: Date;   // Timestamp of user creation
}

// Define the User schema
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,   // Name is required
        trim: true,       // Removes whitespace from the beginning and end
    },
    email: {
        type: String,
        required: true,   // Email is required
        unique: true,     // Ensure each email is unique
        trim: true,       // Removes whitespace
        lowercase: true,  // Converts the email to lowercase
    },
    password: {
        type: String,
        required: true,   // Password is required
        minlength: 6,     // Set a minimum length for security
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically set the creation timestamp
    }
});

// Export the User model, creating it only if it doesn’t already exist
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
