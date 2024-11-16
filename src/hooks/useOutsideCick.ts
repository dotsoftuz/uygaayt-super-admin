import React, { useEffect } from "react";
import { TSetState } from "types/form.types";

function useOutsideHandler(
  ref: React.RefObject<HTMLDivElement>,
  closeOption: TSetState<any>
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeOption(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideHandler;
