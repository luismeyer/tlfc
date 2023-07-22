/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TLFC_API_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
