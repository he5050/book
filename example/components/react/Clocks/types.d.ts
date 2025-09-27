/// <reference types="react" />

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> { }
  interface ElementClass extends React.Component<any> {
    render(): React.ReactNode
  }
  interface ElementAttributesProperty { props: {} }
  interface ElementChildrenAttribute { children: {} }

  type LibraryManagedAttributes<C, P> = C extends React.MemoExoticComponent<infer T> | React.LazyExoticComponent<infer T>
    ? T extends React.MemoExoticComponent<infer U> | React.LazyExoticComponent<infer U>
      ? ReactManagedAttributes<U, P>
      : ReactManagedAttributes<T, P>
    : ReactManagedAttributes<C, P>

  interface IntrinsicAttributes extends React.Attributes { }
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }

  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

type ReactManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D; }
  ? string extends keyof T ? P : P & InferProps<T> & InferDefaults<D>
  : C extends { propTypes: infer T; }
  ? string extends keyof T ? P : P & InferProps<T>
  : C extends { defaultProps: infer D; }
  ? P & InferDefaults<D>
  : P

type InferProps<T> = {
  [K in keyof T]: T[K] extends React.Validator<infer P> ? P : any
}

type InferDefaults<T> = {
  [K in keyof T]: T[K]
}