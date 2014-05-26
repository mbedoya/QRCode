//phonegap remote login -u mauricio.bedoya@gmail.com -p mauricio12
//phonegap local plugin add https://github.com/phonegap-build/BarcodeScanner.git
//phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
//phonegap local plugin add https://github.com/auth0/phonegap-auth0.git
//phonegap local plugin add org.apache.cordova.geolocation


var watchID;
var currentLatLng = null;
var map;
var marker;

function onFileSystemSuccess(fileSystem) {

    try{

        var directoryEntry = fileSystem.root; // to get root path to directory
        directoryEntry.getDirectory("QRCode", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail);
        var rootdir = fileSystem.root.toURL();
        var fp = rootdir + "QRCode/history.txt";
        fileSystem.root.getFile("history.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    }catch (error){
        alert(error);
    }



}

function onDirectorySuccess(parent) {
    console.log(parent);
}

function onDirectoryFail(error) {
    alert("Unable to create new directory: " + error.code);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.seek(writer.length);
    var line = $("#markName").val() + ":" + currentLatLng.toString() + "\r\n";
    writer.write(line);
}

function fail(evt) {
    alert(evt.target.error.code);
}


$(document).ready(function (){

    currentLatLng = new google.maps.LatLng(6.23838686, -75.5852472);

    openFB.init('854392904574269'); // Defaults to sessionStorage for storing the Facebook token

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init('YOUR_FB_APP_ID', 'http://localhost/openfb/oauthcallback.html', window.localStorage);

    function login() {
        openFB.login('email',
            function() {
                alert('Facebook login succeeded');
            },
            function(error) {
                alert('Facebook login failed: ' + error.error_description);
            });
    }

    function getInfo() {

        alert('getting info');

        openFB.api({
            path: '/me',
            success: function(data) {

                alert('success');

                console.log(JSON.stringify(data));
                alert(data.name);

                alert('success final');
            },
            error: errorHandler});
    }

    function share() {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: 'Testing Facebook APIs'
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});
    }

    function revoke() {
        openFB.revokePermissions(
            function() {
                alert('Permissions revoked');
            },
            errorHandler);
    }

    function errorHandler(error) {
        alert(error.message);
    }

    $("#getShowMeMapButton").on("click", function(){

        $.mobile.changePage("#pagemap", {transition: "none"});

    });

    $( document ).on( "pageinit", "#pagemap", function() {



        var mapOptions = {
            center: currentLatLng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: "Greetings!"
        });
    });

    $("#markPointButton").on("click", function(){

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

    });

    function updatePosition(){

        marker.setPosition( currentLatLng );
        map.panTo( currentLatLng );
    }

    $("#getStartGeoLocatorButton").on("click", function(){

        try{

            watchID = navigator.geolocation.watchPosition(
                function(position){

                    $("#latitude").html(position.coords.latitude);
                    $("#longitude").html(position.coords.longitude);
                    $("#altitude").html(position.coords.altitude);

                    currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    updatePosition();

                }, function(error){
                    alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
                },
                { enableHighAccuracy: true });

        }catch (err){
            alert(err);
        }



    });

    $("#getStopGeoLocatorButton").on("click", function(){

        navigator.geolocation.clearWatch(watchID);

    });


    $("#getInfoButton").on("click", function(){

        getInfo();

    });


    $("#getFBButton").on("click", function(){

        login();

    });

    $("#getCodeButton").on("click", function(){

        try{

            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );

        }catch(err) {
            alert('Error calling code reader: ' + err);
        }

    });

    $("#getAuthButton").on("click", function(){

        var auth0 = new Auth0Client("felicis.auth0.com","CqWnSjFdiZzUARDhOFmPPTsu02pKWUqW");

        try{

            auth0.login(function (err, result) {
                if (err){
                    alert(err);
                    //return;
                }
                alert(result);
                alert(result.profile.email);

            });
        }
        catch(err) {
            alert('Error authenticating: ' + err);
        }

    });

});

//It gets mobile events
var index_js = function(){

    var application;

    this.start = function(){

        application = new app(this);
        application.initialize(application.sender.onDeviceReady);
    }

    //Método invocado cuando el dispositivo esté listo
    this.onDeviceReady = function(e){

        //Iniciarlizar los eventos cuando el dispositivo esté listo
        //Evento Menú
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_MENU, aplicacion.sender.onBotonMenuPresionado);
        //Evento Botón Atrás
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_ATRAS, aplicacion.sender.onBotonAtrasPresionado);
    }

    //Método que se invoca cuando se presiona el botón Menú
    this.onBotonMenuPresionado = function (e) {
        if (navigator.notification) {
            navigator.notification.alert('Soy Eus', null, 'Hello', 'OK');
        } else {
            alert('Soy Eus');
        }
    }

    //Método que se invoca cuando se presiona el botón atrás
    this.onBotonAtrasPresionado = function (e) {
        if (navigator.notification) {
            navigator.notification.alert('Atrás', null, 'Hello', 'OK');
        } else {
            alert('Atrás Alert');
        }
    }
}