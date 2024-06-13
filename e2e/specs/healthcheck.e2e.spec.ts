import { ping } from 'tcp-ping';

describe('Health', () => {
  test('ApiGateway', async () => {
    const response = await fetch('http://api-gateway:3000');
    expect(response.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3001');
    expect(response.ok).toBeTruthy();
  });

  test('Books', (done) => {
    ping({ address: 'books', port: 3003 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test('Reviews', (done) => {
    ping({ address: 'reviews', port: 3004 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });
});
