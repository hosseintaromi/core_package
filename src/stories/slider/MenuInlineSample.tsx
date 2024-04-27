import { useEffect, useState } from "react";

function MenuInlineSample() {
  const [chats, setChats] = useState<any[]>([
    { id: "1", name: "ali" },
    { id: "2", name: "reza" },
  ]);

  useEffect(() => {
    // setTimeout(() => {
    //   updateTest();
    // }, 3000);
  }, []);

  return (
    <div>
      {chats?.map((chat, index) => (
        <h1 key={index}>{chat.name}</h1>
      ))}
      {chats?.map((chat, index) => (
        <h1 key={index}>{chat.name}</h1>
      ))}
    </div>
  );
}

export default MenuInlineSample;
