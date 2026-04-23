import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapSurabaya() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const geoJsonRef = useRef(null);

    const [info, setInfo] = useState("Arahkan kursor ke peta");

    const [dataPendidikan, setDataPendidikan] = useState({});

    const normalizeNama = (nama) => {
        return (nama || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    };

    const getNamaKecamatan = (feature) => {
        const props = feature.properties || {};
        const nama =
            props.WADMKC ||
            props.NAMOBJ ||
            props.KECAMATAN ||
            props.name ||
            "";
        return normalizeNama(nama);
    };

    const getDataKecamatan = (feature) => {
        const namaKec = getNamaKecamatan(feature);

        const dataKey = Object.keys(dataPendidikan).find(
            (key) => normalizeNama(key) === namaKec
        );

        return dataKey
            ? { key: dataKey, data: dataPendidikan[dataKey] }
            : null;
    };

    const getColor = (d) => {
        return d > 19
            ? "#d73027"
            : d > 18
            ? "#fc8d59"
            : d > 17
            ? "#fee08b"
            : d > 16
            ? "#91cf60"
            : "#1a9850";
    };

    const style = (feature) => {
        const info = getDataKecamatan(feature);
        const bebanKerja = info
            ? parseFloat(info.data["Beban Kerja"]) || 0
            : 0;

        return {
            fillColor: getColor(bebanKerja),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        };
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const l = e.target;

                l.setStyle({
                    weight: 4,
                    color: "#333",
                    dashArray: "",
                    fillOpacity: 0.9,
                });

                const infoData = getDataKecamatan(feature);

                if (infoData) {
                    const data = infoData.data;
                    setInfo(`
                        Kec. ${infoData.key}
                        Sekolah: ${data["Total Sekolah"]}
                        Siswa: ${data["Total Siswa"]}
                        Guru: ${data["Total Guru"]}
                        Beban Kerja: ${data["Beban Kerja"]}
                    `);
                } else {
                    setInfo("Data tidak tersedia");
                }
            },

            mouseout: (e) => {
                if (geoJsonRef.current) {
                    geoJsonRef.current.resetStyle(e.target);
                }
                setInfo("Arahkan kursor ke peta");
            },
        });
    };

    useEffect(() => {
        if (mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current).setView(
            [-7.27544, 112.74463],
            12
        );

        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
                attribution: "&copy; OpenStreetMap",
            }
        ).addTo(mapInstance.current);

        Promise.all([
            fetch("/data/data_pendidikan.json").then((res) => res.json()),
            fetch("/data/surabaya_kecamatan.json").then((res) =>
                res.json()
            ),
        ]).then(([pendidikan, geoData]) => {
            setDataPendidikan(pendidikan);

            geoJsonRef.current = L.geoJson(geoData, {
                style: (feature) => style(feature),
                onEachFeature: onEachFeature,
            }).addTo(mapInstance.current);
        });
    }, []);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 1000,
                    background: "white",
                    padding: 15,
                    borderRadius: 8,
                }}
            >
                <h3>Info Wilayah</h3>
                <div>{info}</div>
            </div>

            <div
                ref={mapRef}
                style={{ height: "100vh", width: "100%" }}
            />
        </>
    );
}