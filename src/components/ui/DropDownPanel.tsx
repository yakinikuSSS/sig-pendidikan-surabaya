import { useState } from "react";

interface Props {
    selected: any;
}

export default function DropDownPanel({ selected }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const listItemStyle: React.CSSProperties = {
        padding: "10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "left"
    };

    if (!selected) return null;

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
            }}>
                <h4>Pilih data yang ingin ditampilkan:</h4>

                <div style={{ fontSize: 14, lineHeight: "20px" }}>
                    <button onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "white",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            fontWeight: "bold",
                            display: "felx",
                            textAlign: "left",
                            justifyContent: "space-between",
                            color: "black"
                        }}
                    >
                        Menu Data {isOpen ? "▲" : "▼"}
                    </button>
                    {isOpen && (
                        <ul style={{
                            listStyle: "none",
                            padding: "0",
                            margin: "5px 0 0 0"
                        }}>
                            <li style={listItemStyle}>SD Negeri</li>
                            <li style={listItemStyle}>SD Swasta</li>
                            <li style={listItemStyle}>SMP Negeri</li>
                            <li style={listItemStyle}>SMP Swasta</li>
                            <li style={listItemStyle}>SMA Negeri</li>
                            <li style={listItemStyle}>SMA Swasta</li>
                            <li style={listItemStyle}>SMK Negeri</li>
                            <li style={listItemStyle}>SMK Swasta</li>
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}