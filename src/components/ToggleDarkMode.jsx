import useDarkMode from "../hooks/useDarkMode";

export default function ToggleDarkMode() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <button
        onClick={toggleDarkMode}
        className={`darkmode-button ${
          isDarkMode ? "bg-yellow-100" : "bg-slate-900"
        }  `}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
