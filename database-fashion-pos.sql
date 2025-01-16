/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - fashion-pos
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`fashion-pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `fashion-pos`;

/*Table structure for table `discounts` */

DROP TABLE IF EXISTS `discounts`;

CREATE TABLE `discounts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  `code` VARCHAR(100) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT NULL,
  `total_discount` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `discounts` */

LOCK TABLES `discounts` WRITE;

INSERT  INTO `discounts`(`id`,`name`,`code`,`status`,`total_discount`) VALUES 
(1,'Diskon Lebaran','LEBARAN2024',1,5),
(2,'Diskon Akhir Tahun','ENDYEAR2024',0,10),
(3,'Diskon Bulan Merdeka','MERDEKA2024',0,10),
(5,'Db2 for LUW@10.10.10.36','DISKON',1,5),
(6,'DISKON','DISKON',1,15);

UNLOCK TABLES;

/*Table structure for table `order_items` */

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_order` INT(11) DEFAULT NULL,
  `id_product` INT(11) DEFAULT NULL,
  `quantity` INT(11) DEFAULT NULL,
  `total_price` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_order` (`id_order`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `order_items` */

LOCK TABLES `order_items` WRITE;

INSERT  INTO `order_items`(`id`,`id_order`,`id_product`,`quantity`,`total_price`) VALUES 
(32,43,3,1,75000),
(33,43,7,3,225000),
(34,44,5,1,125000),
(35,44,12,2,2),
(36,44,6,4,600000),
(37,45,5,1,125000),
(38,46,5,1,125000),
(39,47,12,2,2),
(40,47,5,4,500000),
(41,48,7,1,75000),
(42,49,7,2,150000),
(43,50,3,1,75000),
(44,51,5,1,125000),
(45,52,8,1,1),
(46,53,6,2,300000),
(47,53,3,1,75000),
(48,53,7,5,375000);

UNLOCK TABLES;

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_date` DATETIME DEFAULT NULL,
  `total` INT(11) DEFAULT NULL,
  `payment_status` VARCHAR(30) DEFAULT NULL,
  `discount` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orders` */

LOCK TABLES `orders` WRITE;

INSERT  INTO `orders`(`id`,`order_date`,`total`,`payment_status`,`discount`) VALUES 
(43,'2024-11-01 09:10:57',300000,'Paid',0),
(44,'2024-11-01 09:25:29',725002,'Paid',0),
(45,'2024-11-01 11:31:02',125000,'Paid',0),
(46,'2024-11-02 12:02:25',118750,'Paid',0),
(47,'2024-11-02 13:11:21',500002,'Paid',0),
(48,'2024-11-02 13:23:06',71250,'Paid',0),
(49,'2024-11-02 13:24:38',142500,'Paid',0),
(50,'2024-11-02 13:25:48',71250,'Paid',3750),
(51,'2024-11-02 13:29:56',125000,'Paid',0),
(52,'2024-11-02 13:30:11',1,'Paid',0),
(53,'2024-11-02 15:32:46',712500,'Paid',37500);

UNLOCK TABLES;

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price` INT(11) DEFAULT NULL,
  `stock` INT(11) DEFAULT NULL,
  `size` VARCHAR(11) DEFAULT NULL,
  `category` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

LOCK TABLES `products` WRITE;

INSERT  INTO `products`(`id`,`name`,`description`,`price`,`stock`,`size`,`category`) VALUES 
(3,'Kaos Polos','Kaos polos berbahan katun yang nyaman.',75000,85,'M','Kaos'),
(5,'Kaos Distro','Kaos Distro keren',125000,86,'L','Kaos'),
(6,'Hoodie Laki','Hoodie Laki',150000,35,'XL','Hoodie'),
(7,'Kaos Polos Tambah','Kaos polos berbahan katun yang nyaman.',75000,81,'M','Kaos'),
(8,'a','sasasas',1,100,'XXL','Hoodie'),
(12,'a update','a',1,100,'L','A');

UNLOCK TABLES;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(30) DEFAULT NULL,
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(256) DEFAULT NULL,
  `role` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

LOCK TABLES `users` WRITE;

INSERT  INTO `users`(`id`,`full_name`,`username`,`password`,`role`) VALUES 
(4,'Wahyu','wabredz1234@gmail.com','12','Kasir'),
(5,'Wahyu','wahyu','123','Kasir'),
(6,'admin','admin','1','Owner'),
(9,'coba','coba','1','Kasir');

ALTER TABLE products ADD COLUMN barcode VARCHAR(50) AFTER id;

ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) AFTER discount;

ALTER TABLE orders ADD COLUMN card_number VARCHAR(50) AFTER payment_method;

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
