declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  const content: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default content;
}