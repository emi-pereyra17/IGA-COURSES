<?php

namespace App\Models;

use CodeIgniter\Model;

class ReporteModel extends Model
{
    protected $table = 'purchases';
    protected $primaryKey = 'id';
    protected $allowedFields = ['course_id', 'client_id', 'purchase_date', 'created_at'];
    protected $returnType = 'array';
    protected $useTimestamps = false;

    /**
     * Obtiene el reporte de ventas con información de los cursos y clientes
     * Hace un JOIN entre purchases, courses y clients
     */
    public function getVentasConCursos()
    {
        $builder = $this->db->table('purchases p');
        $builder->select('
            p.id, 
            p.purchase_date as fecha,
            p.created_at as createdAt,
            cl.name as nombre, 
            cl.email as email, 
            cl.phone as celular,
            co.id as curso_id,
            co.name as curso_nombre, 
            co.price as precio, 
            co.description as curso_descripcion
        ');
        $builder->join('courses co', 'p.course_id = co.id', 'left');
        $builder->join('clients cl', 'p.client_id = cl.id', 'left');
        $builder->orderBy('p.purchase_date', 'DESC');
        
        $query = $builder->get();
        return $query->getResultArray();
    }

    /**
     * Obtiene estadísticas de ventas
     */
    public function getEstadisticas()
    {
        $totalVentas = $this->countAll();
        
        $builder = $this->db->table('purchases p');
        $builder->select('SUM(co.price) as total_ingresos, COUNT(DISTINCT p.course_id) as cursos_vendidos');
        $builder->join('courses co', 'p.course_id = co.id', 'left');
        $query = $builder->get();
        $stats = $query->getRowArray();
        
        return [
            'total_ventas' => $totalVentas,
            'total_ingresos' => $stats['total_ingresos'] ?? 0,
            'cursos_vendidos' => $stats['cursos_vendidos'] ?? 0
        ];
    }
}
