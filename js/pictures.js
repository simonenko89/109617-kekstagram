'use strict';

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomPicture = function (photoNum, comments, description) {

  var randPhoto = {};

  randPhoto.url = 'photos/' + photoNum + '.jpg';
  randPhoto.likes = getRandomNumber(15, 200);

  var commentsCount = getRandomNumber(1, 2);
  var commentList = [];
  for (var i = 0; i < commentsCount; i++) {
    commentList[i] = comments[getRandomNumber(0, comments.length - 1)];
  }

  randPhoto.commentList = commentList;
  randPhoto.description = description[getRandomNumber(0, description.length - 1)];

  return randPhoto;
};

var COMMENT_LIST = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION_LIST = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var pictureList = [];

for (var i = 0; i < 25; i++) {
  pictureList[i] = getRandomPicture(i + 1, COMMENT_LIST, DESCRIPTION_LIST);
}

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

for (i = 0; i < pictureList.length; i++) {
  fragment.appendChild(renderPicture(pictureList[i].url, pictureList[i].likes, pictureList[i].commentList.length));
}

pictureBlock.appendChild(fragment);

// Работа с загрузкой файлов
var ESC_KEYCODE = 27;
var uploadInput = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');

var effectsList = uploadOverlay.querySelectorAll('.effects__radio');
var scalePinBlock = uploadOverlay.querySelector('.img-upload__scale');
var scalePinElement = scalePinBlock.querySelector('.scale__pin');
var scalePinValue = scalePinBlock.querySelector('.scale__value');
var MIN_PIN_X = 443;
var MAX_PIN_X = 903;

var getCurrentFilter = function () {
  for (var k = uploadPreview.classList.length - 1; k > 0; k--) {
    if (uploadPreview.classList[k].match('effects__preview--')) {
      return uploadPreview.classList[k].substring(18);
    }
  }
  return 'none';
};

var getFilterStyle = function (effectName, ratio) {
  scalePinBlock.classList.remove('hidden');

  if (effectName === 'chrome') {
    uploadPreview.style.filter = 'grayscale(' + ratio / 100 + ')';
  } else if (effectName === 'sepia') {
    uploadPreview.style.filter = 'sepia(' + ratio / 100 + ')';
  } else if (effectName === 'marvin') {
    uploadPreview.style.filter = 'invert(' + ratio + '%)';
  } else if (effectName === 'phobos') {
    uploadPreview.style.filter = 'blur(' + 0.03 * ratio + 'px)';
  } else if (effectName === 'heat') {
    uploadPreview.style.filter = 'brightness(' + 0.03 * ratio + ')';
  } else {
    scalePinBlock.classList.add('hidden');
  }
};

var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadOverlay();
  }
};

var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', onUploadOverlayEscPress);
  uploadPreview.style.transform = 'scale(1)';
  getFilterStyle(getCurrentFilter(), scalePinValue.value);
};

var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', onUploadOverlayEscPress);
  uploadInput.value = '';
};

uploadInput.addEventListener('change', function () {
  openUploadOverlay();
});

uploadCancel.addEventListener('click', function () {
  closeUploadOverlay();
});

// Работа с изменением размеров фото
var resizeControlMinus = uploadOverlay.querySelector('.resize__control--minus');
var resizeControlPlus = uploadOverlay.querySelector('.resize__control--plus');
var resizeControlValue = uploadOverlay.querySelector('.resize__control--value');

var getCurrentImgSize = function (scale) {
  if (!scale) {
    return 1;
  }

  return Number(scale.substring(6, scale.length - 1));
};

var currentSize = getCurrentImgSize(uploadPreview.style.transform);
var ZOOM_MIN = 0.25;
var ZOOM_MAX = 1;
var ZOOM_STEP = 0.25;

resizeControlMinus.addEventListener('click', function () {
  if (currentSize > ZOOM_MIN) {
    currentSize = currentSize - ZOOM_STEP;
    uploadPreview.style.transform = 'scale(' + currentSize + ')';
    resizeControlValue.value = currentSize * 100 + '%';
  }
});

