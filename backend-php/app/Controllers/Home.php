<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Backend PHP - IGA Courses API',
            'version' => '1.0.0',
            'endpoints' => [
                'GET /api/reportes/ventas' => 'Reporte de ventas',
                'GET /api/health' => 'Health check'
            ]
        ]);
    }
}
