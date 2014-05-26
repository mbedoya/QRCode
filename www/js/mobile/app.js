/**
 * Created by USUARIO on 23/05/2014.
 */

var app = function(sender) {

    this.sender = sender;

    //Events
    this.EVENT_READY = 'deviceready';
    this.EVENT_MENU_BUTTON = 'menubutton';
    this.EVENT_BACK_BUTTON = 'backbutton';

    this.initialize = function(callback) {
        document.addEventListener(this.EVENT_READY, callback, false);
    }

    this.addEventListener = function(event,callback){
        document.addEventListener(event, callback, false);
    }

};
