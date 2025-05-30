import useDarkMode from "../hooks/useDarkMode";

export default function ToggleDarkMode() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <button
        onClick={toggleDarkMode}
        className={`right-9  ${
          isDarkMode ? "bg-yellow-100" : "bg-slate-900"
        }  p-2 rounded-full border-4 border-indigo-600 hover:scale-150 transition-all duration-300`}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
