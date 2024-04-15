import React from "react";
import ToastSample from "../samples/Toast";
import { MessageType } from "../@types";
import "./general.css";

export default {
  title: "UiKit/Toast",
  component: ToastSample,
  argTypes: {
    message: {
      control: "text",
    },
    type: {
      type: "select",
      options: [MessageType.Error, MessageType.Success],
    },
  },
};
export const Message = {
  render: (args: any) => <ToastSample {...args} />,
  args: {
    message: "پیام Toast اینجا نمایش داده می شود.",
    type: MessageType.Success,
  },
};
