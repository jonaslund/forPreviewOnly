jQuery(function($) {

  //connect to socketio
  var socketHost = "http://forpreviewonly.net";

  if(window.location.host === "localhost:3000") {
    socketHost = "http://localhost:3000";
  }

  var socket = io(socketHost);  
  socket.on("connect", function() {    
  });

  //socket on getting new caption, emitted from server
  socket.on("subtitle", function(data) {
    $("#subtitletext").text(data.data);
    $("#subtitle").show();

    setTimeout(function() {
      $("#subtitle").fadeOut();

    }, 7500);
  });

  var hide = 0;

  setTimeout(function() {
    hide = 1;
  }, 5000);
  

  //Video Player
  var hasPlayed = false;
  var hasPlayedSecondary = false;

  var player = new MediaElementPlayer('#video', {
    videoWidth: 1280,
    videoHeight: 720,
    startVolume: 0.6,
    features: [],
    enableKeyboard: false,
    loop: false,  
    success: function(mediaElement, domObject) {

      //get video file based on time
      var now = new Date();
      var elapsed = ((now.getMinutes() + (now.getHours() * 60)) * 60) + now.getSeconds();
      var elapsedSplit = ((now.getMinutes()) * 60) + now.getSeconds();
      var file = now.getHours();

      mediaElement.setSrc("http://s3.amazonaws.com/forpreviewonlynew/"+file+".mp4");

      $("#video").css({marginLeft: ($(window).width()-1280)/2, marginTop: ($(window).height()-720)/2});

      mediaElement.addEventListener("canplay", function() {
       if(hide === 1) {
          $("#message").fadeOut();
        
        } else {
          setTimeout(function() {
            $("#message").fadeOut();
          }, 5000)
        }

      });
      
        // mediaElement.setCurrentTime(elapsedSplit);
        // mediaElement.play();

        if(!hasPlayed){

            mediaElement.play();
            
            mediaElement.addEventListener('playing', function(){

              if(hasPlayed === false) {
                mediaElement.setCurrentTime(elapsedSplit);
              }

              hasPlayed = true;

            });

        } else {

          mediaElement.setCurrentTime(elapsedSplit);
          mediaElement.play();
        
        }

      //event for when video has ended, time to switch to new video
      mediaElement.addEventListener("ended", function() { 
        console.log("ended");
        var nowNew = new Date(); 

        //video ended, cue next.
        var nfile = nowNew.getHours();
        var elapsedSplitN = ((nowNew.getMinutes()) * 60) + nowNew.getSeconds();
        
        mediaElement.setSrc("http://s3.amazonaws.com/forpreviewonlynew/"+nfile+".mp4");

        if(!hasPlayedSecondary) {

            mediaElement.play();
            mediaElement.addEventListener('playing', function(){

              if(hasPlayedSecondary === false) {
                mediaElement.setCurrentTime(elapsedSplitN);
              }

              hasPlayedSecondary = true;

            });

        } else {

          mediaElement.setCurrentTime(elapsedSplitN);
          mediaElement.play();
        
        }
      });
    }
  });

  
  //resize video to fit
  $(window).resize(function() {
    $("#video").css({marginLeft: ($(window).width()-1280)/2, marginTop: ($(window).height()-720)/2});
  });

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

});

