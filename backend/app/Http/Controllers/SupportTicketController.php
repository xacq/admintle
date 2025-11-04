<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupportTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tickets = SupportTicket::query()
            ->with(['reporter.role', 'technician.role'])
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->input('category'));
            })
            ->when($request->filled('reporter_id'), function ($query) use ($request) {
                $query->where('reporter_id', $request->integer('reporter_id'));
            })
            ->orderByDesc('opened_at')
            ->orderByDesc('created_at')
            ->get();

        return SupportTicketResource::collection($tickets)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reporterId' => ['required', 'integer', Rule::exists('users', 'id')],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'attachmentName' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'openedAt' => ['nullable', 'date'],
        ]);

        $ticket = SupportTicket::create([
            'reporter_id' => $data['reporterId'],
            'category' => $data['category'],
            'description' => $data['description'],
            'attachment_name' => $data['attachmentName'] ?? null,
            'subject' => $data['subject'] ?? null,
            'opened_at' => $data['openedAt'] ?? now(),
            'status' => 'Pendiente',
        ]);

        $ticket->load(['reporter.role', 'technician.role']);

        return (new SupportTicketResource($ticket))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, SupportTicket $supportTicket): JsonResponse
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', Rule::in(['Pendiente', 'En revisión', 'Resuelto', 'Error crítico'])],
            'technicianId' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'supportComment' => ['nullable', 'string'],
            'estimatedResolutionDate' => ['nullable', 'date'],
        ]);

        $supportTicket->fill([
            'status' => $data['status'] ?? $supportTicket->status,
            'technician_id' => array_key_exists('technicianId', $data)
                ? $data['technicianId']
                : $supportTicket->technician_id,
            'support_comment' => $data['supportComment'] ?? $supportTicket->support_comment,
            'estimated_resolution_date' => array_key_exists('estimatedResolutionDate', $data)
                ? $data['estimatedResolutionDate']
                : $supportTicket->estimated_resolution_date,
        ])->save();

        $supportTicket->load(['reporter.role', 'technician.role']);

        return (new SupportTicketResource($supportTicket))->response();
    }
}
