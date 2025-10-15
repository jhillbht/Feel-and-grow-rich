import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Session, InsertSession } from "@shared/schema";

interface SessionContextType {
  currentSession: Session | null;
  isLoading: boolean;
  updateSessionData: (data: Partial<Session>) => Promise<void>;
  createNewSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    const stored = localStorage.getItem("currentSessionId");
    // Return null if localStorage has invalid values
    if (!stored || stored === "undefined" || stored === "null") {
      localStorage.removeItem("currentSessionId");
      return null;
    }
    return stored;
  });
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: currentSession, isLoading } = useQuery<Session>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId && sessionId !== "undefined",
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const emptySession: InsertSession = {};
      const res = await apiRequest("POST", "/api/sessions", emptySession);
      return await res.json();
    },
    onSuccess: (newSession: Session) => {
      setSessionId(newSession.id);
      localStorage.setItem("currentSessionId", newSession.id);
      queryClient.setQueryData(["/api/sessions", newSession.id], newSession);
      setIsCreatingSession(false);
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Session> }) => {
      const res = await apiRequest("PATCH", `/api/sessions/${id}`, updates);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", variables.id] });
    },
  });

  useEffect(() => {
    if (!sessionId && !isCreatingSession && !createSessionMutation.isPending) {
      setIsCreatingSession(true);
      createSessionMutation.mutate();
    }
  }, [sessionId, isCreatingSession, createSessionMutation]);

  const updateSessionData = async (data: Partial<Session>) => {
    if (!sessionId) {
      throw new Error("No active session");
    }
    await updateSessionMutation.mutateAsync({ id: sessionId, updates: data });
  };

  const createNewSession = async () => {
    await createSessionMutation.mutateAsync();
  };

  return (
    <SessionContext.Provider
      value={{
        currentSession: currentSession || null,
        isLoading,
        updateSessionData,
        createNewSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
