interface Props {
    activeMetric: string;
    setActiveMetric: (value: string) => void;
}

const metrics = [
    { key: "beban",     label: "Beban Kerja Guru" },
    { key: "pemerataan", label: "Pemerataan Pendidikan" },
    { key: "usiaSd",    label: "Usia SD (7–12 th)" },
    { key: "usiaSmp",   label: "Usia SMP (13–15 th)" },
    { key: "usiaSma",   label: "Usia SMA (16–18 th)" },
    { key: "sd",        label: "Jumlah SD / MI" },
    { key: "smp",       label: "Jumlah SMP / MTs" },
    { key: "sma",       label: "Jumlah SMA / SMK / MA" },
    { key: "guruSd",    label: "Jumlah Guru SD / MI" },
    { key: "guruSmp",   label: "Jumlah Guru SMP / MTs" },
    { key: "guruSma",   label: "Jumlah Guru SMA / SMK / MA" },
];

export default function SidebarPanel({ activeMetric, setActiveMetric }: Props) {
    return (
        <div style={{
            height: "100%",
            background: "white",
            border: "0.5px solid #C0DD97",
            borderRadius: 10,
            padding: "14px 10px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "auto",
        }}>
            <p style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#3B6D11",
                margin: "0 0 8px 4px",
                letterSpacing: ".6px",
                textTransform: "uppercase",
            }}>
                Pilih Data
            </p>

            {metrics.map(m => {
                const isActive = activeMetric === m.key;
                return (
                    <button
                        key={m.key}
                        onClick={() => setActiveMetric(m.key)}
                        style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 10px",
                            borderRadius: 7,
                            border: isActive ? "none" : "none",
                            background: isActive ? "#3B6D11" : "transparent",
                            color: isActive ? "#EAF3DE" : "#3B6D11",
                            fontSize: 12,
                            fontWeight: isActive ? 500 : 400,
                            cursor: "pointer",
                            transition: "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#EAF3DE";
                        }}
                        onMouseLeave={e => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }}
                    >
                        {m.label}
                    </button>
                );
            })}
        </div>
    );
}