<?php
// Test básico de conexión a MySQL
header('Content-Type: application/json');

try {
    $mysqli = new mysqli('localhost', 'root', '', 'iga_courses');
    
    if ($mysqli->connect_error) {
        echo json_encode([
            'success' => false,
            'error' => 'Connection failed: ' . $mysqli->connect_error
        ]);
        exit;
    }
    
    // Probar query simple
    $result = $mysqli->query('SELECT COUNT(*) as total FROM compras');
    $row = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection OK',
        'total_compras' => $row['total']
    ]);
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
