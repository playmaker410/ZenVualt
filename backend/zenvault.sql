-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: Zenvault
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_number` (`account_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,36,'3328576773',0.00,'2026-07-15 10:46:58'),(2,37,'  21372745',0.00,'2026-07-15 10:48:37'),(3,38,'1727029295',0.00,'2026-07-15 11:26:33'),(4,39,'3639651595',0.00,'2026-07-15 11:26:48'),(5,45,'1312655963',0.00,'2026-07-15 11:55:27'),(6,46,'6514200005',0.00,'2026-07-15 12:01:29'),(7,47,'1103589092',0.00,'2026-07-15 12:06:44'),(8,48,'9863619409',0.00,'2026-07-15 12:26:14'),(9,50,'4481945923',0.00,'2026-07-16 10:54:39'),(10,52,'1006203471',0.00,'2026-07-16 11:04:32'),(11,53,'9974997566',0.00,'2026-07-19 14:49:08'),(12,54,'9831015726',0.00,'2026-07-19 17:38:11');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','super_admin') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Oshim','Odinaka','odinakaoshim@gmail.com','$2a$10$EVllgIyjlpQKqDIVW0eqqORj1taPDcwhPDu8AejQjN9KU1x7evGgi','super_admin',1,'2026-08-15 20:07:52','2026-08-02 22:03:29','2026-08-15 21:07:52');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `country` varchar(60) NOT NULL,
  `bank_pin` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','suspended','pending','closed') DEFAULT 'active',
  `suspend_reason` text,
  `kyc_status` enum('verified','pending','unverified') DEFAULT 'unverified',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Odinaka','joshua','Oshim','+2349072324110','odinakaoshim@gmail.com','Bosnia and Herzegovina','$2a$10$w7OfXqgQYtO1.oCx1VbUGu/stw2wOSSWDWT8Nr6PS.Av3GYviXyly','$2a$10$1E2yKLZpVCYsv.qlk5wpJ.wLBsArqZFoWccjkpra07edYMVkuTVb2','2026-07-11 02:30:33','active',NULL,'unverified'),(2,'Test','','User','08012345678','testpostman@example.com','Nigeria','$2a$10$De/sQ1XW7BEeZ7vI9L4y.ORY2dgt7/YCkMJkibr8hUEV9PcpBOwgi','$2a$10$Zz31boDfaOCVBiTlAXJUr.0SblHPidY7NSy7GbBQcP2Z9pcebp/rG','2026-07-11 02:42:32','active',NULL,'unverified'),(6,'Test','','User','08012345678','testpostman2@example.com','Nigeria','$2a$10$zlr.wUoj6MYSyj68bgoXQeNBNXSt0jvVRxzQU.E9H5AXtono6LS0C','$2a$10$2VbAAL/DTERMoxZ/GJiKp.K6r9d95S9XmshZE60o6o5r6PWbD4rgq','2026-07-11 02:47:14','active',NULL,'unverified'),(7,'Test','','User','08012345678','testpostma2n2@example.com','Nigeria','$2a$10$.HVstOsrkAguyzp8g33JZOqmXGKQLh7dNorqnFA36lsljwKrmcimq','$2a$10$fr/A7tJoRtnh6A2XCoX7vO4PJNoapJPCpxjuj72QfGS5QSB7f6N2S','2026-07-11 02:47:32','active',NULL,'unverified'),(8,'odinaka','','User','08012345678','testpos8tma2n2@example.com','Nigeria','$2a$10$fJ7HMHRqv9aS8rYd2dZzQe.q4AuHY7lKJMFyLiY8xMATQFVhQGBd2','$2a$10$UCUEsUBbrjaxhwqVXYkgFOQJCH2rkQu8mS9/Swung3LfjGZXYMu2S','2026-07-11 02:48:02','active',NULL,'unverified'),(11,'John','Micheal','DOE','+1 9087654332','odinakaoshim1@gmail.com','Bolivia','$2a$10$fGIjTM2CtB6JZ0SvP52uMupAFER/hrAEh0GDzQCiGR9lFcDtatiwa','$2a$10$OtnZHTdQdn3xOy0eQddMdOp41lsvcPl/ueeK0T8V6.tgeXY4hiaHq','2026-07-14 13:35:33','active',NULL,'unverified'),(16,'JJJ','','JHHH','123455778','odinakaoshim11@gmail.com','Botswana','$2a$10$cE4NehyNPbeKcCGwgzDq8.dK7T44/gey7k5QNgm61RZaIidYssBFi','$2a$10$a8kOaAtezwdMS8opSHDHSOMhWIGHzrjwAFEv.EBG6C1/8Ksccp81.','2026-07-14 14:09:55','active',NULL,'unverified'),(18,'John','Micheal','0doh','+23456789908','odinakaoshim34@gmail.com','Bahamas','$2a$10$os38991s/P1vdKSfTx1Cn.RSn5ahchAlSQnUyJePdDY8I9lypsRoO','$2a$10$1M57Pe.cqpHTP2c1v4Afnudu2kfOBNbG31oPj50On3rv8NYv6oDjC','2026-07-15 05:43:52','active',NULL,'unverified'),(25,'john','','carric','+2345678901','odinakaoshim12@gmail.com','Botswana','$2a$10$nYLiNfgVfkeFjIS0t7m/Au/wc.qERF8rTA9E2leG4TdeCew8N7MSm','$2a$10$wieggzvIxKg1ZEJGd2cb3.Y0OPwyytdAKZYpughJ10Xyrdo97K7AC','2026-07-15 10:58:32','active',NULL,'unverified'),(27,'john','','carric','+2345678901','odinakaoshim23@gmail.com','Botswana','$2a$10$rp3Y1rO.9I/icpgnA1YyQuIHK.5S.Zl72xHoj1YHjYiXO8xStPnDG','$2a$10$/v89ngjnaAuD4t1HhrdTKu6dTrG8uxt7J5Lb8AE6EfkW744XCCUM2','2026-07-15 11:04:11','active',NULL,'unverified'),(30,'jon','','doou','234567809','909888475','Azerbaijan','$2a$10$34zlzmIug3iw/F0APrb5BOe19JMb0ThVYSgMDqHu8StlPufgF58.2','$2a$10$qDw0mlhM0k.jNB4qfHF2tOYs2/FYDmiLSp8ennH4KwJFWTmrKLHlO','2026-07-15 11:15:19','active',NULL,'unverified'),(32,'John','mich','okor','+1235687890','odinakaoshim113gmail.com','Barbados','$2a$10$QYMdebB8o5NMHwVC.zq.durEPrl5PFPjMRFdsCyZALnlz/vzoi6lO','$2a$10$SmxjB.ioBBcO0B3hN216mOlqqgpFwAtf9pL5o9xu9eKNm2ZamEvre','2026-07-15 11:39:40','active',NULL,'unverified'),(36,'john','doue','egal','2008923848585','50093030','Bangladesh','$2a$10$ato7PO.pMAmbVJ1c.ZYRKuQl09JTp17zTMCmp301pju8JNZ1fhPIO','$2a$10$fpWSL1p67ol7GMFwdkiKWONCFW0kNYBbIs3rFA8Jz1fSlfMlOjpt6','2026-07-15 11:46:58','active',NULL,'unverified'),(37,'HELLO','','DIMMA','1234567890','odi@gmail.com','Bahamas','$2a$10$7WCAZpdqaEGsXbz4V5pY8ea8xnu9cqi6kpZFz0epPoumpxszixlbW','$2a$10$YGk7OKln1QZam1cORJ8F4.dJ/j.azzx4mxPSKpW0OVZ4BWyeJ5xzS','2026-07-15 11:48:37','active',NULL,'unverified'),(38,'john','','igwe','40098987654','odinaka@gmail.com','Azerbaijan','$2a$10$TAc5b/MgaGOcVStuwK./deXGDOqdxfpDkbBWu8QRg/8FVJRZO8vr.','$2a$10$StRY2yjewZabT1wl5ILYXupfdhTlGDe75KIhrau35VvPV2GmltFCm','2026-07-15 12:26:33','active',NULL,'unverified'),(39,'john','','igwe','40098987654','odinak1a@gmail.com','Azerbaijan','$2a$10$WTSLMwCPE5vlrXEdiIJTPuJ/vFYwbndAea7LL3ez52/lNn23i5mN.','$2a$10$lRsIbkbT8NkyaQmYO7hTBup86q.0rD88ewd.LmVR1tkkuwzGu7oWG','2026-07-15 12:26:48','active',NULL,'unverified'),(45,'John','wilson','Adam','+23456799898','odinaka1@gmail.com','Armenia','$2a$10$dGhb3wqOZ/Wyp1Vcixjoe.CX4Vp9ktPTfr3fb6Vqu6GCstrzy7LRG','$2a$10$MKYyBdb5qx/bPtWENLGKKeVdVchRWMLkO.n0C7dLgao5Msx12XPJ2','2026-07-15 12:55:27','active',NULL,'unverified'),(46,'hello','','micheal','09087654','odinak22@gmail.com','Belgium','$2a$10$Fp1FfcEitSW/9IRfiTEZoOxRAunZaAo2m2AOkqXlqc6anvl7dvU/S','$2a$10$u6XDyOqYvjeBOXcO5cT18O4583ufzhrsy81uUVL08n98Hk8ZkL5.u','2026-07-15 13:01:29','active',NULL,'unverified'),(47,'hello','','micha','8909876','odinaka2345@gmail.com','Belarus','$2a$10$/0u9TZpe9yOXKNaK5Zpxx.AeXDLXJoAqS5YmpYfqKWC7HC2d6.D8a','$2a$10$Yt3XzOZ6JqsATXP2JStkq.FafS47SV84P99IseLCxzcrnzLhghVfC','2026-07-15 13:06:44','active',NULL,'unverified'),(48,'Oshim','Odinaka','Joshua','+234990876','odiboy@gmail.com','Bhutan','$2a$10$ooI7u26gqszigKJpIcNYCeRnWUqxFyM5X29GGFgopsuBZUxO578Mq','$2a$10$wuBRpjXspXmtNiqt710Qru3JwTS0Dcngk6V5MumA2k1ImIFPjnZKC','2026-07-15 13:26:14','active',NULL,'unverified'),(50,'oshim','stella','Nnnek','+2349089345','odinakaoshim15@gmail.com','Brunei','$2a$10$ZmYieQhAtJBmcR0RVrOPgOjEv7PpBkan.EoRwjV3hqWxcJsX1DO4O','$2a$10$H9.e6lITDjlQ0xnKBZjHE.ANNKvVPXAUCSihtN1RMStaFHutp1vAO','2026-07-16 11:54:39','active',NULL,'unverified'),(52,'odi','','agbo','+2345890876','odinakaoshim001@gmail.com','Bangladesh','$2a$10$H4EVv7rjIk3DmX.s4qUZFeFDayf3ykg2FfuK2SWWG1eesM1bG1rDW','$2a$10$ddbE5erW5BGZKaD00QCUSuBq9KASPlQUyIJe63ceRkNV07HuA5L.2','2026-07-16 12:04:32','active',NULL,'unverified'),(53,'Oshim','Joshua','Odinaka','+23409072324110','serahphinahwilde420@gmail.com','Bahrain','$2a$10$dFJ/oXR7nCZ2sZhiA0AZx.DWL1HVOas0zJLdWADOkrr8rGezm22xO','$2a$10$tgsq0Z4xE/2qh2dB.6GOhuwxT5ni03SyAkZCyG0Abw25F8KFbLVhW','2026-07-19 15:49:08','active',NULL,'unverified'),(54,'oshim','','micheal','+23458679022','odinaka3@gmail.com','Armenia','$2a$10$vBIjgmXVIiy4bKZhtMQFBOJ/PNwpfqzjt2v89Iwe2.xJR3HdZbjqG','$2a$10$ueNgfV6xhqgwIMQywTED6OQgGZecTGQaG1AC5IwtJVO52XF85xabG','2026-07-19 18:38:11','active',NULL,'unverified');
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

-- Dump completed on 2026-08-24  3:19:00
