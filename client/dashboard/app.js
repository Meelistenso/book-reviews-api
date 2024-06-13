let idToken;
try {
  idToken = localStorage.getItem('idToken');
} catch (e) {
  console.log(e);
}
if (!idToken) {
  window.location.pathname = '/';
}

function test() {
  return fetch('http://34.49.238.170/api-gateway/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      title: 'title',
      description: 'description',
      rating: 'rating',
      bookId: 'bookId',
      userId: 'userId',
    }),
  });
}

test();
