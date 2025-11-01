-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 14, 2025 lúc 02:25 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ssb1`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiettuyenduong`
--

CREATE TABLE `chitiettuyenduong` (
  `ma_ct` int(11) NOT NULL,
  `ma_tuyen` int(11) NOT NULL,
  `ma_tram` int(11) NOT NULL,
  `thu_tu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiettuyenduong`
--

INSERT INTO `chitiettuyenduong` (`ma_ct`, `ma_tuyen`, `ma_tram`, `thu_tu`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 1, 3, 3),
(4, 1, 4, 4),
(5, 1, 5, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocsinh`
--

CREATE TABLE `hocsinh` (
  `ma_hs` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `lop` varchar(20) DEFAULT NULL,
  `ma_phu_huynh` int(11) NOT NULL,
  `ma_diem_don` int(11) NOT NULL,
  `ma_diem_tra` int(11) NOT NULL,
  `trang_thai` enum('hoat_dong','nghi') DEFAULT 'hoat_dong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hocsinh`
--

INSERT INTO `hocsinh` (`ma_hs`, `ho_ten`, `lop`, `ma_phu_huynh`, `ma_diem_don`, `ma_diem_tra`, `trang_thai`) VALUES
(1, 'Nguyễn Minh An', '1A', 1, 1, 2, 'hoat_dong'),
(2, 'Trần Lan Hương', '2B', 2, 3, 4, 'hoat_dong'),
(3, 'Lê Quốc Bảo', '3A', 3, 5, 6, 'hoat_dong'),
(4, 'Phạm Thu Trang', '1C', 4, 7, 8, 'hoat_dong'),
(5, 'Hoàng Gia Huy', '4A', 5, 9, 10, 'hoat_dong'),
(6, 'Vũ Mai Anh', '2A', 6, 11, 12, 'hoat_dong'),
(7, 'Đỗ Tuấn Kiệt', '5B', 7, 13, 14, 'hoat_dong'),
(8, 'Bùi Ngọc Hà', '1B', 8, 15, 16, 'hoat_dong'),
(9, 'Nguyễn Văn Nam', '3B', 9, 17, 18, 'hoat_dong'),
(10, 'Trần Thị My', '4C', 10, 19, 20, 'hoat_dong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `ma_lich` int(11) NOT NULL,
  `ma_tuyen` int(11) DEFAULT NULL,
  `ma_xe` int(11) DEFAULT NULL,
  `ma_tai_xe` int(11) DEFAULT NULL,
  `ngay_chay` date NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time DEFAULT NULL,
  `trang_thai_lich` enum('cho_chay','dang_chay','hoan_thanh','huy') DEFAULT 'cho_chay'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichtrinh`
--

INSERT INTO `lichtrinh` (`ma_lich`, `ma_tuyen`, `ma_xe`, `ma_tai_xe`, `ngay_chay`, `gio_bat_dau`, `gio_ket_thuc`, `trang_thai_lich`) VALUES
(1, 1, 1, 1, '2025-10-01', '06:30:00', '07:15:00', 'cho_chay'),
(2, 2, 2, 2, '2025-10-01', '07:00:00', '07:40:00', 'cho_chay'),
(3, 3, 3, 3, '2025-10-01', '06:45:00', '07:30:00', 'cho_chay'),
(4, 4, 4, 4, '2025-10-01', '07:15:00', '08:00:00', 'cho_chay'),
(5, 5, 5, 5, '2025-10-01', '06:50:00', '07:35:00', 'cho_chay'),
(6, 6, 6, 6, '2025-10-01', '07:20:00', '08:10:00', 'cho_chay'),
(7, 7, 7, 7, '2025-10-01', '06:40:00', '07:25:00', 'cho_chay'),
(8, 8, 8, 8, '2025-10-01', '07:10:00', '07:55:00', 'cho_chay'),
(9, 9, 9, 9, '2025-10-01', '06:55:00', '07:40:00', 'cho_chay'),
(10, 10, 10, 10, '2025-10-01', '07:30:00', '08:20:00', 'cho_chay');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhatkydontra`
--

CREATE TABLE `nhatkydontra` (
  `ma_nhat_ky` int(11) NOT NULL,
  `ma_hs` int(11) DEFAULT NULL,
  `ma_lich` int(11) DEFAULT NULL,
  `ca_don_tra` enum('sang','chieu') DEFAULT 'sang',
  `trang_thai_don` enum('cho','da_don','vang') DEFAULT 'cho',
  `trang_thai_tra` enum('cho','da_tra','vang') DEFAULT 'cho',
  `thoi_gian` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhatkydontra`
--

INSERT INTO `nhatkydontra` (`ma_nhat_ky`, `ma_hs`, `ma_lich`, `ca_don_tra`, `trang_thai_don`, `trang_thai_tra`, `thoi_gian`) VALUES
(1, 1, 1, 'sang', 'da_don', 'da_tra', '2025-09-30 23:40:00'),
(2, 2, 2, 'sang', 'da_don', 'da_tra', '2025-10-01 00:10:00'),
(3, 3, 3, 'sang', 'da_don', 'da_tra', '2025-09-30 23:55:00'),
(4, 4, 4, 'sang', 'da_don', 'da_tra', '2025-10-01 00:20:00'),
(5, 5, 5, 'sang', 'da_don', 'da_tra', '2025-09-30 23:50:00'),
(6, 6, 6, 'chieu', 'da_don', 'da_tra', '2025-10-01 09:35:00'),
(7, 7, 7, 'chieu', 'da_don', 'da_tra', '2025-10-01 09:25:00'),
(8, 8, 8, 'chieu', 'da_don', 'da_tra', '2025-10-01 09:55:00'),
(9, 9, 9, 'chieu', 'da_don', 'da_tra', '2025-10-01 09:30:00'),
(10, 10, 10, 'chieu', 'da_don', 'da_tra', '2025-10-01 10:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phancong`
--

CREATE TABLE `phancong` (
  `ma_pc` int(11) NOT NULL,
  `ma_hs` int(11) DEFAULT NULL,
  `ma_lich` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phancong`
--

INSERT INTO `phancong` (`ma_pc`, `ma_hs`, `ma_lich`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `ma_phu_huynh` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dia_chi` varchar(200) DEFAULT NULL,
  `tai_khoan` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phuhuynh`
--

INSERT INTO `phuhuynh` (`ma_phu_huynh`, `ho_ten`, `so_dien_thoai`, `email`, `dia_chi`, `tai_khoan`, `mat_khau`) VALUES
(1, 'Nguyễn Văn A', '0912345678', 'a@gmail.com', 'Hà Nội', 'NguyenVanA123', '123'),
(2, 'Trần Thị B', '0987654321', 'b@gmail.com', 'HCM', 'TranThiB123', '123'),
(3, 'Lê Văn C', '0901234567', 'c@gmail.com', 'Đà Nẵng', 'LeVanC', '123'),
(4, 'Phạm Thị D', '0978123456', 'd@gmail.com', 'Hải Phòng', 'PhamThiD123', '123'),
(5, 'Hoàng Văn E', '0934567890', 'e@gmail.com', 'Cần Thơ', 'HoangVanE', '123'),
(6, 'Vũ Thị F', '0923456789', 'f@gmail.com', 'Quảng Ninh', 'VuThiF123', '123'),
(7, 'Đỗ Văn G', '0945678901', 'g@gmail.com', 'Nam Định', 'DoVanG123', '123'),
(8, 'Bùi Thị H', '0909876543', 'h@gmail.com', 'Nghệ An', 'BuiThiH123', '123'),
(9, 'Nguyễn Văn I', '0965432109', 'i@gmail.com', 'Thanh Hóa', 'NguyenVanI123', '123'),
(10, 'Trần Thị K', '0956781234', 'k@gmail.com', 'Huế', 'TranThiK', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanlytaixe`
--

CREATE TABLE `quanlytaixe` (
  `ma_ql` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tai_khoan` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `dia_chi` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quanlytaixe`
--

INSERT INTO `quanlytaixe` (`ma_ql`, `ho_ten`, `so_dien_thoai`, `email`, `tai_khoan`, `mat_khau`, `dia_chi`) VALUES
(1, 'Nguyễn Quản Lý 1', '0902000001', 'ql1@gmail.com', 'ql1', '123456', 'Hà Nội'),
(2, 'Trần Quản Lý 2', '0902000002', 'ql2@gmail.com', 'ql2', '123456', 'HCM'),
(3, 'Lê Quản Lý 3', '0902000003', 'ql3@gmail.com', 'ql3', '123456', 'Đà Nẵng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taixe`
--

CREATE TABLE `taixe` (
  `ma_tai_xe` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `so_gplx` varchar(50) NOT NULL,
  `trang_thai` enum('san_sang','dang_chay','nghi') DEFAULT 'san_sang',
  `tai_khoan` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ma_ql` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taixe`
--

INSERT INTO `taixe` (`ma_tai_xe`, `ho_ten`, `so_dien_thoai`, `so_gplx`, `trang_thai`, `tai_khoan`, `mat_khau`, `ma_ql`) VALUES
(1, 'Phạm Văn Tài 1', '0903000001', 'GPLX0001', 'san_sang', 'tx1', '123456', 1),
(2, 'Lê Văn Tài 2', '0903000002', 'GPLX0002', 'san_sang', 'tx2', '123456', 1),
(3, 'Nguyễn Văn Tài 3', '0903000003', 'GPLX0003', 'nghi', 'tx3', '123456', 2),
(4, 'Trần Văn Tài 4', '0903000004', 'GPLX0004', 'dang_chay', 'tx4', '123456', 2),
(5, 'Đỗ Văn Tài 5', '0903000005', 'GPLX0005', 'san_sang', 'tx5', '123456', 3),
(6, 'Vũ Văn Tài 6', '0903000006', 'GPLX0006', 'dang_chay', 'tx6', '123456', 3),
(7, 'Ngô Văn Tài 7', '0903000007', 'GPLX0007', 'nghi', 'tx7', '123456', 1),
(8, 'Phan Văn Tài 8', '0903000008', 'GPLX0008', 'san_sang', 'tx8', '123456', 2),
(9, 'Bùi Văn Tài 9', '0903000009', 'GPLX0009', 'san_sang', 'tx9', '123456', 3),
(10, 'Trịnh Văn Tài 10', '0903000010', 'GPLX0010', 'dang_chay', 'tx10', '123456', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `ma_tb` int(11) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `thoi_gian` timestamp NOT NULL DEFAULT current_timestamp(),
  `ma_phu_huynh` int(11) DEFAULT NULL,
  `ma_tai_xe` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thongbao`
--

INSERT INTO `thongbao` (`ma_tb`, `noi_dung`, `thoi_gian`, `ma_phu_huynh`, `ma_tai_xe`) VALUES
(1, 'Xe đến muộn 10 phút', '2025-09-30 23:35:00', 1, 1),
(2, 'Học sinh nghỉ học', '2025-10-01 00:00:00', 2, NULL),
(3, 'Thay đổi lộ trình tuyến 3', '2025-10-01 00:10:00', 3, 3),
(4, 'Xe bị hỏng giữa đường', '2025-10-01 00:20:00', 4, 4),
(5, 'Tài xế đổi ca', '2025-10-01 00:30:00', 5, 5),
(6, 'Xe sẽ đến sớm 5 phút', '2025-10-01 00:40:00', 6, 6),
(7, 'Học sinh quên đồ trên xe', '2025-10-01 00:50:00', 7, 7),
(8, 'Thông báo họp phụ huynh', '2025-10-01 01:00:00', 8, NULL),
(9, 'Xe đổi biển số', '2025-10-01 01:10:00', 9, 9),
(10, 'Nghỉ chạy tuyến số 5', '2025-10-01 01:20:00', 10, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tramxe`
--

CREATE TABLE `tramxe` (
  `ma_tram` int(11) NOT NULL,
  `ten_tram` varchar(100) NOT NULL,
  `dia_chi` varchar(200) DEFAULT NULL,
  `loai_tram` enum('don','tra','ca_hai') DEFAULT 'ca_hai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tramxe`
--

INSERT INTO `tramxe` (`ma_tram`, `ten_tram`, `dia_chi`, `loai_tram`) VALUES
(1, 'Trạm 1', 'Quận 1', 'ca_hai'),
(2, 'Trạm 2', 'Quận 2', 'don'),
(3, 'Trạm 3', 'Quận 3', 'tra'),
(4, 'Trạm 4', 'Quận 4', 'ca_hai'),
(5, 'Trạm 5', 'Quận 5', 'ca_hai'),
(6, 'Trạm 6', 'Quận 6', 'don'),
(7, 'Trạm 7', 'Quận 7', 'tra'),
(8, 'Trạm 8', 'Quận 8', 'ca_hai'),
(9, 'Trạm 9', 'Quận 9', 'don'),
(10, 'Trạm 10', 'Quận 10', 'tra'),
(11, 'Trạm 11', 'Quận 11', 'ca_hai'),
(12, 'Trạm 12', 'Quận 12', 'ca_hai'),
(13, 'Trạm 13', 'Tân Bình', 'don'),
(14, 'Trạm 14', 'Tân Phú', 'tra'),
(15, 'Trạm 15', 'Bình Tân', 'don'),
(16, 'Trạm 16', 'Bình Thạnh', 'tra'),
(17, 'Trạm 17', 'Gò Vấp', 'ca_hai'),
(18, 'Trạm 18', 'Thủ Đức', 'don'),
(19, 'Trạm 19', 'Phú Nhuận', 'tra'),
(20, 'Trạm 20', 'Nhà Bè', 'ca_hai');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `ma_tuyen` int(11) NOT NULL,
  `ten_tuyen` varchar(100) NOT NULL,
  `diem_bat_dau` varchar(200) DEFAULT NULL,
  `diem_ket_thuc` varchar(200) DEFAULT NULL,
  `do_dai_km` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong`
--

INSERT INTO `tuyenduong` (`ma_tuyen`, `ten_tuyen`, `diem_bat_dau`, `diem_ket_thuc`, `do_dai_km`) VALUES
(1, 'Tuyến 1', 'Hà Đông', 'Cầu Giấy', 12.50),
(2, 'Tuyến 2', 'Cầu Giấy', 'Mỹ Đình', 10.00),
(3, 'Tuyến 3', 'Gia Lâm', 'Long Biên', 8.50),
(4, 'Tuyến 4', 'Thanh Xuân', 'Hai Bà Trưng', 9.70),
(5, 'Tuyến 5', 'Ba Đình', 'Nam Từ Liêm', 11.20),
(6, 'Tuyến 6', 'Đông Anh', 'Sóc Sơn', 14.30),
(7, 'Tuyến 7', 'Tây Hồ', 'Hoàn Kiếm', 7.80),
(8, 'Tuyến 8', 'Long Biên', 'Hà Đông', 13.00),
(9, 'Tuyến 9', 'Cầu Giấy', 'Bắc Từ Liêm', 9.50),
(10, 'Tuyến 10', 'Hoàng Mai', 'Thanh Trì', 10.80);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vitrixe`
--

CREATE TABLE `vitrixe` (
  `ma_vitri` int(11) NOT NULL,
  `ma_xe` int(11) DEFAULT NULL,
  `vi_do` decimal(10,6) DEFAULT NULL,
  `kinh_do` decimal(10,6) DEFAULT NULL,
  `toc_do` decimal(5,2) DEFAULT NULL,
  `thoi_gian` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vitrixe`
--

INSERT INTO `vitrixe` (`ma_vitri`, `ma_xe`, `vi_do`, `kinh_do`, `toc_do`, `thoi_gian`) VALUES
(1, 1, 21.028500, 105.854200, 35.50, '2025-09-30 23:40:00'),
(2, 2, 21.030000, 105.850000, 40.00, '2025-10-01 00:00:00'),
(3, 3, 21.035000, 105.845000, 38.50, '2025-09-30 23:50:00'),
(4, 4, 21.040000, 105.840000, 30.00, '2025-10-01 00:20:00'),
(5, 5, 21.045000, 105.835000, 42.50, '2025-09-30 23:55:00'),
(6, 6, 21.050000, 105.830000, 33.50, '2025-10-01 00:25:00'),
(7, 7, 21.055000, 105.825000, 36.00, '2025-09-30 23:45:00'),
(8, 8, 21.060000, 105.820000, 39.50, '2025-10-01 00:10:00'),
(9, 9, 21.065000, 105.815000, 37.00, '2025-10-01 00:05:00'),
(10, 10, 21.070000, 105.810000, 41.00, '2025-10-01 00:30:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xebuyt`
--

CREATE TABLE `xebuyt` (
  `ma_xe` int(11) NOT NULL,
  `bien_so` varchar(20) NOT NULL,
  `suc_chua` int(11) NOT NULL,
  `trang_thai` enum('san_sang','dang_su_dung','bao_duong') DEFAULT 'san_sang',
  `ma_tai_xe` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xebuyt`
--

INSERT INTO `xebuyt` (`ma_xe`, `bien_so`, `suc_chua`, `trang_thai`, `ma_tai_xe`) VALUES
(1, '30A-10001', 40, 'san_sang', 1),
(2, '30A-10002', 45, 'dang_su_dung', 2),
(3, '30A-10003', 40, 'bao_duong', 3),
(4, '30A-10004', 50, 'dang_su_dung', 4),
(5, '30A-10005', 35, 'san_sang', 5),
(6, '30A-10006', 50, 'dang_su_dung', 6),
(7, '30A-10007', 40, 'san_sang', 7),
(8, '30A-10008', 40, 'dang_su_dung', 8),
(9, '30A-10009', 45, 'san_sang', 9),
(10, '30A-10010', 50, 'dang_su_dung', 10);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chitiettuyenduong`
--
ALTER TABLE `chitiettuyenduong`
  ADD PRIMARY KEY (`ma_ct`),
  ADD KEY `ma_tuyen` (`ma_tuyen`),
  ADD KEY `ma_tram` (`ma_tram`);

--
-- Chỉ mục cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`ma_hs`),
  ADD KEY `ma_phu_huynh` (`ma_phu_huynh`),
  ADD KEY `ma_diem_don` (`ma_diem_don`),
  ADD KEY `ma_diem_tra` (`ma_diem_tra`);

--
-- Chỉ mục cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`ma_lich`),
  ADD KEY `ma_tuyen` (`ma_tuyen`),
  ADD KEY `ma_xe` (`ma_xe`),
  ADD KEY `ma_tai_xe` (`ma_tai_xe`);

--
-- Chỉ mục cho bảng `nhatkydontra`
--
ALTER TABLE `nhatkydontra`
  ADD PRIMARY KEY (`ma_nhat_ky`),
  ADD KEY `ma_hs` (`ma_hs`),
  ADD KEY `ma_lich` (`ma_lich`),
  ADD KEY `thoi_gian` (`thoi_gian`);

--
-- Chỉ mục cho bảng `phancong`
--
ALTER TABLE `phancong`
  ADD PRIMARY KEY (`ma_pc`),
  ADD KEY `ma_hs` (`ma_hs`),
  ADD KEY `ma_lich` (`ma_lich`);

--
-- Chỉ mục cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`ma_phu_huynh`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  ADD UNIQUE KEY `tai_khoan` (`tai_khoan`);

--
-- Chỉ mục cho bảng `quanlytaixe`
--
ALTER TABLE `quanlytaixe`
  ADD PRIMARY KEY (`ma_ql`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  ADD UNIQUE KEY `tai_khoan` (`tai_khoan`);

--
-- Chỉ mục cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`ma_tai_xe`),
  ADD UNIQUE KEY `so_gplx` (`so_gplx`),
  ADD UNIQUE KEY `tai_khoan` (`tai_khoan`),
  ADD KEY `ma_ql` (`ma_ql`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`ma_tb`),
  ADD KEY `ma_phu_huynh` (`ma_phu_huynh`),
  ADD KEY `ma_tai_xe` (`ma_tai_xe`),
  ADD KEY `thoi_gian` (`thoi_gian`);

--
-- Chỉ mục cho bảng `tramxe`
--
ALTER TABLE `tramxe`
  ADD PRIMARY KEY (`ma_tram`);

--
-- Chỉ mục cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`ma_tuyen`);

--
-- Chỉ mục cho bảng `vitrixe`
--
ALTER TABLE `vitrixe`
  ADD PRIMARY KEY (`ma_vitri`),
  ADD KEY `ma_xe` (`ma_xe`);

--
-- Chỉ mục cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD PRIMARY KEY (`ma_xe`),
  ADD UNIQUE KEY `bien_so` (`bien_so`),
  ADD UNIQUE KEY `ma_tai_xe` (`ma_tai_xe`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chitiettuyenduong`
--
ALTER TABLE `chitiettuyenduong`
  MODIFY `ma_ct` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  MODIFY `ma_hs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `ma_lich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `nhatkydontra`
--
ALTER TABLE `nhatkydontra`
  MODIFY `ma_nhat_ky` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phancong`
--
ALTER TABLE `phancong`
  MODIFY `ma_pc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  MODIFY `ma_phu_huynh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `quanlytaixe`
--
ALTER TABLE `quanlytaixe`
  MODIFY `ma_ql` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `taixe`
--
ALTER TABLE `taixe`
  MODIFY `ma_tai_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `ma_tb` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tramxe`
--
ALTER TABLE `tramxe`
  MODIFY `ma_tram` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  MODIFY `ma_tuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `vitrixe`
--
ALTER TABLE `vitrixe`
  MODIFY `ma_vitri` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  MODIFY `ma_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitiettuyenduong`
--
ALTER TABLE `chitiettuyenduong`
  ADD CONSTRAINT `chitiettuyenduong_ibfk_1` FOREIGN KEY (`ma_tuyen`) REFERENCES `tuyenduong` (`ma_tuyen`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitiettuyenduong_ibfk_2` FOREIGN KEY (`ma_tram`) REFERENCES `tramxe` (`ma_tram`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`ma_phu_huynh`) REFERENCES `phuhuynh` (`ma_phu_huynh`) ON DELETE CASCADE,
  ADD CONSTRAINT `hocsinh_ibfk_2` FOREIGN KEY (`ma_diem_don`) REFERENCES `tramxe` (`ma_tram`) ON DELETE CASCADE,
  ADD CONSTRAINT `hocsinh_ibfk_3` FOREIGN KEY (`ma_diem_tra`) REFERENCES `tramxe` (`ma_tram`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD CONSTRAINT `lichtrinh_ibfk_1` FOREIGN KEY (`ma_tuyen`) REFERENCES `tuyenduong` (`ma_tuyen`),
  ADD CONSTRAINT `lichtrinh_ibfk_2` FOREIGN KEY (`ma_xe`) REFERENCES `xebuyt` (`ma_xe`),
  ADD CONSTRAINT `lichtrinh_ibfk_3` FOREIGN KEY (`ma_tai_xe`) REFERENCES `taixe` (`ma_tai_xe`);

--
-- Các ràng buộc cho bảng `nhatkydontra`
--
ALTER TABLE `nhatkydontra`
  ADD CONSTRAINT `nhatkydontra_ibfk_1` FOREIGN KEY (`ma_hs`) REFERENCES `hocsinh` (`ma_hs`),
  ADD CONSTRAINT `nhatkydontra_ibfk_2` FOREIGN KEY (`ma_lich`) REFERENCES `lichtrinh` (`ma_lich`);

--
-- Các ràng buộc cho bảng `phancong`
--
ALTER TABLE `phancong`
  ADD CONSTRAINT `phancong_ibfk_1` FOREIGN KEY (`ma_hs`) REFERENCES `hocsinh` (`ma_hs`),
  ADD CONSTRAINT `phancong_ibfk_2` FOREIGN KEY (`ma_lich`) REFERENCES `lichtrinh` (`ma_lich`);

--
-- Các ràng buộc cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD CONSTRAINT `taixe_ibfk_1` FOREIGN KEY (`ma_ql`) REFERENCES `quanlytaixe` (`ma_ql`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `thongbao_ibfk_1` FOREIGN KEY (`ma_phu_huynh`) REFERENCES `phuhuynh` (`ma_phu_huynh`),
  ADD CONSTRAINT `thongbao_ibfk_2` FOREIGN KEY (`ma_tai_xe`) REFERENCES `taixe` (`ma_tai_xe`);

--
-- Các ràng buộc cho bảng `vitrixe`
--
ALTER TABLE `vitrixe`
  ADD CONSTRAINT `vitrixe_ibfk_1` FOREIGN KEY (`ma_xe`) REFERENCES `xebuyt` (`ma_xe`);

--
-- Các ràng buộc cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD CONSTRAINT `xebuyt_ibfk_1` FOREIGN KEY (`ma_tai_xe`) REFERENCES `taixe` (`ma_tai_xe`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
