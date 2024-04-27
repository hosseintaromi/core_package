import { useView } from "../../hooks/useView";

function MenuInlineSample3() {
  const { closeByType, close } = useView();
  const closeAll = () => {
    closeByType("All");
  };
  return (
    <div>
      <div
        onClick={() => {
          close();
        }}
      >
        Back
      </div>
      <div onClick={closeAll}>1.5 ffff</div>
      <div>hjh sjkdh sdkhjfhs</div>
      <div>oiio sffs jk</div>
      <div>ewew mmn ww</div>
      <div>pooiiiw</div>
    </div>
  );
}

export default MenuInlineSample3;
