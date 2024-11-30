import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Define the Task interface
interface ITask extends Document {
    title: string;       // Title of the task
    description?: string; // Optional description of the task
    imageUrl?: string;    // Optional URL for an associated image
    startDate: Date;      // Start date of the task
    startTime: string;    // Start time of the task (HH:mm format)
    endDate: Date;        // End date of the task
    endTime: string;      // End time of the task (HH:mm format)
    allDay: boolean;      // Indicates if the task is an all-day event
    created_at: Date;     // Timestamp of task creation
    user: Types.ObjectId; // Reference to the User document
}

// Define the Task schema
const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,   // Title is required
        trim: true,       // Removes whitespace
    },
    description: {
        type: String,
        trim: true,       // Removes whitespace (optional field)
    },
    imageUrl: {
        type: String,
        trim: true,       // Removes whitespace
        validate: {
            validator: function(v: string) {
                // Basic URL validation
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    startDate: {
        type: Date,
        required: true,   // Start date is required
    },
    startTime: {
        type: String,
        required: true,   // Start time is required (stored in HH:mm format)
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Regex to validate time format
    },
    endDate: {
        type: Date,
        required: true,   // End date is required
    },
    endTime: {
        type: String,
        required: true,   // End time is required (stored in HH:mm format)
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Regex to validate time format
    },
    allDay: {
        type: Boolean,
        required: true,   // All-day field is required
        default: false,   // Default value is false
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically set the creation timestamp
    },
    user: {
        type: Schema.Types.ObjectId, // References a User document
        ref: 'User',                // Name of the User model
        required: true,             // Each task must belong to a user
    },
});

// Export the Task model, creating it only if it doesn't already exist
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
export default Task;