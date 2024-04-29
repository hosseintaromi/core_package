import { useRef } from "react";
import SlideContainer from "../../components/containers/SlideContainer";
import { EventType, useInit } from "../../hooks";
import MenuInlineSample from "./MenuInlineSample";
import MenuInlineSample2 from "./MenuInlineSample2";
import MenuInlineSample3 from "./MenuInlineSample3";
import "./slider.css";

const SliderComponent = () => {
  const elRef = useRef<HTMLElement | undefined>();

  useInit(() => {});

  return (
    <>
      <div style={{ overflowY: "scroll", height: "93vh" }}>
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
