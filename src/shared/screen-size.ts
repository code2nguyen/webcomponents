// export function getRootNode(
//   viewRef: EmbeddedViewRef<any>,
//   _document: Document
// ): HTMLElement {
//   const rootNode: Node = viewRef.rootNodes[0];
//   if (rootNode.nodeType !== _document.ELEMENT_NODE) {
//     const wrapper = _document.createElement('div');
//     wrapper.appendChild(rootNode);
//     return wrapper;
//   }
//   return rootNode as HTMLElement;
// }

export enum ScreenSize {
  XSmall = 'XSmall',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}
