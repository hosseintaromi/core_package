import { Overlay, OverlayContainer } from "components";
import { useInit } from "hooks";
import { useRef, useState } from "react";

const ClickAsyncComponent = () => {
  const [name, setName] = useState<string>("taghi");
  const overlayRef = useRef<any>();

  const toggle = (e: any) => overlayRef.current?.toggle(e);

  useInit(() => {
    setTimeout(() => {
      setName("saaed");
    }, 5000);
  });

  return (
    <>
      <h1>{name}</h1>
      <Overlay ref={overlayRef}>
        <h1>{name}</h1>
      </Overlay>
      <button onClick={toggle}>toggle</button>
      <OverlayContainer />
    </>
  );
};
export default {
  title: "Core/ClickAsync",
  component: ClickAsyncComponent,
  argTypes: {},
};
export const Info = {
  render: () => <ClickAsyncComponent />,
  args: {},
};
