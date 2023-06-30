import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import routes from '../src/routes'; 

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/', routes);

describe('Aircraft API', () => {
  let testAircraftId: string;

  // Create a new aircraft before running tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/aircrafts')
      .send({
        model: 'Test Model',
        registration: 'TEST123',
        manufacturer: 'Test Manufacturer',
        capacity: 100,
        status: 'in service'
      });
    testAircraftId = response.body.id;
  });

  // Test GET all aircrafts
  it('should get all aircrafts', async () => {
    const response = await request(app).get('/api/aircrafts');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test GET single aircraft
  it('should get a single aircraft by ID', async () => {
    const response = await request(app).get(`/api/aircrafts/${testAircraftId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testAircraftId);
  });

  // Test POST create aircraft
  it('should create a new aircraft', async () => {
    const response = await request(app)
      .post('/api/aircrafts')
      .send({
        model: 'New Model',
        registration: 'NEW123',
        manufacturer: 'New Manufacturer',
        capacity: 150,
        status: 'under maintenance'
      });
    expect(response.status).toBe(201);
    expect(response.body.model).toBe('New Model');
  });

  // Test PUT update aircraft
  it('should update an existing aircraft', async () => {
    const response = await request(app)
      .put(`/api/aircrafts/${testAircraftId}`)
      .send({ status: 'retired' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('retired');
  });

  // Test DELETE aircraft
  it('should delete an aircraft', async () => {
    const response = await request(app).delete(`/api/aircrafts/${testAircraftId}`);
    expect(response.status).toBe(204);
  });

  // Clean up after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
});
