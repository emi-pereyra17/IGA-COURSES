<?php

namespace App\Models;

use CodeIgniter\Model;

class ReporteModel extends Model
{
    protected $table = 'compras';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nombre', 'email', 'celular', 'cursoId', 'created_at'];
    protected $returnType = 'array';
    protected $useTimestamps = false;

    /**
     * Obtiene el reporte de ventas con información de los cursos
     * Hace un JOIN entre compras y cursos
     */
    public function getVentasConCursos()
    {
        $builder = $this->db->table('compras c');
        $builder->select('c.id, c.nombre, c.email, c.celular, c.cursoId as curso_id, c.created_at as fecha, cu.name as curso_nombre, cu.price as precio, cu.description as curso_descripcion');
        $builder->join('cursos cu', 'c.cursoId = cu.id', 'left');
        $builder->orderBy('c.created_at', 'DESC');
        
        $query = $builder->get();
        return $query->getResultArray();
    }

    /**
     * Obtiene estadísticas de ventas
     */
    public function getEstadisticas()
    {
        $totalVentas = $this->countAll();
        
        $builder = $this->db->table('compras c');
        $builder->select('SUM(cu.price) as total_ingresos, COUNT(DISTINCT c.cursoId) as cursos_vendidos');
        $builder->join('cursos cu', 'c.cursoId = cu.id', 'left');
        $query = $builder->get();
        $stats = $query->getRowArray();
        
        return [
            'total_ventas' => $totalVentas,
            'total_ingresos' => $stats['total_ingresos'] ?? 0,
            'cursos_vendidos' => $stats['cursos_vendidos'] ?? 0
        ];
    }
}
