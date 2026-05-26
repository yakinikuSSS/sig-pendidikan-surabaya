import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { FlyTarget } from "../types";

interface MapControllerProps {
  flyTarget: FlyTarget | null;
}

export function MapController({ flyTarget }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!flyTarget) return;

    map.flyToBounds(flyTarget.bounds, {
      animate: true,
      duration: 0.8,
      maxZoom: 13,
      padding: [42, 42],
    });
  }, [flyTarget, map]);

  return null;
}
