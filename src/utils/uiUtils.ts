export function setStyle(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
) {
  for (let key in styles) {
    el.style[key] = styles[key]!;
  }
}
