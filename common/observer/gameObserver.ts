import Observer, { Events } from "./observer.js";

type Subscribers<E extends Events> = {
  [type in keyof E]?: E[type][];
};

export default class GameObserver<E extends Events> extends Observer<E> {
  private readonly subscribers: Subscribers<E> = {};

  public subscribe<T extends keyof E>(event: T, callback: E[T]): void {
    const subscribers = this.subscribers[event] || [];
    subscribers.push(callback);
    this.subscribers[event] = subscribers;
  }

  public notify<T extends keyof E>(event: T, ...args: Parameters<E[T]>): void {
    this.subscribers[event]?.forEach((callback) => callback(...args));
  }
}