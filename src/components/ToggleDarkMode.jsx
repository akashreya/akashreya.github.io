import { useTheme } from "../contexts/ThemeContext";

export default function ToggleDarkMode() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div>
      <button
        onClick={toggleTheme}
        className={`darkmode-button ${
          isDarkMode ? "bg-yellow-100" : "bg-slate-900"
        }`}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
