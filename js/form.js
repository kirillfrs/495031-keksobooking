'use strict';

(function () {

  var roomNumber = window.elements.mapForm.querySelector('#room_number');
  var capacity = window.elements.mapForm.querySelector('#capacity');
  var houseType = window.elements.mapForm.querySelector('#type');
  var timeIn = window.elements.mapForm.querySelector('#timein');
  var timeOut = window.elements.mapForm.querySelector('#timeout');
  var housePrice = window.elements.mapForm.querySelector('#price');
  var options = capacity.querySelectorAll('option');
  var successPopup = window.elements.successTemplate.cloneNode(true);
  var errorPopup = window.elements.errorTemplate.cloneNode(true);
  var errorButton = errorPopup.querySelector('.error__button');
  var resetButton = window.elements.mapForm.querySelector('.ad-form__reset');
  var featureCheckboxes = document.querySelectorAll('input[type=checkbox]');
  var formDescription = window.elements.mapForm.querySelector('#description');
  var titleAdvert = window.elements.mapForm.querySelector('#title');

  var onTimeInChange = function () {
    timeOut.value = timeIn.value;
  };

  var onTimeOutChange = function () {
    timeIn.value = timeOut.value;
  };

  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);

  houseType.addEventListener('change', function () {
    var select = window.constants.TypesOfHouses[houseType.value];
    housePrice.setAttribute('min', select.min);
    housePrice.setAttribute('placeholder', select.placeholder);
  });

  roomNumber.addEventListener('change', function () {
    var selectType = window.constants.Rooms[roomNumber.value];
    setOptions(selectType);
    setValidity(selectType);
  });

  var setOptions = function (selectType) {
    var checkValidity = function (value) {
      return selectType.enabled.indexOf(value) === -1;
    };

    options.forEach(function (option) {
      option.disabled = checkValidity(option.value);
    });
  };

  var setValidity = function (selectType) {
    var isValid = selectType.enabled.indexOf(capacity.value) !== -1;
    var customValidity = isValid ? '' : selectType.textError;
    capacity.setCustomValidity(customValidity);
  };

  capacity.addEventListener('change', function () {
    capacity.setCustomValidity('');
  });

  var removeSuccessPopup = function () {
    if (successPopup) {
      window.elements.mapSection.removeChild(successPopup);
    }
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessButtonClick);
  };

  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      removeSuccessPopup();
    }
  };

  var onSuccessButtonClick = function () {
    removeSuccessPopup();
  };

  var onUploadSuccess = function () {
    window.elements.mapSection.appendChild(successPopup);
    onResetClick();
    document.addEventListener('keyup', onSuccessEscPress);
    document.addEventListener('click', onSuccessButtonClick);
  };

  var onEscErrorKeyup = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      removeErrorListeners();
    }
  };

  var onButtonErrorKeyup = function (evt) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      removeErrorListeners();
    }
  };

  var onButtonErrorClick = function () {
    removeErrorListeners();
  };

  var removeErrorListeners = function () {
    window.elements.mapSection.removeChild(errorPopup);
    errorButton.removeEventListener('keyup', onButtonErrorKeyup);
    document.removeEventListener('keyup', onEscErrorKeyup);
    document.removeEventListener('click', onButtonErrorClick);
  };

  var onUploadError = function (errorMessage) {
    errorPopup.querySelector('.error__message').textContent = errorMessage;
    errorButton.focus();
    errorButton.setAttribute('tabindex', '0');
    errorButton.style.border = '2px solid yellow';
    window.elements.mapSection.appendChild(errorPopup);

    errorButton.addEventListener('keyup', onButtonErrorKeyup);
    document.addEventListener('keyup', onEscErrorKeyup);
    document.addEventListener('click', onButtonErrorClick);
  };

  window.elements.mapForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(window.elements.mapForm), onUploadSuccess, onUploadError);
    evt.preventDefault();
  });

  var resetMainPin = function () {
    window.elements.mainPin.style.left = window.constants.PIN_LEFT_COORD + 'px';
    window.elements.mainPin.style.top = window.constants.PIN_TOP_COORD + 'px';
  };

  var clearMap = function () {
    var pins = window.elements.mapPinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove(pins[i]);
    }
  };

  var resetImages = function () {
    var photos = window.elements.photoContainer.querySelectorAll('.ad-form__photo');

    if (window.elements.previewContainer.src !== 'img/muffin-grey.svg') {
      window.elements.previewContainer.src = 'img/muffin-grey.svg';
    }

    photos.forEach(function (element, index) {
      if (index === 0) {
        element.innerHTML = '';
      } else {
        element.remove();
      }
    });
  };

  var onResetClick = function () {
    var openedCard = window.elements.mapSection.querySelector('.map__card');

    featureCheckboxes.forEach(function (element) {
      if (element.checked) {
        element.checked = false;
      }
    });

    if (openedCard) {
      window.showCard.activeCardId = null;
      window.showCard.currentCard = null;
      window.elements.mapSection.removeChild(openedCard);
    }

    titleAdvert.value = '';
    formDescription.value = '';
    housePrice.setAttribute('placeholder', window.constants.MIN_PRICE);
    housePrice.value = '';

    window.elements.mapSection.classList.add('map--faded');
    window.elements.advertForm.classList.add('ad-form--disabled');
    window.util.toggleDisabled(true, window.elements.fieldsets);
    window.util.toggleDisabled(true, window.elements.filterSelects);
    capacity.selectedIndex = window.constants.CAPACITY_SELECTED;
    roomNumber.selectedIndex = window.constants.ROOM_SELECTED;
    resetImages();
    clearMap();
    resetMainPin();
    window.util.setAddress();
    window.elements.mainPin.addEventListener('mouseup', window.map.onButtonMouseUp);
  };

  resetButton.addEventListener('click', onResetClick);

})();
