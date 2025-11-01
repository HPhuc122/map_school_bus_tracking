// BusDetailPanel component for displaying detailed bus information
import React from "react";
import { Bus as BusIcon, AlertTriangle } from "lucide-react";
import type { NormalizedBus } from "../../hooks/useBusTracking";

interface BusDetailPanelProps {
  selectedBusId: number | null;
  busLocations: NormalizedBus[]; // array of normalized buses
  getStatusColor: (status: string) => string;
}

export const BusDetailPanel: React.FC<BusDetailPanelProps> = ({
  selectedBusId,
  busLocations,
  getStatusColor,
}) => {
  if (!selectedBusId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Chọn xe để xem chi tiết</h3>
        </div>
        <div className="p-4">
          <div className="text-center py-8 text-gray-500">
            <BusIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Nhấp vào xe buýt để xem thông tin chi tiết</p>
          </div>
        </div>
      </div>
    );
  }

  const bus = busLocations.find((b) => b.id === selectedBusId);
  if (!bus) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Thông tin chi tiết</h3>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BusIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">{bus.busNumber}</h4>
            <p className="text-gray-600">{bus.route ?? "-"}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(
                bus.status
              )}`}
            >
              {bus.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tài xế:</span>
              <span className="font-medium text-gray-900">{bus.driver ?? "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tốc độ:</span>
              <span className="font-medium text-gray-900">
                {bus.speed != null ? `${bus.speed} km/h` : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Học sinh:</span>
              <span className="font-medium text-gray-900">{bus.students ?? 0}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Cập nhật:</span>
              <span className="font-medium text-gray-900">{bus.lastUpdate ?? "-"}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h5 className="font-medium text-gray-900 mb-2">Điểm đến tiếp theo</h5>
            <p className="text-gray-600 text-sm">{(bus as any).nextStop ?? "-"}</p>
            <p className="text-blue-600 text-sm font-medium">
              Dự kiến: {(bus as any).estimatedArrival ?? "-"}
            </p>
          </div>

          <div className="pt-4 border-t">
            <h5 className="font-medium text-gray-900 mb-3">Điểm dừng tuyến đường</h5>
            <div className="space-y-2">
              {(bus.routeStops ?? []).map((stop, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    index === (bus.currentStopIndex ?? 0)
                      ? "bg-blue-50 border border-blue-200"
                      : index < (bus.currentStopIndex ?? 0)
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      index === (bus.currentStopIndex ?? 0)
                        ? "bg-blue-500"
                        : index < (bus.currentStopIndex ?? 0)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        index === (bus.currentStopIndex ?? 0)
                          ? "text-blue-900"
                          : index < (bus.currentStopIndex ?? 0)
                          ? "text-green-900"
                          : "text-gray-600"
                      }`}
                    >
                      {stop}
                    </p>
                    {index === (bus.currentStopIndex ?? 0) && (
                      <p className="text-xs text-blue-600">Điểm hiện tại</p>
                    )}
                    {index < (bus.currentStopIndex ?? 0) && (
                      <p className="text-xs text-green-600">Đã qua</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bus.speed === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Xe đang dừng</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Có thể đang đón hoặc trả khách</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetailPanel;