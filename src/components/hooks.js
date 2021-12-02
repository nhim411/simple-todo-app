import { useState, useCallback } from "react";

export function useToggle(defaultValue) {
  const [isToggle, setIsToggle] = useState(defaultValue);

  const toggle = useCallback(() => {
    setIsToggle((isToggle) => !isToggle);
  }, []);

  return [isToggle, toggle];
}
