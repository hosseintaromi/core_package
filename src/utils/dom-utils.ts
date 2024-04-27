export function clientWidth(el: HTMLElement | Element) {
  return el.clientWidth;
}

export function querySelectorAll(el: HTMLElement, query: string) {
  return el.querySelectorAll(query);
}

export function setStyle(
  el: HTMLElement | undefined,
  style: keyof CSSStyleDeclaration,
  value: string,
) {
  if (!el) {
    return;
  }
  (el.style as any)[style] = value;
  return value;
}
