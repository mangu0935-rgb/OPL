import logoUrl from "@/assets/bri-finance-logo.png";

/**
 * Returns an absolute URL to the BRI Finance logo so it can be embedded in
 * popup print windows (which don't share Vite's module resolution).
 */
export const getLogoUrl = () => new URL(logoUrl, window.location.origin).href;
