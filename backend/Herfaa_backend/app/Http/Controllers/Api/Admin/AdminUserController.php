<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserAdminResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = User::query()->with('providerProfile')->latest();

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        if ($search = $request->query('search')) {
            $query->where(fn ($w) => $w
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%"));
        }

        return $this->paginated($query->paginate(15), UserAdminResource::class);
    }

    public function suspend(User $user)
    {
        if ($user->isAdmin()) {
            return $this->error('لا يمكن إيقاف حساب مدير.', 422);
        }

        $user->update(['status' => UserStatus::Suspended]);
        $user->tokens()->delete(); // force logout everywhere

        return $this->success(new UserAdminResource($user->load('providerProfile')), 'تم إيقاف الحساب.');
    }

    public function activate(User $user)
    {
        $user->update(['status' => UserStatus::Active]);

        return $this->success(new UserAdminResource($user->load('providerProfile')), 'تم تفعيل الحساب.');
    }
}
