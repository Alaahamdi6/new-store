-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 25 nov. 2024 à 21:24
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `electronics`
--

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `available_colors` varchar(255) DEFAULT NULL,
  `brand` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `number_of_sales` int(11) DEFAULT NULL,
  `popularity` int(11) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `product_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `available_colors`, `brand`, `category`, `date`, `description`, `image`, `number_of_sales`, `popularity`, `price`, `product_name`) VALUES
(1, 'Black, Silver', 'Dell', 'laptop', '2023-01-15', '15\" 4K UHD, Intel Core i9, 32GB RAM, 1TB SSD, Windows 11 Pro', NULL, 200, 5, 1899.99, 'Dell XPS 15'),
(2, 'Space Gray, Silver', 'Apple', 'laptop', '2023-02-10', '16\" Retina, Apple M1 Pro, 16GB RAM, 512GB SSD, macOS Monterey', NULL, 180, 4, 2399.99, 'MacBook Pro 16'),
(3, 'Moonlight White, Eclipse Gray', 'Asus', 'laptop', '2023-02-25', '14\" QHD, AMD Ryzen 9, 16GB RAM, 1TB SSD, NVIDIA RTX 3060', NULL, 150, 4, 1699.99, 'Asus ROG Zephyrus G14'),
(4, 'Nightfall Black, Poseidon Blue', 'HP', 'laptop', '2023-03-12', '13.3\" OLED, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Home', NULL, 170, 4, 1499.99, 'HP Spectre x360'),
(5, 'Black', 'Lenovo', 'laptop', '2023-04-05', '14\" Full HD, Intel Core i5, 8GB RAM, 256GB SSD, Windows 10 Pro', NULL, 120, 3, 1299.99, 'Lenovo ThinkPad X1 Carbon'),
(6, 'Mist Green, Safari Gold', 'Acer', 'laptop', '2023-04-20', '14\" Full HD, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Home', NULL, 100, 3, 999.99, 'Acer Swift 5'),
(7, 'Black', 'MSI', 'laptop', '2023-05-03', '15.6\" Full HD, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA RTX 3080', NULL, 140, 4, 2299.99, 'MSI GS66 Stealth'),
(8, 'Black', 'Razer', 'laptop', '2023-05-18', '15.6\" Full HD, Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 3070', NULL, 180, 5, 2499.99, 'Razer Blade 15'),
(9, 'Platinum, Ice Blue', 'Microsoft', 'laptop', '2023-06-01', '13.5\" PixelSense, Intel Core i5, 8GB RAM, 256GB SSD, Windows 10 Home', NULL, 160, 4, 1199.99, 'Microsoft Surface Laptop 4'),
(10, 'Dark Silver', 'LG', 'laptop', '2023-06-16', '17\" WQXGA, Intel Core i7, 16GB RAM, 1TB SSD, Windows 10 Home', NULL, 130, 3, 1499.99, 'LG Gram 17'),
(11, 'Just Black, Not Pink', 'Google', 'laptop', '2023-07-01', '13.3\" Full HD, Intel Core i5, 8GB RAM, 128GB SSD, Chrome OS', NULL, 150, 4, 899.99, 'Google Pixelbook Go'),
(12, 'Mystic Navy, Mystic Silver', 'Samsung', 'laptop', '2023-07-15', '15.6\" AMOLED, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Home', NULL, 190, 5, 1799.99, 'Samsung Galaxy Book Pro 360'),
(13, 'Dark Side of the Moon', 'Alienware', 'laptop', '2023-08-01', '17.3\" QHD, Intel Core i9, 32GB RAM, 2TB SSD, NVIDIA RTX 3080', NULL, 170, 4, 3299.99, 'Alienware x17'),
(14, 'Space Gray', 'Huawei', 'laptop', '2023-08-15', '13.9\" 3K LTPS, Intel Core i7, 16GB RAM, 1TB SSD, Windows 11 Home', NULL, 110, 3, 1699.99, 'Huawei MateBook X Pro'),
(15, 'Black, Silver', 'Sony', 'laptop', '2023-09-01', '14\" 4K UHD, Intel Core i7, 16GB RAM, 1TB SSD, Windows 11 Pro', NULL, 130, 4, 2099.99, 'Sony VAIO Z'),
(16, 'Space Gray', 'Xiaomi', 'laptop', '2023-09-15', '15.6\" 3.5K OLED, AMD Ryzen 9, 32GB RAM, 1TB SSD, Windows 11 Home', NULL, 200, 5, 1499.99, 'Xiaomi RedmiBook Pro 15'),
(17, 'Graphite, Gold, Silver, Sierra Blue', 'Apple', 'phone', '2023-01-15', '6.7\" Super Retina XDR, A15 Bionic, 128GB, iOS 15', NULL, 500, 5, 1099.99, 'iPhone 13 Pro Max'),
(18, 'Phantom Black, Phantom White, Phantom Green', 'Samsung', 'phone', '2023-02-10', '6.8\" Dynamic AMOLED 2X, Exynos 2200, 256GB, Android 12', NULL, 450, 4, 1199.99, 'Samsung Galaxy S22 Ultra'),
(19, 'Stormy Black, Cloudy White, Sunny Yellow', 'Google', 'phone', '2023-02-25', '6.7\" LTPO OLED, Snapdragon 888, 128GB, Android 12', NULL, 400, 4, 999.99, 'Google Pixel 6 Pro'),
(20, 'Stellar Black, Lunar White', 'OnePlus', 'phone', '2023-03-12', '6.7\" Fluid AMOLED, Snapdragon 8 Gen 2, 256GB, OxygenOS 12', NULL, 350, 3, 899.99, 'OnePlus 10 Pro'),
(21, 'Phantom Gray, Cosmic Blue, Polar White', 'Xiaomi', 'phone', '2023-04-05', '6.81\" AMOLED, Snapdragon 8 Gen 2, 512GB, MIUI 13', NULL, 400, 4, 1099.99, 'Xiaomi 12 Ultra'),
(22, 'Frosted Black, Frosted Gray, Frosted Purple', 'Sony', 'phone', '2023-04-20', '6.5\" 4K HDR OLED, Snapdragon 888, 256GB, Android 12', NULL, 300, 3, 999.99, 'Sony Xperia 1 III'),
(23, 'Golden Black, Cocoa Gold, Charm Pink', 'Huawei', 'phone', '2023-05-03', '6.6\" OLED, Kirin 9000, 256GB, HarmonyOS 3', NULL, 350, 4, 1099.99, 'Huawei P50 Pro'),
(24, 'Cosmic Black, Lunar White', 'Motorola', 'phone', '2023-05-18', '6.9\" AMOLED, Snapdragon 8 Gen 2, 256GB, MyUX', NULL, 400, 5, 899.99, 'Motorola Edge 30 Ultra'),
(25, 'Aurora Gray, Illusion Sky, Velvet Pink', 'LG', 'phone', '2023-06-01', '6.8\" OLED, Snapdragon 888, 256GB, LG UX', NULL, 350, 4, 999.99, 'LG Velvet 3'),
(26, 'Midnight Blue, Frost White', 'Nokia', 'phone', '2023-06-16', '6.8\" LCD, Snapdragon 695, 128GB, Android 11', NULL, 250, 3, 699.99, 'Nokia X100'),
(27, 'Phantom Black, Storm White', 'Asus', 'phone', '2023-07-01', '6.78\" AMOLED, Snapdragon 8 Gen 2, 512GB, ROG UI', NULL, 300, 4, 1199.99, 'Asus ROG Phone 6'),
(28, 'Black', 'BlackBerry', 'phone', '2023-07-15', '4.5\" IPS LCD, Snapdragon 778G, 128GB, Android 12', NULL, 250, 3, 799.99, 'BlackBerry Key3'),
(29, 'Cyber Black, Neon Silver', 'Realme', 'phone', '2023-08-01', '6.7\" Super AMOLED, Dimensity 9000, 256GB, Realme UI 3.0', NULL, 300, 4, 899.99, 'Realme GT Neo 3'),
(30, 'Twilight Gold, Deep Blue', 'ZTE', 'phone', '2023-08-15', '6.5\" OLED, Snapdragon 888, 128GB, MiFavor UI 12', NULL, 200, 3, 699.99, 'ZTE Axon 40 Pro'),
(31, 'Ceramic Black, Cosmic Gold', 'Oppo', 'phone', '2023-09-01', '6.7\" OLED, Snapdragon 8 Gen 2, 256GB, ColorOS 13', NULL, 350, 4, 1099.99, 'Oppo Find X5 Pro'),
(32, 'Obsidian Black, Moonlight Silver', 'Vivo', 'phone', '2023-09-15', '6.8\" Super AMOLED, Dimensity 9000, 256GB, Funtouch OS 13', NULL, 400, 5, 999.99, 'Vivo X80 Pro'),
(33, 'Storm Black, Moon White', 'Lenovo', 'phone', '2023-10-01', '6.92\" AMOLED, Snapdragon 8 Gen 2, 512GB, Legion OS', NULL, 350, 4, 1199.99, 'Lenovo Legion Phone 3'),
(34, 'Star Black, Star White, Star Blue', 'Xiaomi', 'phone', '2023-10-15', '6.8\" AMOLED, Dimensity 9000, 256GB, MIUI 14', NULL, 300, 4, 899.99, 'Redmi K50 Pro'),
(35, 'Predator Black, Alien Silver', 'Xiaomi', 'phone', '2023-11-01', '6.67\" AMOLED, Dimensity 1200, 128GB, MIUI 14', NULL, 250, 3, 699.99, 'Poco F4 GT'),
(36, 'Black, White', 'Meizu', 'phone', '2023-11-15', '6.7\" AMOLED, Snapdragon 8 Gen 2, 256GB, Flyme OS 10', NULL, 300, 4, 999.99, 'Meizu 19 Pro'),
(37, 'White', 'Apple', 'AirPods', '2023-01-15', 'Active Noise Cancellation, Wireless Charging Case', NULL, 800, 5, 249.99, 'Apple AirPods Pro'),
(38, 'Black, Violet', 'Samsung', 'AirPods', '2023-02-10', 'Ambient Sound, IPX7 Water Resistant', NULL, 700, 4, 199.99, 'Samsung Galaxy Buds Pro'),
(39, 'Black, Silver', 'Sony', 'AirPods', '2023-02-25', 'Active Noise Cancelling, 360 Reality Audio, 8 hours battery', NULL, 750, 4, 279.99, 'Sony WF-1000XM4'),
(40, 'Black, White', 'Bose', 'AirPods', '2023-03-12', 'Noise Cancelling Earbuds, 6 hours battery', NULL, 600, 3, 249.99, 'Bose QuietComfort Earbuds'),
(41, 'Titanium Black, Gold Beige', 'Jabra', 'AirPods', '2023-04-05', 'Active Noise Cancellation, 5.5 hours battery', NULL, 550, 4, 199.99, 'Jabra Elite 85t'),
(42, 'Black, White', 'Sennheiser', 'AirPods', '2023-04-20', 'Active Noise Cancellation, 7 hours battery', NULL, 500, 3, 249.99, 'Sennheiser Momentum True Wireless 2'),
(43, 'Black, Red, White', 'Beats', 'AirPods', '2023-05-03', 'Active Noise Cancelling, 8 hours battery', NULL, 600, 4, 149.99, 'Beats Studio Buds'),
(44, 'Black, Blue', 'Skullcandy', 'AirPods', '2023-05-18', 'Active Noise Cancellation, 6 hours battery', NULL, 450, 3, 129.99, 'Skullcandy Indy ANC'),
(45, 'Black, White', 'Anker', 'AirPods', '2023-06-01', 'Active Noise Cancelling, 7 hours battery', NULL, 400, 4, 129.99, 'Anker Soundcore Liberty Air 2 Pro'),
(46, 'Black, White', 'JBL', 'AirPods', '2023-06-16', 'True Wireless Earbuds, 5 hours battery', NULL, 350, 3, 99.99, 'JBL Free X'),
(47, 'Black', 'Logitech', 'Keyboard', '2023-01-15', 'Mechanical Gaming Keyboard, RGB Backlit, Detachable Cable', NULL, 200, 5, 149.99, 'Logitech G Pro X'),
(48, 'Black, Green', 'Razer', 'Keyboard', '2023-02-10', 'Mechanical Gaming Keyboard, Chroma RGB Lighting', NULL, 180, 4, 169.99, 'Razer BlackWidow V3'),
(49, 'Black', 'Corsair', 'Keyboard', '2023-02-25', 'Mechanical Gaming Keyboard, Customizable RGB Backlighting', NULL, 170, 4, 139.99, 'Corsair K70 RGB'),
(50, 'Black', 'SteelSeries', 'Keyboard', '2023-03-12', 'Adjustable Mechanical Gaming Keyboard, OLED Smart Display', NULL, 150, 3, 199.99, 'SteelSeries Apex Pro'),
(51, 'Black, Red', 'HyperX', 'Keyboard', '2023-04-05', 'Compact Mechanical Gaming Keyboard, Customizable RGB', NULL, 160, 4, 109.99, 'HyperX Alloy Origins'),
(52, 'White, Black', 'Ducky', 'Keyboard', '2023-04-20', '60% Mechanical Gaming Keyboard, Cherry MX Switches', NULL, 140, 3, 119.99, 'Ducky One 2 Mini'),
(53, 'Black', 'Cooler Master', 'Keyboard', '2023-05-03', 'RGB Mechanical Gaming Keyboard, Gateron Switches', NULL, 150, 4, 89.99, 'Cooler Master CK552'),
(54, 'Black', 'ASUS', 'Keyboard', '2023-05-18', 'Mechanical Gaming Keyboard, RX Red Optical Switches', NULL, 130, 3, 129.99, 'ASUS ROG Strix Scope RX'),
(55, 'Black', 'HP', 'Keyboard', '2023-06-01', 'Mechanical Gaming Keyboard, Customizable RGB Lighting', NULL, 140, 4, 99.99, 'HP OMEN Sequencer'),
(56, 'Black, White', 'Glorious', 'Keyboard', '2023-06-16', 'Modular Mechanical Gaming Keyboard, Hot-Swappable Switches', NULL, 120, 3, 109.99, 'Glorious PC Gaming Race GMMK'),
(57, 'Black', 'Roccat', 'Keyboard', '2023-07-01', 'Compact Mechanical Gaming Keyboard, RGB Lighting', NULL, 130, 4, 119.99, 'Roccat Vulcan TKL'),
(58, 'Black, White', 'Logitech', 'Keyboard', '2023-07-15', 'Wireless Keyboard, Backlit Keys, Multi-Device Connectivity', NULL, 100, 3, 79.99, 'Logitech MX Keys'),
(59, 'Silver', 'Microsoft', 'Keyboard', '2023-08-01', 'Slim Wireless Keyboard, Alcantara Surface, Bluetooth', NULL, 110, 4, 129.99, 'Microsoft Surface Keyboard'),
(60, 'Silver', 'Apple', 'Keyboard', '2023-08-15', 'Wireless Keyboard, Scissor Mechanism, Rechargeable', NULL, 120, 5, 99.99, 'Apple Magic Keyboard'),
(61, 'Black', 'Dell', 'Keyboard', '2023-09-01', 'Wired Keyboard, Multimedia Keys, Quiet Typing', NULL, 90, 3, 29.99, 'Dell KB216'),
(62, 'Black', 'Logitech', 'Mouse', '2023-01-15', 'Gaming Mouse, 16000 DPI, Customizable Weights', NULL, 300, 5, 79.99, 'Logitech G502 Hero'),
(63, 'Black', 'Razer', 'Mouse', '2023-02-10', 'Gaming Mouse, 20000 DPI, Optical Sensor', NULL, 250, 4, 69.99, 'Razer DeathAdder V2'),
(64, 'Black', 'Corsair', 'Mouse', '2023-02-25', 'Wireless Gaming Mouse, 18000 DPI, RGB Lighting', NULL, 220, 4, 99.99, 'Corsair Dark Core RGB Pro'),
(65, 'Black', 'SteelSeries', 'Mouse', '2023-03-12', 'Wireless Gaming Mouse, TrueMove3+ Sensor, 12000 CPI', NULL, 200, 3, 119.99, 'SteelSeries Rival 650 Wireless'),
(66, 'Black', 'HyperX', 'Mouse', '2023-04-05', 'Gaming Mouse, Pixart 3389 Sensor, RGB Lighting', NULL, 180, 4, 49.99, 'HyperX Pulsefire FPS Pro'),
(67, 'Black', 'ASUS', 'Mouse', '2023-04-20', 'Gaming Mouse, 19000 DPI, Hot-Swappable Switches', NULL, 160, 3, 89.99, 'ASUS ROG Gladius III'),
(68, 'Black', 'HP', 'Mouse', '2023-05-03', 'Wireless Gaming Mouse, 16000 DPI, Optical Sensor', NULL, 150, 4, 69.99, 'HP OMEN Vector Wireless'),
(69, 'Black, White', 'Glorious', 'Mouse', '2023-05-18', 'Gaming Mouse, Pixart 3360 Sensor, Matte Finish', NULL, 140, 3, 59.99, 'Glorious Model O'),
(70, 'Black', 'Roccat', 'Mouse', '2023-06-01', 'Wireless Gaming Mouse, Owl-Eye Optical Sensor, Titan Click', NULL, 170, 4, 119.99, 'Roccat Kone Pro Air'),
(71, 'Black', 'Logitech', 'Mouse', '2023-06-16', 'Wireless Gaming Mouse, HERO Sensor, 12000 DPI', NULL, 130, 3, 49.99, 'Logitech G305 Lightspeed'),
(72, 'Black', 'Microsoft', 'Mouse', '2023-07-01', 'Wired Gaming Mouse, PixArt Sensor, 12000 DPI', NULL, 160, 4, 69.99, 'Microsoft Pro Intellimouse'),
(73, 'Black', 'Corsair', 'Mouse', '2023-07-15', 'Wired Gaming Mouse, 18000 DPI Optical Sensor, Lightweight', NULL, 140, 3, 59.99, 'Corsair Sabre RGB Pro Champion Series'),
(74, 'Black', 'Razer', 'Mouse', '2023-08-01', 'Gaming Mouse, Razer Focus+ Optical Sensor, 16000 DPI', NULL, 150, 4, 79.99, 'Razer Naga X'),
(75, 'Black', 'SteelSeries', 'Mouse', '2023-08-15', 'Wired Gaming Mouse, TrueMove Pro Sensor, Ambidextrous Design', NULL, 120, 3, 59.99, 'SteelSeries Sensei Ten'),
(76, 'Black', 'BenQ', 'Mouse', '2023-09-01', 'Wired Gaming Mouse, PixArt Sensor, Ergonomic Design', NULL, 130, 4, 69.99, 'BenQ Zowie EC2'),
(77, 'Black', 'Canon', 'camera', '2023-01-20', '45MP Full-Frame Mirrorless Camera, 8K Video, Dual Pixel CMOS AF II', NULL, 250, 5, 3899.99, 'Canon EOS R5'),
(78, 'Black', 'Sony', 'camera', '2023-02-05', '24.2MP Full-Frame Mirrorless, 4K HDR Video, Real-Time Eye AF', NULL, 200, 4, 1999.99, 'Sony Alpha a7 III'),
(79, 'Black', 'Nikon', 'camera', '2023-03-10', '24.5MP Full-Frame Mirrorless, Dual EXPEED 6 Processors, 4K UHD Video', NULL, 180, 4, 1999.99, 'Nikon Z6 II'),
(80, 'Black, Silver', 'Fujifilm', 'camera', '2023-04-12', '26.1MP APS-C Mirrorless Camera, 4K/60P Video, IBIS', NULL, 220, 5, 1699.99, 'Fujifilm X-T4'),
(81, 'Black', 'Panasonic', 'camera', '2023-05-15', '24.2MP Full-Frame Mirrorless, Dual Native ISO, 4K 60P Video', NULL, 150, 4, 1999.99, 'Panasonic Lumix S5'),
(82, 'Black', 'Olympus', 'camera', '2023-06-18', '20.4MP Micro Four Thirds, 5-Axis IS, Starry Sky AF', NULL, 120, 3, 1799.99, 'Olympus OM-D E-M1 Mark III'),
(83, 'Black', 'Leica', 'camera', '2023-07-01', '47.3MP Full-Frame Compact Camera, Fixed Summilux 28mm Lens', NULL, 140, 5, 4999.99, 'Leica Q2'),
(84, 'Black', 'GoPro', 'camera', '2023-07-25', '5.3K60 Video, 23MP Photos, Waterproof, HyperSmooth 4.0', NULL, 300, 5, 499.99, 'GoPro HERO10 Black'),
(85, 'Black', 'DJI', 'camera', '2023-08-10', '4K Camera, 3-Axis Gimbal, Compact Design, AI Editor', NULL, 220, 4, 349.99, 'DJI Pocket 2'),
(86, 'Black, Silver', 'Canon', 'camera', '2023-08-30', '20.1MP Compact Camera, 4K Video, Live Streaming', NULL, 150, 4, 749.99, 'Canon PowerShot G7 X Mark III'),
(87, 'Black', 'Sony', 'camera', '2023-09-05', '20.1MP Compact Camera, 24-200mm Zoom Lens, 4K Video', NULL, 180, 5, 1299.99, 'Sony Cyber-shot RX100 VII'),
(88, 'Black', 'Nikon', 'camera', '2023-09-20', '16MP, 125x Optical Zoom, 4K UHD Video, Built-In Wi-Fi', NULL, 170, 4, 999.99, 'Nikon COOLPIX P1000'),
(89, 'Black, Silver', 'Fujifilm', 'camera', '2023-10-10', '26.1MP APS-C Compact Camera, Hybrid Viewfinder, 4K Video', NULL, 200, 5, 1399.99, 'Fujifilm X100V'),
(90, 'Black', 'Panasonic', 'camera', '2023-10-20', '25.2MP Micro Four Thirds, 4K 120P Video, 7.5 Stops IS', NULL, 160, 4, 2199.99, 'Panasonic Lumix GH6'),
(91, 'White, Black', 'Olympus', 'camera', '2023-11-05', '16MP Micro Four Thirds, Compact Design, 4K Video', NULL, 90, 3, 699.99, 'Olympus PEN E-PL10'),
(92, 'Black', 'Leica', 'camera', '2023-11-15', '24MP Full-Frame Mirrorless, 4K Video, Vario-Elmarit 24-90mm Lens', NULL, 100, 4, 5199.99, 'Leica SL2-S'),
(93, 'Black', 'GoPro', 'camera', '2023-12-01', '360 Degree Camera, 5.6K30 Video, HyperSmooth Stabilization', NULL, 240, 5, 499.99, 'GoPro MAX'),
(94, 'Gray', 'DJI', 'camera', '2023-12-20', '48MP Drone Camera, 4K Video, SmartPhoto, 34-Min Flight Time', NULL, 180, 4, 799.99, 'DJI Mavic Air 2'),
(95, 'Black', 'Canon', 'camera', '2024-01-15', '24.1MP DSLR, Vari-Angle Touchscreen, 4K Video', NULL, 140, 4, 899.99, 'Canon EOS Rebel T8i'),
(96, 'Black', 'Sony', 'camera', '2024-02-01', '20.1MP Compact Vlogging Camera, 4K Video, Background Defocus', NULL, 200, 5, 749.99, 'Sony ZV-1'),
(97, 'Black, Silver', 'Sony', 'headphones', '2023-01-05', 'Wireless Noise-Cancelling Over-Ear Headphones, 30-Hour Battery Life, Hi-Res Audio', NULL, 300, 5, 399.99, 'Sony WH-1000XM5'),
(98, 'Black, White', 'Bose', 'headphones', '2023-01-20', 'Wireless Noise-Cancelling Headphones, 24-Hour Battery Life, Lightweight Design', NULL, 280, 5, 329.99, 'Bose QuietComfort 45'),
(99, 'Space Gray, Silver, Pink, Green, Sky Blue', 'Apple', 'headphones', '2023-02-10', 'Wireless Over-Ear Headphones, Active Noise Cancellation, Spatial Audio', NULL, 250, 4, 549.99, 'Apple AirPods Max'),
(100, 'Black, White, Blue', 'JBL', 'headphones', '2023-03-01', 'Wireless Over-Ear Noise-Cancelling Headphones, 50-Hour Battery Life, Alexa Built-In', NULL, 200, 4, 199.99, 'JBL Live 660NC'),
(101, 'Black', 'Sennheiser', 'headphones', '2023-03-15', 'Wireless Over-Ear Noise-Cancelling Headphones, 60-Hour Battery Life, Premium Sound', NULL, 220, 5, 349.99, 'Sennheiser Momentum 4'),
(102, 'Black, Red, White, Blue', 'Beats', 'headphones', '2023-04-05', 'Wireless Noise-Cancelling Over-Ear Headphones, Apple W1 Chip, 22-Hour Battery', NULL, 240, 4, 349.99, 'Beats Studio3'),
(103, 'Black, Silver', 'AKG', 'headphones', '2023-04-25', 'Wireless Noise-Cancelling Headphones, Adaptive Sound, 20-Hour Battery Life', NULL, 180, 4, 299.99, 'AKG N700NC M2'),
(104, 'Black Anthracite, Timber', 'Bang & Olufsen', 'headphones', '2023-05-10', 'Wireless Noise-Cancelling Over-Ear Headphones, 35-Hour Battery, Luxurious Design', NULL, 150, 5, 499.99, 'Bang & Olufsen Beoplay HX'),
(105, 'Black, Grey', 'Skullcandy', 'headphones', '2023-05-20', 'Wireless Over-Ear Headphones, Adjustable Bass, 40-Hour Battery Life', NULL, 200, 4, 199.99, 'Skullcandy Crusher Evo'),
(106, 'Black, Grey', 'Plantronics', 'headphones', '2023-06-01', 'Wireless Over-Ear Sport Headphones, Sweatproof, 24-Hour Battery', NULL, 120, 3, 129.99, 'Plantronics BackBeat FIT 6100'),
(107, 'Black, Brown', 'Marshall', 'headphones', '2023-06-15', 'Wireless On-Ear Headphones, Iconic Design, 80-Hour Battery Life', NULL, 190, 4, 149.99, 'Marshall Major IV'),
(108, 'Black, Brown', 'Shure', 'headphones', '2023-07-01', 'Wireless Noise-Cancelling Over-Ear Headphones, Premium Studio Quality', NULL, 140, 5, 349.99, 'Shure AONIC 50'),
(109, 'Black, Blue, Pink', 'Anker', 'headphones', '2023-07-20', 'Wireless Noise-Cancelling Headphones, Hi-Res Audio, 40-Hour Battery Life', NULL, 230, 4, 129.99, 'Anker Soundcore Q35'),
(110, 'Black, White', 'Audio-Technica', 'headphones', '2023-08-05', 'Wireless Over-Ear Headphones, Studio Sound, 50-Hour Battery Life', NULL, 200, 5, 199.99, 'Audio-Technica ATH-M50xBT2'),
(111, 'Black', 'Philips', 'headphones', '2023-08-25', 'Wireless Noise-Cancelling Over-Ear Headphones, Hi-Res Audio, 38-Hour Battery', NULL, 100, 4, 299.99, 'Philips Fidelio L3'),
(112, 'Black, Beige', 'Jabra', 'headphones', '2023-09-10', 'Wireless Noise-Cancelling Headphones, SmartSound, 36-Hour Battery Life', NULL, 190, 4, 249.99, 'Jabra Elite 85h'),
(113, 'Black', 'Grado', 'headphones', '2023-09-30', 'Wireless On-Ear Open-Back Headphones, Premium Sound Quality', NULL, 80, 3, 279.99, 'Grado GW100 v2'),
(114, 'Black, White', 'Edifier', 'headphones', '2023-10-15', 'Wireless Noise-Cancelling Headphones, Foldable Design, 25-Hour Battery', NULL, 170, 4, 179.99, 'Edifier W860NB'),
(115, 'Black, Silver, White', 'Samsung', 'headphones', '2023-10-30', 'True Wireless Noise-Cancelling Earbuds, 28-Hour Battery, Ambient Sound Mode', NULL, 300, 5, 199.99, 'Samsung Galaxy Buds Pro'),
(116, 'Black, Red', 'HyperX', 'headphones', '2023-11-15', 'Gaming Wireless Over-Ear Headphones, 30-Hour Battery, 7.1 Surround Sound', NULL, 220, 4, 149.99, 'HyperX Cloud II Wireless'),
(117, 'Midnight, Starlight, Silver, Gold', 'Apple', 'smartwatch', '2023-01-10', '45mm Retina Display, Blood Oxygen Sensor, GPS + Cellular', NULL, 400, 5, 429.99, 'Apple Watch Series 8'),
(118, 'Graphite, Silver, Gold', 'Samsung', 'smartwatch', '2023-01-20', '44mm Super AMOLED, ECG Monitoring, GPS, LTE', NULL, 350, 5, 379.99, 'Samsung Galaxy Watch 6'),
(119, 'Black, Slate Gray', 'Garmin', 'smartwatch', '2023-02-05', '47mm Solar-Powered, Multisport GPS, 24/7 Heart Rate Monitoring', NULL, 300, 4, 699.99, 'Garmin Fenix 7'),
(120, 'Black, Pink Clay, Midnight Blue', 'Fitbit', 'smartwatch', '2023-02-25', '1.58\" AMOLED, SpO2, Sleep Tracking, 6-Day Battery', NULL, 280, 4, 229.99, 'Fitbit Versa 4'),
(121, 'Black, Green, White', 'Huawei', 'smartwatch', '2023-03-10', '46mm AMOLED, GPS, 2-Week Battery, TruSleep 3.0', NULL, 270, 4, 249.99, 'Huawei Watch GT 4'),
(122, 'Black, Silver, Brown', 'Amazfit', 'smartwatch', '2023-03-20', '1.43\" AMOLED, 150+ Sports Modes, 24-Day Battery', NULL, 250, 4, 199.99, 'Amazfit GTR 4'),
(123, 'Black, Smoke Stainless Steel, Rose Gold', 'Fossil', 'smartwatch', '2023-04-05', '44mm Wear OS, Qualcomm Snapdragon Wear 4100+, Alexa', NULL, 220, 3, 299.99, 'Fossil Gen 6'),
(124, 'Black, Steel', 'TicWatch', 'smartwatch', '2023-04-20', '1.4\" AMOLED + FSTN, Dual-Layer Display, 72-Hour Battery', NULL, 210, 4, 299.99, 'TicWatch Pro 3 Ultra'),
(125, 'Black DLC, Nordic Copper', 'Polar', 'smartwatch', '2023-05-10', '45mm Sapphire Glass, Outdoor Sports GPS, 7-Day Battery', NULL, 200, 4, 499.99, 'Polar Grit X Pro'),
(126, 'Blue, Green', 'Withings', 'smartwatch', '2023-05-25', 'Hybrid Design, ECG & SpO2, Sapphire Glass, 30-Day Battery', NULL, 180, 4, 499.99, 'Withings ScanWatch Horizon'),
(127, 'Black, White, Navy Blue', 'Xiaomi', 'smartwatch', '2023-06-05', '1.39\" AMOLED, GPS, 16-Day Battery, 117 Fitness Modes', NULL, 230, 4, 129.99, 'Xiaomi Mi Watch'),
(128, 'Gold, Midnight Black', 'Honor', 'smartwatch', '2023-06-20', '1.43\" AMOLED, 8-Channel PPG, 14-Day Battery Life', NULL, 200, 3, 199.99, 'Honor Watch GS 3'),
(129, 'Black, Red', 'Casio', 'smartwatch', '2023-07-01', 'Solar Powered, GPS, Heart Rate Monitor, Tough Design', NULL, 150, 4, 399.99, 'Casio G-Shock GBD-H1000'),
(130, 'Titanium, Granite Blue', 'Suunto', 'smartwatch', '2023-07-15', '1.2\" Sapphire Glass, Ultra-Long Battery, Outdoor GPS', NULL, 170, 4, 569.99, 'Suunto 9 Peak Pro'),
(131, 'Gold, Rose Gold, Silver', 'Michael Kors', 'smartwatch', '2023-08-01', 'Wear OS, Fashion Design, 1.28\" AMOLED Display', NULL, 130, 3, 349.99, 'Michael Kors Access Gen 6'),
(132, 'Black', 'Mobvoi', 'smartwatch', '2023-08-20', 'Wear OS, Qualcomm Snapdragon 4100, 2-Day Battery Life', NULL, 220, 4, 199.99, 'Mobvoi TicWatch E3'),
(133, 'Black, Grey', 'Realme', 'smartwatch', '2023-09-10', '1.78\" AMOLED, Bluetooth Calling, 10-Day Battery Life', NULL, 210, 4, 129.99, 'Realme Watch 3 Pro'),
(134, 'Black, Gold', 'Oppo', 'smartwatch', '2023-09-25', '1.91\" AMOLED, Qualcomm Snapdragon W5, 5-Day Battery', NULL, 200, 4, 329.99, 'Oppo Watch 3'),
(135, 'Midnight Black, Moonlight Silver', 'OnePlus', 'smartwatch', '2023-10-10', '1.39\" AMOLED, 14-Day Battery, Blood Oxygen Monitoring', NULL, 190, 4, 159.99, 'OnePlus Watch'),
(136, 'Black, Steel', 'Diesel', 'smartwatch', '2023-10-30', 'Wear OS, Qualcomm Snapdragon 4100+, Rugged Design', NULL, 120, 3, 349.99, 'Diesel Griffed Gen 6');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
