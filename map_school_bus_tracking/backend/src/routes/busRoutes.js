import express from 'express';
import LichTrinh from '../models/LichTrinh.js';
import TuyenDuong from '../models/TuyenDuong.js'; // ✅ TuyenDuong chứ không phải TuyenXe
import TramXe from '../models/TramXe.js';
import ChiTietTuyenDuong from '../models/ChiTietTuyenDuong.js'; // ✅ Cần import để lấy trạm theo tuyến
import ViTriXe from '../models/ViTriXe.js';

const router = express.Router();

// GET /api/buses - Lấy tất cả xe đang chạy (cho admin)
router.get('/', async (req, res) => {
    try {
        const lichTrinhs = await LichTrinh.findAll({
            where: { trang_thai_lich: 'dang_chay' },
            attributes: ['ma_lich', 'ma_xe', 'ma_tuyen'],
        });

        const buses = await Promise.all(
            lichTrinhs.map(async (lich) => {
                // Lấy thông tin tuyến
                const tuyen = await TuyenDuong.findByPk(lich.ma_tuyen);

                // Lấy danh sách trạm qua bảng ChiTietTuyenDuong
                const chiTietList = await ChiTietTuyenDuong.findAll({
                    where: { ma_tuyen: lich.ma_tuyen },
                    include: [{
                        model: TramXe,
                        attributes: ['ma_tram', 'ten_tram', 'vi_do', 'kinh_do']
                    }],
                    order: [['thu_tu', 'ASC']]
                });

                // Lấy vị trí hiện tại
                const viTri = await ViTriXe.findOne({
                    where: { ma_xe: lich.ma_xe },
                    order: [['thoi_gian', 'DESC']],
                    limit: 1
                });

                return {
                    ma_lich: lich.ma_lich,
                    ma_tuyen: lich.ma_tuyen,
                    ten_tuyen: tuyen?.ten_tuyen || 'Unknown',
                    danh_sach_tram: chiTietList.map(ct => ({
                        ma_tram: ct.TramXe.ma_tram,
                        ten_tram: ct.TramXe.ten_tram,
                        vi_do: parseFloat(ct.TramXe.vi_do),
                        kinh_do: parseFloat(ct.TramXe.kinh_do)
                    })),
                    vi_tri_hien_tai: viTri ? {
                        lat: parseFloat(viTri.vi_do),
                        lng: parseFloat(viTri.kinh_do)
                    } : null
                };
            })
        );

        res.json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/parent/:userId - Lấy xe theo phụ huynh
router.get('/parent/:userId', async (req, res) => {
    try {
        // TODO: Implement logic lấy xe theo học sinh của phụ huynh
        res.json([]);
    } catch (error) {
        console.error('Error fetching parent buses:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/driver/:userId - Lấy xe theo tài xế
router.get('/driver/:userId', async (req, res) => {
    try {
        const lichTrinhs = await LichTrinh.findAll({
            where: {
                trang_thai_lich: 'dang_chay',
                ma_tai_xe: req.params.userId
            },
            attributes: ['ma_lich', 'ma_xe', 'ma_tuyen'],
        });

        const buses = await Promise.all(
            lichTrinhs.map(async (lich) => {
                const tuyen = await TuyenDuong.findByPk(lich.ma_tuyen);

                const chiTietList = await ChiTietTuyenDuong.findAll({
                    where: { ma_tuyen: lich.ma_tuyen },
                    include: [{
                        model: TramXe,
                        attributes: ['ma_tram', 'ten_tram', 'vi_do', 'kinh_do']
                    }],
                    order: [['thu_tu', 'ASC']]
                });

                const viTri = await ViTriXe.findOne({
                    where: { ma_xe: lich.ma_xe },
                    order: [['thoi_gian', 'DESC']],
                    limit: 1
                });

                return {
                    ma_lich: lich.ma_lich,
                    ma_tuyen: lich.ma_tuyen,
                    ten_tuyen: tuyen?.ten_tuyen || 'Unknown',
                    danh_sach_tram: chiTietList.map(ct => ({
                        ma_tram: ct.TramXe.ma_tram,
                        ten_tram: ct.TramXe.ten_tram,
                        vi_do: parseFloat(ct.TramXe.vi_do),
                        kinh_do: parseFloat(ct.TramXe.kinh_do)
                    })),
                    vi_tri_hien_tai: viTri ? {
                        lat: parseFloat(viTri.vi_do),
                        lng: parseFloat(viTri.kinh_do)
                    } : null
                };
            })
        );

        res.json(buses);
    } catch (error) {
        console.error('Error fetching driver buses:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;