/**
 * Use example:
 *   In provider:
 *     comst property = new Listenable(initialValue);
 *     property.value = newValue;
 *   In consumer:
 *     const listenerId = this.property.listen(callback);
 *     this.property.unlisten(listenerId);
 *   Or in a React component:
 *     const value = useListenable(Listenable);
 */
class Listenable {
  constructor(initialValue) {
    this._value = initialValue;
    this.listeners = [];
  }

  set value(newValue) {
    this._value = newValue;
    this.listeners.forEach(l => l(newValue));
  }

  get value() {
    return this._value;
  }

  listen(listener) {
    this.listeners.push(listener);
    return this.listeners.length - 1;
  }

  unlisten(listenerIndex) {
    this.listeners.splice(listenerIndex, 1);
  }
}


export default Listenable;
