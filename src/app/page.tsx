"use client";

import * as React from "react";
import { LandingPage } from "@/components/dashboard/landing-page";
import { LoginView } from "@/components/dashboard/login-view";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RegisterView } from "@/components/dashboard/register-view";
import { AllNewsView } from "@/components/dashboard/all-news-view";
import type { SessionUser } from "@/lib/auth";

const AUTH_KEY = "kado-dukcapil-auth";

type View = "landing" | "login" | "register" | "all-news";

export default function Home() {
  const [view, setView] = React.useState<View>("landing");
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [bootstrapped, setBootstrapped] = React.useState(false);

  // restore auth from previous session
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionUser & { name?: string; role?: string };
        if (parsed?.name && parsed?.role) {
          setUser({
            name: parsed.name,
            role: parsed.role as SessionUser["role"],
            unit: parsed.unit,
            fotoProfil: (parsed as { fotoProfil?: string }).fotoProfil,
          });
        }
      }
    } catch {
      /* ignore */
    }
    setBootstrapped(true);
  }, []);

  function handleLoginSuccess(u: SessionUser) {
    setUser(u);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    } catch {
      /* ignore */
    }
  }

  function handleLogout() {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setView("landing");
  }

  // scroll to top whenever the public view changes
  React.useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [view]);

  if (!bootstrapped) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (user) {
    return (
      <DashboardLayout
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (view === "login") {
    return (
      <LoginView
        onSuccess={handleLoginSuccess}
        onBack={() => setView("landing")}
      />
    );
  }

  if (view === "register") {
    return <RegisterView onBack={() => setView("landing")} />;
  }

  if (view === "all-news") {
    return (
      <AllNewsView
        onBack={() => setView("landing")}
        onLogin={() => setView("login")}
        onRegister={() => setView("register")}
      />
    );
  }

  return (
    <LandingPage
      onLogin={() => setView("login")}
      onRegister={() => setView("register")}
      onAllNews={() => setView("all-news")}
    />
  );
}
