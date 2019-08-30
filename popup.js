;(function(){
  let cities = document.getElementById('cities');

  cities.onclick = function(element) {
    let elem = element.target;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, elem.getAttribute('data-city') + ":" + elem.innerHTML)
    })
  }
})();
