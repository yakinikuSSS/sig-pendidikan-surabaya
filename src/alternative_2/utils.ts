export const metricLabels: Record<string, string> = {
    beban: "Beban Kerja Guru",
    pemerataan: "Pemerataan Pendidikan",
    sd: "Jumlah SD / MI",
    smp: "Jumlah SMP / MTs",
    sma: "Jumlah SMA / SMK / MA",
    guruSd: "Jumlah Guru SD",
    guruSmp: "Jumlah Guru SMP",
    guruSma: "Jumlah Guru SMA",
    usiaSd: "Penduduk Usia SD (7–12 th)",
    usiaSmp: "Penduduk Usia SMP (13–15 th)",
    usiaSma: "Penduduk Usia SMA (16–18 th)",
};

export const calculateMetricValue = (nama: string, pendidikan: any, pendudukData: any, activeMetric: string) => {
    const data = pendidikan[nama];
    const penduduk = pendudukData[nama];
    if (!data && !penduduk) return 0;

    switch (activeMetric) {
        case "beban": return data?.["Beban Kerja"] || 0;
        case "pemerataan": return (data?.["Total Siswa"] || 0) / (penduduk?.Total || 1);
        case "sd": return data?.["Jumlah Sekolah SD"] || 0;
        case "smp": return data?.["Jumlah Sekolah SMP"] || 0;
        case "sma": return data?.["Jumlah Sekolah SMA"] || 0;
        case "guruSd": return data?.["Jumlah Guru SD"] || 0;
        case "guruSmp": return data?.["Jumlah Guru SMP"] || 0;
        case "guruSma": return data?.["Jumlah Guru SMA"] || 0;
        case "usiaSd": return penduduk?.SD || 0;
        case "usiaSmp": return penduduk?.SMP || 0;
        case "usiaSma": return penduduk?.SMA || 0;
        default: return 0;
    }
};

export const BLUE_PALETTE = {
    dark: "#1E3A8A",
    mid: "#2563EB",
    light: "#93C5FD",
    pale: "#DBEAFE",
    bg: "#EFF6FF",
    text: "#1E293B",
    muted: "#64748B",
    border: "#E2E8F0",
};

export const getColorByMetric = (value: number, activeMetric: string) => {
    const colors = {
        sangatTinggi: "#1E3A8A",
        tinggi: "#2563EB",
        sedang: "#93C5FD",
        rendah: "#EFF6FF"
    };

    switch (activeMetric) {
        case "sd":
            if (value > 45) return colors.sangatTinggi;
            if (value > 30) return colors.tinggi;
            if (value > 15) return colors.sedang;
            return colors.rendah;
        case "smp":
            if (value > 14) return colors.sangatTinggi;
            if (value > 10) return colors.tinggi;
            if (value > 6) return colors.sedang;
            return colors.rendah;
        case "sma":
            if (value > 8) return colors.sangatTinggi;
            if (value > 5) return colors.tinggi;
            if (value > 2) return colors.sedang;
            return colors.rendah;
        case "guruSd":
            if (value > 500) return colors.sangatTinggi;
            if (value > 300) return colors.tinggi;
            if (value > 150) return colors.sedang;
            return colors.rendah;
        case "guruSmp":
            if (value > 250) return colors.sangatTinggi;
            if (value > 180) return colors.tinggi;
            if (value > 120) return colors.sedang;
            return colors.rendah;
        case "guruSma":
            if (value > 400) return colors.sangatTinggi;
            if (value > 200) return colors.tinggi;
            if (value > 100) return colors.sedang;
            return colors.rendah;
        case "usiaSd":
            if (value > 15000) return colors.sangatTinggi;
            if (value > 10000) return colors.tinggi;
            if (value > 7000) return colors.sedang;
            return colors.rendah;
        case "usiaSmp":
            if (value > 7000) return colors.sangatTinggi;
            if (value > 5000) return colors.tinggi;
            if (value > 3000) return colors.sedang;
            return colors.rendah;
        case "usiaSma":
            if (value > 7000) return colors.sangatTinggi;
            if (value > 5000) return colors.tinggi;
            if (value > 3000) return colors.sedang;
            return colors.rendah;
        case "beban":
            if (value > 20) return colors.sangatTinggi;
            if (value > 17) return colors.tinggi;
            if (value > 12) return colors.sedang;
            return colors.rendah;
        case "pemerataan":
            if (value >= 1.1) return colors.sangatTinggi;
            if (value > 0.8) return colors.tinggi;
            if (value > 0.6) return colors.sedang;
            return colors.rendah;
        default:
            return colors.rendah;
    }
};
