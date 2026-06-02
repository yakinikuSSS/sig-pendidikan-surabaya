const sourceCards = [
  {
    title: "data_persebaran_pendidikan.json",
    body: "Berisi jumlah sekolah, siswa, guru, total tiap kecamatan, dan beban kerja guru yang sudah tersedia dari dataset.",
    fields: [
      "Jumlah Sekolah SD/SMP/SMA",
      "Jumlah Siswa SD/SMP/SMA",
      "Jumlah Guru SD/SMP/SMA",
      "Total Sekolah, Total Siswa, Total Guru",
      "Beban Kerja",
    ],
  },
  {
    title: "data_umur.json",
    body: "Berisi estimasi penduduk usia sekolah per kecamatan untuk jenjang SD, SMP, SMA, dan total usia sekolah.",
    fields: ["SD", "SMP", "SMA", "Total"],
  },
  {
    title: "surabaya_kecamatan.geojson",
    body: "Berisi polygon batas kecamatan Surabaya. Nama kecamatan pada properties dicocokkan ke data JSON dengan normalisasi nama.",
    fields: ["properties.name", "geometry polygon / multipolygon"],
  },
];

const formulaCards = [
  {
    title: "Ketersediaan SD",
    formula: "Jumlah Sekolah SD / Penduduk Usia SD x 1.000",
    example: "Mengukur ketersediaan unit sekolah SD untuk setiap 1.000 anak usia SD.",
  },
  {
    title: "Ketersediaan SMP",
    formula: "Jumlah Sekolah SMP / Penduduk Usia SMP x 1.000",
    example: "Mengukur ketersediaan unit sekolah SMP untuk setiap 1.000 anak usia SMP.",
  },
  {
    title: "Ketersediaan SMA",
    formula: "Jumlah Sekolah SMA / Penduduk Usia SMA x 1.000",
    example: "Mengukur ketersediaan unit sekolah SMA untuk setiap 1.000 anak usia SMA.",
  },
  {
    title: "Pemerataan (Total)",
    formula: "Total Sekolah / Total Penduduk Usia Sekolah x 1.000",
    example: "Indikator utama pemerataan infrastruktur pendidikan per 1.000 anak usia sekolah.",
  },
  {
    title: "Beban Kerja Guru",
    formula: "Total Siswa / Total Guru",
    example: "Dataset sudah menyediakan nilai ini. Nilai tinggi berarti rata-rata siswa per guru lebih besar.",
  },
  {
    title: "Rasio Sekolah",
    formula: "Total Sekolah / (Total Penduduk Usia Sekolah / 1.000)",
    example: "Identik dengan rumus pemerataan, mengukur unit sekolah per 1.000 anak.",
  },
];

const interpretationRows = [
  {
    metric: "Pemerataan (Ketersediaan)",
    good: "Lebih tinggi",
    meaning: "Jumlah sekolah relatif lebih banyak terhadap populasi usia sekolah.",
    map: "Hijau muda ke hijau tua.",
  },
  {
    metric: "Beban Kerja Guru",
    good: "Lebih rendah",
    meaning: "Rata-rata siswa per guru lebih ringan.",
    map: "Kuning muda ke merah tua. Merah berarti beban lebih berat.",
  },
  {
    metric: "Rasio Sekolah",
    good: "Lebih tinggi",
    meaning: "Unit sekolah relatif lebih banyak terhadap populasi usia sekolah.",
    map: "Toska muda ke toska tua.",
  },
];

export function MethodologyPage() {
  return (
    <main className="alt5-method-page">
      <section className="alt5-method-hero">
        <div>
          <span>Metodologi</span>
          <h2>Cara data pendidikan Surabaya dihitung, digabungkan, dan dibaca di aplikasi.</h2>
        </div>
      </section>

      <section className="alt5-method-grid">
        {sourceCards.map((card) => (
          <article className="alt5-method-card" key={card.title}>
            <span>Sumber Data</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <ul>
              {card.fields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="alt5-method-section">
        <header>
          <span>Rumus Metrik</span>
          <h3>Metric yang dipakai di peta, popup, analitik, dan tabel data</h3>
        </header>
        <div className="alt5-formula-grid">
          {formulaCards.map((card) => (
            <article className="alt5-formula-card" key={card.title}>
              <h4>{card.title}</h4>
              <code>{card.formula}</code>
              <p>{card.example}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="alt5-method-section">
        <header>
          <span>Interpretasi</span>
          <h3>Cara membaca warna dan ranking</h3>
        </header>
        <div className="alt5-method-table-wrap">
          <table className="alt5-method-table">
            <thead>
              <tr>
                <th>Metrik</th>
                <th>Arah Nilai Baik</th>
                <th>Makna</th>
                <th>Skala Peta</th>
              </tr>
            </thead>
            <tbody>
              {interpretationRows.map((row) => (
                <tr key={row.metric}>
                  <th scope="row">{row.metric}</th>
                  <td>{row.good}</td>
                  <td>{row.meaning}</td>
                  <td>{row.map}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="alt5-method-section">
        <header>
          <span>Normalisasi Nama</span>
          <h3>Pencocokan GeoJSON ke JSON data</h3>
        </header>
        <p className="alt5-method-copy">
          Nama kecamatan dari GeoJSON dan JSON dicocokkan dengan fungsi normalisasi: spasi dirapikan,
          huruf dibandingkan case-insensitive, lalu beberapa variasi nama seperti DUKUH PAKIS atau
          Gunung Anyar diarahkan ke nama canonical di dataset. Ini membuat polygon peta tetap cocok
          dengan baris data meskipun format penulisan nama berbeda.
        </p>
      </section>
    </main>
  );
}
