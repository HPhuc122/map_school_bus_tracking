// backend/src/services/vehicleSimulation.js
import LichTrinh from "../models/LichTrinh.js";
import ViTriXe from "../models/ViTriXe.js";
import TuyenDuong from "../models/TuyenDuong.js";
import ChiTietTuyenDuong from "../models/ChiTietTuyenDuong.js";
import TramXe from "../models/TramXe.js";
import XeBuyt from "../models/XeBuyt.js";

// Lưu trạng thái di chuyển của từng xe
const vehicleStates = new Map();

/**
 * Tính khoảng cách giữa 2 điểm (công thức Haversine)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Di chuyển từ điểm A đến điểm B theo tốc độ
 */
function moveTowards(currentLat, currentLng, targetLat, targetLng, speed) {
    const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);

    // Nếu đã đến đích (gần hơn 10m = 0.01km)
    if (distance < 0.01) {
        return { lat: targetLat, lng: targetLng, arrived: true };
    }

    // Tính toán vị trí mới dựa trên tốc độ (km/h -> km/5s)
    const moveDistance = (speed / 3600) * 5; // Di chuyển trong 5 giây
    const ratio = Math.min(moveDistance / distance, 1);

    const newLat = currentLat + (targetLat - currentLat) * ratio;
    const newLng = currentLng + (targetLng - currentLng) * ratio;

    return { lat: newLat, lng: newLng, arrived: false };
}

/**
 * Khởi tạo trạng thái cho một xe từ dữ liệu thực
 */
async function initializeVehicleState(maLich, maXe, maTuyen) {
    try {
        // Lấy thông tin tuyến đường
        const tuyen = await TuyenDuong.findByPk(maTuyen);
        if (!tuyen) {
            console.log(`⚠️ Không tìm thấy tuyến ${maTuyen}`);
            return null;
        }

        // Lấy thông tin xe
        const xe = await XeBuyt.findByPk(maXe);
        if (!xe) {
            console.log(`⚠️ Không tìm thấy xe ${maXe}`);
            return null;
        }

        // Lấy danh sách trạm của tuyến (từ bảng ChiTietTuyenDuong)
        const chiTietList = await ChiTietTuyenDuong.findAll({
            where: { ma_tuyen: maTuyen },
            include: [{
                model: TramXe,
                attributes: ['ma_tram', 'ten_tram', 'vi_do', 'kinh_do']
            }],
            order: [['thu_tu', 'ASC']]
        });

        if (chiTietList.length === 0) {
            console.log(`⚠️ Tuyến ${maTuyen} (${tuyen.ten_tuyen}) không có trạm nào`);
            return null;
        }

        const route = chiTietList.map(ct => ({
            ma_tram: ct.TramXe.ma_tram,
            ten_tram: ct.TramXe.ten_tram,
            vi_do: parseFloat(ct.TramXe.vi_do),
            kinh_do: parseFloat(ct.TramXe.kinh_do)
        }));

        console.log(`✅ Xe ${xe.bien_so} - Tuyến: ${tuyen.ten_tuyen} - ${route.length} trạm`);

        // Kiểm tra xem xe đã có vị trí trước đó chưa
        const lastPosition = await ViTriXe.findOne({
            where: { ma_xe: maXe },
            order: [['thoi_gian', 'DESC']]
        });

        let startLat, startLng, currentStopIndex;

        if (lastPosition) {
            // Tiếp tục từ vị trí cuối cùng
            startLat = parseFloat(lastPosition.vi_do);
            startLng = parseFloat(lastPosition.kinh_do);

            // Tìm trạm gần nhất
            let minDistance = Infinity;
            currentStopIndex = 0;
            route.forEach((stop, idx) => {
                const dist = calculateDistance(startLat, startLng, stop.vi_do, stop.kinh_do);
                if (dist < minDistance) {
                    minDistance = dist;
                    currentStopIndex = idx;
                }
            });

            console.log(`  📍 Tiếp tục từ vị trí: ${startLat.toFixed(6)}, ${startLng.toFixed(6)}`);
        } else {
            // Bắt đầu từ trạm đầu tiên
            startLat = route[0].vi_do;
            startLng = route[0].kinh_do;
            currentStopIndex = 0;

            console.log(`  🚏 Bắt đầu tại: ${route[0].ten_tram}`);
        }

        return {
            ma_lich: maLich,
            ma_xe: maXe,
            bien_so: xe.bien_so,
            ma_tuyen: maTuyen,
            ten_tuyen: tuyen.ten_tuyen,
            route: route,
            currentStopIndex: currentStopIndex,
            currentLat: startLat,
            currentLng: startLng,
            speed: 30 + Math.random() * 20, // Tốc độ 30-50 km/h
            direction: 'forward' // 'forward' hoặc 'backward'
        };
    } catch (error) {
        console.error(`❌ Lỗi khởi tạo trạng thái xe ${maXe}:`, error);
        return null;
    }
}

