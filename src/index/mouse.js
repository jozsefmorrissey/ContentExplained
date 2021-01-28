
class Mouse {
  constructor() {
    let lastMoveEvent;

    const setLastMouseMove = (e) => lastMoveEvent = e;
    const getLastMoveEvent = () => JSON.parse(JSON.stringify(lastMoveEvent));

    this.withinElem = (offset) => {
      const rect = getPopupElems().cnt.getBoundingClientRect();
      if (lastMoveEvent) {
        const withinX = lastMoveEvent.clientX < rect.right - offset && rect.left + offset < lastMoveEvent.clientX;
        const withinY = lastMoveEvent.clientY < rect.bottom - offset && rect.top + offset < lastMoveEvent.clientY;
        return withinX && withinY;
      }
      return false;
    }

    document.addEventListener('mousemove', setLastMouseMove);
  }
}
