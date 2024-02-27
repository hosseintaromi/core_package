import { useClickAsync } from "hooks";

const ClickAsyncComponent = () => {
  const request = (callback?: VoidFunction) => {
    setTimeout(() => {
      callback?.();
    }, 3000);
  };

  const request2 = () =>
    new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 3000);
    });
  const clickAsync = useClickAsync(request);
  const clickAsync2 = useClickAsync(request2);
  return (
    <>
      <button ref={clickAsync}>Click Async</button>
      <button ref={clickAsync2}>Click Async2</button>
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