/**
 * Cập nhật vị trí xe
 */
async function updateVehiclePosition(state) {
    const { route, currentStopIndex, currentLat, currentLng, speed, direction } = state;

    // Xác định trạm tiếp theo
    let nextStopIndex;
    if (direction === 'forward') {
        nextStopIndex = currentStopIndex + 1;
        if (nextStopIndex >= route.length) {
            // Đảo chiều - quay lại trạm trước đó
            state.direction = 'backward';
            nextStopIndex = route.length - 2;
            console.log(`🔄 Xe ${state.bien_so} đảo chiều tại ${route[route.length - 1].ten_tram}`);
        }
    } else {
        nextStopIndex = currentStopIndex - 1;
        if (nextStopIndex < 0) {
            // Đảo chiều - tiến về trạm tiếp theo
            state.direction = 'forward';
            nextStopIndex = 1;
            console.log(`🔄 Xe ${state.bien_so} đảo chiều tại ${route[0].ten_tram}`);
        }
    }

    const nextStop = route[nextStopIndex];

    // Di chuyển về phía trạm tiếp theo
    const newPosition = moveTowards(
        currentLat,
        currentLng,
        nextStop.vi_do,
        nextStop.kinh_do,
        speed
    );

    state.currentLat = newPosition.lat;
    state.currentLng = newPosition.lng;

    // Nếu đã đến trạm
    if (newPosition.arrived) {
        state.currentStopIndex = nextStopIndex;
        console.log(`🚏 Xe ${state.bien_so} đã đến ${nextStop.ten_tram}`);
    }

    // Lưu vị trí vào database
    try {
        await ViTriXe.create({
            ma_xe: state.ma_xe,
            vi_do: state.currentLat.toFixed(6), // Làm tròn 6 chữ số
            kinh_do: state.currentLng.toFixed(6),
            toc_do: speed.toFixed(2),
            thoi_gian: new Date()
        });
    } catch (error) {
        console.error(`❌ Lỗi lưu vị trí xe ${state.ma_xe}:`, error);
    }

    return state;
}

/**
 * Bắt đầu giả lập xe chạy với dữ liệu thực từ database
 */
