// declare general global variables

var takeButton = document.querySelector('.takeBtn'),
showButton = document.querySelector('.showBtn'),
galleryButton = document.querySelector('.galleryBtn'),
deck = document.querySelector('x-deck');

// wire up the nav buttons for the mobile app view

takeButton.addEventListener("click", function(){
    deck.shuffleTo(0);
});
showButton.addEventListener("click", function(){
    deck.shuffleTo(1);
});
galleryButton.addEventListener("click", function(){
    deck.shuffleTo(2);
});

var snap = document.querySelector('.snap');

snap.addEventListener("click", function(){
    takePicture();
});


// use getUserMedia to put the camera stream into the video element

var video = document.querySelector('video');
var canvas = document.querySelector('.canvas');
var photo = document.querySelector('.photo');

var save = document.querySelector('.save');
save.style.display = 'none';

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

if (navigator.getMedia) {
    navigator.getMedia (

       // constraints
       {
          video: true,
          audio: false
       },

       // successCallback
       function(localMediaStream) {
       
          video.src = (window.URL && window.URL.createObjectURL(localMediaStream)) || localMediaStream;
          video.play();
       },

       // errorCallback
       function(err) {
        console.log('There is a problem with getUserMedia support in your browser: ' + err.code);
       }

    );
} else {
    console.log('getUserMedia not supported');
}

// take a picture and store it in the canvas when the take picture button is pressed

function takePicture() {
    canvas.width = video.clientWidth;
    var w = canvas.width;
    canvas.height = video.clientHeight - 4;
    var ctx = canvas.getContext('2d');
    
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    
    save.style.display = 'block';
    
    if (window.matchMedia("(max-width: 480px)").matches) {
      deck.shuffleTo(1);  
    }
}

// save the picture to the gallery when the Save picture button is pressed

var gallery = document.querySelector('x-card:nth-child(3)');

save.addEventListener("click", function(){
    addToGallery();
});

var evtTgt = 0;

function addToGallery() {
  var newPhoto = document.createElement('img');
  newPhoto.src = photo.src;
  gallery.appendChild(newPhoto);
  
  if (window.matchMedia("(max-width: 480px)").matches) {
    deck.shuffleTo(2);  
  }
  
  newPhoto.onclick = function(e) {
    if(evtTgt == 0) {
      evtTgt = e.target; 
      deletePhoto(evtTgt);
    }
  }
}


// set the height of the xcard to be the height of the viewport, regardless of what device is being used, so we always get the full screen nicely filled up by the app

deck.style.height = window.innerHeight + 'px';

window.onresize = function() {
  deck.style.height = window.innerHeight + 'px';  
}

// delete images in the gallery

var show = document.querySelector('x-card:nth-child(2)');

function deletePhoto(evtTgt) {
  
  photo.src = evtTgt.src;
  save.style.display = 'none';
  
  var deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'Delete Photo'; 
  show.appendChild(deleteBtn);
  
  var cancelBtn = document.createElement('button');
  cancelBtn.innerHTML = 'Cancel'; 
  cancelBtn.setAttribute('class','cancel');
  show.appendChild(cancelBtn);
  
  if (window.matchMedia("(max-width: 480px)").matches) {
      deck.shuffleTo(1);  
  }
  
  deleteBtn.onclick = function() {
    evtTgt.parentNode.removeChild(evtTgt);
    
    deleteBtn.parentNode.removeChild(deleteBtn);
    cancelBtn.parentNode.removeChild(cancelBtn);  
    
    save.style.display = 'block';
    evtTgtZero();
    
    if (window.matchMedia("(max-width: 480px)").matches) {
      deck.shuffleTo(2);  
    }
  }
  
  cancelBtn.onclick = function() {
    deleteBtn.parentNode.removeChild(deleteBtn);
    cancelBtn.parentNode.removeChild(cancelBtn);  
    
    save.style.display = 'block';
    evtTgtZero();
    
    if (window.matchMedia("(max-width: 480px)").matches) {
      deck.shuffleTo(2);  
    }
  }
}

function evtTgtZero() {
  evtTgt = 0;
}