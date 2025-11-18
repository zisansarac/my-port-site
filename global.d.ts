// global.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src: string;
      autoplay?: boolean | string;
      loop?: boolean | string;
      mode?: string; 
     
    };
  }
}

