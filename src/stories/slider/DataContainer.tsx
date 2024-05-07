import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useRef,
} from "react";
import { useInit } from "../../hooks";
import { Observable } from "../../utils";
import { useCDFromView, useCDObserver } from "../../hooks/useCDObserver";

export interface ContainerDataType<T> {
  id: string;
  data: T;
  getContainer: (id?: string) => ContainerDataType<T> | undefined;
  getRefContainer: (id: string) => ContainerDataType<any> | undefined;
  observer: any;
  viewRef?: ContainerDataType<any>;
}

export interface ContainerEventHandlerType extends Event {
  container: ContainerDataType<any>;
  getContainer: (id?: string) => ContainerDataType<any> | undefined;
}

export const CDContext = createContext<ContainerDataType<any>>({} as any);

export const useContainer = <T = any,>() => {
  const container: ContainerDataType<T> = useContext(CDContext);
  const getContainer = (id?: string) => {
    if (!container) {
      return;
    }
    if (container.id === id) {
      return container;
    }
    return id ? container.getContainer(id) : container;
  };

  const getRefContainer = (id: string) => {
    if (!container || !id) {
      return;
    }
    if (container.viewRef?.id === id) {
      return container.viewRef;
    }
    return container.viewRef?.getRefContainer(id);
  };

  useInit(() => {});

  return {
    getContainer,
    getRefContainer,
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
  observer: Observable<T>;
  ref?: MutableRefObject<ContainerDataType<T>>;
}) => {
  const { getContainer, getRefContainer } = useContainer();
  const contextRef = useRef<ContainerDataType<T>>({
    id,
    data,
    observer,
    getContainer,
    getRefContainer,
  });

  useInit(() => {
    if (ref) {
      ref.current = contextRef.current;
    }
  });

  return (
    <>
      <CDContext.Provider value={contextRef.current}>
        {children}
      </CDContext.Provider>
    </>
  );
};

export const ViewDataContainer = <T = any,>({
  children,
  id,
  data,
  observer,
  ref,
}: {
  children: ReactNode;
  id: string;
  data: T;
  observer: Observable<T>;
  ref?: MutableRefObject<ContainerDataType<T>>;
}) => {
  const viewContainer = useCDFromView<any>();
  const { getContainer, getRefContainer } = useContainer();
  const contextRef = useRef<ContainerDataType<T>>({
    id,
    data,
    observer,
    getContainer,
    getRefContainer,
    viewRef: viewContainer,
  });

  useInit(() => {
    if (ref) {
      ref.current = contextRef.current;
    }
  });

  return (
    <>
      <CDContext.Provider value={contextRef.current}>
        {children}
      </CDContext.Provider>
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

interface Chat {
  name: string;
  id: string;
}

interface Message {
  text: string;
  id: string;
}

const chatObserver = new Observable<Chat>((x) => x.id);
const msgObserver = new Observable<Message>((x) => x.id);

const MsgComponent = () => {
  const $message = useCDObserver<Message>();
  const $chat = useCDObserver<Chat>("chat");
  const chat2 = useCDFromView<Chat>("chat");
  return (
    <>
      <ContainerEventHandler
        onClick={(e) => {
          console.log(e.container);
          console.log(e.getContainer("chat"));
        }}
      >
        {$chat.name}: <strong>{$message.text} </strong>
        <br />
      </ContainerEventHandler>
    </>
  );
};

const ChatComponent = () => {
  const $chat = useCDObserver<Chat>("chat");
  const messages: any = [
    { text: "hello", id: "1" },
    { text: "by", id: "2" },
  ];

  useInit(() => {
    setTimeout(() => {
      msgObserver.update({ text: "byby", id: "2" });
    }, 2000);
    setTimeout(() => {
      chatObserver.update({ name: "reza", id: "1" });
    }, 4000);
  });

  return (
    <>
      <h1>{$chat.name}</h1>
      <ul>
        {messages.map((message: any, index: number) => (
          <div key={index}>
            <ViewDataContainer
              id="message"
              data={message}
              observer={msgObserver}
            >
              <MsgComponent />
            </ViewDataContainer>
          </div>
        ))}
      </ul>
    </>
  );
};

export const MessengerComponent = () => {
  const chat: any = { name: "ali", id: "1" };

  return (
    <>
      <DataContainer id="chat" data={chat} observer={chatObserver}>
        <ChatComponent />
      </DataContainer>
    </>
  );
};
