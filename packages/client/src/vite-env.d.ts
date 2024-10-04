/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT: string;
  readonly VITE_GOOGLE_ANALYTICS_TRACKING_ID?: string;
  readonly VITE_API_UNREACHABLE_ERROR_MESSAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
