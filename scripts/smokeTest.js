/* eslint-disable no-console */
// scripts/smokeTest.js
// End-to-end smoke test for the API (run locally, not inside restricted sandboxes).

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const jsonHeaders = { 'Content-Type': 'application/json' };

const request = async (method, path, body, token) => {
  const headers = { ...jsonHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return { ok: res.ok, status: res.status, data };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const run = async () => {
  console.log(`BASE_URL: ${BASE_URL}`);

  // Health
  const health = await request('GET', '/api/health');
  assert(health.ok, `Health failed: ${health.status}`);

  // Register (unique email)
  const unique = Date.now();
  const email = `student${unique}@example.com`;
  const password = 'password123';

  const register = await request('POST', '/api/auth/register', {
    name: 'Test Student',
    email,
    password,
  });
  assert(register.ok, `Register failed: ${register.status}`);
  assert(register.data?.token, 'Register token missing');
  const token = register.data.token;

  // Create products
  const productsToCreate = [
    {
      name: 'Smart Phone X',
      description: 'A phone with good camera',
      price: 699,
      category: 'Electronics',
      stock: 5,
    },
    {
      name: 'Phone Case',
      description: 'Protective cover for phone',
      price: 19,
      category: 'electronics',
      stock: 50,
    },
    {
      name: 'Running Shoes',
      description: 'Comfortable shoes for sports',
      price: 120,
      category: 'Sports',
      stock: 10,
    },
    {
      name: 'Bluetooth Headphones',
      description: 'Wireless headphones',
      price: 89,
      category: 'Electronics',
      stock: 15,
    },
  ];

  const created = [];
  for (const p of productsToCreate) {
    const createdRes = await request('POST', '/api/products', p, token);
    assert(createdRes.ok, `Create product failed: ${createdRes.status}`);
    const createdId = createdRes.data?.product?._id;
    assert(createdId, 'Created product id missing');
    created.push({ id: createdId, name: p.name });
  }

  // GET all (basic)
  const all = await request('GET', '/api/products');
  assert(all.ok, `GET products failed: ${all.status}`);
  assert(Array.isArray(all.data?.data), 'GET products response missing data[]');

  // Search: keyword=phone (name or description)
  const search = await request('GET', '/api/products?keyword=phone');
  assert(search.ok, `Search failed: ${search.status}`);
  assert(search.data?.data?.length >= 2, 'Search did not return expected products');

  // Filter: category + price range
  const filter = await request('GET', '/api/products?category=electronics&minPrice=50&maxPrice=800');
  assert(filter.ok, `Filter failed: ${filter.status}`);

  // Sort: descending by price
  const sorted = await request('GET', '/api/products?sort=-price');
  assert(sorted.ok, `Sort failed: ${sorted.status}`);
  const sortedData = sorted.data?.data || [];
  if (sortedData.length >= 2) {
    assert(sortedData[0].price >= sortedData[1].price, 'Sort -price is not working');
  }

  // Pagination
  const paged = await request('GET', '/api/products?page=1&limit=2&sort=price');
  assert(paged.ok, `Pagination failed: ${paged.status}`);
  assert(paged.data?.page === 1, 'Pagination page value incorrect');
  assert(typeof paged.data?.pages === 'number', 'Pagination pages missing');
  assert(paged.data?.data?.length <= 2, 'Pagination limit not applied');

  // Update + Delete one product to confirm protected routes still work
  const firstId = created[0].id;
  const updated = await request('PUT', `/api/products/${firstId}`, { price: 650 }, token);
  assert(updated.ok, `Update failed: ${updated.status}`);

  const deleted = await request('DELETE', `/api/products/${firstId}`, null, token);
  assert(deleted.ok, `Delete failed: ${deleted.status}`);

  console.log('✅ Smoke test completed successfully.');
};

run().catch((err) => {
  console.error('❌ Smoke test failed:', err.message);
  process.exit(1);
});

