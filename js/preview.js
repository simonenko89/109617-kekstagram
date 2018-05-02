'use strict';

(function () {
  // Работа с большой фотографией
  var pictureBlock = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  var commentBlock = bigPicture.querySelector('.social__comments');
  var socialCaption = bigPicture.querySelector('.social__caption');

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

      socialCaption.textContent = currentPictureElement.comments[0];

      var renderComment = function (logoLink, comment) {
        var commentElement = commentTemplate.cloneNode(true);

        commentElement.children[0].src = logoLink;
        commentElement.childNodes[2].textContent = comment;

        return commentElement;
      };

      var fragment = document.createDocumentFragment();
      for (i = 0; i < currentPictureElement.comments.length; i++) {
        var logoSrc = 'img/avatar-' + window.util.getRandomNumber(1, 6) + '.svg';
        fragment.appendChild(renderComment(logoSrc, currentPictureElement.comments[i]));
      }
      commentBlock.appendChild(fragment);

      bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
      bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
    }
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscPress);
    commentBlock.textContent = '';
  };

  pictureBlock.addEventListener('click', onPictureBlockClick);

  bigPictureClose.addEventListener('click', function () {
    closeBigPicture();
  });
})();