resizeControlPlus.addEventListener('click', function () {
  if (currentSize < ZOOM_MAX) {
    currentSize = currentSize + ZOOM_STEP;
    uploadPreview.style.transform = 'scale(' + currentSize + ')';
    resizeControlValue.value = currentSize * 100 + '%';
  }
});

// Работа с наложением эффектов на фото


for (i = 0; i < effectsList.length; i++) {
  effectsList[i].addEventListener('click', function (evt) {

    var oldEffect = uploadPreview.classList[1];

    if (oldEffect) {
      uploadPreview.classList.remove(oldEffect);
    }

    var newEffect = 'effects__preview--' + evt.target.value;
    uploadPreview.classList.add(newEffect);

    getFilterStyle(evt.target.value, scalePinValue.value);
  });
}

// Работа с пином для изменения эффектов
scalePinElement.addEventListener('mouseup', function (evt) {
  var currentPinX = evt.clientX;
  var currentPinRatio = Math.round(100 * (currentPinX - MIN_PIN_X) / (MAX_PIN_X - MIN_PIN_X));
  scalePinValue.value = currentPinRatio;
  getFilterStyle(getCurrentFilter(), scalePinValue.value);
});

// Работа с большой фотографией
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

var onPictureBlockClick = function (evt) {
  var clickedSrc = evt.target.src;
  var clickedLikes = evt.target.parentElement.querySelector('.picture__stat--likes').textContent;
  var clickedCommentsCnt = evt.target.parentElement.querySelector('.picture__stat--comments').textContent;

  if (clickedSrc && clickedLikes && clickedCommentsCnt) {
    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);

    bigPicture.querySelector('.big-picture__img').children[0].src = clickedSrc;
    bigPicture.querySelector('.likes-count').textContent = clickedLikes;
    bigPicture.querySelector('.comments-count').textContent = clickedCommentsCnt;

    for (i = 0; i < pictureList.length; i++) {
      if (clickedSrc.match(pictureList[i].url)) {
        var currentPictureElement = pictureList[i];
      }
    }

    var commentsBlock = bigPicture.querySelectorAll('.social__comment');

    for (i = 0; i < currentPictureElement.commentList.length; i++) {
      commentsBlock[i].children[0].src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
      commentsBlock[i].childNodes[2].textContent = currentPictureElement.commentList[i];
    }

    if (currentPictureElement.commentList.length === 1) {
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

// валидация формы
var submitFormButton = document.querySelector('.img-upload__submit');
var hashtagList = document.querySelector('.text__hashtags');
var textComment = document.querySelector('.text__description');

var isSimilarElements = function (checkingArray) {
  for (var h = 0; h < checkingArray.length; h++) {
    var checkingArrayElement = checkingArray[h];
    for (var j = h + 1; j < checkingArray.length; j++) {
      if (checkingArrayElement.toLowerCase() === checkingArray[j].toLowerCase()) {
        return true;
      }
    }
  }

  return false;
};

var getTagsValidityError = function (checkingTagString) {
  var tagList = checkingTagString.split(' ');

  if (tagList.length > 5) {
    return 'Больше 5 тэгов';
  }
  if (isSimilarElements(tagList)) {
    return 'Повторяющиеся тэги';
  }

  for (var l = 0; l < tagList.length; l++) {
    if (tagList[l].charAt(0) !== '#' && tagList[l].length > 0) {
      return 'Не хватает # в начале тэга';
    } else if (!tagList[l].charAt(1) && tagList[l].length > 0) {
      return 'Одна решетка - это не тэг';
    } else if (tagList[l].length > 20) {
      return 'Больше 20 символов в тэге';
    }
  }

  return '';
};

var onClickSubmitFormButton = function () {
  if (getTagsValidityError(hashtagList.value)) {
    hashtagList.setCustomValidity(getTagsValidityError(hashtagList.value));
  }
};

hashtagList.addEventListener('focus', function (evt) {
  evt.preventDefault();
});

textComment.addEventListener('focus', function (evt) {
  evt.preventDefault();
});

submitFormButton.addEventListener('click', onClickSubmitFormButton);
