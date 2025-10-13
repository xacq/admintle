<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            return response('', Response::HTTP_NO_CONTENT)->withHeaders($this->headers());
        }

        $response = $next($request);

        foreach ($this->headers() as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }

    /**
     * @return array<string, string>
     */
    private function headers(): array
    {
        return [
            'Access-Control-Allow-Origin' => env('FRONTEND_URL', 'http://localhost:3000'),
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Origin, Content-Type, X-Requested-With, Authorization, Accept',
            'Access-Control-Allow-Credentials' => 'true',
        ];
    }
}
