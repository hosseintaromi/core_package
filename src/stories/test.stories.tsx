import React from "react";
import { Story, Meta } from "@storybook/react";

import { openView } from "utils";
import { ViewContainerType } from "types";
import { useInit, useView } from "hooks";
import {
  BottomSheetContainer,
  MasterTabContainer,
  ModalContainer,
  TabContainer,
  ToastContainer,
} from "components";
import "../styles/index.css";

export default {
  title: "Core/Components/Containers/PartialTabContainer",
} as Meta;

const Test3 = () => {
  const { close } = useView();
  const x = "sdvjjvbjkdsbvjksdbvjks";

  return (
    <div style={{ backgroundColor: "blue" }}>
      {x}
      <button onClick={close}>close</button>
    </div>
  );
};

const Test2 = () => {
  const { close } = useView();
  const x = "testttcacvahjvchjavc test222";

  const y = "test3";

  return (
    <div style={{ backgroundColor: "red" }}>
      {x}
      <button
        onClick={() => {
          openView({
            id: "3",
            type: ViewContainerType.Tab,
            data: {},
            component: Test3,
          });
        }}
      >
        {y}
      </button>
      <button onClick={close}>close</button>
    </div>
  );
};

const Test1 = () => {
  const x = "test 1jj2";
  return (
    <button
      onClick={() => {
        openView({
          id: "2",
          type: ViewContainerType.Tab,
          data: {},
          component: Test2,
        });
      }}
    >
      {x}
    </button>
  );
};

function App() {
  useInit(() => {
    openView({
      id: "1",
      type: ViewContainerType.MasterTab,
      data: {},
      component: Test1,
    });
  });

  return (
    <>
      <MasterTabContainer />
      <TabContainer />
      <ModalContainer />
      <BottomSheetContainer />
      <ToastContainer />
    </>
  );
}

const Template: Story = () => (
  <React.StrictMode>
    <App />
    <TabContainer />
  </React.StrictMode>
);
export const Default = Template.bind({});

Default.args = {
  // add the props that you wanna set up for the default scenario here
};
