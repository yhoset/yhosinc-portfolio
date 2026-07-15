"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export type PowerUpEvent = {
  id: number;
  amount: number;
  message: string;
};

type PowerLevelContextValue = {
  level: number;
  events: PowerUpEvent[];
  /** Sube el nivel y dispara un "power up" narrativo — ver branding-y-filosofia.md §7.
   * Nunca gatea contenido: solo lo llaman hitos que ya se desbloquearon por su cuenta. */
  powerUp: (amount: number, message: string) => void;
  dismissEvent: (id: number) => void;
};

const PowerLevelContext = createContext<PowerLevelContextValue | null>(null);

export function PowerLevelProvider({
  initialLevel,
  children,
}: {
  initialLevel: number;
  children: React.ReactNode;
}) {
  const [level, setLevel] = useState(initialLevel);
  const [events, setEvents] = useState<PowerUpEvent[]>([]);
  const nextId = useRef(0);

  const dismissEvent = useCallback((id: number) => {
    setEvents((evts) => evts.filter((e) => e.id !== id));
  }, []);

  const powerUp = useCallback(
    (amount: number, message: string) => {
      setLevel((l) => l + amount);
      const id = nextId.current++;
      setEvents((evts) => [...evts, { id, amount, message }]);
      setTimeout(() => dismissEvent(id), 4000);
    },
    [dismissEvent]
  );

  return (
    <PowerLevelContext.Provider value={{ level, events, powerUp, dismissEvent }}>
      {children}
    </PowerLevelContext.Provider>
  );
}

export function usePowerLevel() {
  const ctx = useContext(PowerLevelContext);
  if (!ctx) {
    throw new Error("usePowerLevel must be used within a PowerLevelProvider");
  }
  return ctx;
}
