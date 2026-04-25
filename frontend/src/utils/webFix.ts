// Suppress React Native web touch event warnings
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: any[]) => {
    if (
      args[0]?.includes?.('Cannot record touch end without a touch start') ||
      args[0]?.includes?.('Touch Bank')
    ) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args: any[]) => {
    if (
      args[0]?.includes?.('Cannot record touch end without a touch start') ||
      args[0]?.includes?.('Touch Bank')
    ) {
      return;
    }
    originalError(...args);
  };
}
