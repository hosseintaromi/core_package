import { useView } from "../hooks";

export interface Option {
  label: string;
  value: string;
}

export interface MenuOptions {
  options: Option[];
}

export function Menu() {
  const { close, viewData } = useView<MenuOptions>();
  return (
    <div
      style={{
        backgroundColor: "yellow",
        marginTop: "20px",
        borderRadius: "8px",
        padding: "5px",
      }}
    >
      <ul>
        {viewData.options.map((option: Option) => (
          <li onClick={() => close({ res: option })} key={option.value}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
