import AbstractView from '../framework/view/abstract-view.js';

const errorText = 'failed to load latest route information';

function createErrorTemplate() {
  const errorTexttValue = errorText.toUpperCase();
  return (
    `<p class="trip-events__msg">
      ${errorTexttValue}
    </p>`
  );
}

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
