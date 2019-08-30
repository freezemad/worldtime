function wtGetTimeZoneList() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tzList'], function(result) {
      if (result.tzList) {
        return resolve(result.tzList);
      } else {
        fetch('https://worldtimeapi.org/api/timezone.json').then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              chrome.storage.sync.set({tzList: data}, function() {
                console.log('Timezone List received');
              });
              return resolve(data);
            });
          } else {
            return reject("Sorry, server halt!");
          }
        }).catch(err => {
          console.log('Timezone List Fetch Error :-S', err);
          return reject(err);
        });
      }
    })
  });
}


function wtGetTime(location) {
  return new Promise((resolve, reject) => {
    wtGetTimeZoneList().then(data => {
      if (data.indexOf(location) === -1) {
        reject("Sorry, region invalid!");
      } else {
        fetch('https://worldtimeapi.org/api/timezone/' + location + '.json').then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              data.wtTime = new Date(data.datetime.match(/(.*)[+-][\d]{2}\:00/)[1]);
              resolve(data);
            });
          } else {
            reject("Sorry, server halt!")
          }
        }).catch(err => {
          console.log('City Time Fetch Error :-S', err);
          reject(err);
        });
      }
    }).catch(err => reject(err));
  });
}
