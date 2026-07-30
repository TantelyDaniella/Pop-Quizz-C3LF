import {Toaster} from "react-hot-toast";

function AppToaster() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
            className: "bg-(--surface)! text-(--primary-text-color)! border border-(--border-color) backdrop-blur-md",
            success: {
                iconTheme: {
                    primary: "var(--primary)",
                        secondary: "#ffffff",
                },
            },
            error: {
                iconTheme: {
                    primary: "#e71717",
                        secondary: "#ffffff",
                },
            },
            }}
        />)
}

export default AppToaster;