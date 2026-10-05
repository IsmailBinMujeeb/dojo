export const THEMES = [
    {
        id: "default",
        label: "Default",
        colors: ["#fafafa", "#ffffff", "#facc15"],
    },
    { id: "dark", label: "Dark", colors: ["#09090b", "#18181b", "#facc15"] },
    {
        id: "purple-light",
        label: "Purple Light",
        colors: ["#f2f3f5", "#ffffff", "#5865f2"],
    },
    {
        id: "purple-dark",
        label: "Purple Dark",
        colors: ["#313338", "#2b2d31", "#5865f2"],
    },
];

const DARK_THEMES = ["dark", "purple-dark"];

export const getStoredTheme = () => {
    try {
        return localStorage.getItem("theme") || "default";
    } catch {
        return "default";
    }
};

export const applyTheme = (theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // keeps shadcn's `dark:` utilities working
    root.classList.toggle("dark", DARK_THEMES.includes(theme));
    try {
        localStorage.setItem("theme", theme);
    } catch (e) {
        console.log(e);
    }
};
