<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\AcceptBookingRequest;
use App\Http\Requests\Booking\CancelBookingRequest;
use App\Http\Requests\Booking\RejectBookingRequest;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Resources\Customer\BookingResource;
use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Services\Customer\BookingService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly BookingService $service) {}

    /** Role-aware list: a customer sees their bookings, a provider sees incoming ones. */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Booking::query()
            ->with(['service', 'provider.user', 'customer', 'review'])
            ->latest();

        if ($user->isProvider()) {
            $query->where('provider_profile_id', $user->providerProfile()->value('id'));
        } else {
            $query->where('customer_id', $user->id);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return $this->success(BookingResource::collection($query->get()), 'OK');
    }

    public function store(StoreBookingRequest $request)
    {
        $provider = ProviderProfile::findOrFail($request->integer('provider_id'));

        if (! $provider->isApproved()) {
            return $this->error('هذا الحِرفي غير متاح للحجز حالياً.', 422);
        }

        if ($provider->user_id === $request->user()->id) {
            return $this->error('لا يمكنك إرسال طلب حجز لنفسك.', 422);
        }

        $booking = $this->service->create($request->user(), $provider, $request->validated());

        return $this->respond($booking, 'تم إرسال طلب الحجز بنجاح.', 201);
    }

    public function show(Request $request, Booking $booking)
    {
        $this->authorize('view', $booking);

        return $this->respond($booking, 'OK');
    }

    public function accept(AcceptBookingRequest $request, Booking $booking)
    {
        $this->authorize('manage', $booking);
        $this->service->accept($booking, $request->validated()['agreed_price'] ?? null);

        return $this->respond($booking, 'تم قبول الطلب.');
    }

    public function reject(RejectBookingRequest $request, Booking $booking)
    {
        $this->authorize('manage', $booking);
        $this->service->reject($booking, $request->validated()['reason']);

        return $this->respond($booking, 'تم رفض الطلب.');
    }

    public function start(Request $request, Booking $booking)
    {
        $this->authorize('manage', $booking);
        $this->service->start($booking);

        return $this->respond($booking, 'تم بدء تنفيذ الطلب.');
    }

    public function complete(Request $request, Booking $booking)
    {
        $this->authorize('manage', $booking);
        $this->service->complete($booking);

        return $this->respond($booking, 'تم إنجاز الطلب.');
    }

    public function cancel(CancelBookingRequest $request, Booking $booking)
    {
        $this->authorize('cancel', $booking);
        $this->service->cancel($booking, $request->validated()['reason'] ?? 'ألغى العميل الطلب');

        return $this->respond($booking, 'تم إلغاء الطلب.');
    }

    private function respond(Booking $booking, string $message, int $status = 200)
    {
        $booking->load(['service', 'provider.user', 'customer', 'review']);

        return $this->success(new BookingResource($booking), $message, $status);
    }
}
