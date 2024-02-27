import { useRef, ReactNode, createContext } from "react";
import { useFn, useInit } from "hooks";
import { ObjectObservable } from "utils";

type GetAsyncLocale = (localeKey: string) => Promise<any>;

type LocaleContextType = {
  lang: (key: string) => string | undefined;
  getLocaleKey: () => string;
  setLocaleKey: (lang_code: string) => Promise<void>;
  localeObservable: ObjectObservable<string>;
};

export const LocaleContext = createContext<LocaleContextType>({} as any);

type LocaleContextProviderType = {
  children: ReactNode;
  getAsyncLocale: GetAsyncLocale;
  defaultLocaleKey?: string;
};

export const LocaleContextProvider = ({
  children,
  getAsyncLocale,
  defaultLocaleKey = "en-US",
}: LocaleContextProviderType) => {
  const localesRef = useRef<Record<string, string>>();
  const localeKeyRef = useRef<string>("");
  const getLocaleRef = useRef<GetAsyncLocale>(getAsyncLocale);
  const localeObservable = new ObjectObservable<string>(() => "locale");

  const lang = (key: string) => localesRef.current?.[key];

  const setLocaleKey = useFn(async (lang_code: string) => {
    if (localeKeyRef.current === lang_code && !localesRef.current) {
      return;
    }
    try {
      localesRef.current = await getLocaleRef.current(lang_code);
      localeKeyRef.current = lang_code;
      localeObservable.emit("Change", lang_code);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  });

  const getLocaleKey = () => localeKeyRef.current;

  useInit(() => {
    setLocaleKey(defaultLocaleKey);
  });

  return (
    <LocaleContext.Provider
      value={{ lang, getLocaleKey, setLocaleKey, localeObservable }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
