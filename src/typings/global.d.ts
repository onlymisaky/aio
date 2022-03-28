declare global {

  interface Window {

  }

  interface Obj<T = any> {
    [key: string]: T;
    [key: number]: T;
  }

}

export { };
