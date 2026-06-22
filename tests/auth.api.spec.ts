import { test, expect } from '@playwright/test';

test.describe('Authentication API', () => {
  test('valid credentials return a token', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { username: 'admin', password: 'secret' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).token).toBeTruthy();
  });

  test('invalid credentials are rejected with 401', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { username: 'admin', password: 'wrong' },
    });
    expect(res.status()).toBe(401);
  });

  test('a write without a token is unauthorized (401)', async ({ request }) => {
    const res = await request.post('/api/users', {
      data: { name: 'X', email: 'x@example.com' },
    });
    expect(res.status()).toBe(401);
  });
});
