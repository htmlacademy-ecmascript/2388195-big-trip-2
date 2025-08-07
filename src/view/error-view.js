import AbstractView from '../framework/view/abstract-view.js';

const errorText = 'failed to load latest route information';

function createErrorTextTemplate() {
  const errorTexttValue = errorText.toUpperCase();
  return (
    `<p class="trip-events__msg">
      ${errorTexttValue}
    </p>`
  );
}

export default class errorView extends AbstractView {

  get template() {
    return createErrorTextTemplate();
  }
}
