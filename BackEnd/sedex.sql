-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 20-Ago-2023 às 13:47
-- Versão do servidor: 8.0.31
-- versão do PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS bd_sedex;
USE bd_sedex;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  usuario VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nivel INT NOT NULL
);

DROP TABLE IF EXISTS `sedex`;
CREATE TABLE IF NOT EXISTS `sedex` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destinatario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `rua` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `numerorua` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `cxp` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `numeroSedex` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `entrada_funcionario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `data_entrada` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `saida_funcionario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `data_saida` date NOT NULL,
  `hora_saida` time NOT NULL,
  `retirado` tinyint(1) NOT NULL,
  `url_img_assinatura` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `lote` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_swedish_ci;
COMMIT;

DROP TABLE IF EXISTS `sedex_sd`;
CREATE TABLE IF NOT EXISTS `sedex_sd` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destinatario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `rua` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `numerorua` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `cxp` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `numeroSedex` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `entrada_funcionario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `data_entrada` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `saida_funcionario` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `data_saida` date NOT NULL,
  `hora_saida` time NOT NULL,
  `retirado` tinyint(1) NOT NULL,
  `url_img_assinatura` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  `lote` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_swedish_ci;
COMMIT;

