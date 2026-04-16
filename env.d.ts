namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_SEATS_WORKSPACE_KEY: string;
    NEXT_PUBLIC_SECRET_BASE_32: string;
    NEXT_PUBLIC_BASE_PATH: string;
    NEXT_PUBLIC_ASSET_PREFIX: string;
    DOCKER_IMAGE_VERSION?: string;
  }
}
