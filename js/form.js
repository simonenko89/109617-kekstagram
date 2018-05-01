'use strict';

(function () {
// Работа с загрузкой файлов
  var uploadInput = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
  var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');

  var effectsList = uploadOverlay.querySelectorAll('.effects__radio');
  var scalePinBlock = uploadOverlay.querySelector('.img-upload__scale');
  var scalePinValue = scalePinBlock.querySelector('.scale__value');

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
    if (evt.keyCode === window.util.ESC_KEYCODE) {
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
  for (var i = 0; i < effectsList.length; i++) {
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

  // Валидация формы
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
    } else {
      hashtagList.setCustomValidity('');
    }
  };

  hashtagList.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });

  textComment.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });

  submitFormButton.addEventListener('click', onClickSubmitFormButton);

  // Работа с пином для изменения эффектов
  var imgUploadScale = document.querySelector('.img-upload__scale');
  var scalePin = imgUploadScale.querySelector('.scale__pin');

  var getСurrentPinRatio = function (pinX) {

    var minPinX = imgUploadScale.querySelector('.scale__line').getBoundingClientRect().left;
    var maxPinX = imgUploadScale.querySelector('.scale__line').getBoundingClientRect().right;

    return Math.round(100 * (pinX - minPinX) / (maxPinX - minPinX));
  };

  scalePin.addEventListener('mousedown', function () {

    var onImgUploadScaleMove = function (moveEvt) {
      moveEvt.preventDefault();
      var currentPinX = moveEvt.clientX;
      var currentPinRatio = getСurrentPinRatio(currentPinX);
      if (currentPinRatio > 100) {
        currentPinRatio = 100;
      } else if (currentPinRatio < 0) {
        currentPinRatio = 0;
      }
      scalePin.style.left = currentPinRatio + '%';
      imgUploadScale.querySelector('.scale__level').style.width = currentPinRatio + '%';
    };

    var onImgUploadScaleUp = function (upEvt) {
      var currentPinX = upEvt.clientX;
      var currentPinRatio = getСurrentPinRatio(currentPinX);
      if (currentPinRatio > 100) {
        currentPinRatio = 100;
      } else if (currentPinRatio < 0) {
        currentPinRatio = 0;
      }
      scalePinValue.value = currentPinRatio;
      getFilterStyle(getCurrentFilter(), scalePinValue.value);

      document.removeEventListener('mousemove', onImgUploadScaleMove);
    };

    document.addEventListener('mousemove', onImgUploadScaleMove);
    document.addEventListener('mouseup', onImgUploadScaleUp);
  });

  var form = document.querySelector('.img-upload__form');

  form.addEventListener('submit', function (evt) {

    window.backend.upload(new FormData(form), function () {
      uploadOverlay.classList.add('hidden');
    }, window.util.onError);

    evt.preventDefault();
  });
})();
