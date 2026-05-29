"use client";

import { useCallback, useEffect, useState } from "react";

import { credentialedFetch } from "@/lib/fetch";
import type { SessionResponse, SessionUser } from "@/types";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/session", credentialedFetch);
      const data = (await response.json()) as SessionResponse;
      setUser(data.authenticated && data.user ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { user, isLoading, refetch };
}
