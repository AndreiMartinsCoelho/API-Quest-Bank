CREATE DATABASE  IF NOT EXISTS `infocimol` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `infocimol`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cimol
-- ------------------------------------------------------
-- Server version	8.0.28

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

-- -----------------------------------------------------
-- Table `infocimol`.`topico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`topico` (
  `id_topico` INT NOT NULL,
  `enunciado` VARCHAR(250) NOT NULL,
  `professor_pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  `disciplina_id_disciplina` INT NOT NULL,
  PRIMARY KEY (`id_topico`),
  UNIQUE INDEX `enunciado_UNIQUE` (`enunciado` ASC) VISIBLE,
  INDEX `fk_topico_professor_idx` (`professor_pessoa_id_pessoa` ASC) VISIBLE,
  INDEX `fk_topico_disciplina1_idx` (`disciplina_id_disciplina` ASC) VISIBLE,
  CONSTRAINT `fk_topico_professor`
    FOREIGN KEY (`professor_pessoa_id_pessoa`)
    REFERENCES `infocimol`.`professor` (`pessoa_id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_topico_disciplina1`
    FOREIGN KEY (`disciplina_id_disciplina`)
    REFERENCES `infocimol`.`disciplina` (`id_disciplina`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;