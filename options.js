;(function(){
  let addRegion = function() {
    let region = document.getElementById('region').value;
    let regionName = document.getElementById('cityname').value;


    chrome.storage.sync.get(['regionSelected'], function(result) {
      let _regionSel = result.regionSelected || {};
      _regionSel[region] = regionName;

      chrome.storage.sync.set({regionSelected: _regionSel}, function() {
        console.log('Region setted');
      })

      getRegions();
    });
  }

  let getRegions = function() {
    chrome.storage.sync.get(['regionSelected'], function(result) {
      let _regionSel = result.regionSelected || {}

      let ary = [];
      Object.keys(_regionSel).forEach(k => {
        ary.push("<div>" + k + " -- " + _regionSel[k] + "</div>");
      })

      document.getElementById("regionList").innerHTML = ary.join("");
    });
  }

  window.onload = function() {
    document.getElementById('add').onclick = addRegion;
    getRegions();
  }

})();
