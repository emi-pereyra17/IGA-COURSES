<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

/**
 * Rutas para reportes (usadas por el frontend)
 */
$routes->get('api/reportes/ventas', 'Reporte::ventas');
$routes->get('api/reportes/ventas-por-curso', 'AdminReport::stats');
$routes->get('api/health', 'Reporte::health');

/**
 * Compra de cursos - Validación aplicada antes de procesar
 */
$routes->post('api/compras', 'Compra::store');
