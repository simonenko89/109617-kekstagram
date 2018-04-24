'use strict';

(function () {

  var getRandomPicture = function (photoNum, comments, description) {

    var randPhoto = {};

    randPhoto.url = 'photos/' + photoNum + '.jpg';
    randPhoto.likes = window.util.getRandomNumber(15, 200);

    var commentsCount = window.util.getRandomNumber(1, 2);
    var commentList = [];
    for (var i = 0; i < commentsCount; i++) {
      commentList[i] = comments[window.util.getRandomNumber(0, comments.length - 1)];
    }

    randPhoto.commentList = commentList;
    randPhoto.description = description[window.util.getRandomNumber(0, description.length - 1)];

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

  window.pictureList = pictureList;
})();
