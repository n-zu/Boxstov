export type Events = {
  [type: string]: (...args: any[]) => void;
}

export default abstract class Observer<E extends Events> {
  abstract subscribe<T extends keyof E>(event: T, callback: E[T]): void;

  abstract notify<T extends keyof E>(event: T, ...args: Parameters<E[T]>): void;
}