import type { Path } from "react-router-dom";
export {};

declare global {
  interface Window {
    electron: {
      openWeb: (url: Partial<Path> | strings) => void;
      closeWeb: () => void;
    };
  }
}
