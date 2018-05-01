'use strict';

(function () {
  window.backend = {
    load: function (onSuccess, onError) {
      var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onSuccess(JSON.parse(xhr.responseText));
            break;
          default:
            onError('Ошибка. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }

      });

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },
    upload: function (data, onSuccess, onError) {
      var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onSuccess(JSON.parse(xhr.responseText));
            break;
          default:
            onError('Ошибка. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
