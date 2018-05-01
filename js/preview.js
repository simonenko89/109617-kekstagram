'use strict';

(function () {
  // Работа с большой фотографией
  var pictureBlock = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var commentsBlock = bigPicture.querySelectorAll('.social__comment');

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  var onPictureBlockClick = function (evt) {
    var clickedSrc = evt.target.src;
    var clickedLikes = '';
    var clickedCommentsCnt = '';

    if (evt.target.parentElement.querySelector('.picture__stat--likes')) {
      clickedLikes = evt.target.parentElement.querySelector('.picture__stat--likes').textContent;
    }

    if (evt.target.parentElement.querySelector('.picture__stat--comments')) {
      clickedCommentsCnt = evt.target.parentElement.querySelector('.picture__stat--comments').textContent;
    }

    if (clickedSrc && clickedLikes && clickedCommentsCnt) {
      bigPicture.classList.remove('hidden');
      document.querySelector('body').classList.add('modal-open');
      document.addEventListener('keydown', onBigPictureEscPress);

      bigPicture.querySelector('.big-picture__img').children[0].src = clickedSrc;
      bigPicture.querySelector('.likes-count').textContent = clickedLikes;
      bigPicture.querySelector('.comments-count').textContent = clickedCommentsCnt;

      for (var i = 0; i < window.picture.pictureList.length; i++) {
        if (clickedSrc.match(window.picture.pictureList[i].url)) {
          var currentPictureElement = window.picture.pictureList[i];
        }
      }

      for (i = 0; i < commentsBlock.length; i++) {
        commentsBlock[i].children[0].src = 'img/avatar-' + window.util.getRandomNumber(1, 6) + '.svg';
        commentsBlock[i].childNodes[2].textContent = currentPictureElement.comments[i];
      }

      if (currentPictureElement.comments.length === 1) {
        commentsBlock[1].classList.add('visually-hidden');
      }

      bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
      bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
    }
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  pictureBlock.addEventListener('click', onPictureBlockClick);

  bigPictureClose.addEventListener('click', function () {
    closeBigPicture();
  });
})();
