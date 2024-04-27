import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useRef,
} from "react";
import { useInit } from "../../hooks";

export interface ContainerDataType {
  id: string;
  data: any;
  getContainer: (id?: string) => ContainerDataType | undefined;
  observer?: any;
}

export interface ContainerEventHandlerType extends Event {
  container: ContainerDataType;
  getContainer: (id?: string) => ContainerDataType | undefined;
}

export const DataContext = createContext<ContainerDataType>({} as any);

export const useContainer = <T = any,>() => {
  const container = useContext(DataContext);

  const getContainer = (id?: string) => {
    if (!container) {
      return;
    }
    if (container.id === id) {
      return container;
    }
    return id ? container.getContainer(id) : container;
  };

  useInit(() => {});

  return {
    getContainer,
    container,
  };
};

export const DataContainer = <T = any,>({
  children,
  id,
  data,
  observer,
  ref,
}: {
  children: ReactNode;
  id: string;
  data: T;
  observer?: any;
  ref?: MutableRefObject<ContainerDataType>;
}) => {
  const { getContainer } = useContainer();
  const contextRef = useRef<ContainerDataType>({
    id,
    data,
    observer,
    getContainer,
  });

  useInit(() => {
    if (ref) {
      ref.current = contextRef.current;
    }
  });

  return (
    <>
      <DataContext.Provider value={contextRef.current}>
        {children}
      </DataContext.Provider>
    </>
  );
};

export const ContainerEventHandler = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: (e: ContainerEventHandlerType) => void;
}) => {
  const context = useContainer();
  const extendEvent = (e: ContainerEventHandlerType) => {
    e.container = context.container;
    e.getContainer = context.getContainer;
    return e as ContainerEventHandlerType;
  };
  return (
    <div
      onClick={(e) => {
        onClick?.(extendEvent(e as any));
      }}
    >
      {children}
    </div>
  );
};
/// /////////////////////////////////////////
const chatObserver = {};
const msgObserver = {};

const MsgComponent = ({ message }: { message: any }) => {
  const containerCtx = useContainer();
  return (
    <>
      <ContainerEventHandler
        onClick={(e) => {
          console.log(e.container);
          console.log(e.getContainer("chat"));
        }}
      >
        {message.text}
      </ContainerEventHandler>
      <span>{containerCtx.getContainer("chat")?.data.name}</span>
    </>
  );
};

export const ChatComponent = () => {
  const chat: any = { name: "ali" };
  const messages: any = [{ text: "hello" }, { text: "by" }];
  return (
    <>
      <DataContainer id="chat" data={chat} observer={chatObserver}>
        <h1>{chat.name}</h1>
        <ul>
          {messages.map((message: any, index: number) => (
            <div key={index}>
              <DataContainer id="message" data={message} observer={msgObserver}>
                <MsgComponent message={message} />
              </DataContainer>
            </div>
          ))}
        </ul>
      </DataContainer>
    </>
  );
};
