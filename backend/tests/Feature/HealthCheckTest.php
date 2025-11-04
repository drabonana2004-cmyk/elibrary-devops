<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test health check endpoint returns healthy status.
     */
    public function test_health_check_returns_healthy_status(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'timestamp',
                     'services' => [
                         'database',
                         'cache'
                     ]
                 ])
                 ->assertJson([
                     'status' => 'healthy',
                     'services' => [
                         'database' => 'connected'
                     ]
                 ]);
    }

    /**
     * Test metrics endpoint returns prometheus format.
     */
    public function test_metrics_endpoint_returns_prometheus_format(): void
    {
        $response = $this->get('/api/metrics');

        $response->assertStatus(200)
                 ->assertHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');

        $content = $response->getContent();
        $this->assertStringContains('http_requests_total', $content);
        $this->assertStringContains('memory_usage_bytes', $content);
    }

    /**
     * Test dashboard stats endpoint.
     */
    public function test_dashboard_stats_endpoint(): void
    {
        $response = $this->get('/api/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'stats' => [
                         'total_books',
                         'total_users',
                         'active_loans',
                         'overdue_loans'
                     ],
                     'popular_books',
                     'recent_loans'
                 ]);
    }

    /**
     * Test books endpoint returns array.
     */
    public function test_books_endpoint_returns_array(): void
    {
        $response = $this->get('/api/books');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'title',
                         'author',
                         'available'
                     ]
                 ]);
    }

    /**
     * Test users endpoint returns array.
     */
    public function test_users_endpoint_returns_array(): void
    {
        $response = $this->get('/api/users');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'name',
                         'email',
                         'status'
                     ]
                 ]);
    }
}