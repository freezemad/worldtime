;(function(){

  const addElem = function(parent, id, klass) {
    var elem = document.getElementById(id);
    if (null === elem) {
      elem = document.createElement('div');
      if (id) { elem.setAttribute('id', id); }
      if (klass) { elem.setAttribute('class', klass); }
      parent.appendChild(elem);
      return [elem, true];
    }
    return [elem, false];
  }

  const addTimeBox = function() {
    return addElem(document.body, 'wtTimeBox', 'wtTimeBox')[0];
  }

  const addCityTime = function(city, cityName) {
    const box = addTimeBox();
    let frameId = 'wtTimeFrame-' + city.toString();

    let [frame, newFrame] = addElem(box, frameId, 'wtTimeFrame');

    if (newFrame) {
      let htmlString = "\
        <div class=\"wtTimeFrameTop\"> \
          <div>Time.is</div> \
          <div>" + cityName + "</div> \
          <div onclick=\"var d=document.getElementById('" + frameId + "');clearInterval(parseInt(d.getAttribute('data-timer')));d.remove();\">close</div> \
        </div> \
        <div class=\"wtTimeFrameContent\">&nbsp;</div> \
        <div class=\"wtTimeFrameBottom\"></div> \
      ";
      frame.innerHTML = htmlString;

      const weeks = ['日', '一', '二', '三', '四', '五', '六'];
      wtGetTime(city).then(data => {
        document.getElementById(frameId).getElementsByClassName('wtTimeFrameBottom')[0].innerHTML = showDateStr(data.wtTime, weeks[data.day_of_week], data.week_number);
        let timerId = setInterval(() => {
          data.wtTime = new Date(data.wtTime.getTime() + 1000)
          document.getElementById(frameId).getElementsByClassName('wtTimeFrameContent')[0].innerHTML = showTimeStr(data.wtTime);
        }, 1000);
        frame.setAttribute('data-timer', timerId);

      }).catch(err => {})
    }
  }

  const showTimeStr = function(time) {
    const showTimeItem = num => (num + 100).toString().substr(1)
    return showTimeItem(time.getHours()) + ':' + showTimeItem(time.getMinutes()) + ':' + showTimeItem(time.getSeconds());
  }

  const showDateStr = function(time, day, week) {
    return time.getFullYear() + '年' + (time.getMonth() + 1).toString() + '月' + time.getDate() + '日星期' + day + '，第' + week + '周';
  }

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    let msgs = message.split(":")
    addCityTime(msgs[0], msgs[1]);
  });
})();
