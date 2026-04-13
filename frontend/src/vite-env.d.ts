/// <reference types="vite/client" />

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "react-quill-new" {
  import { ComponentType } from "react";
  const ReactQuill: ComponentType<any>;
  export default ReactQuill;
}
