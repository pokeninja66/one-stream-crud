<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStreamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // For now, allow all requests. Add auth logic later if needed.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:655',
            'tokens_price' => 'sometimes|required|integer|min:1',
            'stream_type_id' => 'nullable|exists:stream_types,id',
            'date_expiration' => 'sometimes|required|date_format:Y-m-d H:i:s|after:now',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'description.max' => 'The description may not be greater than 655 characters.',
            'tokens_price.required' => 'The tokens price field is required.',
            'tokens_price.integer' => 'The tokens price must be an integer.',
            'tokens_price.min' => 'The tokens price must be at least 1.',
            'stream_type_id.exists' => 'The selected stream type does not exist.',
            'date_expiration.required' => 'The expiration date is required.',
            'date_expiration.date_format' => 'The expiration date must be in Y-m-d H:i:s format.',
            'date_expiration.after' => 'The expiration date must be in the future.',
        ];
    }
}
