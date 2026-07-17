"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

type RenderState =
  | { status: "loading" }
  | { status: "ready"; svg: string }
  | { status: "error" };

const THEME_VARIABLES = {
  primaryColor: "#C8102E",
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#8C1A2B",
  lineColor: "#8C1A2B",
  secondaryColor: "#8C1A2B",
  tertiaryColor: "#F5F5F5",
  background: "#F5F5F5",
  mainBkg: "#C8102E",
  nodeBorder: "#8C1A2B",
  titleColor: "#1A1A1A",
  edgeLabelBackground: "#F5F5F5",
  fontFamily: "Inter, system-ui, sans-serif",
} as const;

export function MermaidDiagram({ chart }: MermaidDiagramProps): React.ReactElement {
  const reactId = useId().replace(/:/g, "");
  const [state, setState] = useState<RenderState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram(): Promise<void> {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: { ...THEME_VARIABLES },
        });

        const { svg } = await mermaid.render(`mermaid-${reactId}`, chart.trim());
        if (!cancelled) {
          setState({ status: "ready", svg });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (state.status === "error") {
    return (
      <p
        className="my-6 rounded-lg border border-ink-muted/20 bg-surface-muted px-4 py-3 text-sm text-ink-muted"
        role="status"
      >
        No se pudo mostrar el diagrama.
      </p>
    );
  }

  if (state.status === "loading") {
    return (
      <p className="my-6 text-sm text-ink-muted" role="status">
        Cargando diagrama…
      </p>
    );
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-xl border border-ink-muted/10 bg-surface-muted p-4"
      dangerouslySetInnerHTML={{ __html: state.svg }}
    />
  );
}
