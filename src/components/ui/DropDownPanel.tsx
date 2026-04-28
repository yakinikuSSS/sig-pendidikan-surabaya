import { useState } from "react";

interface Props {
    setActiveMetric: (value: string) => void;
}

export default function DropDownPanel({ setActiveMetric }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const listItemStyle: React.CSSProperties = {
        padding: "10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "left"
    };


    return (
        <>
            <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 250,
                minHeight: 120,
                background: "white",
                padding: 12,
                zIndex: 1000,
                borderRadius: 8,
                overflow: "visible"
            }}>
            <h4>Pilih data yang ingin ditampilkan:</h4>

                <div style={{ fontSize: 14, lineHeight: "20px" }}>
                    <button onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            paddingLeft: "10px",
                            background: "white",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            fontWeight: "bold",
                            display: "flex",
                            textAlign: "left",
                            justifyContent: "space-between",
                            color: "black"
                        }}>
                        Menu Data {isOpen ? "▲" : "▼"}
                    </button>
                    {isOpen && (
                        <ul style={{
                            listStyle: "none",
                            padding: "0",
                            margin: "5px 0 0 0",
                            position: "relative",
                            zIndex: 2000,
                            background: "white",
                            border: "1px solid #ccc"
                        }}>
                            <li style={listItemStyle} onClick={() => setActiveMetric("beban")}>Beban Kerja Guru</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("pemerataan")}>Pemerataan Pendidikan</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("usiaSd")}>Jumlah Penduduk Usia 7-12 tahun</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("usiaSmp")}>Jumlah Penduduk Usia 13-15 tahun</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("usiaSma")}>Jumlah Penduduk Usia 16-18 tahun</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("sd")}>Jumlah SD</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("smp")}>Jumlah SMP</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("sma")}>Jumlah SMA</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("guruSd")}>Jumlah Guru SD</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("guruSmp")}>Jumlah Guru SMP</li>
                            <li style={listItemStyle} onClick={() => setActiveMetric("guruSma")}>Jumlah Guru SMA</li>
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}