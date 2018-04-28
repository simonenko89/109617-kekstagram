'use strict';

(function () {
  window.util = {
    getRandomNumber: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    ESC_KEYCODE: 27,
    onError: function (errorMessage) {
      var errorMessageBlock = document.createElement('div');
      errorMessageBlock.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      errorMessageBlock.style.position = 'absolute';
      errorMessageBlock.style.left = 0;
      errorMessageBlock.style.right = 0;
      errorMessageBlock.style.fontSize = '20px';

      errorMessageBlock.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorMessageBlock);
    }
  };
})();
