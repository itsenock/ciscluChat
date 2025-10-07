export const applyTheme = () => {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  document.documentElement.classList.toggle("dark", newTheme === "dark");
};
