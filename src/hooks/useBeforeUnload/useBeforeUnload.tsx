import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useBeforeUnload(message: string) {
  const [isDirty, setDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleBeforeUnload(event: any) {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = message;
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, message]);

  function prompt() {
    setDirty(true);
  }

  function confirmNavigation() {
    setDirty(false);
    // navigate(-1);
  }

  return [prompt, confirmNavigation];
}
