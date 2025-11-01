import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import busService from "../services/api/busService";
import type { Bus as ApiBus, BusLocation as ApiBusLocation } from "../types";

/**
 * Normalized bus shape exposed to UI components.
 * UI components expect fields like id, busNumber, status, driver, route, students, speed, lastUpdate, routeStops, currentStopIndex, vi_tri_hien_tai.
 */
export type NormalizedBus = {
  id: number; // alias for ma_xe
  ma_xe: number;
  busNumber: string; // alias for bien_so
  bien_so: string;
  suc_chua?: number;
  rawStatus?: string; // original trang_thai
  status: string; // human readable or normalized status
  ma_tai_xe?: number | null;
  driver?: string | null;
  students?: number;
  route?: string | null;
  routeStops?: string[];
  currentStopIndex?: number;
  speed?: number | null;
  lastUpdate?: string | null;
  vi_tri_hien_tai?: ApiBusLocation | null;
  // keep original API object in case needed
  raw?: ApiBus;
};

type UseBusTrackingOptions = {
  initialAutoRefresh?: boolean;
  refreshIntervalMs?: number;
  initialFilterStatus?: string; // 'all' | 'san_sang' | 'dang_su_dung' | 'bao_duong'
};

function normalizeStatus(trang_thai?: string) {
  if (!trang_thai) return "unknown";
  // Map DB statuses to human/readable ones used by UI; adjust as needed
  switch (trang_thai) {
    case "san_sang":
      return "Sẵn sàng";
    case "dang_su_dung":
      return "Đang di chuyển";
    case "bao_duong":
      return "Bảo dưỡng";
    default:
      return trang_thai;
  }
}

function mapApiBusToNormalized(b: ApiBus): NormalizedBus {
  const id = Number(b.ma_xe);
  const busNumber = b.bien_so ?? String(b.ma_xe);
  const driver = b.tai_xe?.ho_ten ?? null;
  const vi_tri = b.vi_tri_hien_tai ?? null;

  const speed =
    vi_tri && vi_tri.toc_do !== undefined ? (vi_tri.toc_do ?? null) : null;

  const lastUpdate = (vi_tri && (vi_tri.thoi_gian ?? null)) ?? null;

  return {
    id,
    ma_xe: id,
    busNumber,
    bien_so: busNumber,
    suc_chua: b.suc_chua,
    rawStatus: b.trang_thai ?? "",
    status: normalizeStatus(b.trang_thai),
    ma_tai_xe: b.ma_tai_xe ?? null,
    driver,
    students: 0, // default; backend may include student count elsewhere
    route: undefined,
    routeStops: [],
    currentStopIndex: 0,
    speed,
    lastUpdate,
    vi_tri_hien_tai: vi_tri ?? null,
    raw: b,
  };
}

