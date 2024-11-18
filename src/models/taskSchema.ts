import mongoose, {Schema, Document, Model} from "mongoose";

interface IItem extends Document {
    title: string;
    description?: string;
    userId: Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
}

const taskSchema = new Schema<IItem>({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId, // One user id to many tasks link
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        default: new Date( Date.now() ),
        required: true,
    },
    endDate: {
        type: Date,
        default: new Date(  Date.now() + (3600 * 1 * 1000)  ), // 1 hour ahead of current time
        required: true,
    },
})

const Task: Model<IItem> = mongoose.models.Task || mongoose.model<IItem>("Task", taskSchema);
export default Task;
