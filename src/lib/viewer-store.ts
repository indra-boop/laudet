import { create } from "zustand";
import { lightPresets, type PresetId } from "@/lib/catalog";

export type ViewerApi = {
  reset: () => void;
  zoomBy: (factor: number) => void;
};

type ViewerState = {
  autoRotate: boolean;
  key: number;
  fill: number;
  rim: number;
  temp: number;
  presetId: PresetId | null;
  api: ViewerApi | null;
  setAutoRotate: (v: boolean) => void;
  toggleAutoRotate: () => void;
  setLight: (partial: Partial<Pick<ViewerState, "key" | "fill" | "rim" | "temp">>) => void;
  applyPreset: (id: PresetId) => void;
  setApi: (api: ViewerApi | null) => void;
};

const soft = lightPresets[0];

export const zoomLabelRef: { current: HTMLElement | null } = { current: null };

export const useViewer = create<ViewerState>((set) => ({
  autoRotate: true,
  key: soft.key,
  fill: soft.fill,
  rim: soft.rim,
  temp: soft.temp,
  presetId: "soft",
  api: null,
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
  setLight: (partial) => set({ ...partial, presetId: null }),
  applyPreset: (id) => {
    const preset = lightPresets.find((p) => p.id === id);
    if (!preset) return;
    set({
      presetId: id,
      key: preset.key,
      fill: preset.fill,
      rim: preset.rim,
      temp: preset.temp,
    });
  },
  setApi: (api) => set({ api }),
}));
