import { Observable, Subscriber } from 'rxjs';
declare const window: any;

function setupSubscription(element: HTMLElement, subscriber: Subscriber<any>) {
  const observer = new window.ResizeObserver((entries: any) => {
    const entry = entries && entries[0];
    if (entry) {
      subscriber.next(entry);
    }
  });
  observer.observe(element);
  const unsubscribe = () => observer.unobserve(element);
  subscriber.add(unsubscribe);
}

export function resizeObserver(element: HTMLElement) {
  return new Observable<any>(subscriber => {
    return setupSubscription(element, subscriber);
  });
}
