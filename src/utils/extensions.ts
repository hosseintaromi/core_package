declare global {
  interface Event {
    contains(container: Node): boolean;
  }

  interface Array<T> {
    last(): T;
    safePush(item: T): void;
    remove(predicate: (value: T) => boolean): T | undefined;
    removeAll(predicate: (value: T) => boolean): T | undefined;
  }
}

Event.prototype.contains = function (container: Node): boolean {
  return containsTargetEl(this.target as Node, container);
};

// eslint-disable-next-line no-extend-native
Array.prototype.last = function <T>(): T {
  const arr: Array<T> = this || [];
  return arr[arr.length - 1];
};

// eslint-disable-next-line no-extend-native
Array.prototype.safePush = function <T>(item: T) {
  const arr: Array<T> = this || [];
  if (!arr.find((x) => x === item)) {
    arr.push(item);
  }
};

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function <T>(
  predicate: (value: T) => boolean,
): T | undefined {
  const arr: Array<T> = this || [];
  const index = arr.findIndex((x) => predicate(x));
  if (index >= 0) {
    const removedItem = arr[index];
    arr.splice(index, 1);
    return removedItem;
  }
};

// eslint-disable-next-line no-extend-native
Array.prototype.removeAll = function <T>(
  predicate: (value: T) => boolean,
): T[] | undefined {
  let found = true;
  const removedItems: T[] = [];
  const arr: Array<T> = this || [];
  while (found) {
    if (!arr.remove(predicate)) {
      found = false;
      break;
    }
  }
  return removedItems;
};

export function containsTargetEl(target: Node | null, container: Node) {
  if (!target) {
    return false;
  }
  return target === container || container.contains(target);
}

export function addEventListenerEl(
  target: HTMLElement | undefined,
  event: string,
  listener: (e: Event) => void,
) {
  target?.addEventListener(event, listener);
}

export function removeEventListenerEl(
  target: HTMLElement | undefined,
  event: string,
  listener: (e: Event) => void,
) {
  target?.removeEventListener(event, listener);
}
