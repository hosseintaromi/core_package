import { useRef } from "react";
import { EventType, useInit } from "../../hooks";
import MenuInlineSample from "./MenuInlineSample";
import MenuInlineSample2 from "./MenuInlineSample2";
import MenuInlineSample3 from "./MenuInlineSample3";
import "./slider.css";
import { SlideContainer } from "../../components";

const SliderComponent = () => {
  const elRef = useRef<HTMLElement | undefined>();

  useInit(() => {});

  return (
    <>
      <div style={{ display: "flex" }}>
        <SlideContainer
          config={{
            event: EventType.Tap,
            components: [
              { title: "All", component: MenuInlineSample },
              { title: "Groups", component: MenuInlineSample2 },
              { title: "Private Chats", component: MenuInlineSample3 },
            ],
            hasPointer: true,
            firstIndex: 2,
            elRef: elRef as any,
            className: "slide-menu",
          }}
        />
        {/* <OverlaySlideContainer
          config={{
            id: "setting1",
            event: EventType.Tap,
            component: MenuInlineSample,
            elRef: elRef as any,
            className: "slide-menu",
          }}
        /> */}
      </div>
    </>
  );
};
export default {
  title: "Core/Slider",
  component: SliderComponent,
  argTypes: {},
};
export const Info = {
  render: () => <SliderComponent />,
  args: {},
};
