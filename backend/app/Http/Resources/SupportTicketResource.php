<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SupportTicket */
class SupportTicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'status' => $this->status,
            'subject' => $this->subject,
            'description' => $this->description,
            'attachmentName' => $this->attachment_name,
            'supportComment' => $this->support_comment,
            'estimatedResolutionDate' => $this->estimated_resolution_date?->toDateString(),
            'openedAt' => $this->opened_at?->toIso8601String(),
            'reporter' => $this->whenLoaded('reporter', function () {
                return [
                    'id' => $this->reporter->id,
                    'name' => $this->reporter->name,
                    'username' => $this->reporter->username,
                    'role' => $this->reporter->role?->name,
                    'roleLabel' => $this->reporter->role?->display_name,
                ];
            }),
            'technician' => $this->whenLoaded('technician', function () {
                return [
                    'id' => $this->technician->id,
                    'name' => $this->technician->name,
                    'username' => $this->technician->username,
                    'role' => $this->technician->role?->name,
                    'roleLabel' => $this->technician->role?->display_name,
                ];
            }),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
