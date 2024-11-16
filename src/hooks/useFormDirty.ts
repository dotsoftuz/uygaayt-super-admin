import { useEffect, useState } from "react";

export default function useFormDirty(initialData: boolean) {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "hello world"; // Some browsers require a string to be set
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const setFormDirty = () => setIsDirty(true);
  const setFormClean = () => setIsDirty(false);

  return [isDirty, setFormDirty, setFormClean];
}
