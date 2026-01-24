"use client";

import * as React from "react";

import type { Session } from "@/server/better-auth/client";

type AppSidebarSessionContextValue = {
  session: Session | null;
};

const AppSidebarSessionContext = React.createContext<
  AppSidebarSessionContextValue | undefined
>(undefined);

export function AppSidebarSessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <AppSidebarSessionContext.Provider value={{ session }}>
      {children}
    </AppSidebarSessionContext.Provider>
  );
}

export function useAppSidebarSession() {
  const context = React.useContext(AppSidebarSessionContext);
  if (!context) {
    throw new Error(
      "useAppSidebarSession must be used within AppSidebarSessionProvider",
    );
  }
  return context;
}
