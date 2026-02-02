<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Filtro CORS - Configuración estricta de orígenes permitidos
 * Solo permite peticiones desde el Frontend autorizado.
 * Bloquea cualquier otro origen para prevenir ataques desde sitios no confiables.
 */
class Cors implements FilterInterface
{
    /**
     * Orígenes permitidos (whitelist). Separar múltiples URLs por coma en CORS_ORIGIN.
     */
    private function getAllowedOrigins(): array
    {
        $origin = env('CORS_ORIGIN', 'http://localhost:5173');
        if ($origin === '*' || empty($origin)) {
            // En desarrollo, si no está configurado, usar solo el frontend local
            return ['http://localhost:5173'];
        }
        return array_map('trim', explode(',', $origin));
    }

    /**
     * Verifica si el origen de la petición está en la whitelist
     */
    private function isOriginAllowed(RequestInterface $request): ?string
    {
        $requestOrigin = $request->getHeaderLine('Origin');
        if (empty($requestOrigin)) {
            return null;
        }
        $allowed = $this->getAllowedOrigins();
        return in_array($requestOrigin, $allowed, true) ? $requestOrigin : null;
    }

    /**
     * Antes de ejecutar el controlador
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $allowedOrigin = $this->isOriginAllowed($request);

        if ($allowedOrigin !== null) {
            header("Access-Control-Allow-Origin: {$allowedOrigin}");
        }
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 3600");

        if ($request->getMethod() === 'options') {
            http_response_code(200);
            exit();
        }
    }

    /**
     * Después de ejecutar el controlador
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $allowedOrigin = $this->isOriginAllowed($request);

        if ($allowedOrigin !== null) {
            $response->setHeader('Access-Control-Allow-Origin', $allowedOrigin);
        }
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
