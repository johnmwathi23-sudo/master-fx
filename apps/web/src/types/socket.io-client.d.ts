declare module 'socket.io-client' {
  export function io(uri?: string, opts?: any): Socket;
  export interface Socket {
    id: string;
    connected: boolean;
    disconnected: boolean;
    connect(): Socket;
    open(): Socket;
    send(...args: any[]): Socket;
    emit(event: string, ...args: any[]): Socket;
    on(event: string, fn: (...args: any[]) => void): Socket;
    once(event: string, fn: (...args: any[]) => void): Socket;
    off(event?: string, fn?: (...args: any[]) => void): Socket;
    removeAllListeners(event?: string): Socket;
    close(): Socket;
    disconnect(): Socket;
    listeners(event: string): any[];
    hasListeners(event: string): boolean;
    onAny(fn: (...args: any[]) => void): Socket;
    prependAny(fn: (...args: any[]) => void): Socket;
    offAny(fn?: (...args: any[]) => void): Socket;
    compress(compress: boolean): Socket;
    io: any;
    nsp: string;
    auth: any;
  }
}
