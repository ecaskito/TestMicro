var mi_mediaAudioGrabar;
var mi_mediaAudioReproducir;
var src = "myrecording.mp3";
var sFichero;
function recordAudioInicio() {
    try{
        document.getElementById('audio_position').innerHTML = "recordAudioInicio";

        mi_mediaAudioGrabar = new Media(src,onSuccessAudio,onErrorAudio);

        // Record audio
        mi_mediaAudioGrabar.startRecord();
    }
    catch (ex){
        alert("recordAudioInicio "+ ex.message)
    }
}

function recordAudioFin() {
    try{
        document.getElementById('audio_position').innerHTML = "recordAudioFin";
        mi_mediaAudioGrabar.stopRecord();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, fail);
    }
    catch (ex){
        alert("recordAudioFin "+ ex.message)

    }
}


/*************************** REPRODUCIR AUDIO ***************************/

function gotFS(fileSystem) {
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry, onError);
}

function gotFileEntry(fileEntry) {

    var fileUri = fileEntry.toURI();
    var scr = fileEntry.toURI();

    my_media = new Media(scr, onSuccess('Play'), onError);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        var iPos = parseInt(position);
                        if (iPos < 10) {
                            setAudioPosition("0:0" + (iPos), 0);
                        }
                        else
                        {
                            setAudioPosition("0:" + (iPos), 0);
                        }
                        if (iPos==0){
                            setAudioPosition("", 0);
                            document.getElementById('playAudio_Push').src="img/play.png";
                        }
                        else{
                            document.getElementById('playAudio_Push').src="img/stop.png";
                        }
                    }
                },
                // error callback
                function(e) {
                    alert("Error getting pos=" + e);
                    setAudioPosition("Error: " + e, 1);
                }
            );
        }, setInt * 100);
    }
}

function PlayAudioInicio() {
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    //fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry(), onError);
    try {
        document.getElementById('audio_position').innerHTML = "PlayAudioInicio";

        if (mi_mediaAudioReproducir == null) {
            // Create Media object from src
            mi_mediaAudioReproducir = new Media("data:audio/mpeg;base64," + sFichero, onSuccessAudio, onErrorAudio);
        } // else play current audio
        // Play audio
        mi_mediaAudioReproducir.play();
    }
    catch (ex) {
        alert("PlayAudioInicio "+ ex.message)
    }
}

function PlayAudioFin() {
    try{
        document.getElementById('audio_position').innerHTML = "PlayAudioFin";
        mi_mediaAudioReproducir.stop();
    }
    catch (ex){
        alert("PlayAudioFin"+ ex.message)
    }
}

function onSuccessAudio() {
}

function onErrorAudio(error) {
    alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
//    document.getElementById('audio_position').innerHTML = position;
}


function ConvertirFicheroAudioToBase64(fileSystem) {
    fileSystem.root.getFile(miGlobal_mediaAudiosrc, null, LeerFicheroAudio, fail);
}
function LeerFicheroAudio(fileEntry) {
    fileEntry.file(LeerFicheroAudioOK, LeerFicheroAudioError);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
function LeerFicheroAudioError(error) {
    miGlobal_inciAudio='';
    mensaje(error.message,"error");
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        alert(evt.target.result);
        sFichero = evt.target.result;
    };
    reader.readAsDataURL(file);
}
