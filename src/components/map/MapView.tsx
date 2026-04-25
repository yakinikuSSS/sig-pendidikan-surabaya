import { MapContainer, TileLayer } from "react-leaflet";

export default function MapView() {
    return (
        <MapContainer
            center={[-7.27544, 112.74463] as any}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap"
            />
        </MapContainer>
    );
}