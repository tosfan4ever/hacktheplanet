angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $http, $ionicActionSheet, $ionicModal) {
    $scope.creditCard = {};
    $scope.amount = null;
    $scope.txid = null;
    $scope.locations=[];
    $scope.positions = [];
    $scope.locations2;
    $scope.positions2;
    //$scope.clicked = false;

  var vcard  = {
    firstName: 'Shiva',
    lastName: 'Kaushal',
    number: '4005519200000004',
    expirationDate: '08/16',
    amount: '0'
  },
  acard= {
    firstName: 'Tian',
    lastName: 'Yuan',
    number: '371449635398431',
    expirationDate: '08/16',
    amount: '0'
  },
  mcard = {
    firstName: 'Daniel',
    lastName: 'Scott',
    number: '5555555555554444',
    expirationDate: '08/16',
    amount: '0'
  }

  $scope.riders = [];

  function _getRiders () {

     $http.get('https://cryptic-oasis-6309.herokuapp.com/user')
        .success(function (data) {
           $scope.riders = data;
           console.log(data);
        })
        .error(function (data) {
            alert("Error: " + data);
        });
  }

  _getRiders();

  $scope.options = function (option) {
    $scope.option = option;
  }

   $ionicModal.fromTemplateUrl('templates/transactionComplete.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modallogin) {
      $scope.modallogin = modallogin;
      $scope.modallogin.show();
  });

   $ionicModal.fromTemplateUrl('templates/transactionDetails.html', { scope: $scope })
        .then(function (txDetails) {
            $scope.txDetails = txDetails;
        });

  function triggerEvent (nfcEvent) {
      $scope.tag = nfcEvent.tag;
      $scope.hideSheet();
      assignCard($scope.tag);
      //alert(JSON.stringify($scope.tag));

  }
    //document.addEventListener('deviceready', this.onDeviceReady, false);
  $scope.tapping = function(amount){
    $scope.amount = amount;
    nfc.addTagDiscoveredListener(triggerEvent,
      function () {
      $scope.hideSheet = $ionicActionSheet.show({
          buttons: [
       { text: '<center><b>You are going to pay $' + $scope.amount}
     ],
           titleText: '<center>Tap your card please.</center>'
        });
      },
      function (reason) {
        console.log("Error: " + reason);
      }
    );
  };

  $scope.verifyTxId = function (txid) {
      $scope.txid = txid;
      $http.get('https://flashpay.herokuapp.com/getinfo/' + $scope.txid)
        .success(function (data) {
            $scope.currentTx = data[0];
            $scope.txDetails.show();
        })
        .error(function (data) {
            alert("Error: " + data);
        });
  };

  var assignCard = function(tag) {
     if($scope.tag.id[0] == 33 && $scope.tag.id[1] == 34 && $scope.tag.id[2] == 35 && $scope.tag.id[3] == 36) {
        $scope.creditCard = vcard;
    }
    if($scope.tag.id[0] == 111 && $scope.tag.id[1] == 122 && $scope.tag.id[2] == 84 && $scope.tag.id[3] == 11) {
        $scope.creditCard = acard;
    }
    if($scope.tag.id[0] == 15 && $scope.tag.id[1] == -107 && $scope.tag.id[2] == -70 && $scope.tag.id[3] == -7) {
        $scope.creditCard = mcard;
    }
     $scope.creditCard.amount = $scope.amount;

    nfc.removeTagDiscoveredListener(triggerEvent, function (){
    }, function (error){});

       $http.post('https://flashpay.herokuapp.com/createPayment', $scope.creditCard)
    .success(function (data, status, headers, config) {
      $scope.modal.show();
    }).error(function (data, status, headers, config) {
        alert('There was a problem retrieving your information' + data+ status);
    });

  };

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.doLogin = function (username, password) {
      if (username.toLowerCase() === "eric" && password.toLowerCase() === "1234") {
          $scope.modallogin.hide();
      } else {
          alert("Invalid password entered");
      }
  };

  $scope.closeTxDetails = function () {
      $scope.txDetails.hide();
  };

  $scope.justcheck = function(){    
    }


