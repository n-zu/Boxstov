import Observer from "./observer.js";

export default class GameObserver extends Observer {
  private readonly subscribers: { [key: string]: Function[] } = {};

  public subscribe(event: string, callback: (...args: any[]) => void): void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  public notify(event: string, ...args: any[]): void {
    if (!this.subscribers[event]) {
      return;
    }
    this.subscribers[event].forEach((callback) => callback(...args));
  }
}