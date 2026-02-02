<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ReporteModel;

class Reporte extends ResourceController
{
    protected $format = 'json';

    /**
     * Obtiene el reporte de ventas con información de cursos
     * GET /api/reportes/ventas
     */
    public function ventas()
    {
        try {
            $reporteModel = new ReporteModel();
            $ventas = $reporteModel->getVentasConCursos();
            
            return $this->respond([
                'success' => true,
                'data' => $ventas,
                'total' => count($ventas)
            ], 200);
            
        } catch (\Exception $e) {
            return $this->fail([
                'success' => false,
                'message' => 'Error al obtener el reporte de ventas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Health check endpoint
     * GET /api/health
     */
    public function health()
    {
        return $this->respond([
            'status' => 'ok',
            'service' => 'backend-php',
            'timestamp' => date('Y-m-d H:i:s')
        ], 200);
    }
}
