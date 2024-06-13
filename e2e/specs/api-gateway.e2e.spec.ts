describe('Api Gateway', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'agnostic.prayer@gmail.com',
      password: 'StrogPassword123!@',
    };
    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    jwt = await response.text();
  });

  test('Create & Get', async () => {
    const createdReview = await createReview();
    const responseGet = await fetch(
      `http://api-gateway:3000/reviews/${createdReview._id}`,
      {
        headers: {
          Authentication: jwt,
        },
      },
    );
    const review = await responseGet.json();
    expect(createdReview).toEqual(review);
  });

  const createReview = async () => {
    const responseCreate = await fetch(
      'http://reservations:3000/reviews',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
        body: JSON.stringify({
          startDate: '02-01-2023',
          endDate: '02-05-2023',
          placeId: '123',
          invoiceId: '123',
          // TODO: fix
        }),
      },
    );
    expect(responseCreate.ok).toBeTruthy();
    return responseCreate.json();
  };
});
