'use client';

import Logo from "@/app/components/Logo";
import TaskForm from "@/app/components/TaskForm";

// The main component for adding a new task
export default function AddTask() {
    return (
        <div className="flex flex-col space-y-2.5 min-h-screen">
            {/* Header section containing the logo */}
            <div className="flex flex-row p-1 justify-center items-center">
                <Logo /> {/* Render the Logo component */}
            </div>
            {/* Horizontal line separator */}
            <hr style={{ height: "2px", backgroundColor: "#A8A8A7", border: "none" }} />
            {/* Render the TaskForm component in 'add' mode to create a new task */}
            <TaskForm mode="add" />
        </div>
    );
}