<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemParameterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'string', 'max:12'],
            'management_start_date' => ['required', 'date'],
            'management_end_date' => ['required', 'date', 'after_or_equal:management_start_date'],
            'report_deadline' => ['required', 'date', 'after_or_equal:management_start_date'],
            'max_reports_per_scholar' => ['required', 'integer', 'min:0'],
            'system_status' => ['required', 'in:activo,cerrado'],
            'research_lines' => ['nullable', 'array'],
            'research_lines.*' => ['nullable', 'string', 'max:255'],
        ];
    }
}
