import pendidikanRaw from "./data_persebaran_pendidikan.json";
import umurRaw from "./data_umur.json";
import geoJsonRaw from "./surabaya_kecamatan.json";
import type { KecamatanFeatureCollection, PendidikanData, UmurData } from "../types";

export const pendidikanData = pendidikanRaw as unknown as PendidikanData;
export const umurData = umurRaw as unknown as UmurData;
export const surabayaGeoJson = geoJsonRaw as unknown as KecamatanFeatureCollection;
