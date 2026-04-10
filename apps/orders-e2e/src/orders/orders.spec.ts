import axios from 'axios';
import { randomUUID } from 'crypto';

// Helper to wait for the event handler to propagate data to Read DB
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

describe('CQRS Orders API (e2e)', () => {
  const orderId = randomUUID();
  const customer = 'Jane Doe ' + Date.now();

  it('should create an order (Write DB Command)', async () => {
    const payload = {
      orderId,
      customer,
      products: [
        { productId: 'P-100', quantity: 1, price: 50 },
        { productId: 'P-200', quantity: 2, price: 25 },
      ]
    };

    const res = await axios.post('/api/orders', payload);
    
    // Commands usually return 201 Created from NestJS
    expect(res.status).toBe(201);
  });

  it('should fetch the created order from the Read DB (Query)', async () => {
    // Wait slightly to let the internal memory event bus sync the Mongoose document
    await delay(300);

    const res = await axios.get(`/api/orders/${orderId}`);
    
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data.id).toBe(orderId);
    expect(res.data.customer).toBe(customer);
    expect(res.data.status).toBe('Created');
    expect(res.data.totalAmount).toBe(100); // 1*50 + 2*25
  });

  it('should change the order state (Command) and reflect in Read DB', async () => {
    const patchRes = await axios.patch(`/api/orders/${orderId}/state`, {
      newState: 'Paid'
    });
    expect(patchRes.status).toBe(200);

    await delay(300);

    const res = await axios.get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('Paid');
  });

  it('should retrieve a sales summary from Read DB Aggregations (Query)', async () => {
    const res = await axios.get('/api/orders/sales-summary');
    
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    // We use GreaterThanOrEqual because other tests might have seeded the DB
    expect(res.data.totalOrders).toBeGreaterThanOrEqual(1);
    expect(res.data.totalSold).toBeGreaterThanOrEqual(100);
    
    // Top products should contain P-200 since it has quantity 2
    const topProd = res.data.topProducts.find((p: any) => p.productId === 'P-200');
    expect(topProd).toBeDefined();
    expect(topProd.totalQuantity).toBeGreaterThanOrEqual(2);
  });
});
