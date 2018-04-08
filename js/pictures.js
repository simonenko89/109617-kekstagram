'use strict';

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomPhoto = function (photoNum, comments, description) {

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

var photoList = [];

for (var i = 0; i < 15; i++) {
  photoList[i] = getRandomPhoto(i + 1, COMMENT_LIST, DESCRIPTION_LIST);
}

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var pictureList = document.querySelector('.pictures');

var renderPicture = function (url, likes, comments) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__stat--comments').textContent = comments;
  pictureElement.querySelector('.picture__stat--likes').textContent = likes;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

for (i = 0; i < photoList.length; i++) {
  fragment.appendChild(renderPicture(photoList[i].url, photoList[i].likes, photoList[i].commentList.length));
}

pictureList.appendChild(fragment);

var bigPictureBlock = document.querySelector('.big-picture');
bigPictureBlock.classList.remove('hidden');

bigPictureBlock.querySelector('.big-picture__img').children.src = photoList[0].url;
bigPictureBlock.querySelector('.likes-count').textContent = photoList[0].likes;
bigPictureBlock.querySelector('.comments-count').textContent = photoList[0].commentList.length;
var commentsBlock = bigPictureBlock.querySelectorAll('.social__comment');

for (i = 0; i < photoList[1].commentList.length; i++) {
  commentsBlock[i].children.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
  commentsBlock[i].textContent = photoList[0].commentList[i];
}

if (photoList[0].commentList.length === 1) {
  commentsBlock[1].classList.add('hidden');
}

bigPictureBlock.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPictureBlock.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
