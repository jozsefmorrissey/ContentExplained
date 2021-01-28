
class RelativeFixed {
  constructor(relitiveElem, targetElem, position) {


    const leftOfView = (style) => style.right !== undefined && style.right < 0;
    const rightOfView = (style) => style.left !== undefined && style.left > window.innerWidth ;
    const topOfView = (style) => style.bottom !== undefined && style.bottom < 0;
    const bottomOfView = (style) => style.top !== undefined && style.top > window.innerHeight;

    function offsetPosition(rect, attr) {
      const offset = position[attr];
      if (offset) {
        return offset + rect[attr];
      }
    }

    function position() {
      const rect = relitiveElem.getBoundingClientRect();
      const style = {
        top: offsetPosition(rect, 'top'),
        bottom: offsetPosition(rect, 'bottom'),
        right: offsetPosition(rect, 'right'),
        left: offsetPosition(rect, 'left')
      };

      if (leftOfView(style) || rightOfView(style) || topOfView(style) || bottomOfView(style)) {
        console.log('Out of view')
      } else {
        console.log('in view')
      }
    }

    position();
  }
}
