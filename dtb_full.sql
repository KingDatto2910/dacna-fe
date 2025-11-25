-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dacna
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','electronics','/placeholder/electronics-cate.png','2025-11-10 15:50:43'),(2,'Appliances','appliances','/placeholder/laundry-cate.png','2025-11-10 15:50:43'),(3,'Furniture','furniture','/placeholder/furniture-cate.png','2025-11-10 15:50:43'),(4,'Kitchen','kitchen','/placeholder/kitchen-cate.png','2025-11-10 15:50:43'),(5,'Cleaning','cleaning','/placeholder/cleaning-cate.png','2025-11-10 15:50:43'),(6,'Accessories','accessories','/placeholder/accessories-cate.png','2025-11-10 15:50:43'),(7,'TestCategory','testcate',NULL,'2025-11-23 08:25:09');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product` (`user_id`,`product_id`),
  KEY `ix_fav_user` (`user_id`),
  KEY `ix_fav_product` (`product_id`),
  CONSTRAINT `fk_fav_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (4,6,25,'2025-11-23 10:50:07'),(5,6,28,'2025-11-23 10:56:48'),(6,6,3,'2025-11-23 10:56:49'),(7,6,4,'2025-11-23 10:56:51');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `item_name_snapshot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `qty` int NOT NULL,
  `amount` decimal(12,2) GENERATED ALWAYS AS (round((`unit_price` * `qty`),2)) STORED,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_oi_order_product` (`order_id`,`product_id`),
  KEY `fk_oi_product` (`product_id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_oi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `item_name_snapshot`, `unit_price`, `qty`, `created_at`) VALUES (1,1,23,'Cookware Set 6pcs',51.96,1,'2025-11-11 03:56:18'),(2,2,23,'Cookware Set 6pcs',51.96,1,'2025-11-11 03:56:48'),(3,3,23,'Cookware Set 6pcs',51.96,1,'2025-11-11 04:46:27'),(4,1,5,'Dell XPS 13',1319.96,1,'2025-11-11 04:48:02'),(5,4,23,'Cookware Set 6pcs',51.96,1,'2025-11-11 04:49:14'),(6,4,5,'Dell XPS 13',1319.96,1,'2025-11-11 04:49:14'),(8,6,27,'Hand Blender 800W',31.96,1,'2025-11-11 04:51:02'),(11,7,27,'Hand Blender 800W',31.96,1,'2025-11-11 04:56:35'),(38,14,4,'Samsung Galaxy S24',919.96,1,'2025-11-23 04:53:41'),(39,15,5,'Dell XPS 13',1319.96,1,'2025-11-23 10:09:39');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `address_street` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_district` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_ward` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_city` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `shipping_fee` decimal(12,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `payment_method` enum('cod','card') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('unpaid','paid','pending_refund','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `promotion_id` int unsigned DEFAULT NULL,
  `promotion_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `order_status` enum('cart','awaiting_payment','paid','processing','shipping','delivered','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cart',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` datetime GENERATED ALWAYS AS ((`created_at` + interval 1 day)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `fk_orders_user` (`user_id`),
  KEY `fk_order_promotion` (`promotion_id`),
  CONSTRAINT `fk_order_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `address_street`, `address_district`, `address_ward`, `address_city`, `subtotal`, `shipping_fee`, `grand_total`, `payment_method`, `payment_status`, `promotion_id`, `promotion_code`, `discount_amount`, `order_status`, `created_at`, `updated_at`) VALUES (1,'CART1762790628018635',2,NULL,NULL,NULL,NULL,1371.92,30000.00,31371.92,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-10 16:03:48','2025-11-11 04:48:02'),(2,'OD1762833408307587',2,'71C Bùi Minh Trực ','8','5','Saigon',51.96,30000.00,30051.96,NULL,'unpaid',NULL,NULL,0.00,'awaiting_payment','2025-11-11 03:56:48','2025-11-11 03:56:48'),(3,'OD1762836386900910',NULL,'71C Bùi Minh Trực phường 5 quận 8',NULL,NULL,'Quận 8',51.96,30000.00,30051.96,'card','paid',NULL,NULL,0.00,'paid','2025-11-11 04:46:27','2025-11-11 04:46:27'),(4,'OD176283655472436',2,'71C Bùi Minh Trực phường 5 quận 8',NULL,NULL,'Quận 8',1371.92,30000.00,31371.92,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-11 04:49:14','2025-11-11 04:49:14'),(5,'CART1762836638746452',NULL,NULL,NULL,NULL,NULL,0.00,0.00,0.00,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-11 04:50:38','2025-11-11 05:02:16'),(6,'OD1762836662438490',NULL,'71C Bùi Minh Trực phường 5 quận 8',NULL,NULL,'Quận 8',31.96,30000.00,30031.96,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-11 04:51:02','2025-11-11 04:51:02'),(7,'OD1762836995904858',NULL,'71C Bùi Minh Trực phường 5 quận 8','8','5','Quận 8',31.96,30000.00,30031.96,'cod','paid',NULL,NULL,0.00,'paid','2025-11-11 04:56:35','2025-11-11 04:56:36'),(8,'CART1763537057942787',4,NULL,NULL,NULL,NULL,0.00,0.00,0.00,NULL,'unpaid',NULL,NULL,0.00,'cancelled','2025-11-19 07:24:17','2025-11-22 03:06:16'),(9,'CART1763781996994946',4,NULL,NULL,NULL,NULL,0.00,0.00,0.00,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-22 03:26:36','2025-11-22 03:26:36'),(13,'CART1763873553985908',6,NULL,NULL,NULL,NULL,0.00,0.00,0.00,NULL,'unpaid',NULL,NULL,0.00,'processing','2025-11-23 04:52:33','2025-11-23 08:02:40'),(14,'OD1763873621469420',6,'71C Bùi Minh Trực phường 5 quận 8',NULL,NULL,'Ho Chi Minh',919.96,0.00,919.96,'card','paid',NULL,NULL,0.00,'processing','2025-11-23 04:53:41','2025-11-23 08:02:08'),(15,'CART1763885059943525',6,NULL,NULL,NULL,NULL,1319.96,0.00,1319.96,NULL,'unpaid',NULL,NULL,0.00,'cart','2025-11-23 08:04:19','2025-11-23 10:09:39');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_codes`
--

DROP TABLE IF EXISTS `otp_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_codes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` enum('register','reset') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `attempts` int DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_otp_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_codes`
--

LOCK TABLES `otp_codes` WRITE;
/*!40000 ALTER TABLE `otp_codes` DISABLE KEYS */;
INSERT INTO `otp_codes` VALUES (1,'chauphuongdat@gmail.com','301569','register','2025-11-10 23:04:15',1,0,NULL,'2025-11-10 15:59:14'),(2,'signaturedurant2910@gmail.com','496285','register','2025-11-10 23:08:04',1,0,NULL,'2025-11-10 16:03:04'),(3,'kevthomp2929@gmail.com','555717','register','2025-11-11 11:55:04',1,0,NULL,'2025-11-11 04:50:03'),(4,'dat.cp06443@sinhvien.hoasen.edu.vn','691225','register','2025-11-19 14:28:17',1,0,NULL,'2025-11-19 07:23:16'),(5,'kevthomp2929@gmail.com','815490','register','2025-11-22 10:33:52',1,0,NULL,'2025-11-22 03:28:51'),(6,'kevthomp2929@gmail.com','353647','register','2025-11-23 11:57:02',1,0,NULL,'2025-11-23 04:52:01');
/*!40000 ALTER TABLE `otp_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_thumbnail` tinyint(1) NOT NULL DEFAULT '0',
  `display_order` int unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `ix_product_images_order` (`product_id`,`is_thumbnail` DESC,`display_order`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'/placeholder/ggtv/ggtv-main.jpg',1,1),(2,1,'/placeholder/ggtv/ggtv1.jpg',0,2),(3,1,'/placeholder/ggtv/ggtv2.jpg',0,3),(4,1,'/placeholder/ggtv/ggtv3.jpg',0,4),(5,1,'/placeholder/ggtv/ggtv4.jpg',0,5),(6,1,'/placeholder/ggtv/ggtv-remote.jpg',0,6),(8,2,'/placeholder/ss1.jpg',1,1),(9,3,'/placeholder/iphone/ip17.jpg',1,1),(10,3,'/placeholder/iphone/ip171.jpg',0,2),(11,3,'/placeholder/iphone/ip172.jpg',0,3),(12,5,'/placeholder/dell/dell.jpg',1,1),(13,6,'/placeholder/headphone/sony.webp',1,1),(14,9,'/placeholder/keyboard/keyboard.jpg',1,1),(15,9,'/placeholder/keyboard/kb1.jpg',0,2),(16,9,'/placeholder/keyboard/kb2.jpg',0,3),(17,9,'/placeholder/keyboard/kb3.jpg',0,4),(21,15,'/placeholder/lgac/ac.png',1,1),(22,15,'/placeholder/lgac/lgac1.jpg',0,2),(23,15,'/placeholder/lgac/lgac2.jpg',0,3),(24,15,'/placeholder/lgac/lgac3.jpg',0,4),(25,15,'/placeholder/lgac/lgac4.jpg',0,5),(26,15,'/placeholder/lgac/lgac-specs.jpg',0,6),(28,4,'/placeholder/ps5.webp',1,1),(29,28,'/placeholder/airfryer.jfif',1,1),(30,27,'/placeholder/blender.jfif',1,1),(31,20,'/placeholder/chair.jfif',1,1),(32,23,'/placeholder/cookset.jfif',1,1),(33,18,'/placeholder/desk.jfif',1,1),(34,14,'/placeholder/ssdryer.jfif',1,1),(35,16,'/placeholder/ssfridhe.jfif',1,1),(36,10,'/placeholder/logimouse.jfif',1,1),(37,25,'/placeholder/oven.jfif',1,1),(38,30,'/placeholder/robot.jfif',1,1),(39,22,'/placeholder/sofa.jfif',1,1),(40,8,'/placeholder/ssd.jfif',1,1),(41,29,'/placeholder/vacuum.jfif',1,1),(42,13,'/placeholder/sswasher.jfif',1,1),(43,11,'/placeholder/cable.jfif',1,1),(44,12,'/placeholder/charger.jfif',1,1),(45,7,'/placeholder/speaker.webp',1,1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_specifications`
--

DROP TABLE IF EXISTS `product_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_specifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `spec_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `spec_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_product_spec` (`product_id`,`spec_key`),
  CONSTRAINT `fk_spec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_specifications`
--

LOCK TABLES `product_specifications` WRITE;
/*!40000 ALTER TABLE `product_specifications` DISABLE KEYS */;
INSERT INTO `product_specifications` VALUES (1,1,'Screen Size','55 inches'),(2,1,'Resolution','4K UHD (3840 x 2160)'),(3,1,'HDR','Yes (HDR10, Dolby Vision)'),(4,1,'Smart Platform','Google TV'),(5,1,'Refresh Rate','60Hz'),(6,1,'Ports','3x HDMI 2.1, 2x USB, Ethernet'),(7,1,'Audio','20W Dolby Audio'),(8,1,'Voice Control','Google Assistant Built-in'),(16,3,'Display','6.1\" Super Retina XDR OLED'),(17,3,'Chip','A19 Bionic'),(18,3,'Storage','256GB'),(19,3,'Camera','48MP Main, 12MP Ultra Wide'),(20,3,'Battery','Up to 20 hours video playback'),(21,3,'5G','Yes'),(22,3,'Water Resistance','IP68'),(23,3,'OS','iOS 19'),(31,5,'Processor','Intel Core i7-1355U (13th Gen)'),(32,5,'RAM','16GB LPDDR5'),(33,5,'Storage','512GB NVMe SSD'),(34,5,'Display','13.4\" FHD+ (1920x1200) InfinityEdge'),(35,5,'Graphics','Intel Iris Xe'),(36,5,'Battery','Up to 12 hours'),(37,5,'Weight','1.19 kg'),(38,5,'OS','Windows 11 Pro'),(46,6,'Type','Over-ear Wireless'),(47,6,'ANC','Industry-leading Active Noise Cancellation'),(48,6,'Battery Life','Up to 30 hours'),(49,6,'Charging','USB-C Quick Charge (3 min = 3 hours)'),(50,6,'Bluetooth','5.2 with LDAC'),(51,6,'Voice Assistant','Alexa, Google Assistant'),(52,6,'Controls','Touch sensor'),(53,15,'Capacity','1.5 HP (12,000 BTU)'),(54,15,'Technology','Dual Inverter Compressor'),(55,15,'Energy Rating','5 Star'),(56,15,'Cooling Area','Up to 20 sqm'),(57,15,'Features','Fast Cooling, Low Noise, Wi-Fi Control'),(58,15,'Refrigerant','R32'),(59,15,'Warranty','10 years compressor'),(60,28,'Capacity','5 Liters'),(61,28,'Power','1500W'),(62,28,'Temperature Range','80°C - 200°C'),(63,28,'Timer','60 minutes with auto shut-off'),(64,28,'Features','Rapid Air Technology, Non-stick basket'),(65,28,'Material','Stainless steel'),(67,30,'Navigation','Laser SLAM mapping'),(68,30,'Suction Power','4000Pa'),(69,30,'Battery','5200mAh (up to 180 mins)'),(70,30,'Dustbin','600ml'),(71,30,'Smart Features','App control, Voice control, Auto-recharge'),(72,30,'Floor Types','Carpet, Hardwood, Tile'),(74,9,'Connectivity','Bluetooth 5.1'),(75,9,'Multi-device','Connect up to 3 devices'),(76,9,'Battery','2x AAA (up to 2 years)'),(77,9,'Layout','Compact with number pad'),(78,9,'Compatibility','Windows, Mac, iOS, Android, ChromeOS'),(81,8,'Capacity','1TB'),(82,8,'Interface','NVMe PCIe Gen 3.0 x4'),(83,8,'Read Speed','Up to 3,500 MB/s'),(84,8,'Write Speed','Up to 3,300 MB/s'),(85,8,'Form Factor','M.2 2280'),(86,8,'Warranty','5 years');
/*!40000 ALTER TABLE `product_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned DEFAULT NULL,
  `sub_category_id` int unsigned DEFAULT NULL,
  `sku` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `stock_qty` int NOT NULL DEFAULT '0',
  `is_trending` tinyint(1) NOT NULL DEFAULT '0',
  `is_bestseller` tinyint(1) NOT NULL DEFAULT '0',
  `average_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `review_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `ix_products_category` (`category_id`),
  KEY `ix_products_sub_category` (`sub_category_id`),
  KEY `ix_products_rating` (`average_rating`,`review_count`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_product_sub_category` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ck_products_prices` CHECK (((`price` >= 0) and ((`sale_price` is null) or ((`sale_price` >= 0) and (`sale_price` <= `price`)))))
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'TV-GG-001','Google TV 55\"','GGT-55','4K HDR Smart TV with Google Assistant',599.96,519.96,25,1,1,4.50,5,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(2,1,1,'TV-SS-002','Samsung TV 65\"','SS-65','UHD Smart TV with Tizen OS',759.96,NULL,18,0,1,4.70,3,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(3,1,2,'PH-IP-001','iPhone 17','A3101','Latest iPhone with A19 Bionic chip',1239.96,NULL,40,1,1,4.90,5,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(4,1,2,'PH-SS-001','Samsung Galaxy S24','SM-S921','Flagship Android with AI features',999.96,919.96,32,1,0,4.60,4,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(5,1,3,'LP-DE-001','Dell XPS 13','XPS-13','Ultra portable with Intel Core i7 13th Gen',1399.96,1319.96,12,1,1,4.70,4,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(6,1,4,'HP-SO-001','Sony WH-1000XM5','XM5','Industry-leading ANC Headphones',359.96,319.96,30,1,1,4.80,5,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(7,1,4,'HP-SO-002','Sony WF-1000XM5 Earbuds','WF-XM5','Premium ANC True Wireless Earbuds',239.96,223.96,40,1,0,4.70,3,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(8,1,6,'ST-SS-001','Samsung SSD 1TB','970 EVO','NVMe SSD with blazing fast speeds',111.96,NULL,50,0,1,4.60,3,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(9,1,5,'KB-LG-001','Logitech Keyboard K380','K380','Multi-device Bluetooth keyboard',31.96,NULL,60,0,1,4.50,4,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(10,1,5,'MS-LG-001','Logitech Mouse M331','M331','Silent wireless mouse',15.96,NULL,70,0,1,4.30,2,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(11,1,18,'CB-USB-001','USB-C Cable 1m','CB-USBC-1','Fast charge and data sync',3.96,NULL,200,0,0,4.00,2,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(12,1,18,'CH-20W-001','20W USB-C Charger','CH-20','Power Delivery 20W',7.96,NULL,150,0,1,4.20,3,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(13,2,7,'WS-LG-001','LG Washer 9kg','LG-W9','Inverter Direct Drive with Steam',359.96,NULL,18,0,1,4.50,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(14,2,7,'DR-SS-001','Samsung Dryer 9kg','SS-D9','Heat Pump technology for energy efficiency',439.96,399.96,12,0,0,4.40,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(15,2,8,'AC-LG-001','LG Dual Inverter AC 1.5HP','LG-AC-15','Energy-saving with fast cooling',479.96,NULL,20,1,0,4.60,5,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(16,2,9,'FR-SS-001','Samsung Refrigerator 380L','SS-R380','Twin Cooling Plus technology',559.96,519.96,10,0,1,4.70,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(17,2,9,'FR-SS-002','Samsung Refrigerator 500L','SS-R500','French Door with Inverter',799.96,NULL,7,0,0,4.80,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(18,3,10,'DK-WD-001','Wooden Desk','WD-DK','Solid wood desk for home office',119.96,NULL,30,0,0,4.30,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(19,3,10,'DK-WD-002','Office Desk 120cm','WD-120','Modern MDF desk with cable management',71.96,63.96,20,0,0,4.20,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(20,3,11,'CH-ER-001','Ergonomic Chair','ERG-CH','Mesh back with lumbar support',99.96,NULL,25,0,1,4.40,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(21,3,11,'CH-ER-002','Ergo Chair Plus','ERG-PLUS','Premium ergonomic with adjustable headrest',131.96,119.96,15,0,0,4.50,1,'2025-11-10 15:50:43','2025-11-10 15:50:43'),(22,3,12,'SF-MD-001','Modern Sofa 3-seat','MD-SF','Comfortable fabric sofa',279.96,259.96,0,0,0,4.30,1,'2025-11-10 15:50:43','2025-11-23 08:07:50'),(23,4,13,'CK-SET-001','Cookware Set 6pcs','CK-6','Non-stick coating cookware set',51.96,NULL,1,0,1,3.33,3,'2025-11-10 15:50:44','2025-11-23 08:07:44'),(24,4,13,'CK-PAN-001','Cookware Pan 28cm','CK-PAN-28','Heavy-duty non-stick pan',15.96,NULL,1,0,0,4.20,1,'2025-11-10 15:50:44','2025-11-22 02:57:14'),(25,4,14,'OV-EL-001','Electric Oven 45L','OV-45','Multi-function with convection',75.96,NULL,18,0,0,3.00,1,'2025-11-10 15:50:44','2025-11-11 11:08:34'),(26,4,14,'OV-EL-002','Electric Oven 30L','OV-30','Compact oven for small kitchens',55.96,NULL,25,0,0,4.10,1,'2025-11-10 15:50:44','2025-11-10 15:50:44'),(27,4,15,'BL-HB-001','Hand Blender 800W','HB-800','Powerful with stainless steel blade',31.96,NULL,35,0,0,0.00,0,'2025-11-10 15:50:44','2025-11-11 11:03:10'),(28,4,14,'AF-5L-001','Air Fryer 5L','AF-5L','Healthy cooking with rapid air technology',79.96,69.96,45,1,1,4.60,5,'2025-11-10 15:50:44','2025-11-10 15:50:44'),(29,5,16,'VC-MV-001','Vacuum Cleaner 2000W','MV-2000','Powerful suction for deep cleaning',63.96,NULL,30,0,1,4.30,1,'2025-11-10 15:50:44','2025-11-10 15:50:44'),(30,5,17,'RB-CL-001','Robot Cleaner Pro','RB-PRO','Auto mapping with app control',239.96,223.96,0,1,1,4.70,5,'2025-11-10 15:50:44','2025-11-22 02:57:28');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(12,2) DEFAULT NULL,
  `max_discount_amount` decimal(12,2) DEFAULT NULL,
  `usage_limit` int unsigned DEFAULT NULL COMMENT 'Total usage limit across all users',
  `usage_count` int unsigned NOT NULL DEFAULT '0',
  `per_user_limit` int unsigned DEFAULT '1' COMMENT 'Usage limit per user',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_promo_code` (`code`),
  KEY `ix_promo_active_dates` (`is_active`,`start_date`,`end_date`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'HELLODATTO',NULL,'percentage',10.00,100.00,500.00,NULL,0,1,'2025-11-23 00:00:00','2025-11-24 00:00:00',1,'2025-11-23 10:08:55','2025-11-23 10:08:55');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `rating` tinyint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `admin_reply` text COLLATE utf8mb4_unicode_ci,
  `admin_reply_at` timestamp NULL DEFAULT NULL,
  `author_name_snapshot` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified_purchase` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_reviews_product_date` (`product_id`,`created_at` DESC),
  KEY `fk_review_user` (`user_id`),
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ck_review_rating` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (2,23,NULL,5,NULL,'Good',NULL,NULL,'Guest',0,'2025-11-11 10:19:42'),(3,23,NULL,4,NULL,'CPD',NULL,NULL,'Kevin Thompson',1,'2025-11-11 10:27:37'),(4,23,NULL,1,NULL,'Dang Khoa',NULL,NULL,'Kevin Thompson',1,'2025-11-11 10:44:40'),(8,25,NULL,3,NULL,'Khoa','Yeah for sure Khoa. love you!','2025-11-23 09:55:19','Kevin Thompson',1,'2025-11-11 11:08:26');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_subcategory_category` (`category_id`),
  CONSTRAINT `fk_subcategory_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,1,'TVs & Displays','tvs-displays','2025-11-10 15:50:43'),(2,1,'Smartphones','smartphones','2025-11-10 15:50:43'),(3,1,'Laptops','laptops','2025-11-10 15:50:43'),(4,1,'Audio','audio','2025-11-10 15:50:43'),(5,1,'Computer Accessories','computer-accessories','2025-11-10 15:50:43'),(6,1,'Storage','storage','2025-11-10 15:50:43'),(7,2,'Laundry','laundry','2025-11-10 15:50:43'),(8,2,'Cooling & Heating','cooling-heating','2025-11-10 15:50:43'),(9,2,'Refrigeration','refrigeration','2025-11-10 15:50:43'),(10,3,'Office Furniture','office-furniture','2025-11-10 15:50:43'),(11,3,'Chairs','chairs','2025-11-10 15:50:43'),(12,3,'Living Room','living-room','2025-11-10 15:50:43'),(13,4,'Cookware','cookware','2025-11-10 15:50:43'),(14,4,'Ovens & Fryers','ovens-fryers','2025-11-10 15:50:43'),(15,4,'Small Appliances','small-appliances','2025-11-10 15:50:43'),(16,5,'Vacuum Cleaners','vacuum-cleaners','2025-11-10 15:50:43'),(17,5,'Robot Cleaners','robot-cleaners','2025-11-10 15:50:43'),(18,6,'Cables & Chargers','cables-chargers','2025-11-10 15:50:43'),(19,6,'Phone Accessories','phone-accessories','2025-11-10 15:50:43'),(20,6,'Bags & Cases','bags-cases','2025-11-10 15:50:43'),(21,7,'HelloPerciva','hello-per','2025-11-23 08:25:27');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_promotions`
--

DROP TABLE IF EXISTS `user_promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_promotions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `promotion_id` int unsigned NOT NULL,
  `order_id` int unsigned DEFAULT NULL,
  `used_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_user_promo` (`user_id`,`promotion_id`),
  KEY `fk_up_order` (`order_id`),
  KEY `fk_up_promotion` (`promotion_id`),
  CONSTRAINT `fk_up_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_up_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_promotions`
--

LOCK TABLES `user_promotions` WRITE;
/*!40000 ALTER TABLE `user_promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pw` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `roles` enum('admin','staff','customer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `auth_provider` enum('local','google','github') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `auth_provider_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_street` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `ux_users_provider` (`auth_provider`,`auth_provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Chau Dat','signaturedurant2910@gmail.com',NULL,'$2b$10$RyoGSDaTrRuTROHtVELZe.ZFC53ZY568xGbkVX/xjr9vgXzim2G92','staff',1,'local',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-10 16:03:04','2025-11-23 08:10:31'),(4,'Toi La Admin','dat.cp06443@sinhvien.hoasen.edu.vn',NULL,'$2b$10$ZMfkSicu4v.KoM.HVlT8IuD8.lS1vd2.4pyWx4K1/tzNQMQpehcX.','admin',1,'local',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-19 07:23:16','2025-11-22 03:27:35'),(6,'Toi La Test','kevthomp2929@gmail.com',NULL,'$2b$10$L9tsMoaO6GqAHSkG0xr3meZwjw0JQ.bHRLDiOgd1DF2A/EZqOOvRO','customer',1,'local',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-23 04:52:01','2025-11-23 04:52:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 16:26:49
