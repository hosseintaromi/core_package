import React from "react";
import { Story, Meta } from "@storybook/react";

import { openView } from "../utils";
import { ViewContainerType } from "../@types";
import { useChangeView, useInit, useView } from "../hooks";
import {
  BottomSheetContainer,
  MasterTabContainer,
  ModalContainer,
  TabContainer,
  ToastContainer,
} from "../components";
import "../styles/index.css";

export default {
  title: "Core/ModalTest",
} as Meta;

interface UserType {
  id: string;
  name: string;
}

const Modal2 = () => {
  const x = "test 1jj2444";
  const user: UserType = {
    name: "ali333",
    id: "111133",
  };
  return <h1>{x}</h1>;
};

const Modal1 = () => {
  const x = "test 1jj2";
  const user: UserType = {
    name: "ali",
    id: "1111",
  };
  return (
    <button
      onClick={() => {
        openView({
          id: "2",
          type: ViewContainerType.Tab,
          data: {},
          component: Modal2,
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
      type: ViewContainerType.Modal,
      data: {},
      component: Modal1,
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

const Template: Story = () => <App />;
export const Default = Template.bind({});

Default.args = {
  // add the props that you wanna set up for the default scenario here
};
