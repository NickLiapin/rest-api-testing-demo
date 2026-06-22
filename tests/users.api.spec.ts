import { test, expect, type APIRequestContext } from '@playwright/test';
import { userSchema, validateSchema } from '../utils/schemas';

async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/api/login', {
    data: { username: 'admin', password: 'secret' },
  });
  return (await res.json()).token as string;
}

async function authHeaders(request: APIRequestContext) {
  return { Authorization: `Bearer ${await getToken(request)}` };
}

test.describe('Users API', () => {
  test('GET /api/users returns a list of schema-valid users', async ({ request }) => {
    const res = await request.get('/api/users');
    expect(res.status()).toBe(200);
    const users = await res.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    users.forEach((u: unknown) => validateSchema(userSchema, u));
  });

  test('GET /api/users/:id returns a single user', async ({ request }) => {
    const res = await request.get('/api/users/1');
    expect(res.status()).toBe(200);
    validateSchema(userSchema, await res.json());
  });

  test('GET an unknown user returns 404', async ({ request }) => {
    const res = await request.get('/api/users/999999');
    expect(res.status()).toBe(404);
  });

  test('POST creates a user and echoes it (201)', async ({ request }) => {
    const res = await request.post('/api/users', {
      headers: await authHeaders(request),
      data: { name: 'Grace Hopper', email: 'grace@example.com' },
    });
    expect(res.status()).toBe(201);
    const created = await res.json();
    validateSchema(userSchema, created);
    expect(created.name).toBe('Grace Hopper');

    const fetched = await request.get(`/api/users/${created.id}`);
    expect(fetched.status()).toBe(200);
  });

  test('POST with an invalid email returns 400', async ({ request }) => {
    const res = await request.post('/api/users', {
      headers: await authHeaders(request),
      data: { name: 'Bad', email: 'not-an-email' },
    });
    expect(res.status()).toBe(400);
  });

  test('PUT updates an existing user', async ({ request }) => {
    const headers = await authHeaders(request);
    const created = await (
      await request.post('/api/users', {
        headers,
        data: { name: 'Temp', email: 'temp@example.com' },
      })
    ).json();

    const res = await request.put(`/api/users/${created.id}`, {
      headers,
      data: { name: 'Updated Name' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).name).toBe('Updated Name');
  });

  test('DELETE removes a user (204) and it is gone afterwards', async ({ request }) => {
    const headers = await authHeaders(request);
    const created = await (
      await request.post('/api/users', {
        headers,
        data: { name: 'ToDelete', email: 'del@example.com' },
      })
    ).json();

    const del = await request.delete(`/api/users/${created.id}`, { headers });
    expect(del.status()).toBe(204);

    const after = await request.get(`/api/users/${created.id}`);
    expect(after.status()).toBe(404);
  });
});