//////////////////////////
  $scope.useCurrentLocation = function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
  }

      // onSuccess Callback
  // This method accepts a Position object, which contains the
  // current GPS coordinates
  //
  var onSuccess = function(position) {
    var url = "insert url";
      $scope.locations.push(position.coords);
      //$scope.location.lon = position.coords.longitude;
      $http({method: 'GET', url: url,
              params: {
          locationx : position.coords.latitude,
          locationy : position.coords.longitude}})
        .success(function(data, status, headers, config) {
          console.log('got my information3' +JSON.stringify(data));
        });
  };

  // onError Callback receives a PositionError object
  //
  function onError(error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }

  $scope.$watch('locations', function (location) {
    console.log('here we go again', location);
  })

  $scope.callRiders = function(riders) {
    var selectedRiders = [];
    var url = 'url', scenic;

    for (var i = 0; i< $scope.riders.length; i++) {
      if($scope.riders[i].checked){
        selectedRiders.push($scope.riders[i]);
      }
    }

    if($scope.option == 'Economical') {
      scenic = false
    } else {
      scenic = true;
    };


    var toSend= [
    {
        "id": 1,
        "routes": [
            {
                "id": 1,
                "name": "location 1",
                "start": {
                    "id": 1,
                    "latitude": $scope.locations[0].latitude,
                    "longitude": $scope.locations[0].longitude
                },
                "end": {
                    "id": 2,
                    "latitude": $scope.positions[0].lat,
                    "longitude": $scope.positions[0].lng
                }
            }
        ],
        "scenic": scenic,
        "start_ts": "2015-08-16T13:21:20.382226Z",
        "status": "unconfirmed",
        "users": [
            selectedRiders[0].id,
            selectedRiders[1].id,
            selectedRiders[2].id,
            5
        ]
    }
];

console.log('here is to send', toSend);
  $http.post('https://cryptic-oasis-6309.herokuapp.com/trip', toSend)
    .success(function (data, status, headers, config) {
      $scope.modal.show();
    }).error(function (data, status, headers, config) {
        alert('There was a problem retrieving your information' + data + status);
    });
  };


})

.controller('DashCtrl', function ($scope, $http, $ionicActionSheet, $ionicModal) {
$scope.driverObject;
$scope.passanger;

  function _pickups() {
    $http.get('http://127.0.0.1:8000/trip')
       .success(function (data) {
        $scope.driverObject = data;
        $scope.locations2 = data[0].routes[0].start;
        $scope.positions2 = data[0].routes[0].end;
        console.log(data, $scope.positions2);
          
       })
       .error(function (data) {
           alert("Error: " + data);
       });
  }
  _pickups();


  $scope.rideComplete = function() {
    $ionicActionSheet.show({
          buttons: [
       { text: '<center><b>Thanks for Riding'}
     ],
           titleText: '<center>You are going to pay $50</center>'
        });

  }

})

.controller('CustomerCtrl', function ($scope, $compile) {
 
 // $("map").on("tap",function(){
 //   $scope.addMarker();
 //  });  
  
  $scope.addMarker = function(event) {
    var ll = event.latLng;
    $scope.positions.push({lat:ll.lat(), lng: ll.lng()});
    console.log($scope.positions);
  }

  $scope.cities = {
    1: {position: [41.878113, -87.629798]},
    2: {position: [40.714352, -74.005973]},
    3: {position: [37.7699298, -122.4469157]},
    4: {position: [49.25, -123.1]},
    5: {position: [49.25, -123.1]}
  }
  $scope.getRadius = function(num) {
    return Math.sqrt(num) * 100;
  }

})

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    $scope.$on('$ionicView.enter', function (e) {
        Chats.all(function (transactions) {
            $scope.chats = transactions;
        });
    });
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    Chats.all(function (transactions) {
        $scope.chats = transactions;
    });
})

.controller('AccountCtrl', function ($scope, Chats) {
    $scope.settings = {
        enableFriends: true
    };

    Chats.all(function (transactions) {
        $scope.chats = transactions;
    });

    //  http.$get('flashpay.herokuapp.com/createPayment', params)
})

.controller('TickerCtrl', function ($scope) {

    $scope.cookie = "yummy";

    $scope.ticker_msgs = [];

    // Enable pusher logging - don't include this in production
    Pusher.log = function (message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    };

    var pusher = new Pusher('991b4111cb90d8ba79f6', {
        encrypted: true
    });
    var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function (data) {
        $scope.ticker_msgs.push(data);
        $scope.$apply();
    });
    //  http.$get('flashpay.herokuapp.com/createPayment', params)
});
