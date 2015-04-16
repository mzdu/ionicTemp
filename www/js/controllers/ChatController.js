'use strict'

mongerApp.controller('ChatsCtrl', function($scope, $state, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, socket, Chats) {
  console.log(Chats.get($stateParams.chatId));
  $scope.chat = Chats.get($stateParams.chatId);

  //input models
  $scope.draft = { message: '' };
  $scope.channel = { name: '' };

  //App info
  $scope.channels = [];
  $scope.listeningChannels = [];
  $scope.activeChannel = null;
  $scope.userName = 'testUser'
  //Auth.currentUser().name;
  $scope.messages = [];

  socket.on('channels', function channels(channels){
    console.log('channels', channels);

    console.log(channels);
    $scope.channels = channels;
    $scope.channels = channels;
  });

  socket.on('message:received', function messageReceived(message) {
    console.log('message is: ' + message);
    $scope.messages.push(message);
  });

  socket.emit('user:joined', {name: $scope.userName});

  socket.on('user:joined', function(user) {
    console.log('user:joined');
    $scope.messages.push(user);
  });

  $scope.listenChannel = function listenChannel (channel) {
    socket.on('messages:channel:' + channel, function messages(messages) {
      console.log('got messages: ', messages);
      console.log(messages.length);
      for(var i = 0, j = messages.length; i < j; i++) {
        var message = messages[i];
        console.log('message');
        console.log(message);
          console.log('apply with function');
        $scope.messages.push(message);
      }
    });

    socket.on('message:channel:' + channel, function message(message) {
      console.log('got message: ' + message);
      if(channel != $scope.activeChannel) {
        return;
      }
      $scope.messages.push(message);
    });

    socket.on('message:remove:channel:' + channel, function(removalInfo) {
      console.log('removalInfo to remove: ', removalInfo);
      var expires = removalInfo.message.expires;
      var expireMessageIndex = $filter('messageByExpires')($scope.messages, expires);
      if(expireMessageIndex) {
        $scope.messages.splice(expireMessageIndex, 1);
      }

    });

    $scope.listeningChannels.push(channel);

  }

  $scope.joinChannel = function joinChannel(channel) {
    $scope.activeChannel = channel;
    $scope.messages = [];

    $scope.channel.name = '';

    //Listen to channel if we dont have it already.
    if($scope.listeningChannels.indexOf(channel) == -1) {
      $scope.listenChannel(channel);    
    }

    socket.emit('channel:join', { channel: channel, name: $scope.userName });
  }

    $scope.sendMessage = function sendMessage(draft) {
    if(!draft.message || draft.message == null || typeof draft == 'undefined' || draft.length == 0) {
      return;
    }
    socket.emit('message:send', { message: draft.message, name: $scope.userName, channel: $scope.activeChannel });
    $scope.draft.message = '';
  };


  $scope.joinChannel('Lobby');
})