<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Validation\StrictRules\CreditCardRules;
use CodeIgniter\Validation\StrictRules\FileRules;
use CodeIgniter\Validation\StrictRules\FormatRules;
use CodeIgniter\Validation\StrictRules\Rules;

class Validation extends BaseConfig
{
    // --------------------------------------------------------------------
    // Setup
    // --------------------------------------------------------------------

    /**
     * Stores the classes that contain the
     * rules that are available.
     *
     * @var list<string>
     */
    public array $ruleSets = [
        Rules::class,
        FormatRules::class,
        FileRules::class,
        CreditCardRules::class,
    ];

    /**
     * Specifies the views that are used to display the
     * errors.
     *
     * @var array<string, string>
     */
    public array $templates = [
        'list'   => 'CodeIgniter\Validation\Views\list',
        'single' => 'CodeIgniter\Validation\Views\single',
    ];

    // --------------------------------------------------------------------
    // Rules
    // --------------------------------------------------------------------

    /**
     * Reglas de validación para compras - Previenen SQL Injection y XSS
     * Usar antes de procesar cualquier compra. Regex rechaza < > " ' para XSS.
     *
     * @var array<string, string>
     */
    public array $compraRules = [
        'client_name'  => 'required|min_length[3]|max_length[100]|regex_match[/^[^<>"\']*$/]',
        'client_email' => 'required|valid_email|max_length[254]',
        'client_phone' => 'required|max_length[20]|regex_match[/^[+]?[\d\s\-()]+$/]',
        'course_id'    => 'required|integer',
    ];

    /**
     * Mensajes de error para compras
     *
     * @var array<string, array<string, string>>
     */
    public array $compraErrors = [
        'client_name' => [
            'required'    => 'El nombre del cliente es requerido',
            'min_length'  => 'El nombre debe tener al menos 3 caracteres',
            'max_length'  => 'El nombre no puede exceder 100 caracteres',
            'regex_match' => 'El nombre no puede contener caracteres HTML o de script',
        ],
        'client_email' => [
            'required'    => 'El email es requerido',
            'valid_email' => 'Debe proporcionar un email válido',
            'max_length'  => 'El email no puede exceder 254 caracteres',
        ],
        'client_phone' => [
            'required'    => 'El teléfono es requerido',
            'max_length'  => 'El teléfono no puede exceder 20 caracteres',
            'regex_match' => 'El teléfono debe contener solo números, espacios, guiones, paréntesis o signo +',
        ],
        'course_id' => [
            'required' => 'El ID del curso es requerido',
            'integer'  => 'El ID del curso debe ser un número entero',
        ],
    ];
}
