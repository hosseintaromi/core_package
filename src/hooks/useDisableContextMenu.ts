import { useInit } from "./useInit";

export const useDisableContextMenu = () => {
  useInit(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  });
};