export async function startVehicleSimulation(io) {
    console.log("\n🚀 ========================================");
    console.log("🚀 BẮT ĐẦU GIẢ LẬP XE CHẠY");
    console.log("🚀 ========================================\n");

    // Khởi tạo trạng thái cho tất cả xe đang chạy
    async function initializeAllVehicles() {
        try {
            // Lấy tất cả lịch trình đang chạy từ database
            const lichTrinhs = await LichTrinh.findAll({
                where: { trang_thai_lich: 'dang_chay' },
                attributes: ['ma_lich', 'ma_xe', 'ma_tuyen', 'ngay_chay', 'gio_bat_dau', 'gio_ket_thuc']
            });

            if (lichTrinhs.length === 0) {
                console.log("⚠️  Không có xe nào đang chạy (trang_thai_lich = 'dang_chay')");
                console.log("💡 Hãy cập nhật database để có ít nhất 1 lịch trình với trang_thai_lich = 'dang_chay'\n");
                return;
            }

            console.log(`📋 Tìm thấy ${lichTrinhs.length} lịch trình đang chạy:\n`);

            for (const lich of lichTrinhs) {
                if (!vehicleStates.has(lich.ma_xe)) {
                    const state = await initializeVehicleState(lich.ma_lich, lich.ma_xe, lich.ma_tuyen);
                    if (state) {
                        vehicleStates.set(lich.ma_xe, state);
                    }
                }
            }

            if (vehicleStates.size === 0) {
                console.log("\n⚠️  Không thể khởi tạo xe nào. Kiểm tra:");
                console.log("   - Bảng TuyenDuong có dữ liệu không?");
                console.log("   - Bảng TramXe có dữ liệu không?");
                console.log("   - Bảng ChiTietTuyenDuong có liên kết tuyến-trạm không?\n");
            } else {
                console.log(`\n✅ Đã khởi tạo ${vehicleStates.size} xe\n`);
            }
        } catch (error) {
            console.error("❌ Lỗi khởi tạo xe:", error);
        }
    }

    // Khởi tạo ban đầu
    await initializeAllVehicles();

    // Cập nhật vị trí mỗi 5 giây
    const updateInterval = setInterval(async () => {
        try {
            // Kiểm tra xe mới hoặc xe dừng
            const lichTrinhs = await LichTrinh.findAll({
                where: { trang_thai_lich: 'dang_chay' },
                attributes: ['ma_lich', 'ma_xe', 'ma_tuyen']
            });

            const currentRunningVehicles = new Set(lichTrinhs.map(l => l.ma_xe));

            // Thêm xe mới vào simulation
            for (const lich of lichTrinhs) {
                if (!vehicleStates.has(lich.ma_xe)) {
                    const state = await initializeVehicleState(lich.ma_lich, lich.ma_xe, lich.ma_tuyen);
                    if (state) {
                        vehicleStates.set(lich.ma_xe, state);
                        console.log(`\n➕ Thêm xe mới vào simulation: ${state.bien_so}\n`);
                    }
                }
            }

            // Xóa xe không còn chạy
            for (const maXe of vehicleStates.keys()) {
                if (!currentRunningVehicles.has(maXe)) {
                    const state = vehicleStates.get(maXe);
                    vehicleStates.delete(maXe);
                    console.log(`\n➖ Xóa xe khỏi simulation: ${state.bien_so}\n`);
                }
            }

            // Cập nhật vị trí tất cả xe
            if (vehicleStates.size > 0) {
                const updates = [];
                for (const [maXe, state] of vehicleStates.entries()) {
                    const newState = await updateVehiclePosition(state);
                    vehicleStates.set(maXe, newState);

                    updates.push({
                        ma_lich: newState.ma_lich,
                        ma_xe: maXe,
                        vi_do: newState.currentLat,
                        kinh_do: newState.currentLng,
                        toc_do: newState.speed
                    });
                }

                // Gửi cập nhật qua Socket.IO
                if (updates.length > 0 && io) {
                    io.emit("busLocationUpdate", updates);
                }

                console.log(`📡 [${new Date().toLocaleTimeString()}] Cập nhật ${updates.length} xe`);
            } else {
                console.log(`⚠️  [${new Date().toLocaleTimeString()}] Không có xe nào đang chạy`);
            }

        } catch (error) {
            console.error("❌ Lỗi cập nhật vị trí xe:", error);
        }
    }, 5000); // 5 giây

    console.log("✅ Simulation đang chạy...");
    console.log("⏱️  Cập nhật vị trí mỗi 5 giây\n");
    console.log("========================================\n");

    // Cleanup khi process kết thúc
    process.on('SIGINT', () => {
        console.log("\n🛑 Đang dừng simulation...");
        clearInterval(updateInterval);
        vehicleStates.clear();
        console.log("✅ Đã dừng simulation");
        process.exit(0);
    });
}

/**
 * Dừng simulation
 */
export function stopVehicleSimulation() {
    vehicleStates.clear();
    console.log("🛑 Đã dừng simulation");
}

/**
 * Lấy trạng thái hiện tại của xe (để debug)
 */
export function getVehicleStates() {
    return Array.from(vehicleStates.values()).map(state => ({
        bien_so: state.bien_so,
        ten_tuyen: state.ten_tuyen,
        vi_tri: { lat: state.currentLat, lng: state.currentLng },
        tram_hien_tai: state.route[state.currentStopIndex].ten_tram,
        huong: state.direction === 'forward' ? 'Tiến' : 'Lùi',
        toc_do: state.speed.toFixed(1) + ' km/h'
    }));
}