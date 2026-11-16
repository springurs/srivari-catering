export const isLoopbackHost = (hostname: string) => ["localhost", "127.0.0.1", "[::1]"].includes(hostname);

export function withSandboxFlag(path: string, sandbox: boolean) {
  if (!sandbox) return path;
  const url = new URL(path, "http://local.invalid");
  url.searchParams.set("flag", "sandbox");
  return `${url.pathname}${url.search}${url.hash}`;
}
