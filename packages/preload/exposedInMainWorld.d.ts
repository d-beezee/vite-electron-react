interface Window {
  electron: {
    /**
     * Opens a new web page in the main window.
     * @example
     * openWeb("https://www.google.com");
     */
    openWeb: (url: string) => void;
    /**
     * Closes the current web page.
     * @example
     * closeWeb();
     */
    closeWeb: () => void;
  };
}
