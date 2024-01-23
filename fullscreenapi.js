(function() {
    var uiFullScreenApi = { 
        fullscreenEnabled: false,
        fullScreen: function() {return false;}, 
        requestFullscreen: function() {}, 
        exitFullscreen: function() {},
        bind: function() {},
        fullScreenEventName: '',
        prefix: ''
    }
    if (document.exitFullscreen) {
        //native support
        uiFullScreenApi.fullscreenEnabled = true;
    } else {
        if (document.mozCancelFullScreen) {
            uiFullScreenApi.fullscreenEnabled = true;
            uiFullScreenApi.prefix = 'moz';
        } 
        if (document.webkitCancelFullScreen) {
            uiFullScreenApi.fullscreenEnabled = true;
            uiFullScreenApi.prefix = 'webkit';
        } 
    }
    if (uiFullScreenApi.fullscreenEnabled) {
        uiFullScreenApi.fullScreenEventName = uiFullScreenApi.prefix + 'fullscreenchange';
        
        uiFullScreenApi.fullScreen = function() {
            switch (this.prefix) {	
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }

        uiFullScreenApi.requestFullscreen = function(el) {
            return (this.prefix === '') ? el.requestFullscreen() : el[this.prefix + 'RequestFullScreen']();
        }
        uiFullScreenApi.exitFullscreen = function(el) {
            return (this.prefix === '') ? document.exitFullscreen() : document[this.prefix + 'CancelFullScreen']();
        }	
        
        uiFullScreenApi.bind = function(el, func, useCapture) {
            if (this.fullscreenEnabled) {
                if (!useCapture) useCapture = false;
                el.addEventListener(uiFullScreenApi.fullScreenEventName, func, useCapture);
                return true;
            }
            return false;
        }
    }
    
    window.uiFullScreenApi = uiFullScreenApi;
})();