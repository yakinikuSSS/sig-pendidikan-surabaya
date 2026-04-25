import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    
    useEffect(() => {
        fetch("data/surabaya_kecamatan.geojson")
            .then((res) => res.json())
            .then((data: FeatureCollection) => {
                setGeoData(data);
            });
    }, []);

    return (
        <MapContainer center={[-7.27544, 112.74463] as any} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap"/>
            {geoData && <GeoJSON data={geoData} />}

        </MapContainer>
    );
}