export function setStyle(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
) {
  if (!el || !el.style) {
    return;
  }
  for (let key in styles) {
    el.style[key] = styles[key]!;
  }
}
