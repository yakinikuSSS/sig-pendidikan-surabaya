import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import InfoPanel from "../ui/InfoPanel";
import DropDownPanel from "../ui/DropDownPanel";
import { ZoomControl } from "react-leaflet";

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [pendidikan, setPendidikan] = useState<any>({});
    const [pendudukData, setPendudukData] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);
    const [activeMetric, setActiveMetric] = useState<string>("beban");

    useEffect(() => {
        fetch("/data/surabaya_kecamatan.geojson")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Gagal memuat GeoJSON: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((data: FeatureCollection) => {
                setGeoData(data);
            });
    }, []);

    useEffect(() => {
        fetch("/data/data_persebaran_pendidikan.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Gagal memuat data pendidikan: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => setPendidikan(data));
    }, []);

    useEffect(() => {
        fetch("/data/data_umur.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Gagal memuat data umur: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => setPendudukData(data));
    }, []);

    useEffect(() => {
        fetch("/data/data_penduduk.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Gagal memuat data penduduk: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => setPenduduk(data));
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
        const value = getValue(nama);

        if (selected && selected.nama === nama) {
            return {
                fillColor: "#b4e0ff",
                weight: 3,
                color: "#000",
                fillOpacity: 0.9
            };
        }

        return {
            fillColor: getColorByMetric(value),
            weight: selected?.nama === nama ? 3 : 2,
            color: selected?.nama === nama ? "#000" : "white",
            fillOpacity: 0.7
        };
    };

    const getValue = (nama: string) => {
        const data = pendidikan[nama];
        const penduduk = pendudukData[nama];

        switch (activeMetric) {
            case "beban":
                return data["Beban Kerja"];

            case "pemerataan":
                const siswa = data["Total Siswa"];
                const totalPenduduk = penduduk?.Total || 1;
                return siswa / totalPenduduk;

            case "sd":
                return data["Jumlah Sekolah SD"];

            case "smp":
                return data["Jumlah Sekolah SMP"];

            case "sma":
                return data["Jumlah Sekolah SMA"];

            case "pemerataanSd":
                return data["Jumlah Siswa SD"] / (pendudukData[nama]?.SD || 1);

            case "pemerataanSmp":
                return data["Jumlah Siswa SMP"] / (pendudukData[nama]?.SMP || 1);

            case "pemerataanSma":
                return data["Jumlah Siswa SMA"] / (pendudukData[nama]?.SMA || 1);

            case "guruSd":
                return data["Jumlah Guru SD"];

            case "guruSmp":
                return data["Jumlah Guru SMP"];

            case "guruSma":
                return data["Jumlah Guru SMA"];

            case "usiaSd":
                return penduduk?.SD || 0;

            case "usiaSmp":
                return penduduk?.SMP || 0;

            case "usiaSma":
                return penduduk?.SMA || 0;

            default:
                return 0;
        }
    };

const getColorByMetric = (value: number) => {
    switch (activeMetric) {
        case "sd":
            if (value > 45) return "#08306b";
            if (value > 30) return "#2171b5";
            if (value > 15) return "#6baed6";
            return "#c6dbef";

            case "sd":
                if (value > 30) return "#08306b";
                if (value > 20) return "#2171b5";
                if (value > 10) return "#6baed6";
                return "#c6dbef";

            case "smp":
                if (value > 14) return "#08306b";
                if (value > 10) return "#2171b5";
                if (value > 6) return "#6baed6";
                return "#c6dbef";

            case "sma":
                if (value > 8) return "#08306b";
                if (value > 5) return "#2171b5";
                if (value > 2) return "#6baed6";
                return "#c6dbef";

        case "sma":
            if (value > 15) return "#08306b";
            if (value > 10) return "#2171b5";
            if (value > 5) return "#6baed6";
            return "#c6dbef";

            case "guruSmp":
                if (value > 250) return "#08306b";
                if (value > 180) return "#2171b5";
                if (value > 120) return "#6baed6";
                return "#c6dbef";

        case "guruSma":
            if (value > 400) return "#08306b";
            if (value > 200) return "#2171b5";
            if (value > 100) return "#6baed6";
            return "#c6dbef";

        case "usiaSd":
            if (value > 15000) return "#08306b";
            if (value > 10000) return "#2171b5";
            if (value > 7000) return "#6baed6";
            return "#c6dbef";

        case "usiaSmp":
            if (value > 7000) return "#08306b";
            if (value > 5000) return "#2171b5";
            if (value > 3000) return "#6baed6";
            return "#c6dbef";

        case "usiaSma":
            if (value > 7000) return "#08306b";
            if (value > 5000) return "#2171b5";
            if (value > 3000) return "#6baed6";
            return "#c6dbef";

        case "beban":
            if (value > 20) return "#08306b";
            if (value > 17) return "#2171b5";
            if (value > 12) return "#6baed6";
            return "#c6dbef";

        case "pemerataan":
            if (value >= 1.1) return "#08306b";
            if (value > 0.8) return "#2171b5";
            if (value > 0.6) return "#6baed6";
            return "#c6dbef";

        default:
            return "#c6dbef";
    }
};

    return (
        <>
            <DropDownPanel setActiveMetric={setActiveMetric} />
            <InfoPanel selected={selected} />
            <MapContainer center={[-7.27544, 112.74463] as any} zoom={12} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
                {geoData && <GeoJSON key={activeMetric + (selected?.nama || "")} data={geoData} style={style} onEachFeature={onEachFeature} />}
                <ZoomControl position="bottomright" />
            </MapContainer>
        </>
    );
}