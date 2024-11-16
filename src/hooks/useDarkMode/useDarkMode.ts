import { useState } from "react";

export const useDarkMode = (): ["dark" | "light", () => void] => {
     const [theme, setTheme] = useState<"dark" | "light">("light");

     const toggleTheme = () => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
     };
     return [theme, toggleTheme];
};
