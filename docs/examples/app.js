(function (mokit) {

  mokit({
    element: document.getElementById('app'),
    data: function () {
      return { name: '' };
    },
    say: function (name) {
      this.name = name;
    }

  }).start();

})(mokit);