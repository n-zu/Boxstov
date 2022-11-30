export default abstract class Observer {
  abstract subscribe(event: string, callback: (...args: any[]) => void): void;

  abstract notify(event: string, ...args: any[]): void;
}