/* eslint-disable @typescript-eslint/no-unused-vars */

// Firebase config and initialization
var firebaseConfig = {
  apiKey: 'AIzaSyCZHnMocOA8IJZ2c2YrqkbsKfcv5FbLbMc',
  authDomain: 'pet-pproject.firebaseapp.com',
};
firebase.initializeApp(firebaseConfig);

function handleSignUpSuccess(userCredential) {
  localStorage.setItem('user', JSON.stringify(userCredential));
  firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      localStorage.setItem('idToken', idToken);
      window.location.pathname = '/dashboard/';
    });
}

function signUpWithEmail() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('message').innerHTML =
        'Signed up with email successfully!';
      handleSignUpSuccess(userCredential);
    })
    .catch((error) => {
      document.getElementById('message').innerHTML = error.message;
    });
}

function signUpWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      document.getElementById('message').innerHTML =
        'Signed up with Google successfully!';
      handleSignUpSuccess(result);
    })
    .catch((error) => {
      document.getElementById('message').innerHTML = error.message;
    });
}
