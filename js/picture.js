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

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.pictureList.length; i++) {
    fragment.appendChild(renderPicture(window.pictureList[i].url
        , window.pictureList[i].likes
        , window.pictureList[i].commentList.length));
  }

  pictureBlock.appendChild(fragment);
})();
