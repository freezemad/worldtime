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
          <div class=\"wtClose\">close</div> \
        </div> \
        <div class=\"wtTimeFrameContent\">&nbsp;</div> \
        <div class=\"wtTimeFrameBottom\">&nbsp;</div> \
      ";
      frame.innerHTML = htmlString;

      const weeks = ['日', '一', '二', '三', '四', '五', '六'];
      wtGetTime(city).then(data => {
        document.getElementById(frameId).getElementsByClassName('wtTimeFrameBottom')[0].innerHTML = showDateStr(data.wtTime, weeks[data.day_of_week], data.week_number);
        setTick(city, data.wtTime, frameId, true);
      }).catch(err => {
        document.getElementById(frameId).getElementsByClassName('wtTimeFrameContent')[0].innerHTML = '<div style="font-size: 20px">' + err + '</div>';
      })

      frame.getElementsByClassName('wtClose')[0].onclick = function() {
        setTick(city, null, null, false);
        frame.remove();
      }
    }
  }

  const isBlank = function(variable) {
    return variable === null || typeof variable === 'undefined';
  }

  const setTick = (function() {
    let subscribers = {};
    let timerId;

    return function(city, wtTime, frameId, insert) {
      if (!insert) { // 删除城市
        delete subscribers[city];
        if (Object.keys(subscribers).length === 0 && !isBlank(timerId)) {
          clearInterval(timerId);
          timerId = null;
        }
        return;
      }
      if (!isBlank(subscribers[city])) return;
      // 校准秒数
      if (Object.keys(subscribers).length > 0) {
        let reference = subscribers[Object.keys(subscribers)[0]];
        wtTime.setSeconds(reference.wtTime.getSeconds())
      }
      subscribers[city] = { wtTime, frameId };

      if (isBlank(timerId)) {
        timerId = setInterval(() => {
          Object.keys(subscribers).forEach(k => {
            subscribers[k].wtTime = new Date(subscribers[k].wtTime.getTime() + 1000);
            document.getElementById(subscribers[k].frameId).getElementsByClassName('wtTimeFrameContent')[0].innerHTML = showTimeStr(subscribers[k].wtTime);
          })
        }, 1000);
      }
    } // return
  })();

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
