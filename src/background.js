// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var genTime = function() {
        var str = "var div = document.createElement('div');div.id='twddiv';div.style = 'z-index:10000;position: fixed;top: 10px; right: 10px;width: 304px;height:167px; background:white;border:0;-webkit-box-shadow: #666 0px 0px 10px;-moz-box-shadow: #666 0px 0px 10px;box-shadow: #666 0px 0px 10px;'; \
        div.innerHTML = \"<iframe style='width:100%;height:100%;' src='https://time.is/Vancouver' id='_twdframe'></iframe>\";\
        var closeDiv = document.createElement('div');\
        closeDiv.id = 'twdclose';\
        closeDiv.style = 'position:fixed;top:10px;right:10px;width:50px;height:50px;background:green;z-index:10001';\
        closeDiv.innerHTML=\"<img src='images/close.png' style='width:100%;height:100%'>\"; \
        closeDiv.onclick=function(){document.getElementById('twdclose').remove();document.getElementById('twddiv').remove()}";
        return str + ";document.body.appendChild(div);document.body.appendChild(closeDiv);";
        //return str + ";document.body.appendChild(div);document.body.appendChild(closeDiv);document.getElementById('_twdframe').document.body.onload=\"document.getElementById('twd').click();\"";
      }
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: genTime() }
      );
    })
  });
});
