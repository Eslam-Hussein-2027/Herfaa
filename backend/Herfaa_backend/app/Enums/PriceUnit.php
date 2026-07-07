<?php

namespace App\Enums;

enum PriceUnit: string
{
    case Fixed = 'fixed';   // سعر مقطوع
    case Hourly = 'hourly'; // بالساعة
    case Visit = 'visit';   // سعر الزيارة
}
