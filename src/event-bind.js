function wtAddEventHandler(obj, eventName, handler) {
  if (document.addEventListener) {
    obj.addEventListener(eventName, handler, false);
  } else if (document.attachEvent) {
    obj.attachEvent("on" + eventName, handler);
  } else {
    obj["on" + eventName] = handler;
  }
}

function wtRemoveEventHandler(obj, eventName, handler) {
  if (document.removeEventListener) {
    obj.removeEventListener(eventName, handler, false);
  } else if (document.detachEvent) {
    obj.detachEvent("on" + eventName, handler);
  } else {
    obj["on" + eventName] = null;
  }
}
