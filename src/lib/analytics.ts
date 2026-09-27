// The GoatCounter <script> is injected into every page at build time
// (see vite.config.ts) when GOATCOUNTER_CODE is set; otherwise this is a no-op.

declare global {
  interface Window {
    goatcounter?: { count: (opts: { path: string; title?: string; event?: boolean }) => void };
  }
}

export function track(event: string): void {
  window.goatcounter?.count({ path: event, event: true });
}
