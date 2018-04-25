'use strict';

(function () {
  window.util = {
    getRandomNumber: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    ESC_KEYCODE: 27
  };
})();
