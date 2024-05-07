export type ObservableAction<T> = (action: string, subject: T) => void;
export type ObservableEventAction<T, U> = (action: U, subject: T) => void;

export interface IObservable<T> {
  on: (subscriber: ObservableAction<T>, subject?: T) => void;
  off: (subscriber: ObservableAction<T>, subject?: T) => void;
  emit: (action: string, subject: T) => void;
  update: (subject: T) => void;
}

export interface IEventObservable<T, U = any> extends IObservable<T> {
  eventOn: (subscriber: ObservableEventAction<T, U>, subject: T) => void;
  eventOff: (subscriber: ObservableEventAction<T, U>, subject: T) => void;
  eventEmit: (subject: T, event: U) => void;
}

export class Observable<T> implements IObservable<T> {
  protected observables: {
    [id: string]: {
      listeners: ObservableAction<T>[];

      subject?: T;
    };
  } = {};

  public getId: (subject: T) => string;

  readonly defaultId = "subscribers";

  constructor(getId: (subject: T) => string) {
    this.getId = getId;
  }

  private getForceId = (subject?: T) =>
    this.getId?.(subject || ({} as any)) || this.defaultId;

  on(subscriber: ObservableAction<T>, subject?: T) {
    const id = this.getForceId(subject);
    let observable = this.observables[id];
    if (!observable) {
      observable = this.observables[id] = { listeners: [] };
    }
    observable.listeners.push(subscriber);
    const value = observable.subject;
    if (value !== subject) {
      return value;
    }
  }

  off(subscriber: ObservableAction<T>, subject?: T) {
    const id = this.getForceId(subject);
    const observable = this.observables[id];
    const listeners = observable?.listeners;
    if (listeners) {
      listeners.remove((x) => x === subscriber);
      if (listeners.length === 0) {
        delete this.observables[id];
      }
    }
  }

  emit(action: string, subject: T, changeReference?: boolean) {
    const id = this.getForceId(subject);
    const observable = this.observables[id];
    if (!observable) {
      return;
    }
    if (changeReference && observable.subject === subject) {
      subject = { ...subject };
    }
    observable.subject = subject;
    observable.listeners.forEach((subscriber) => {
      subscriber?.apply(subscriber, [action, subject]);
    });
  }

  update(subject: T) {
    this.emit("Update", subject);
  }
}

export interface ObservableItem<T> {
  subject: T;
  observable: Observable<T>;
}

export class EventObservable<T, U = any> extends Observable<T> {
  private eventObservable = new Observable<T>(this.getId);

  eventOn(subscriber: ObservableEventAction<T, U>, subject: T) {
    this.eventObservable.on(subscriber as any, subject);
  }

  eventOff(subscriber: ObservableEventAction<T, U>, subject: T) {
    this.eventObservable.off(subscriber as any, subject);
  }

  eventEmit(subject: T, event: U) {
    this.eventObservable.emit(event as string, subject);
  }
}

export class ObjectObservable<T> extends EventObservable<T> {
  public update(subject: T) {
    this.emit("Update", subject, true);
  }

  public delete(subject: T) {
    this.emit("Delete", subject);
    const id = this.getId?.(subject);
    if (id) {
      delete this.observables[id];
    }
  }
}

export class ObservableCollection<T> {
  private subscribers: ObservableAction<T>[] = [];

  private obsItems: {
    id: string;
    subject: any;
    observable: Observable<any>;
    on: (action: string, subject: any) => void;
  }[] = [];

  constructor(
    observableItems: ObservableItem<T>[],
    mapTo: (subjects: any[]) => T,
  ) {
    this.obsItems = observableItems.map((x) => ({
      id: x.observable.getId(x.subject),
      observable: x.observable,
      subject: x.subject,
      on: (action: string, subject: any) => {
        x.subject = subject;
        const result = mapTo(this.obsItems.map((x) => x.subject));
        this.subscribers.forEach((subscriber) => {
          subscriber?.apply(subscriber, [action, result]);
        });
      },
    }));
  }

  on(subscriber: ObservableAction<T>) {
    if (this.subscribers.length === 0) {
      this.obsItems.forEach((item) => {
        item.observable.on(item.on);
      });
    }

    this.subscribers.push(subscriber);
  }

  off(subscriber: ObservableAction<T>) {
    this.subscribers.remove((x) => x === subscriber);
    if (this.subscribers.length === 0) {
      this.obsItems.forEach((item) => {
        item.observable.off(item.on);
      });
    }
  }
}
