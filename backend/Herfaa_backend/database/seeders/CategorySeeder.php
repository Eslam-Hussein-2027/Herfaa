<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['نجارة', 'Carpentry', 'carpentry', 'Hammer'],
            ['سباكة', 'Plumbing', 'plumbing', 'Droplets'],
            ['كهرباء', 'Electrical', 'electrical', 'Zap'],
            ['دهان', 'Painting', 'painting', 'Paintbrush'],
            ['تكييف وتبريد', 'HVAC', 'hvac', 'Wind'],
            ['خياطة', 'Tailoring', 'tailoring', 'Scissors'],
            ['حدادة', 'Blacksmithing', 'blacksmithing', 'Flame'],
            ['بلاط ورخام', 'Tiling', 'tiling', 'LayoutGrid'],
            ['تنظيف', 'Cleaning', 'cleaning', 'Sparkles'],
            ['صيانة أجهزة', 'Appliance Repair', 'appliance-repair', 'Wrench'],
        ];

        foreach ($categories as $i => [$ar, $en, $slug, $icon]) {
            Category::updateOrCreate(['slug' => $slug], [
                'name_ar' => $ar,
                'name_en' => $en,
                'icon' => $icon,
                'is_active' => true,
                'sort_order' => $i,
            ]);
        }
    }
}
