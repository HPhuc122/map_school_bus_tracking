import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L from "leaflet";
import { io, Socket } from "socket.io-client";

// TypeScript interfaces
interface Tram {
    ma_tram: number;
    ten_tram: string;
    vi_do: number;
    kinh_do: number;
}

interface Bus {
    ma_lich: number;
    ma_tuyen: number;
    ten_tuyen: string;
    danh_sach_tram: Tram[];
    vi_tri_hien_tai: {
        lat: number;
        lng: number;
    } | null;
    route_geometry?: LatLngTuple[]; // ✅ Thêm đường đi thực tế
}

interface MapViewsProps {
    role: "parent" | "driver" | "admin";
    userId: string;
}

interface AutoZoomProps {
    buses: Bus[];
    shouldAutoZoom: boolean;
}

// Import icon
const busIconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e74c3c'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E";

const busIcon = L.icon({
    iconUrl: busIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const tramIcon = L.icon({
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
});

// ✅ Component tự động zoom CHỈ LẦN ĐẦU TIÊN
function AutoZoom({ buses, shouldAutoZoom }: AutoZoomProps) {
    const map = useMap();
    const hasZoomedRef = useRef(false);

    useEffect(() => {
        if (buses.length > 0 && !hasZoomedRef.current && shouldAutoZoom) {
            const bounds: LatLngTuple[] = [];

            buses.forEach((bus: Bus) => {
                if (bus.danh_sach_tram && bus.danh_sach_tram.length > 0) {
                    bus.danh_sach_tram.forEach((tram: Tram) => {
                        bounds.push([tram.vi_do, tram.kinh_do]);
                    });
                }

                if (bus.vi_tri_hien_tai) {
                    bounds.push([bus.vi_tri_hien_tai.lat, bus.vi_tri_hien_tai.lng]);
                }
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
                hasZoomedRef.current = true;
            }
        }
    }, [buses.length, map, shouldAutoZoom]);

    return null;
}

const MapViews: React.FC<MapViewsProps> = ({ role, userId }) => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [autoZoomEnabled, setAutoZoomEnabled] = useState(true);

    // ✅ Hàm lấy đường đi thực tế từ OpenRouteService
    const fetchRealRoute = async (stops: Tram[]): Promise<LatLngTuple[]> => {
        if (!stops || stops.length < 2) return [];

        try {
            // Tạo coordinates string: lng,lat|lng,lat|...
            const coordinates = stops
                .map(stop => `${stop.kinh_do},${stop.vi_do}`)
                .join('|');

            // Gọi OpenRouteService API (miễn phí, không cần API key cho số request nhỏ)
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
            );

            if (!response.ok) {
                console.warn('Không thể lấy route, dùng đường thẳng');
                return stops.map(stop => [stop.vi_do, stop.kinh_do]);
            }

            const data = await response.json();

            if (data.routes && data.routes[0] && data.routes[0].geometry) {
                // Convert GeoJSON coordinates (lng, lat) to Leaflet format (lat, lng)
                return data.routes[0].geometry.coordinates.map((coord: number[]) => [
                    coord[1], // lat
                    coord[0]  // lng
                ] as LatLngTuple);
            }

            return stops.map(stop => [stop.vi_do, stop.kinh_do]);
        } catch (error) {
            console.error('Lỗi fetch route:', error);
            // Fallback về đường thẳng nếu lỗi
            return stops.map(stop => [stop.vi_do, stop.kinh_do]);
        }
    };

    // Fetch initial data
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                setLoading(true);
                setError(null);

                let url = "http://localhost:5000/api/buses";
                if (role === "parent") {
                    url = `http://localhost:5000/api/buses/parent/${userId}`;
                } else if (role === "driver") {
                    url = `http://localhost:5000/api/buses/driver/${userId}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("📊 Data xe:", data);

                // ✅ Lấy đường đi thực tế cho mỗi tuyến
                const busesWithRoutes = await Promise.all(
                    data.map(async (bus: Bus) => {
                        if (bus.danh_sach_tram && bus.danh_sach_tram.length > 1) {
                            const routeGeometry = await fetchRealRoute(bus.danh_sach_tram);
                            return { ...bus, route_geometry: routeGeometry };
                        }
                        return bus;
                    })
                );

                setBuses(busesWithRoutes);
            } catch (err) {
                console.error("❌ Lỗi fetch buses:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchBuses();
    }, [role, userId]);

    // Socket.io realtime updates
    useEffect(() => {
        const socket: Socket = io("http://localhost:5000");

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
        });

        socket.on("busLocationUpdate", (busUpdate: any) => {
            console.log("📡 Cập nhật vị trí:", busUpdate);

            setBuses((prevBuses: Bus[]) => {
                if (Array.isArray(busUpdate)) {
                    return prevBuses.map((bus: Bus) => {
                        const update = busUpdate.find((u: any) => u.ma_lich === bus.ma_lich);
                        if (update && update.vi_do && update.kinh_do) {
                            return {
                                ...bus,
                                vi_tri_hien_tai: {
                                    lat: parseFloat(update.vi_do),
                                    lng: parseFloat(update.kinh_do)
                                }
                            };
                        }
                        return bus;
                    });
                } else if (busUpdate.ma_lich) {
                    return prevBuses.map((bus: Bus) =>
                        bus.ma_lich === busUpdate.ma_lich && busUpdate.vi_do && busUpdate.kinh_do
                            ? {
                                ...bus,
                                vi_tri_hien_tai: {
                                    lat: parseFloat(busUpdate.vi_do),
                                    lng: parseFloat(busUpdate.kinh_do)
                                }
                            }
                            : bus
                    );
                }
                return prevBuses;
            });
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '600px',
                fontSize: '18px',
                color: '#555'
            }}>
                🔄 Đang tải bản đồ và tính toán tuyến đường...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                color: '#c33'
            }}>
                ❌ Lỗi: {error}
            </div>
        );
    }

    if (!buses || buses.length === 0) {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#ffc',
                border: '1px solid #fc6',
                borderRadius: '8px',
                color: '#963'
            }}>
                ⚠️ Không có xe nào đang chạy.
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                maxWidth: '250px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        🚍 Số xe: {buses.length}
                    </div>
                    <button
                        onClick={() => setAutoZoomEnabled(!autoZoomEnabled)}
                        style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: autoZoomEnabled ? '#3498db' : '#95a5a6',
                            color: 'white'
                        }}
                        title={autoZoomEnabled ? 'Tắt tự động zoom' : 'Bật tự động zoom'}
                    >
                        {autoZoomEnabled ? '🔒 Auto' : '🔓 Manual'}
                    </button>
                </div>
                {buses.map((bus: Bus, idx: number) => (
                    <div key={bus.ma_lich} style={{
                        fontSize: '13px',
                        padding: '4px 0',
                        borderBottom: idx < buses.length - 1 ? '1px solid #eee' : 'none'
                    }}>
                        <span style={{ color: '#3498db', fontWeight: '500' }}>
                            {bus.ten_tuyen}
                        </span>
                        <span style={{ color: '#7f8c8d', fontSize: '11px', marginLeft: '5px' }}>
                            ({bus.danh_sach_tram?.length || 0} trạm)
                            {bus.route_geometry && ` • ${bus.route_geometry.length} điểm`}
                        </span>
                    </div>
                ))}
            </div>

            <MapContainer
                center={[10.7769, 106.7009]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <AutoZoom buses={buses} shouldAutoZoom={autoZoomEnabled} />

                {buses.map((bus: Bus) => {
                    const routeColor = `hsl(${(bus.ma_lich * 137) % 360}, 70%, 50%)`;

                    return (
                        <React.Fragment key={bus.ma_lich}>
                            {/* ✅ Vẽ đường đi THỰC TẾ nếu có, nếu không thì dùng đường thẳng */}
                            {bus.route_geometry && bus.route_geometry.length > 0 ? (
                                <Polyline
                                    positions={bus.route_geometry}
                                    color={routeColor}
                                    weight={4}
                                    opacity={0.7}
                                />
                            ) : bus.danh_sach_tram && bus.danh_sach_tram.length > 0 ? (
                                <Polyline
                                    positions={bus.danh_sach_tram.map(t => [t.vi_do, t.kinh_do])}
                                    color={routeColor}
                                    weight={4}
                                    opacity={0.5}
                                    dashArray="5, 10"
                                />
                            ) : null}

                            {/* Đánh dấu các trạm */}
                            {bus.danh_sach_tram && bus.danh_sach_tram.map((tram: Tram, idx: number) => (
                                <Marker
                                    key={`${bus.ma_lich}-${tram.ma_tram}`}
                                    position={[parseFloat(tram.vi_do.toString()), parseFloat(tram.kinh_do.toString())]}
                                    icon={tramIcon}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '150px' }}>
                                            <strong>{tram.ten_tram}</strong>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                Trạm #{idx + 1} - {bus.ten_tuyen}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Đánh dấu vị trí xe hiện tại */}
                            {bus.vi_tri_hien_tai && (
                                <Marker
                                    position={[
                                        parseFloat(bus.vi_tri_hien_tai.lat.toString()),
                                        parseFloat(bus.vi_tri_hien_tai.lng.toString())
                                    ]}
                                    icon={busIcon}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '180px' }}>
                                            <strong>🚍 {bus.ten_tuyen}</strong>
                                            <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                                <div>📍 Vị trí: {bus.vi_tri_hien_tai.lat.toFixed(6)}, {bus.vi_tri_hien_tai.lng.toFixed(6)}</div>
                                                <div style={{ marginTop: '3px', color: '#27ae60', fontWeight: 'bold' }}>
                                                    ✅ Đang chạy
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapViews;