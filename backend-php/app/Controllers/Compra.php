<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use Config\Validation as ValidationConfig;

/**
 * Controlador de compras - Valida y procesa compras de cursos
 * Aplica reglas de validación del framework antes de procesar cualquier compra.
 * Previene SQL Injection (Query Builder) y XSS (regex en validación).
 */
class Compra extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * POST /api/compras
     * Registra una compra - VALIDACIÓN APLICADA ANTES DE PROCESAR
     *
     * @return Response JSON
     */
    public function store()
    {
        $validation = \Config\Services::validation();
        $config = new ValidationConfig();

        // Aplicar reglas de validación antes de procesar
        $validation->setRules($config->compraRules, $config->compraErrors);

        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$validation->run($data)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $clientName = $data['client_name'];
        $clientEmail = $data['client_email'];
        $clientPhone = $data['client_phone'] ?? '';
        $courseId = (int) $data['course_id'];

        try {
            // Verificar que el curso existe (Query Builder - parámetros)
            $course = $this->db->table('courses')
                ->where('id', $courseId)
                ->get()
                ->getRowArray();

            if (!$course) {
                return $this->failNotFound('Curso no encontrado');
            }

            // Buscar o crear cliente (Query Builder - parámetros preparados)
            $client = $this->db->table('clients')
                ->where('email', $clientEmail)
                ->get()
                ->getRowArray();

            if (!$client) {
                $this->db->table('clients')->insert([
                    'name'  => $clientName,
                    'email' => $clientEmail,
                    'phone' => $clientPhone,
                ]);
                $clientId = $this->db->insertID();
            } else {
                $clientId = $client['id'];
                $this->db->table('clients')->where('id', $clientId)->update([
                    'name'  => $clientName,
                    'phone' => $clientPhone,
                ]);
            }

            // Registrar compra (Query Builder)
            $this->db->table('purchases')->insert([
                'course_id'      => $courseId,
                'client_id'      => $clientId,
                'purchase_date'  => date('Y-m-d H:i:s'),
            ]);
            $purchaseId = $this->db->insertID();

            return $this->respondCreated([
                'success' => true,
                'message' => 'Compra registrada exitosamente',
                'data'    => [
                    'id'            => $purchaseId,
                    'course_id'     => $courseId,
                    'client_id'     => $clientId,
                    'purchase_date' => date('Y-m-d H:i:s'),
                ],
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Error en Compra::store: ' . $e->getMessage());
            return $this->failServerError('Error al procesar la compra');
        }
    }
}
