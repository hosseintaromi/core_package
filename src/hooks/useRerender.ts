import { useState } from "react";

export const useRerender = () => {
  const [update, setUpdate] = useState<boolean>(false);

  const rerender = () => {
    setUpdate((value) => !value);
  };

  return { rerender };
};
