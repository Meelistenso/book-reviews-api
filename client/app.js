/* eslint-disable @typescript-eslint/no-unused-vars */

// Firebase config and initialization
var firebaseConfig = {
  apiKey: 'AIzaSyCZHnMocOA8IJZ2c2YrqkbsKfcv5FbLbMc',
  authDomain: 'pet-pproject.firebaseapp.com',
};
firebase.initializeApp(firebaseConfig);

function handleSignInSuccess(userCredential) {
  localStorage.setItem('user', JSON.stringify(userCredential));
  firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      localStorage.setItem('idToken', idToken);
      window.location.pathname = '/dashboard/';
    });
}

function signInWithEmail() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('message').innerHTML =
        'Signed in with email successfully!';
      handleSignInSuccess(userCredential);
    })
    .catch((error) => {
      document.getElementById('message').innerHTML = error.message;
    });
}

function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      document.getElementById('message').innerHTML =
        'Signed in with Google successfully!';
      handleSignInSuccess(result);
    })
    .catch((error) => {
      document.getElementById('message').innerHTML = error.message;
    });
}
