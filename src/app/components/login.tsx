import { signIn, signOut } from "@/auth";

export async function doLogout() {
    await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData: FormData): Promise<void> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (response?.ok) {
            // Redirect to the tasks page after successful login
            window.location.href = "/tasks";
        } else {
            // Handle login failure
            const errorMessage = response?.error || "Login failed. Please check your credentials.";
            alert(errorMessage);
        }
    } catch (err: any) {
        console.error("An error occurred during login:", err);
        alert("An unexpected error occurred. Please try again later.");
    }
}