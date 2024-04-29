import {
  BottomSheetContainer,
  ModalContainer,
  ToastContainer,
} from "../components";
import { MessageType } from "../@types";
import { openAlert, openConfirm, openToast, openView } from "../utils";
import { Modal } from "../components/Modal";
import { BottomSheet } from "../components/BottomSheet";

interface Props {
  message: string;
  type: MessageType;
}

export default function ToastSample({ message, type }: Props) {
  const openTst = () => {
    openToast({
      message,
      type,
    });
  };
  const openAlt = () => {
    openAlert({
      message: "پیام Alert اینجا نمایش داده می شود.",
      title: "هشدار",
      type: MessageType.Success,
    });
  };
  const openCfm = () => {
    openConfirm({
      message: "پیام Confirm اینجا نمایش داده می شود.",
      title: "هشدار",
    });
  };
  const openMdl = () => {
    openView({
      component: Modal,
      type: "Modal",
    });
  };
  const openBtmsht = () => {
    openView({
      component: BottomSheet,
      type: "BottomSheet",
    });
  };

  return (
    <>
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            verticalAlign: "middle",
            cursor: "pointer",
            userSelect: "none",
            border: "1px solid #029CFD",
            borderRadius: ".5rem",
            backgroundColor: "#029CFD",
            transition:
              "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          }}
          onClick={() => openTst()}
        >
          Open Toast
        </button>
      </div>
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            verticalAlign: "middle",
            cursor: "pointer",
            userSelect: "none",
            border: "1px solid #029CFD",
            borderRadius: ".5rem",
            backgroundColor: "#029CFD",
            transition:
              "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          }}
          onClick={() => openAlt()}
        >
          Open Alert
        </button>
      </div>
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            verticalAlign: "middle",
            cursor: "pointer",
            userSelect: "none",
            border: "1px solid #029CFD",
            borderRadius: ".5rem",
            backgroundColor: "#029CFD",
            transition:
              "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          }}
          onClick={() => openCfm()}
        >
          Open Confirm
        </button>
      </div>
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            verticalAlign: "middle",
            cursor: "pointer",
            userSelect: "none",
            border: "1px solid #029CFD",
            borderRadius: ".5rem",
            backgroundColor: "#029CFD",
            transition:
              "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          }}
          onClick={() => openMdl()}
        >
          Open Modal
        </button>
      </div>
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            verticalAlign: "middle",
            cursor: "pointer",
            userSelect: "none",
            border: "1px solid #029CFD",
            borderRadius: ".5rem",
            backgroundColor: "#029CFD",
            transition:
              "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          }}
          onClick={() => openBtmsht()}
        >
          Open BottomSheet
        </button>
      </div>
      <ToastContainer />
      <ModalContainer />
      <BottomSheetContainer />
    </>
  );
}
