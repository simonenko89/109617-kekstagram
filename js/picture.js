'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var pictureBlock = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');

  var renderPicture = function (url, likes, comments) {

    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__stat--likes').textContent = likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = comments;

    return pictureElement;
  };

  var renderPictureBlock = function (picturesArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 25; i++) {
      fragment.appendChild(renderPicture(picturesArray[i].url
          , picturesArray[i].likes, picturesArray[i].comments.length));
    }

    pictureBlock.appendChild(fragment);
  };

  var onSuccess = function (data) {
    var pictureLists = [];
    renderPictureBlock(data);

    for (var i = 0; i < 25; i++) {
      pictureLists[i] = {
        url: data[i].url,
        likes: data[i].likes,
        comments: data[i].comments
      };
    }

    window.picture.pictureLists = pictureLists;

    imageFilters.classList.remove('img-filters--inactive');
  };

  window.backend.load(onSuccess, window.util.onError);

  var imageFilterButtons = document.querySelectorAll('.img-filters__button');
  var recommendedFilter = document.querySelector('#filter-recommended');
  var popularFilter = document.querySelector('#filter-popular');
  var discussedFilter = document.querySelector('#filter-discussed');
  var randomFilter = document.querySelector('#filter-random');

  var setActiveClass = function (activeBlock) {
    for (var i = 0; i < imageFilterButtons.length; i++) {
      imageFilterButtons[i].classList.remove('img-filters__button--active');
    }
    activeBlock.classList.add('img-filters__button--active');
  };

  var cleanPictureBlock = function () {
    var pictures = pictureBlock.querySelectorAll('.picture__link');
    for (var i = 0; i < pictures.length; i++) {
      pictureBlock.removeChild(pictures[i]);
    }
  };

  var lastTimeout;
  var debounce = function (fun, data) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      fun(data);
    }, DEBOUNCE_INTERVAL);
  };

  recommendedFilter.addEventListener('click', function () {
    cleanPictureBlock();
    setActiveClass(recommendedFilter);
    debounce(renderPictureBlock, window.picture.pictureLists);
  });

  popularFilter.addEventListener('click', function () {
    cleanPictureBlock();
    setActiveClass(popularFilter);

    var newPictureLists = window.picture.pictureLists.slice().sort(function (first, second) {
      return second.likes - first.likes;
    });

    debounce(renderPictureBlock, newPictureLists);
  });

  discussedFilter.addEventListener('click', function () {
    cleanPictureBlock();
    setActiveClass(discussedFilter);

    var newPictureLists = window.picture.pictureLists.slice().sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });

    debounce(renderPictureBlock, newPictureLists);
  });

  randomFilter.addEventListener('click', function () {
    cleanPictureBlock();
    setActiveClass(randomFilter);

    var newPictureLists = window.picture.pictureLists.slice().sort(function () {
      return Math.random() - Math.random();
    });

    debounce(renderPictureBlock, newPictureLists);
  });

})();
