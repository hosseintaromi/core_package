const locale = {
  user: {
    delete_user: "delete user",
    add_user: "add user",
  },
  message: {
    add_message: "add message",
    delete_message: "delete message",
  },
  chat: {
    add_chat: "add chat",
    delete_chat: "delete chat",
  },
};
export type LocaleRootPropes = keyof typeof locale;
export type LocaleKeyProp<T extends LocaleRootPropes> =
  keyof (typeof locale)[T];

export type LocaleKeyUser = LocaleKeyProp<"user">;
export type LocaleKeyMessage = LocaleKeyProp<"message">;
export type LocaleKeyChat = LocaleKeyProp<"chat">;
export type LocaleKeyTypes = LocaleKeyUser | LocaleKeyMessage | LocaleKeyChat;
