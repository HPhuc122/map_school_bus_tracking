import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';

// Icon xe buýt
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61206.png',
    iconSize: [40, 40],
});

const MapView = () => {
    const [busPosition, setBusPosition] = useState<[number, number]>([21.0285, 105.8542]);
    const route: [number, number][] = [
        [21.0278, 105.8342], // Điểm đón
        [21.0285, 105.8542], // Giữa đường
        [21.0300, 105.8700], // Điểm trả
    ];

    // Giả lập cập nhật vị trí xe mỗi 5 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setBusPosition(([lat, lng]) => [lat + 0.0002, lng + 0.0001]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer
            center={busPosition}
            zoom={14}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
            {/* Lớp nền OSM */}
            <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Vẽ tuyến đường */}
            <Polyline positions={route} color="blue" weight={4} />

            {/* Marker xe buýt */}
            <Marker position={busPosition} icon={busIcon}>
                <Popup>Xe buýt đang ở đây 🚌</Popup>
            </Marker>

            {/* Điểm đón */}
            <Marker position={route[0]}>
                <Popup>Điểm đón</Popup>
            </Marker>

            {/* Điểm trả */}
            <Marker position={route[route.length - 1]}>
                <Popup>Điểm trả</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;
