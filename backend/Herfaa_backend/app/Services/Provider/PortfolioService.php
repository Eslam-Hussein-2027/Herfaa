<?php

namespace App\Services\Provider;

use App\Models\PortfolioItem;
use App\Models\ProviderProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PortfolioService
{
    public function store(ProviderProfile $profile, UploadedFile $image, ?string $caption): PortfolioItem
    {
        $path = $image->store("portfolios/{$profile->id}", 'public');
        $sort = (int) $profile->portfolioItems()->max('sort_order') + 1;

        return $profile->portfolioItems()->create([
            'image_path' => $path,
            'caption' => $caption,
            'sort_order' => $sort,
        ]);
    }

    public function delete(PortfolioItem $item): void
    {
        Storage::disk('public')->delete($item->image_path);
        $item->delete();
    }

    /**
     * @param  array<int, int>  $ids
     */
    public function reorder(ProviderProfile $profile, array $ids): void
    {
        foreach (array_values($ids) as $index => $id) {
            $profile->portfolioItems()->whereKey($id)->update(['sort_order' => $index]);
        }
    }
}
