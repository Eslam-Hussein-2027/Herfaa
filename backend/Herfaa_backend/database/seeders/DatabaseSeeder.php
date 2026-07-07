<?php

namespace Database\Seeders;

use App\Enums\ApprovalStatus;
use App\Enums\PriceUnit;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(CategorySeeder::class);

        // Seeded admin (admins are never self-registered).
        User::factory()->admin()->create([
            'name' => 'مدير حِرفة',
            'email' => 'admin@herfaa.ly',
            'phone' => '0910000000',
        ]);

        // Sample customer.
        $customer = User::factory()->customer()->create([
            'name' => 'اسلام حسين ',
            'email' => 'islam@herfaa.ly',
            'phone' => '0911111111',
        ]);

        // Sample APPROVED provider with a full profile, skills and services.
        $providerUser = User::factory()->provider()->create([
            'name' => 'محمد النجّار',
            'email' => 'provider@herfaa.ly',
            'phone' => '0912222222',
        ]);

        $carpentry = Category::where('slug', 'carpentry')->first();

        $profile = $providerUser->providerProfile()->create([
            'category_id' => $carpentry?->id,
            'headline' => 'نجّار محترف بخبرة 10 سنوات',
            'bio' => 'متخصص في صناعة وتركيب الأثاث الخشبي والأبواب والمطابخ بجودة عالية.',
            'address' => 'شارع جامعة طرابلس',
            'city' => 'طرابلس',
            'base_price' => 50,
            'price_unit' => PriceUnit::Visit,
            'approval_status' => ApprovalStatus::Approved,
        ]);

        $profile->skills()->createMany([
            ['name' => 'تركيب أثاث'],
            ['name' => 'تفصيل مطابخ'],
            ['name' => 'إصلاح أبواب'],
        ]);

        $profile->services()->createMany([
            [
                'category_id' => $carpentry?->id,
                'title' => 'تفصيل وتركيب مطبخ خشبي',
                'description' => 'تفصيل وتركيب مطابخ خشبية حسب الطلب والمساحة.',
                'price' => 800,
                'price_unit' => PriceUnit::Fixed,
                'is_active' => true,
            ],
            [
                'category_id' => $carpentry?->id,
                'title' => 'إصلاح وصيانة الأبواب',
                'description' => 'صيانة وإصلاح الأبواب الخشبية والمفصّلات.',
                'price' => 60,
                'price_unit' => PriceUnit::Visit,
                'is_active' => true,
            ],
        ]);

        // A second provider still PENDING approval (for the admin queue later).
        User::factory()->provider()->create([
            'name' => 'سالم الكهربائي',
            'email' => 'pending@herfaa.ly',
            'phone' => '0913333333',
        ])->providerProfile()->create([
            'category_id' => Category::where('slug', 'electrical')->value('id'),
            'headline' => 'كهربائي منازل',
            'city' => 'بنغازي',
            'price_unit' => PriceUnit::Visit,
            'approval_status' => ApprovalStatus::Pending,
        ]);

        // Sample pending booking from the customer to the approved provider.
        \App\Models\Booking::create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $profile->id,
            'status' => 'pending',
            'description' => 'أحتاج تركيب باب خشبي رئيسي للمنزل.',
            'address' => 'حي الأندلس، طرابلس',
            'agreed_price' => 60,
            'payment_method' => 'cash',
            'payment_status' => 'unpaid',
        ]);

        // A completed booking with a review (drives the provider's rating).
        $completed = \App\Models\Booking::create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $profile->id,
            'service_id' => $profile->services()->value('id'),
            'status' => 'completed',
            'description' => 'تركيب خزانة ملابس خشبية في غرفة النوم.',
            'address' => 'حي الأندلس، طرابلس',
            'agreed_price' => 500,
            'payment_method' => 'cash',
            'payment_status' => 'paid',
        ]);

        \App\Models\Review::create([
            'booking_id' => $completed->id,
            'customer_id' => $customer->id,
            'provider_profile_id' => $profile->id,
            'rating' => 5,
            'comment' => 'عمل ممتاز ودقيق، التزم بالموعد والسعر. أنصح به بشدة.',
            'status' => 'visible',
        ]);

        $profile->forceFill(['rating_avg' => 5.0, 'rating_count' => 1])->save();

        \App\Models\Faq::insert([
            ['question' => 'كيف أحجز حِرفياً؟', 'answer' => 'ابحث عن الحِرفي المناسب، افتح ملفه، واضغط "احجز الآن" ثم أدخل تفاصيل المهمة.', 'sort_order' => 1, 'is_published' => true, 'created_at' => now(), 'updated_at' => now()],
            ['question' => 'كيف يتم الدفع؟', 'answer' => 'الدفع نقداً مباشرة للحِرفي بعد إنجاز العمل.', 'sort_order' => 2, 'is_published' => true, 'created_at' => now(), 'updated_at' => now()],
            ['question' => 'كيف أصبح حِرفياً معتمداً؟', 'answer' => 'سجّل كحِرفي، أكمل ملفك الشخصي، وانتظر اعتماد الإدارة لحسابك.', 'sort_order' => 3, 'is_published' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
