"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { isLoopbackHost } from "../data/local-checkout-mode";

const subscribe = () => () => {};
const localSnapshot = () => isLoopbackHost(window.location.hostname);
const serverSnapshot = () => false;

export function useLocalSandboxFlag() {
  const params = useSearchParams();
  const local = useSyncExternalStore(subscribe, localSnapshot, serverSnapshot);
  return local && params.get("flag") === "sandbox";
}
