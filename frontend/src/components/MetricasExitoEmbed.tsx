"use client";

import { useEffect, useState } from "react";

type HeightMessage = {
  type?: string;
  height?: number;
};

export function MetricasExitoEmbed(): React.ReactElement {
  const [height, setHeight] = useState(2400);

  useEffect(() => {
    function onMessage(event: MessageEvent<HeightMessage>): void {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "salto-dashboard-height") return;
      const next = event.data.height;
      if (typeof next === "number" && next > 400) {
        setHeight(Math.ceil(next));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      src="/metricas/dashboard-exito.html"
      title="Dashboard de métricas de éxito — Programa SALTO"
      className="block w-full border-0"
      style={{ height }}
    />
  );
}
