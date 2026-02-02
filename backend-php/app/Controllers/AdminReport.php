<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

/**
 * Controlador REST para el Panel de Administración
 * Proporciona estadísticas de ventas de cursos
 */
class AdminReport extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';
    protected $db;

    public function __construct()
    {
        // Inicializar conexión a base de datos
        $this->db = \Config\Database::connect();
    }

    /**
     * GET /admin/stats
     * 
     * Devuelve estadísticas de ventas por curso
     * Incluye: nombre del curso, cantidad de ventas, total de ingresos
     * 
     * @return Response JSON
     */
    public function stats()
    {
        try {
            // Query Builder - previene SQL Injection, no usa concatenación de strings
            $builder = $this->db->table('courses c');
            $builder->select('c.id, c.name AS curso, c.price AS precio_unitario, COUNT(p.id) AS ventas, SUM(c.price) AS total_ingresos, c.image_url, MIN(p.purchase_date) AS primera_venta, MAX(p.purchase_date) AS ultima_venta');
            $builder->join('purchases p', 'c.id = p.course_id', 'left');
            $builder->groupBy(['c.id', 'c.name', 'c.price', 'c.image_url']);
            $builder->orderBy('ventas', 'DESC');
            $builder->orderBy('total_ingresos', 'DESC');
            $query = $builder->get();

            $stats = $query->getResultArray();

            // Transformar datos para mejor legibilidad
            $formattedStats = array_map(function($item) {
                return [
                    'id' => (int)$item['id'],
                    'curso' => $item['curso'],
                    'precio_unitario' => (float)$item['precio_unitario'],
                    'ventas' => (int)$item['ventas'],
                    'total_ingresos' => (float)$item['total_ingresos'],
                    'image_url' => $item['image_url'],
                    'primera_venta' => $item['primera_venta'],
                    'ultima_venta' => $item['ultima_venta']
                ];
            }, $stats);

            // Calcular totales generales
            $totalVentas = array_sum(array_column($formattedStats, 'ventas'));
            $totalIngresos = array_sum(array_column($formattedStats, 'total_ingresos'));

            return $this->respond([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'cursos' => $formattedStats,
                    'resumen' => [
                        'total_ventas' => $totalVentas,
                        'total_ingresos' => $totalIngresos,
                        'cursos_activos' => count($formattedStats),
                        'curso_mas_vendido' => $formattedStats[0]['curso'] ?? null
                    ]
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ], 200);

        } catch (\Exception $e) {
            return $this->failServerError('Error al obtener estadísticas: ' . $e->getMessage());
        }
    }

    /**
     * GET /admin/courses
     * 
     * Lista todos los cursos (para gestión CRUD)
     * 
     * @return Response JSON
     */
    public function courses()
    {
        try {
            $builder = $this->db->table('courses');
            $builder->select('id, name, description, price, detail, image_url, created_at, updated_at');
            $builder->orderBy('created_at', 'DESC');
            $query = $builder->get();

            $courses = $query->getResultArray();

            return $this->respond([
                'success' => true,
                'message' => 'Cursos obtenidos exitosamente',
                'data' => $courses,
                'count' => count($courses)
            ], 200);

        } catch (\Exception $e) {
            return $this->failServerError('Error al obtener cursos: ' . $e->getMessage());
        }
    }

    /**
     * GET /admin/clients
     * 
     * Lista todos los clientes registrados
     * 
     * @return Response JSON
     */
    public function clients()
    {
        try {
            $builder = $this->db->table('clients cl');
            $builder->select('cl.id, cl.name, cl.email, cl.phone, cl.created_at, COUNT(p.id) AS total_compras, SUM(c.price) AS total_gastado');
            $builder->join('purchases p', 'cl.id = p.client_id', 'left');
            $builder->join('courses c', 'p.course_id = c.id', 'left');
            $builder->groupBy(['cl.id', 'cl.name', 'cl.email', 'cl.phone', 'cl.created_at']);
            $builder->orderBy('total_compras', 'DESC');
            $builder->orderBy('cl.created_at', 'DESC');
            $query = $builder->get();

            $clients = $query->getResultArray();

            return $this->respond([
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => $clients,
                'count' => count($clients)
            ], 200);

        } catch (\Exception $e) {
            return $this->failServerError('Error al obtener clientes: ' . $e->getMessage());
        }
    }

    /**
     * GET /admin/purchases
     * 
     * Lista todas las compras realizadas
     * 
     * @return Response JSON
     */
    public function purchases()
    {
        try {
            $builder = $this->db->table('purchases p');
            $builder->select('p.id, p.purchase_date, c.name AS curso, c.price, cl.name AS cliente, cl.email AS cliente_email');
            $builder->join('courses c', 'p.course_id = c.id', 'inner');
            $builder->join('clients cl', 'p.client_id = cl.id', 'inner');
            $builder->orderBy('p.purchase_date', 'DESC');
            $builder->limit(100);
            $query = $builder->get();

            $purchases = $query->getResultArray();

            return $this->respond([
                'success' => true,
                'message' => 'Compras obtenidas exitosamente',
                'data' => $purchases,
                'count' => count($purchases)
            ], 200);

        } catch (\Exception $e) {
            return $this->failServerError('Error al obtener compras: ' . $e->getMessage());
        }
    }

    /**
     * GET /admin/health
     * 
     * Health check para verificar estado de la API
     * 
     * @return Response JSON
     */
    public function health()
    {
        try {
            // Verificar conexión a base de datos
            $this->db->query("SELECT 1");

            return $this->respond([
                'status' => 'ok',
                'database' => 'connected',
                'timestamp' => date('Y-m-d H:i:s'),
                'environment' => getenv('CI_ENVIRONMENT') ?: 'development'
            ], 200);

        } catch (\Exception $e) {
            return $this->failServerError('Database connection failed');
        }
    }
}
