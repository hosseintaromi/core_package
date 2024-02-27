import { useContext, useState } from "react";
import { LocaleKeyTypes } from "types";
import { LocaleContext } from "context/LocaleContextProvider";
import { useFn, useInit } from "./_index";

export const useLocale = <T extends LocaleKeyTypes = LocaleKeyTypes>() => {
  const { lang, localeObservable, getLocaleKey, setLocaleKey } =
    useContext(LocaleContext);
  const [localeState, setLocaleState] = useState<string>(getLocaleKey());

  const subscribe = useFn((action: string, newKey: string) => {
    if (newKey !== localeState) {
      setLocaleState(newKey);
    }
  });

  useInit(() => {
    localeObservable.on(subscribe);

    return () => {
      localeObservable.off(subscribe);
    };
  });

  return { lang, setLocaleKey, getLocaleKey };
};
