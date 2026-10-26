import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AtelierHeader,
  AtelierPanel,
  StageToolbar,
  useAtelierBehavior,
} from "@/components/atelier/AtelierChrome";
import { useViewer } from "@/lib/viewer-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useAtelierBehavior();

  return (
    <div className="min-h-dvh bg-paper">
      <AtelierHeader />
      <div className="md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <main className="relative aspect-square bg-stage md:sticky md:top-14 md:aspect-auto md:h-[calc(100dvh-3.5rem)]">
          <WebGLBoundary>
            <StageSlot />
          </WebGLBoundary>
          <StageToolbar />
        </main>
        <AtelierPanel />
      </div>
    </div>
  );
}

function StageSlot() {
  const [Stage, setStage] = useState<ComponentType | null>(null);

  useEffect(() => {
    let live = true;
    import("@/components/viewer/ProductStage").then((mod) => {
      if (live) setStage(() => mod.ProductStage);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div
      className="absolute inset-0 touch-none"
      onDoubleClick={() => useViewer.getState().api?.reset()}
    >
      {Stage ? (
        <Stage />
      ) : (
        <div className="grid h-full place-items-center">
          <p className="font-serif text-3xl text-muted">LAUDET</p>
        </div>
      )}
    </div>
  );
}

class WebGLBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : "The studio couldn't start.";
    return { error: message };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div className="grid max-w-sm gap-2">
            <p className="font-serif text-2xl">Studio belum siap</p>
            <p className="text-sm break-words text-muted">{this.state.error}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
