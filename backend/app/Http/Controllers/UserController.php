<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('role')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->transformUser($user));

        return response()->json(['data' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_active' => true,
        ]);

        $user->load('role');

        return response()->json(['data' => $this->transformUser($user)], 201);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('role');

        return response()->json(['data' => $this->transformUser($user)]);
    }

    public function toggle(User $user): JsonResponse
    {
        $user->is_active = ! $user->is_active;
        $user->save();

        $user->load('role');

        return response()->json(['data' => $this->transformUser($user)]);
    }

    public function roles(): JsonResponse
    {
        $roles = Role::orderBy('display_name')
            ->get(['id', 'name', 'display_name as displayName']);

        return response()->json(['data' => $roles]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->username = $validated['username'];
        $user->role_id = $validated['role_id'];

        $password = $validated['password'] ?? null;

        if (! empty($password)) {
            $user->password = Hash::make($password);
        }

        $user->save();

        $user->load('role');

        return response()->json(['data' => $this->transformUser($user)]);
    }

    public function destroy(User $user): Response
    {
        $user->delete();

        return response()->noContent();
    }

    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'role' => [
                'id' => $user->role?->id,
                'name' => $user->role?->name,
                'displayName' => $user->role?->display_name,
            ],
            'isActive' => (bool) $user->is_active,
            'createdAt' => optional($user->created_at)->toIso8601String(),
        ];
    }
}
