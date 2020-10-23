
class AddInterface {
  constructor () {
    const instance = this;
    instance.inputElem = document.getElementById(ADD_EDITOR_ID);
    instance.inputCnt = document.querySelector('.ce-add-cnt');
    instance.toggleButton = document.querySelector('.ce-add-btn');
    let updatePending = false;
    function updateDisplay (value) {
      value = value === undefined ? '' : value;
      value = value.replace(/\n/g, '<br>')
                    .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                        '<a target=\'blank\' href="$2">$1</a>');
      instance.inputElem.parentNode.querySelector('.ce-expl').innerHTML = value;
    }
    instance.updateDisplay = updateDisplay;

    function onChange(e) {
      updateDisplay(e.target.value);
    }

    let show;
    function toggleDisplay(value) {
      show = (typeof value) === "boolean" ? value : !show;
      if (show) {
        instance.inputCnt.style.display = 'block';
      } else {
        instance.inputCnt.style.display = 'none';
      }
    }

    toggleDisplay(false);
    this.toggleDisplay = toggleDisplay;
    instance.inputElem.addEventListener('keyup', onChange);
    instance.toggleButton.addEventListener('click', toggleDisplay);
  }
}
