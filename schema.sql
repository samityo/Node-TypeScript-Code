/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`node_sample` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `node_sample`;

/*Table structure for table `permissions` */

DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_granted` tinyint(1) NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('web','api') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'api',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `permissions` */

insert  into `permissions`(`id`,`role`,`resource`,`is_granted`,`action`,`type`,`created_at`) values (276,'ROLE_ADMIN','/pages/dashboard',1,'view','web','2019-05-31 00:35:25'),(277,'ROLE_ADMIN','/pages',1,'view','web','2019-05-31 00:35:45'),(278,'ROLE_ADMIN','/pages/system/users',1,'view','web','2019-05-31 01:15:51'),(279,'ROLE_ADMIN','/pages/system/permissions',1,'view','web','2019-05-31 01:16:16'),(280,'ROLE_ADMIN','/pages/system/user-roles',1,'view','web','2019-05-31 01:16:52'),(281,'ROLE_ADMIN','/api/users',1,'get','api','2019-06-06 00:20:40'),(283,'ROLE_ADMIN','/api/users',1,'post','api','2019-06-06 00:56:37');


/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `user_roles` */

insert  into `user_roles`(`id`,`name`,`created_at`) values (1,'ROLE_GUEST','2019-01-30 19:53:49'),(2,'ROLE_USER','2019-01-30 19:53:49'),(3,'ROLE_ADMIN','2019-01-30 19:53:49'),(4,'ROLE_MANAGER','2019-05-31 00:48:21');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `loggedin_at` datetime DEFAULT NULL,
  `roles` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:simple_array)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`first_name`,`last_name`,`avatar`,`status`,`created_at`,`loggedin_at`,`roles`) values (40,'admin@admin.com','$2b$10$Mhx4WgVNvCr11sPe33jLhe50bMeBJ1bU143ljpw9oBa55VGjejKm.','Alex','Admin','',1,'2019-01-30 19:53:48',NULL,'ROLE_ADMIN');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
