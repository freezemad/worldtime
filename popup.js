;(function(){
  let cities = document.getElementById('cities');

  cities.onclick = function(element) {
    let elem = element.target;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, elem.getAttribute('data-city') + ":" + elem.innerHTML)
    })
  }

  chrome.storage.sync.get(['regionSelected'], function(result) {
    let _regionSel = result.regionSelected || {};

    let ary = [];
    Object.keys(_regionSel).forEach(k => {
      ary.push("<li><a data-city='" + k + "'>" + _regionSel[k] + "</a></li>");
    })

    document.getElementById('cities').innerHTML = ary.join('');
  });
})();
