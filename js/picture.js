'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var pictureBlock = document.querySelector('.pictures');

  var renderPicture = function (url, likes, comments) {

    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__stat--likes').textContent = likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = comments;

    return pictureElement;
  };

  var onSuccess = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < 25; i++) {
      fragment.appendChild(renderPicture(data[i].url, data[i].likes, data[i].comments.length));
    }

    pictureBlock.appendChild(fragment);
  };

  window.backend.load(onSuccess, window.util.onError);

})();