export default function useBusTracking(options: UseBusTrackingOptions = {}) {
  const {
    initialAutoRefresh = true,
    refreshIntervalMs = 10000,
    initialFilterStatus = "all",
  } = options;

  const [buses, setBuses] = useState<NormalizedBus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [filterStatus, setFilterStatus] = useState<string>(initialFilterStatus);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<NormalizedBus[] | null>(null);
  const [selectedBus, setSelectedBus] = useState<NormalizedBus | null>(null);

  const [autoRefresh, setAutoRefresh] = useState<boolean>(initialAutoRefresh);
  const [refreshInterval, setRefreshInterval] = useState<number>(refreshIntervalMs);

  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Fetch raw buses from API and normalize
  const fetchBuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await busService.getBuses();
      if (!mountedRef.current) return;
      const normalized = Array.isArray(data) ? data.map(mapApiBusToNormalized) : [];
      setBuses(normalized);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err);
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchBuses();
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchBuses]);

  // Auto-refresh
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        fetchBuses();
      }, refreshInterval);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, fetchBuses]);

  // Derived: filtered by status (compare normalized status or rawStatus)
  const filteredBuses = useMemo(() => {
    if (!buses) return [];
    if (!filterStatus || filterStatus === "all") return buses;
    const key = filterStatus.toString().toLowerCase();
    return buses.filter((b) => {
      // allow matching raw database status keys too (san_sang, dang_su_dung, bao_duong)
      return (
        (b.rawStatus && b.rawStatus.toLowerCase() === key) ||
        (b.status && b.status.toLowerCase().includes(key))
      );
    });
  }, [buses, filterStatus]);

  // Search on filteredBuses
  useEffect(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) {
      setSearchResults(null);
      return;
    }
    const results = filteredBuses.filter((b) => {
      const candidates = [
        String(b.id),
        b.busNumber ?? "",
        b.bien_so ?? "",
        b.driver ?? "",
        b.route ?? "",
      ].join(" ").toLowerCase();
      return candidates.includes(q);
    });
    setSearchResults(results);
  }, [searchQuery, filteredBuses]);

  // manual refresh helper
  const manualRefresh = useCallback(async () => {
    await fetchBuses();
  }, [fetchBuses]);

  // select by id (ma_xe)
  const selectBusById = useCallback((ma_xe: number | null) => {
    if (ma_xe === null) {
      setSelectedBus(null);
      return;
    }
    const found = buses.find((b) => b.ma_xe === ma_xe) ?? null;
    setSelectedBus(found);
  }, [buses]);

  // getMarkers helper: extract lat/lng markers from vi_tri_hien_tai for map rendering
  const getMarkers = useCallback(() => {
    return buses
      .map((b) => {
        const v = b.vi_tri_hien_tai;
        if (!v) return null;
        const lat = v.vi_do ?? (v as any).latitude ?? null;
        const lng = v.kinh_do ?? (v as any).longitude ?? null;
        if (lat == null || lng == null) return null;
        return {
          id: b.id,
          ma_xe: b.ma_xe,
          lat: Number(lat),
          lng: Number(lng),
          label: b.busNumber,
          speed: v.toc_do ?? null,
          updatedAt: v.thoi_gian ?? null,
          bus: b,
        };
      })
      .filter(Boolean) as Array<{
      id: number;
      ma_xe: number;
      lat: number;
      lng: number;
      label: string;
      speed: number | null;
      updatedAt: string | null;
      bus: NormalizedBus;
    }>;
  }, [buses]);

  // handle incoming realtime location update from socket.
  // Accepts multiple shapes:
  // - { busId, latitude, longitude, speed, timestamp }
  // - { ma_xe, vi_tri: { vi_do, kinh_do, toc_do, thoi_gian } }
  // - partial BusTrackingData
  const handleLocationUpdate = useCallback((payload: any) => {
    const ma_xe = payload.ma_xe ?? payload.busId ?? (payload.id || null);
    if (ma_xe == null) return;

    // Try to build vi_tri object
    const vi_tri =
      payload.vi_tri ??
      payload.viTri ??
      (payload.vi_do || payload.latitude || payload.kinh_do || payload.longitude || payload.toc_do || payload.speed
        ? {
            ma_vitri: payload.ma_vitri ?? -1,
            ma_xe: ma_xe,
            vi_do: payload.vi_do ?? payload.latitude ?? null,
            kinh_do: payload.kinh_do ?? payload.longitude ?? null,
            toc_do: payload.toc_do ?? payload.speed ?? null,
            thoi_gian: payload.thoi_gian ?? payload.timestamp ?? new Date().toISOString(),
          }
        : null);

    setBuses((prev) =>
      prev.map((b) => {
        if (b.ma_xe !== Number(ma_xe)) return b;
        const updated: NormalizedBus = { ...b };
        if (vi_tri) {
          updated.vi_tri_hien_tai = vi_tri as ApiBusLocation;
          updated.speed = (vi_tri as any).toc_do ?? (vi_tri as any).speed ?? updated.speed;
          updated.lastUpdate = (vi_tri as any).thoi_gian ?? (vi_tri as any).timestamp ?? new Date().toISOString();
        } else {
          // if payload has direct latitude/longitude fields without vi_tri
          const lat = payload.latitude ?? payload.vi_do;
          const lng = payload.longitude ?? payload.kinh_do;
          if (lat != null && lng != null) {
            updated.vi_tri_hien_tai = {
              ma_vitri: -1,
              ma_xe: updated.ma_xe,
              vi_do: Number(lat),
              kinh_do: Number(lng),
              toc_do: payload.speed ?? null,
              thoi_gian: payload.timestamp ?? new Date().toISOString(),
            } as ApiBusLocation;
            updated.speed = payload.speed ?? updated.speed;
            updated.lastUpdate = payload.timestamp ?? new Date().toISOString();
          }
        }
        // update raw reference if server sends busInfo
        if (payload.busInfo) {
          updated.raw = { ...updated.raw, ...payload.busInfo } as ApiBus;
        }
        return updated;
      })
    );

    // update selected bus too if matches
    setSelectedBus((prev) => {
      if (!prev || prev.ma_xe !== Number(ma_xe)) return prev;
      const updated = { ...prev };
      if (vi_tri) {
        updated.vi_tri_hien_tai = vi_tri as ApiBusLocation;
        updated.speed = (vi_tri as any).toc_do ?? (vi_tri as any).speed ?? updated.speed;
        updated.lastUpdate = (vi_tri as any).thoi_gian ?? (vi_tri as any).timestamp ?? new Date().toISOString();
      } else {
        const lat = payload.latitude ?? payload.vi_do;
        const lng = payload.longitude ?? payload.kinh_do;
        if (lat != null && lng != null) {
          updated.vi_tri_hien_tai = {
            ma_vitri: -1,
            ma_xe: updated.ma_xe,
            vi_do: Number(lat),
            kinh_do: Number(lng),
            toc_do: payload.speed ?? null,
            thoi_gian: payload.timestamp ?? new Date().toISOString(),
          } as ApiBusLocation;
          updated.speed = payload.speed ?? updated.speed;
          updated.lastUpdate = payload.timestamp ?? new Date().toISOString();
        }
      }
      if (payload.busInfo) {
        updated.raw = { ...updated.raw, ...payload.busInfo } as ApiBus;
      }
      return updated;
    });
  }, []);

  // Exposed arrays: busLocations kept for compatibility with components using that name
  const busLocations = buses;

  return {
    // data
    buses,
    busLocations,
    filteredBuses,
    searchResults: searchResults ?? [],

    // selection
    selectedBus,
    setSelectedBus,
    selectBusById,

    // filter & search
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    setSearchResults,

    // auto refresh
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,

    // actions
    fetchBuses,
    manualRefresh,
    getMarkers,
    handleLocationUpdate,

    // status
    loading,
    error,
  } as const;
}