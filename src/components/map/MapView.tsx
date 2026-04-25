import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import InfoPanel from "../ui/InfoPanel";
import DropDownPanel from "../ui/DropDownPanel";

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [pendidikan, setPendidikan] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        fetch("data/surabaya_kecamatan.geojson")
            .then((res) => res.json())
            .then((data: FeatureCollection) => {
                setGeoData(data);
            });
    }, []);

    useEffect(() => {
        fetch("/data/data_persebaran_pendidikan.json")
            .then(res => res.json())
            .then(data => setPendidikan(data));
    }, []);

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            mouseover: (e: any) => {
                e.target.setStyle({
                    weight: 3,
                    color: "#000",
                    fillOpacity: 0.8
                });
            },
            mouseout: (e: any) => {
                const nama = feature.properties.name;

                if (!(selected && selected.nama === nama)) {
                    e.target.setStyle({
                        weight: 2,
                        color: "white",
                        fillOpacity: 0.5
                    });
                }
            },
            click: () => {
                const nama = feature.properties.name;

                if (selected && selected.nama === nama) {
                    setSelected(null);
                    return;
                }

                const data = pendidikan[nama];

                setSelected({
                    nama,
                    data
                });
            },

        });
    };

    const style = (feature: any) => {
        const nama = feature.properties.name;

        if (selected && selected.nama === nama) {
            return {
                fillColor: "#036cff",
                weight: 3,
                color: "#000",
                fillOpacity: 0.9
            };
        }

        return {
            fillColor: "#3388ff",
            weight: 2,
            color: "white",
            fillOpacity: 0.5
        };
    };


    return (
        <>
            <DropDownPanel selected={selected} />
            <InfoPanel selected={selected} />
            <MapContainer center={[-7.27544, 112.74463] as any} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
                {geoData && <GeoJSON key={selected?.nama || "default"} data={geoData} style={style} onEachFeature={onEachFeature} />}
            </MapContainer>
        </>
    );
}