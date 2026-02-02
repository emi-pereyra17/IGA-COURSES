<?php
header('Content-Type: application/json');
echo json_encode(['message' => 'PHP works', 'time' => date('Y-m-d H:i:s')]);
