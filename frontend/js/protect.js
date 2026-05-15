(function () {
  function redirect() {
    window.location.replace('/login.html');
  }

  fetch('/api/profile', { credentials: 'same-origin' })
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      if (!d || !d.success) redirect();
    })
    .catch(redirect);
})();
