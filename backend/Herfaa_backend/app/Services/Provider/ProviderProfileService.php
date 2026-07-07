<?php

namespace App\Services\Provider;

use App\Models\ProviderProfile;

class ProviderProfileService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function update(ProviderProfile $profile, array $data): ProviderProfile
    {
        $profile->update($data);

        return $profile;
    }

    /**
     * Replace the provider's skill set with the given names (deduped, trimmed).
     *
     * @param  array<int, string>  $skills
     */
    public function syncSkills(ProviderProfile $profile, array $skills): void
    {
        $profile->skills()->delete();

        $rows = collect($skills)
            ->map(fn ($name) => trim($name))
            ->filter()
            ->unique()
            ->map(fn ($name) => ['name' => $name])
            ->values()
            ->all();

        if ($rows) {
            $profile->skills()->createMany($rows);
        }
    }
}
