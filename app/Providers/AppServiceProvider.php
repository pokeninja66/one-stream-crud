<?php

namespace App\Providers;

use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(\L5Swagger\L5SwaggerServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(UrlGenerator $url): void
    {
        // Render.com specific logic, because it's not possible to set the APP_URL in the .env file for some reason...
        if (app()->environment('production') || request()->getHost() === 'one-stream-crud.onrender.com') {
            $url->forceScheme('https');
            $url->forceRootUrl('https://one-stream-crud.onrender.com');
        }
        // Always force HTTPS backup variant
        // $url->forceScheme('https');
    }
}
