import { useClickAsync } from "hooks";

const ClickAsyncComponent = () => {
  const clickAsync = useClickAsync((callback) => {
    setTimeout(() => {
      callback();
    }, 3000);
  });

  const clickAsync2 = useClickAsync(
    () =>
      new Promise((res) => {
        setTimeout(() => {
          res(true);
        }, 3000);
      }),
  );

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
