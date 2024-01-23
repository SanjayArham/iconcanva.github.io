(function($) {
    $(document).ready(function(){
        $('#slidesmenu a').click(function() {

            var itemIndex = $(this.parentNode).index();
            uiSlidesFullScreen(false);
            
            if (itemIndex==0) {
                uiSlidesEsc('projects');
            } else {
                var activeMenuItem = $('#menu a.active').get(0);
                if (activeMenuItem) {
                    uiSlidesEsc(activeMenuItem.pathname.replace(/^\//, '' ))
                }
                else uiSlidesEsc('news');
            }
            
            return false;
        });
        $('#flyingIcon a').click(function() {
            uiSlidesFullScreen(false);
            uiSlidesEsc('projects');
        });

        uiFullScreenApi.bind(document, function(e){
            if (uiFullScreenApi.fullScreen()) {
                uiSlidesFullScreen(true);
            } else {
                uiSlidesFullScreen(false);
            }
        });
        
        $('#slidesfspanel .fullScrButton').click(function(){
            uiSlidesFullScreen();
            return false;
        });
        uiPaginationInit('slides', 'uiSlidesPaginate');
        $('#slides .nextzone, #slides .prevzone').live('mouseover', function() {
            $(this).addClass('hover');
            if ($(this).hasClass('nextzone')) {
                $('#pgnt-slides a.next').addClass('hover');
                
            } else if ($(this).hasClass('prevzone')) {
                $('#pgnt-slides a.prev').addClass('hover');
            }
        });
        $('#slides .nextzone, #slides .prevzone').live('mouseout', function() {
            $(this).removeClass('hover');
            if ($(this).hasClass('nextzone')) {
                $('#pgnt-slides a.next').removeClass('hover');
            } else if ($(this).hasClass('prevzone')) {
                $('#pgnt-slides a.prev').removeClass('hover');
            }
        });
        $('#slides .nextzone, #slides .prevzone').live('click', function() {
            var dir;
            if ($(this).hasClass('nextzone')) {
                dir = 'next';
            } else if ($(this).hasClass('prevzone')) {
                dir = 'prev';
            }
            uiSlidesNextPrev(dir);
        });
        var iPad = $(document.body).hasClass('iPad');
        if (!iPad) {
            $('#slidesmenublock,#slidespanelblock,#slidesfspanel').mouseover(function(e){
                var isFull = $(document.body).hasClass('fullscreen');
                if (isFull) $('.slidesmenublock-wrapper,.slidespanel-wrapper,.slidesfspanel-wrapper').show();
            });
            $('#slidesmenublock,#slidespanelblock,#slidesfspanel').mouseout(function(){
                var isFull = $(document.body).hasClass('fullscreen');
                if (isFull) $('.slidesmenublock-wrapper,.slidespanel-wrapper,.slidesfspanel-wrapper').hide();
            });
        }
        
        $('#slideshowblock').live('mousemove', function(e) {
            var pageX = e.pageX;
            var pageY = e.pageY;
            $('#slides .currslide .slidecontentbox').find('a').each(function() {
                var $this = $(this);
                if ($this.hasClass('attachment')) return;
                var w = $this.width();
                var h = $this.height();
                var offset = $this.offset();
                if ((pageX>=offset.left) && (pageX<=(offset.left+w))) {
                    if ((pageY>=offset.top) && (pageY<=(offset.top+h))) {
                        var $link = $('#slideshowblock #flyingLink');
                        var linkLeft, linkTop;
                        var add = false;
                        if ($link.length) {
                            linkLeft = $link.attr('data-left');
                            linkTop = $link.attr('data-top');
                            if ((offset.left!=linkLeft) || (offset.top!=linkTop)) {
                                add = true;
                            }
                        } else add = true;
                        if (add) {
                            $('#slideshowblock a.flyingLink').remove();
                            var a = $this.clone();
                            a.css({
                                'position': 'fixed',
                                'zIndex': '301',
                                'left': offset.left,
                                'top': offset.top,
                                'display': 'inline-block'
                            }).addClass('flyingLink');
                            a.attr('id', 'flyingLink');
                            a.attr('data-left', offset.left);
                            a.attr('data-top', offset.top);
                            a.attr('onmouseout', 'this.parentNode.removeChild(this);');
                            $('#slideshowblock').prepend(a);
                        }
                        return false;
                    }
                }
                
            });
            
        });
        
        $('#slideVideoPlay .play').click(function() {
            slideVideoReset();
            var $this = $(this).hide();
            $this.next().html($this.attr('data-code')).show();
        });
        
        $('.scrollbar').live('click', function(e) {
            var dir = '';
            var $target = $(e.target);
            if ($target.hasClass('scrollArrDown')) {
                dir = 'next';
            } else if ($target.hasClass('scrollArrUp')) {
                dir = 'prev';
            } else {
                var pos = uiGetMouseWheelPos(e.originalEvent);
                var $pDescr = $('#slides').find('.currslide').find('.teamAndDescr');
                var pDescrOffset = $pDescr.offset();
                var barT = uiScrollBar.y + pDescrOffset.top;
                var barB = barT + uiScrollBar.size;
                if (pos.y > barB) {
                    dir = 'next';
                } else if (pos.y < barT) {
                    dir = 'prev';
                }
            }
            
            if (dir) uiScrollProjectDescr(dir);
        });
        
    });
})(jQuery);
var uiSlidesConfig = {
    maxH: 900,
    maxW: 1600,
    maxSide: 'height' //width or height
};
var uiScrollBar = {
    h: 0,
    contH: 0,
    step: 1,
    steps: 0,
    delta: 0,
    contY: 0,
    size: 0,
    y: 0,
    maxContY: 0,
    minBarSize: 30,
    reset: function() {
        this.step = 1;
        this.contH = 0;
        this.steps = 0;
        this.size = 0;
        this.delta = 0;
        this.contY = 0;
        this.y = 0;
        this.h = 0;
        this.maxContY = 0;
        
        var $container = $('#slides');
        
        var $pDescrCont = $container.find('.currslide').find('.teamAndDescrCont');
        $pDescrCont.css('top', '0px');

    },
    init: function(contH, h, $slideCont) {
        if ((contH<=0) || (h<=0)) return; 
        this.contH = contH;
        this.h = h;
        
        this.maxContY = this.contH-this.h;
        this.delta = Math.ceil(this.h/3);
        this.steps = Math.ceil(this.maxContY/this.delta)+1;
        this.size = Math.ceil(this.h/this.steps);
        if (this.size < this.minBarSize) {
            this.size = this.minBarSize;
        }
        if (this.size > this.h) {
            this.size = this.h;
        }
        this.step = 1;
        this.contY = 0;
        this.y = 0;
        
        var $slideContentBox = $slideCont.find('.slidecontentbox');
        
        var $pDescr = $slideCont.find('.teamAndDescr');
        var $pDescrCont = $pDescr.find('.teamAndDescrCont');

        var $scrollbar = $slideContentBox.find('.scrollbar');
        var $scrollslider = $scrollbar.find('.scrollslider');
        $pDescrCont.css('top', '0px');
        $scrollslider.css('height', this.size+'px');
        $scrollslider.css('top', '0px');
        
    }
};
var uiSlides = {
    xhrFetchSlide: null,
    orig2Load: 0,
    origLoading: false,
    origBgTimeout: null,
    xhrOrigBg: null
};
function slideVideoReset() {
    var $slideVideoPlay = $('#slideVideoPlay');
    var $playBut = $slideVideoPlay.find('a.play');
    $playBut.next().hide().html('');
    $playBut.show();
}
function uiSlidesKeyPress(e) {
    var dir;
    if (e.which == 37) {
        dir = 'prev';
    } else if (e.which == 39) {
        dir = 'next';
    } else if ((e.which == 38) || (e.which == 40)) {
        if (e.which == 40) dir = 'next';
        else dir = 'prev';
        uiScrollProjectDescr(dir);
        return;
    } else if (e.which == 27) {
        if (!$(document.body).hasClass('fullscreen')) {
            uiSlidesEsc('projects');
        } else if (!uiFullScreenApi.fullscreenEnabled) {
            uiSlidesFullScreen(false);  
        }
        return;
    } else {
        return;
    }
    uiSlidesNextPrev(dir);
}
function uiGetMouseWheelPos(e) {
    var x, y;
    if (e.pageX || e.pageX == 0) {
        x = e.pageX;
        y = e.pageY;
    } else if (e.layerX || e.layerX == 0) {
        x = e.layerX;
        y = e.layerY;
    }
    return {'x': x, 'y': y};
}
function uiSlidesMouseWheel(e) {
    var dir; 
    //as for now: up - prev, down - next
    if (e.originalEvent.wheelDelta) {
        dir = (e.originalEvent.wheelDelta>0)?'prev':'next';
    } else if (e.originalEvent.detail) {
        dir = (e.originalEvent.detail>0)?'next':'prev';
    }
    
    var isOverProjectDescr = false;
    if (dir) {
        var pos = uiGetMouseWheelPos(e.originalEvent);
        var $container = $('#slides');
        var displayState = $container.css('display');
        if (displayState == 'none') return false;
        var $slideCont = $container.find('.currslide');
        var $slideContentBox = $slideCont.find('.slidecontentbox');
        var $pDescr = $slideCont.find('.teamAndDescr');
        var $pDescrCont = $pDescr.find('.teamAndDescrCont');
       
        var $scrollbar = $slideContentBox.find('.scrollbar');
        displayState = $scrollbar.css('display');

        if ((displayState != 'none') && $pDescrCont.length) {
            var pDescrOffset = $pDescr.offset();
            var offset = $slideContentBox.offset();
            var h = $slideContentBox.height();
            var w = $slideContentBox.width();
            var top = Math.round(offset['top']);
            var left = Math.round(offset['left']);
            var pInfoCorr = 30;
            
            var yT = Math.round(pDescrOffset['top']);
            var yB = top + h;
//            var xL = Math.round(pDescrOffset['left']);
            var xL = left;
            var xR = left + w;
            if ((pos.x>xL) && (pos.x<xR) && (pos.y>yT) && (pos.y<yB)) {
                isOverProjectDescr = true;
            }
        }
        if (isOverProjectDescr) {
            uiScrollProjectDescr(dir);
            
        } else {
            uiSlidesNextPrev(dir);
        }
    }
}

function uiScrollProjectDescr(dir) {
    var $container = $('#slides');
    var displayState = $container.css('display');
    if (displayState == 'none') return;
    var $slideCont = $container.find('.currslide');
    var $slideContentBox = $slideCont.find('.slidecontentbox');

    var $pDescr = $slideCont.find('.teamAndDescr');
    var $pDescrCont = $pDescr.find('.teamAndDescrCont');

    var $scrollbar = $slideContentBox.find('.scrollbar');
    displayState = $scrollbar.css('display');
    if ((displayState == 'none') || !$pDescrCont.length) {
        return;
    }
    
    if (uiScrollBar.contH<=0) return;
    uiScrollBar.maxContY = uiScrollBar.contH-uiScrollBar.h;
    uiScrollBar.delta = Math.ceil(uiScrollBar.h/3);
    uiScrollBar.steps = Math.ceil(uiScrollBar.maxContY/uiScrollBar.delta)+1;
    uiScrollBar.size = Math.ceil(uiScrollBar.h/uiScrollBar.steps);
    if (uiScrollBar.size < uiScrollBar.minBarSize) {
        uiScrollBar.size = uiScrollBar.minBarSize;
    }
    if (uiScrollBar.size > uiScrollBar.h) {
        uiScrollBar.size = uiScrollBar.h;
    }
    var step = uiScrollBar.step;
    
    if (dir=='next') {//down
        step++;
    } else {//up
        step--;
    }
    if (step<=1) step = 1; 
    if (step>=uiScrollBar.steps) step = uiScrollBar.steps; 
    
    var contY = (step-1)*uiScrollBar.delta;
    if (contY>=uiScrollBar.maxContY) {
        contY = uiScrollBar.maxContY;
    }
    if (uiScrollBar.contY != contY) {
        uiScrollBar.contY = contY;
        uiScrollBar.step = step;
    } 
    var y = (step-1)*uiScrollBar.size;
    if ((y + uiScrollBar.size) > uiScrollBar.h) {
        y = uiScrollBar.h - uiScrollBar.size;
    }
    uiScrollBar.y = y;
    
    var $scrollslider = $scrollbar.find('.scrollslider');
    $pDescrCont.css('top', (-uiScrollBar.contY)+'px');
    $scrollslider.css('height', uiScrollBar.size+'px');
    $scrollslider.css('top', uiScrollBar.y+'px');
}
function uiSlidesNextPrev(dir) {
    var href, pgNum;
    var a = (dir=='next')?$('#pgnt-slides a.next'):$('#pgnt-slides a.prev');
    if (a.length) {
        pgNum =  parseInt(a.attr('title'));
        if (isNaN(pgNum) || (pgNum<=0)) return false;
        if (href = a.attr('href')) {
            uiSlidesPaginate('slides', href, pgNum);
        }
    }
    return false;
}
function uiSlidesPaginate(containerId, href, pgNum) {
    $('#slideshowblock a.flyingLink').remove();
    if (uiSlideLoaded.status=='idling') {
        uiSlideLoaded.skipfadein = true;
        uiSlideLoaded.fadeinelement.stop(true, true);
        return;
    } else {
        uiSlideLoaded.skipfadein = false;
    }
    slideVideoReset();
    uiFetchSlides(containerId, href, pgNum);
}
function uiSlidesFullScreen(toFull) {
    if (typeof(toFull)=='undefined') 
        toFull = !$(document.body).hasClass('fullscreen');
    var iPad = $(document.body).hasClass('iPad');
    if (toFull) {
        $(document.body).addClass('fullscreen');
        if (uiFullScreenApi.fullscreenEnabled) {
            uiFullScreenApi.requestFullscreen(document.body);
        } 
        if (!iPad) 
            $('.slidesmenublock-wrapper,.slidespanel-wrapper,.slidesfspanel-wrapper').hide();
        else
            $('.slidesmenublock-wrapper,.slidespanel-wrapper,.slidesfspanel-wrapper').show();
        $('#slidesfspanel a.fullScrButton').attr('title', 'Exit Fullscreen');
        
    } else {
        $(document.body).removeClass('fullscreen');
        if (uiFullScreenApi.fullscreenEnabled) {
            uiFullScreenApi.exitFullscreen(document.body);
        }
        $('.slidesmenublock-wrapper,.slidespanel-wrapper,.slidesfspanel-wrapper').show();
        $('#slidesfspanel a.fullScrButton').attr('title', 'Go Fullscreen');
        
    }
    uiFixSlideSize('slides', 'currslide');
    uiFixFlyingIconPos('currslide');
    uiFixVideoCodePos('currslide');
}
function uiLoadSlides(pid, iconSrc, iL, iB, fsW, fsH, pBgClr, slSrc, code, hideFlyingImg) {

    $('#slideshowblock .loading').hide();
    uiIdling();
    canvasApp.disable();
    globeApp.disable();
    uiHashChange('projects-'+code.toLowerCase());
    uiMainPreloadingStop();
    $('#slideshowblock,#slides').hide();
    $('#canvasGlobe').css('position', 'absolute').css('top', '16px');
    var slideCache = $('#slidesCache');
    var cachePid = parseInt(slideCache.attr('data-pid'));
    if (cachePid!=pid) {
        slideCache.html('');
        slideCache.attr('data-pid', pid);

    }
    var skipfadein = false;
    var cIWH = 30; //30 - canvas small icon width and height
    var iWH = 80; //80 - icon height and width
    var cOffset = $('#canvas').offset();
    var cB = 77; //77 - canvas from bottom
    var cL = cOffset['left'];
    iL = Math.floor(cL + iL - (iWH-cIWH)/2);
    iB = Math.floor(cB + iB - cIWH - (iWH-cIWH)/2); 
    var wH = $(window).height();
    var iT = wH - iB - iWH;
    var flyingImgDiv = $('#flyingIcon');
    $('#projectAttachment').hide();
    var flyingImg = flyingImgDiv.find('img');
    flyingImg.attr('src', iconSrc);

    flyingImgDiv.css('left', iL+'px').css('bottom', iB+'px').css('opacity', 1);
    if (!hideFlyingImg) {
        flyingImgDiv.show();
    }

    $('.slide').html('');
    var destL = 175 /* div#slides left position */ + 30 /* div#slideicon left */; //205
    var destT = 30 /* div#slides top position */ + 30 /* div#slideicon top */; //60
    var firstSlideSize = null;
    var iconRelX = 30;
    var iconRelY = 30;
    
    var fakeSlide = $('#fakeslide').css('background', pBgClr).css('opacity', '1');
    var fakeSlideImg = $('#fakeslide img').hide();
    var $cached = $('#firstslidesCache>div[data-pid="'+pid+'"]');
    var $cachedImg = $cached.find('img.slideimg');
    var cachedImgSrc = $cachedImg.attr('src');

    if (fsW>0 && fsH>0) {
        firstSlideSize = uiGetFirstSlideSize(fsW, fsH);
        destL = firstSlideSize['left'] + iconRelX;
        destT = firstSlideSize['top'] + iconRelY;
        
        fakeSlide.css('width', firstSlideSize['width']+'px');
        fakeSlide.css('height', firstSlideSize['height']+'px');
        
        
        if (cachedImgSrc) {
            skipfadein = true;
            slSrc = cachedImgSrc;
        }
        if (slSrc) {
            if (!fakeSlideImg.length) {
                fakeSlide.html('');
                fakeSlideImg = new Image();
                fakeSlideImg.src = slSrc;
                fakeSlideImg = $(fakeSlideImg).appendTo(fakeSlide);
            } else {
                fakeSlideImg.attr('src', slSrc);
            }

            fakeSlideImg.css('width', firstSlideSize['width']+'px');
            fakeSlideImg.css('height', firstSlideSize['height']+'px');
            fakeSlideImg.show();
        }
        
        fakeSlide.show();
    }
    
    /**/
    $('#slideshowblock').css('position', 'fixed').css('bottom', (wH)+'px').css('left', '0px').css('width', '100%').css('height', '100%');
    $('#slides').css('position', 'absolute');
    $('#slidesinterface').css('position', 'absolute');
    $('#slideshowblock,#slides').show();
    
    $('#slidesmenu li:nth-child(2)').css('visibility', 'hidden');
    $('#canvasHide').css('position', 'fixed').css('bottom', '16px').css('left', '25px');
    
    $('#slideshowblock').animate(
    {
        bottom: 0 
    }, 
    {
        duration: 400, 
        specialEasing: {
          opacity: 'easeInQuad'
        },
        complete: function() {
            $('#canvasblock').hide(); 
            $('#slideshowblock').css('position', 'static').css('bottom', 'auto').css('left', 'auto').css('width', 'auto').css('height', 'auto');
            $('#slides').css('position', 'fixed');
            $('#slidesinterface').css('position', 'fixed');
            
            $('#canvasHide').hide().css('position', 'static').css('bottom', 'auto').css('left', 'auto').show();
            $('#slidesmenu li:nth-child(2)').css('visibility', 'visible'); 
        },
        step: function(now, fx) {
            var d = now - fx.start;
            $('#canvasblock').css('bottom', (16 + d)+'px');
        }
    });
    var koeff = (destT - iT)/(destL - iL);
    flyingImgDiv.animate(
    {
        left: destL
    }, 
    {
        duration: 400, 
        specialEasing: {
          opacity: 'easeInQuad'
        },
        complete: function() {
            $(this).css('top', destT+'px').css('left', destL+'px');
            var href = "/getslideshow/"+pid+"?orig=1";
            uiSlideLoaded.isFirst = true;
            uiSlideLoaded.skipfadein = skipfadein;
            uiIdling(true);
            uiFetchSlides('slides', href, 1);
        },
        step: function(now, fx) {
            var dx = now - iL;
            var t = Math.floor(iT + koeff*dx);
            $(this).css('top', t+'px');
        }
    });
}
function uiFetchSlides(containerId, href, page) {
    var container = $('#'+containerId);
    var isLoading = uiCheckIfIdling();
    if (isLoading) return false;
    uiIdling();
    uiSlideLoaded.status = 'idling';
    var nextCont = container.find('.nextslide');
    var currCont = container.find('.currslide');
    var slideContentBox = currCont.find('.slidecontentbox');
    var sw = slideContentBox.width();
    var sh = slideContentBox.height();
    var slideCache = $('#slidesCache');
    var pid = slideCache.attr('data-pid');

    var $firstSlidesCache = $('#firstslidesCache');
    //search cached data
    var cached;
    if (page==1) {
        cached = $('#firstslidesCache>div[data-pid="'+pid+'"]');
    } else
        cached = $('#slidesCache>div[data-p="'+page+'"]');
    if (cached.length && (cached.attr('data-st')=='ready')) {
        nextCont.html('');
        nextCont.hide();
        $('#slideshowblock .loading').show();
        nextCont.html(cached.html());

        uiSlideLoaded(false, page, pid, true);
        return;
    }
    
    uiSlides.xhrFetchSlide = $.ajax({
        url: href,
        type: "post",
        context: container,
        data: {sw: sw, sh: sh},
        beforeSend: function() {
            nextCont.html('');
            nextCont.hide();
            $('#slideshowblock .loading').show();
        },                
        success: function(r) {
            nextCont.html(r);
            
            var img = $(nextCont).find('img.slideimg');
            if (!img.length) {
                uiSlideLoaded(false, page, pid);
            }
        },
        complete: function() {
        },
        error: function(jqXHR, textStatus) {
            $('#slideshowblock .loading').hide();
            $('#fakeslide').hide();
            uiIdling(true);
        }
    }); 
}
function showAttachment(slideCls) {
    var $prAttachDiv = $('#projectAttachment');
    var container = $('#slides');
    var slideCont = container.find('.'+slideCls);
    var slideContentBox = slideCont.find('.slidecontentbox');
    var attachLink;

    $prAttachDiv.html('');
    if (slideContentBox.length) {
        attachLink = slideContentBox.find('a.attachment');
        if (attachLink.length) {
            $prAttachDiv.append(attachLink.clone().css('visibility', 'visible'));
        }
    }
    if (attachLink.length) {
        $prAttachDiv.show(); 
    } else {
        $prAttachDiv.hide(); 
    }
    
}
function uiSlideLoaded(isErr, page, pid, cached) {
    uiIdling();
    page = page || 0;
    cached = Boolean(cached || false);
    var slideCache = $('#slidesCache');
    var curPid = slideCache.attr('data-pid');
    if (pid!=curPid) return;
    var $flyingIcon = $('#flyingIcon');
    var $prAttachDiv = $('#projectAttachment');
    var container = $('#slides');
    var $nextCont = container.find('.nextslide');
    uiSlideLoaded.fadeinelement = $nextCont;
    var currCont = container.find('.currslide');
    var currPage = 0; 
    var currShowIcon = 0; var nextShowIcon = 0;
    var currParamsFrm = currCont.find('form').get(0);
    var nextParamsFrm = $nextCont.find('form').get(0);

    if (currParamsFrm) {
        currPage = currParamsFrm.elements['page'].value;
        currShowIcon = parseInt(currParamsFrm.elements['showicon'].value);
    }
    if (nextParamsFrm) {
        nextShowIcon = parseInt(nextParamsFrm.elements['showicon'].value);
    }

    var pagCont = '';
    pagCont = $nextCont.find('.paginationContent').get(0).innerHTML;
    var isFirst = uiSlideLoaded.isFirst;
    var $firstSlidesCache;
    $nextCont.find('img.slideimg').removeAttr('onload').removeAttr('onerror');
    
    
    /**/
    if (!cached) {
        if (page==1) {
            cached = $('#firstslidesCache>div[data-pid="'+pid+'"]').get(0);
        } else
            cached = $('#slidesCache>div[data-p="'+page+'"]').get(0);
        if (cached) {
            $nextCont.html('');
            $nextCont.html($(cached).html());
        }
    }
    /**/
    
    if (!isErr && (page>0) && !cached) {
        if (page==1) {
            $firstSlidesCache = $('#firstslidesCache');
            cached = $('#firstslidesCache>div[data-pid="'+pid+'"]').get(0);
            if (!cached) {
                cached = document.createElement('div');
                cached.setAttribute('data-pid', pid);
                cached.setAttribute('data-st', 'ready');
                $firstSlidesCache.append(cached);
            }
            $(cached).html($nextCont.html());
        } else {
            cached = $('#slidesCache>div[data-p="'+page+'"]').get(0);
            var isOrig = parseInt(nextParamsFrm.elements['isOrig'].value);
            if (!cached && isOrig) {

                cached = document.createElement('div');
                cached.setAttribute('data-p', page);
                cached.setAttribute('data-st', 'ready');
                slideCache.append(cached);
            }
            if (cached && isOrig) $(cached).html($nextCont.html());
        }
    }
    
    
    var $nextSlideContBox = $nextCont.find('.slidecontentbox');
    var textColor = $nextSlideContBox.css('color');
    $nextSlideContBox.find('.scrollslider').css('background', textColor);
    if (textColor.toLowerCase() != 'rgb(255, 255, 255)') {
        $('.scrollArrUp').removeClass('scrollArrUpWhite');
        $('.scrollArrDown').removeClass('scrollArrDownWhite');
    } else {
        $('.scrollArrUp').removeClass('scrollArrUpWhite').addClass('scrollArrUpWhite');
        $('.scrollArrDown').removeClass('scrollArrDownWhite').addClass('scrollArrDownWhite');
    }
    
    $nextCont.show();
    
    if (!isErr) {
        uiFixSlideSize('slides', 'nextslide');
    }
    
    var hideDiv = currCont;
    if (isFirst) {
        hideDiv = $('#fakeslide');
        $(document).bind('keyup', uiSlidesKeyPress);
        $(window).bind('mousewheel DOMMouseScroll', uiSlidesMouseWheel);

        $(window).bind('resize', uiSlidesResize);
        uiSlideLoaded.isFirst = false;
    }
    uiSlideLoaded.fadein = true;
    uiSlideLoaded.page = page;
    uiSlideLoaded.currpage = currPage;
    
    var iconSlide = !isFirst && currShowIcon && nextShowIcon;
    var flyingPosNext = {l: 0, t: 0};
    var flyingPos = {l: parseInt($flyingIcon.css('left')), t: parseInt($flyingIcon.css('top'))};
    if (nextShowIcon) {
        flyingPosNext = uiFixFlyingIconPos('nextslide', iconSlide);
        $flyingIcon.show();
        if (page==2) showAttachment('nextslide');
    }

    var flyingIconZInd = 301;
    var flyingIconZIndSet = parseInt(currCont.css('zIndex'))+1;
    if (!isFirst) {
        if (currShowIcon && !nextShowIcon) {
            $flyingIcon.css('zIndex', flyingIconZIndSet);
        }
    }
    if ((page!=2) && (currPage==2)) {
        $prAttachDiv.css('zIndex', flyingIconZIndSet);
    }
    
    if (iconSlide) {
        
        $flyingIcon.animate({
            left: flyingPosNext.l,
            top: flyingPosNext.t
        }, uiSlideLoaded.skipfadein?0:250);
    }
    
    $nextCont.css({opacity: 0.0}).animate(
    {
        opacity: 1.0
    }, 
    {
        duration: uiSlideLoaded.skipfadein?0:250,
        complete: function() {
            hideDiv.animate(
            {
                opacity: 0
            }, 
            {
                duration: (uiSlideLoaded.skipfadein || isFirst)?0:1,
                complete: function() {
                    currCont.hide().html('').removeClass('currslide').addClass('nextslide');
                    $nextCont.removeClass('nextslide').addClass('currslide');
                    $('#fakeslide').hide();
                    
                    uiIdling(true);
                    uiSlideLoaded.status = 'complete';
                    uiSlideLoaded.skipfadein = false;

                    if (!nextShowIcon) {
                        $flyingIcon.hide();
                    } else {
                        $flyingIcon.show();
                    }
                    if (page==2) {
                        showAttachment('currslide');
                    } else {
                        $prAttachDiv.hide();
                    }
                    $flyingIcon.css('zIndex', flyingIconZInd);
                    $prAttachDiv.css('zIndex', flyingIconZInd);
                    uiSlideLoaded.fadein = false;
                    
                    uiFixVideoCodePos('currslide');
                    
                    if (page > 1) {
                        if (uiSlides.xhrOrigBg) {
                            uiSlides.xhrOrigBg.abort();
                        }
                        
                        uiSlides.orig2Load = page;
                    }
                    if (isFirst) {
                        uiSlidesBg();
                        uiOrigBg();
                    }
                    
                },
                step: function(now) {

                    if (!isFirst) {
                        if (currShowIcon && !nextShowIcon) {
                            $flyingIcon.css('opacity', now);
                        }
                    }
                    if (page!=2) {
                        $prAttachDiv.css('opacity', now);
                    }
                }
            });
        }, 
        step: function(now) {

            if (!isFirst) {
                if (!currShowIcon && nextShowIcon) {
                    $flyingIcon.css('opacity', now);
                }
            }
            
            if ((page==2) && (currPage!=2)) {
                $prAttachDiv.css('opacity', now);
            }
        }
    });

    $('#slideshowblock .loading').hide();
    $('#pgnt-slides').html(pagCont);
    $('#slides .nextzone.hover, #slides .prevzone.hover').each(function(){
        if ($(this).hasClass('nextzone')) {
            $('#pgnt-slides a.prev').removeClass('hover');
            $('#pgnt-slides a.next').removeClass('hover').addClass('hover');
        } else if ($(this).hasClass('prevzone')) {
            $('#pgnt-slides a.next').removeClass('hover');
            $('#pgnt-slides a.prev').removeClass('hover').addClass('hover');
        }
    });
}
function uiOrigBg() {
     var pgNum = uiSlides.orig2Load;

     var $slideCache = $('#slidesCache');
     var pid = $slideCache.attr('data-pid');
     var $cached = $('#slidesCache>div[data-p="'+pgNum+'"]');
     if ($cached.length) {
         
     } else {
        if (!uiSlides.origLoading && (pgNum > 1)) {
           var href = '/getslideshow/'+pid+'/'+pgNum+'?orig=1';
           uiSlides.xhrOrigBg = $.ajax({
               url: href,
               type: "post",
               data: {cache: 1},
               beforeSend: function() {

                   uiSlides.origLoading = true;
               },                
               success: function(r) {
                   var curPid = $slideCache.attr('data-pid');
                   if (curPid!=pid) return;

                   var cached = document.createElement('div');
                   cached.setAttribute('data-p', pgNum);
                   cached.setAttribute('data-st', 'pending');
                   $slideCache.append(cached);

                   var $cached = $(cached);
                   $cached.html(r);
                   var img = $cached.find('img.slideimg');
                   if (!img.length) {
                       uiCachedSlideLoaded(false, pgNum, pid, false);
                   }


               },
               complete: function() {
               },
               error: function() {
                   uiSlides.origLoading = false;
                   if (uiSlides.orig2Load == pgNum) uiSlides.orig2Load = 0;
               }
           }); 
        }
     }
     uiSlides.origBgTimeout = setTimeout(uiOrigBg, 200); 
}
function uiSlidesBg() {
    if ($('#slideshowblock').css('display')=='none') return;
    var $slideCache = $('#slidesCache');
    var pid = $slideCache.attr('data-pid');
    var pgCount = $('#pgnt-slides .page-nav span').text().split('/');
    if (1 in pgCount) pgCount = parseInt(pgCount[1]);
    if (!pgCount || (pgCount==1)) return;

    var $cachedDivs = $('#slidesCache>div');
    if ($cachedDivs.length>=pgCount) {

        uiSlidesBg.timeout = setTimeout(uiSlidesBg, 3000);
        return;
    }
    
    var pgNums = [];
    var pgNum;
    $cachedDivs.each(function() {
        pgNum = parseInt($(this).attr('data-p'));
        if (pgNum) {
            pgNums.push(pgNum);
        }
    });
    pgNums.sort(function(a, b) {
        return a-b;
    });
    var prevPgNum = 1;
    pgNum = 1; //skip first
    var pgNumsCount = pgNums.length;
    for (var i = 0; i<pgNumsCount; i++) {
        pgNum = pgNums[i];
        if ((pgNum-prevPgNum)>1) {
            pgNum = prevPgNum;
            break;
        }
        prevPgNum = pgNum;
    }
    pgNum++;
    if (pgNum>pgCount) {

        uiSlidesBg.timeout = setTimeout(uiSlidesBg, 3000);
        return;
    }

    var cached = document.createElement('div');
    cached.setAttribute('data-p', pgNum);
    var href = '/getslideshow/'+pid+'/'+pgNum+'?orig=1&bg=1';
    $.ajax({
        url: href,
        type: "post",
        data: {cache: 1},
        beforeSend: function() {
        },                
        success: function(r) {
            cached.setAttribute('data-st', 'pending');
            $slideCache.append(cached);

            var $cached = $(cached);
            $cached.html(r);
            var img = $cached.find('img.slideimg');
            if (!img.length) {
                uiCachedSlideLoaded(false, pgNum, pid, true);
            }
    
        },
        complete: function() {
        },
        error: function() {
        }
    }); 
}
function uiCachedSlideLoaded(isErr, page, pid, bg) {
    if ($('#slideshowblock').css('display')=='none') return;
    page = page || 0;
    var slideCache = $('#slidesCache');
    var curPid = slideCache.attr('data-pid');
    if (curPid!=pid) return;
    
    var container = $('#slides');
    var currCont = container.find('.currslide');
    var paramsFrm = currCont.find('form').get(0);
    var curPage = paramsFrm.elements['page'].value;

    var cached = $('#slidesCache>div[data-p="'+page+'"]');
    if (cached.length && !isErr) {
        $(cached).find('img.slideimg').removeAttr('onload').removeAttr('onerror');
        $(cached).attr('data-st', 'ready');
        
        if (!uiCheckIfIdling()) {
            if (curPage==page) {
                currCont.html(cached.html());
                uiFixSlideSize('slides', 'currslide');
            }
        }
        
    } else if (isErr) {
        $(cached).remove();
    }
    if (!bg) {
        uiSlides.origLoading = false;
        if (uiSlides.orig2Load == page) uiSlides.orig2Load = 0;
    } else {
        uiSlidesBg.timeout = setTimeout(uiSlidesBg, 3000); 
    }
}
function uiFixSlideSize(containerId, slideCls) {
    var isFull = $(document.body).hasClass('fullscreen');
    $('#slideshowblock a.flyingLink').remove();
    var container = $('#'+containerId);
    var displayState = container.css('display');
    if (displayState == 'none') return false;
    var slideCont = container.find('.'+slideCls);
    var slideContentBox = slideCont.find('.slidecontentbox');
    var containerH = container.height();
    var containerW = container.width();
    if (isFull) {
        containerH = $(window).height();
        containerW = $(window).width();
    }

    var img = slideCont.find('img.slideimg').get(0);
    var imgExists = (typeof(img)!='undefined')?true:false;
    var paramsFrm = slideCont.find('form').get(0);
    var descrCont = slideCont.find('.description');
   
    var $pDescr = slideCont.find('.teamAndDescr');
    var $pDescrCont = $pDescr.find('.teamAndDescrCont');

    var isVideo = 0;
    if (paramsFrm) {
        isVideo = parseInt(paramsFrm.elements['isvideo'].value);
    }

    var imgRealH = 0;var imgRealW = 0;
    var dH;var dW;var imgW = 0;var imgH = 0; 
    uiScrollBar.reset();
    /* set dimensions and positions */
    if (typeof(paramsFrm)!='undefined') {
        if (!isVideo) {
            if (imgExists) {
                imgRealH = parseInt(paramsFrm['elements']['h'].value);
                imgRealW = parseInt(paramsFrm['elements']['w'].value);
                img.style.width = 'auto';img.style.height = 'auto';
                
            } else {
                imgRealH = parseInt(paramsFrm['elements']['fh'].value);
                imgRealW = parseInt(paramsFrm['elements']['fw'].value);
            }

            slideContentBox.css('width', 'auto');slideContentBox.css('height', 'auto');
            dH = containerH/imgRealH;
            dW = containerW/imgRealW;

            if ((imgRealH<containerH) && (imgRealW<containerW)) {
                if (dW<=dH) {
                    imgW = Math.floor(imgRealW*dW);
                    imgH = Math.floor(imgRealH*dW);
                } else {
                    imgH = Math.floor(imgRealH*dH);
                    imgW = Math.floor(imgRealW*dH);
                }
                if (imgW>containerW) {
                    imgW = containerW;
                }
                if (imgH>containerH) {
                    imgH = containerH;
                }
                if (imgExists) {
                    img.style.width = imgW+'px';
                    img.style.height = imgH+'px';
                }
            } else if (!imgExists) {
                if (imgRealW<containerW) {
                    //resize by height
                    imgH = containerH;
                    imgW = Math.floor(imgRealW/(imgRealH/containerH));
                } else if (imgRealH<containerH) {
                    //resize by width
                    imgW = containerW;
                    imgH = Math.floor(imgRealH/(imgRealW/containerW));
                } else {
                    //imgRealH>=containerH && imgRealW>=containerW
                    dH = imgRealH/containerH;
                    dW = imgRealW/containerW;
                    if (dW>=dH) {
                        imgW = containerW;
                        imgH = Math.floor(imgRealH/dW);
                    } else {
                        imgH = containerH;
                        imgW = Math.floor(imgRealW/dH);
                    }
                }
                if (imgW>containerW) {
                    imgW = containerW;
                }
                if (imgH>containerH) {
                    imgH = containerH;
                }
            }

            if (imgExists) {
                imgW = $(img).width();
                imgH = $(img).height();            
            }
            if (uiSlidesConfig.maxSide == 'width') {
                if (!isFull) if (imgW>=uiSlidesConfig.maxW) {
                    imgW = uiSlidesConfig.maxW;
                    imgH = Math.floor(imgRealH/(imgRealW/uiSlidesConfig.maxW));
                    if (imgExists) {
                        img.style.width = imgW+'px';
                        img.style.height = imgH+'px';
                    }
                }
            } else {
                if (!isFull) if (imgH>=uiSlidesConfig.maxH) {
                    imgH = uiSlidesConfig.maxH;
                    imgW = Math.floor(imgRealW/(imgRealH/uiSlidesConfig.maxH));
                    if (imgExists) {
                        img.style.width = imgW+'px';
                        img.style.height = imgH+'px';
                    }
                }
            }
        
        } else {
            imgW = 800;
            imgH = 450;
            if (imgExists) {
                img.style.width = imgW+'px';
                img.style.height = imgH+'px';
            }
        }
        
        slideContentBox.css('width', imgW+'px'); 
        slideContentBox.css('height', imgH+'px');
        
        var padding = 10;
        if (descrCont.length) {
            descrCont.css('width', 'auto').css('height', 'auto');
            descrCont.css('width', (imgW-padding*2>1)?(imgW-padding*2-1):0+'px');
            descrCont.css('bottom', 'auto').css('top', 'auto').css('left', 'auto').css('right', 'auto');
            if (descrCont.hasClass('top') || descrCont.hasClass('topright') || descrCont.hasClass('topleft')) {
                descrCont.css('top', padding+'px');
                descrCont.css('height', (imgH-padding*2>1)?(imgH-padding*2-1):0+'px');
            } else if (descrCont.hasClass('bottom') || descrCont.hasClass('bottomleft') || descrCont.hasClass('bottomright')) {
                descrCont.css('max-height', (imgH-padding*2>1)?(imgH-padding*2-1):0+'px');
                descrCont.css('bottom', padding+'px');
            } else if (descrCont.hasClass('left') || descrCont.hasClass('right') || descrCont.hasClass('center')) {
                var descrRealH = $(descrCont).height();
                descrRealH = (descrRealH<(imgH-padding*2-1))?(descrRealH):(imgH-padding*2-1);
                
                descrCont.css('height', descrRealH+'px');
                descrCont.css('max-height', (imgH-padding*2>1)?(imgH-padding*2-1):0+'px');
                
                descrCont.css('bottom', padding+'px').css('top', padding+'px');
            }
            
            if (descrCont.hasClass('topleft') || descrCont.hasClass('left') || descrCont.hasClass('bottomleft')) {
                descrCont.css('left', padding+'px');
            }
            if (descrCont.hasClass('topright') || descrCont.hasClass('right') || descrCont.hasClass('bottomright')) {
                descrCont.css('right', padding+'px');
            }
            if (descrCont.hasClass('top') || descrCont.hasClass('bottom') || descrCont.hasClass('center')) {
                descrCont.css('right', padding+'px');
                descrCont.css('left', padding+'px');
            }
        }
        
        var pInfoBCorr = 30;
        var offset = slideContentBox.offset();
        var top = Math.round(offset['top']);
        var $scrollbar = slideContentBox.find('.scrollbar');
        if (!isFull) $('.prevzoneDefault,.nextzoneDefault').css({'height': 'auto', 'bottom': '0px'});
        $('.prevzone4DescrSlides,.nextzone4DescrSlides').hide();
        if ($pDescrCont.length && $scrollbar.length) {
            var pdContH = $pDescrCont.height();
            var pDescrOffset = $pDescr.offset();
            var pdT = Math.round(pDescrOffset['top']);
            var pdL = Math.round(pDescrOffset['left']);
            var pdRealH = imgH - (pdT - top) - pInfoBCorr;
            var dH = pdRealH - pdContH;
            if ((dH>=0) || (pdRealH<=0)) {
                $scrollbar.hide();
            } else {
                $scrollbar.css('height', pdRealH+'px');
                $pDescr.css('height', pdRealH+'px');
                $scrollbar.show();
                uiScrollBar.init(pdContH, pdRealH, slideCont);
            }

            //var zoneH = (pdT - top - 30);
            //if (!isFull) {
            //    var containerMarginX = 175;
            //    var prevnext4DescrW = pdL - pInfoBCorr - containerMarginX;
            //    $('.prevzoneDefault,.nextzoneDefault').css({'height': zoneH + 'px', 'bottom': 'auto'});
            //    $('.prevzone4DescrSlides,.nextzone4DescrSlides').css('width', prevnext4DescrW + 'px').show();
            //}
        }
    }
}

function uiFixFlyingIconPos(slideCls, fiDoNotMove) {
    var flyingIconDiv = $('#flyingIcon');
    var prAttachDiv = $('#projectAttachment');
    
    var container = $('#slides');
    var displayState = container.css('display');
    if (displayState == 'none') return false;
    var slideCont = container.find('.'+slideCls);
    var slideContentBox = slideCont.find('.slidecontentbox');
    if (!slideContentBox.length) return false;
    
    var offset = slideContentBox.offset();
    var left = Math.round(offset['left']);
    var top = Math.round(offset['top']);
    var w = slideContentBox.width();
    var h = slideContentBox.height();
    var fiL = left+30;
    var fiT = top+30;
    if (!fiDoNotMove) 
        flyingIconDiv.css('left', fiL+'px').css('top', fiT+'px');
    
    prAttachDiv.css('left', (left+w-30-17)+'px').css('top', (top+30)+'px');
    if ((w<=110) || (h<=110)) {//110 = 80 + 30; 80 - flyingIcon size, 30 - icon relative offset
        flyingIconDiv.css('visibility', 'hidden');
        prAttachDiv.css('visibility', 'hidden');
    } else {
        flyingIconDiv.css('visibility', 'visible');
        prAttachDiv.css('visibility', 'visible');
    }
    return {l: fiL, t: fiT};
}
function uiFixVideoCodePos(slideCls) {
    var container = $('#slides');
    var displayState = container.css('display');
    if (displayState == 'none') return false;
    var slideCont = container.find('.'+slideCls);
    var slideContentBox = slideCont.find('.slidecontentbox');
    if (!slideContentBox.length) return false;
    var $slideVideoPlay = $('#slideVideoPlay');
    $slideVideoPlay.hide();
    var $playBtn = $slideVideoPlay.find('a.play');
    var paramsFrm = slideCont.find('form').get(0);
    var isVideo = 0;
    var videoCode = '';
    if (paramsFrm) {
        isVideo = parseInt(paramsFrm.elements['isvideo'].value);
        videoCode = $.trim(paramsFrm.elements['videocode'].value);
    }

    var offset, left, top, w, h;
    if (isVideo) {
        var offset = slideContentBox.offset();
        var left = Math.round(offset['left']);
        var top = Math.round(offset['top']);
        var w = slideContentBox.width();
        var h = slideContentBox.height();
        $slideVideoPlay.css('left', left+'px').css('top', top+'px');
        $slideVideoPlay.css('width', w+'px').css('height', h+'px');
        
        $playBtn.attr('data-code', videoCode);
        if ((w<=110) || (h<=110)) {//110 = 80 + 30; 80 - flyingIcon size, 30 - icon relative offset
            $slideVideoPlay.css('visibility', 'hidden');
        } else {
            $slideVideoPlay.css('visibility', 'visible');
        }
        $slideVideoPlay.show();
    }
}
function uiGetFirstSlideSize(imgRealW, imgRealH) {
    var dH;var dW;var imgW = 0;var imgH = 0;
    var containerW = 0;var containerH = 0;

    var windowW = $(window).width();
    var windowH = $(window).height();
    var containerMinW = 500;
    var containerMinH = 0;
    var containerMarginX = 175; 
    var containerMarginY = 30;
    containerW = windowW - containerMarginX*2;
    if (containerW<=containerMinW) containerW = containerMinW;
    containerH = windowH - containerMarginY*2;
    if (containerH<=containerMinH) containerH = containerMinH;
    
    if (imgRealW<containerW) {
        //resize by height
        imgH = containerH;
        imgW = Math.floor(imgRealW/(imgRealH/containerH));
    } else if (imgRealH<containerH) {
        //resize by width
        imgW = containerW;
        imgH = Math.floor(imgRealH/(imgRealW/containerW));
    } else {
        //imgRealH>=containerH && imgRealW>=containerW
        dH = imgRealH/containerH;
        dW = imgRealW/containerW;
        if (dW>=dH) {
            imgW = containerW;
            imgH = Math.floor(imgRealH/dW);
        } else {
            imgH = containerH;
            imgW = Math.floor(imgRealW/dH);
        }
    }
    if (imgW>containerW) {
        imgW = containerW;
    }
    if (imgH>containerH) {
        imgH = containerH;
    }
    
    if (uiSlidesConfig.maxSide == 'width') {
        if (imgW>=uiSlidesConfig.maxW) {
            imgW = uiSlidesConfig.maxW;
            imgH = Math.floor(imgRealH/(imgRealW/uiSlidesConfig.maxW));
        }
    } else {
        if (imgH>=uiSlidesConfig.maxH) {
            imgH = uiSlidesConfig.maxH;
            imgW = Math.floor(imgRealW/(imgRealH/uiSlidesConfig.maxH));
        }
    }
    var left = Math.round((windowW-imgW)/2);
    var top = Math.round((windowH-imgH)/2);
    
    return {'left': left, 'top': top, 'width': imgW, 'height': imgH};
}
function uiSlidesResize() {
    uiFixSlideSize('slides', 'currslide'); 
    if (uiSlideLoaded.fadein) {
        if (uiSlideLoaded.page>2) {
            uiFixFlyingIconPos('currslide');
        } else {
            uiFixFlyingIconPos('nextslide');
        }
    } else {
        uiFixFlyingIconPos('currslide');
    }
    uiFixVideoCodePos('currslide');
}
function uiSlides2Canvas() {
    if (uiCheckIfIdling()) return false;    
    uiIdling();
    $('#slideshowblock a.flyingLink').remove();
    $('#canvasGlobe').css('position', 'absolute').css('top', '16px');
    slideVideoReset();
    $('#slideVideoPlay').hide();
    clearTimeout(uiSlidesBg.timeout);
    clearTimeout(uiSlides.origBgTimeout);
    var $flyingIcon = $('#flyingIcon');
    var $prAttachDiv = $('#projectAttachment');
    $(document).unbind('keyup', uiSlidesKeyPress);
    $(window).unbind('mousewheel DOMMouseScroll', uiSlidesMouseWheel);
    $(window).unbind('resize', uiSlidesResize);
    canvasApp.disable();
    globeApp.disable();
    var wH = $(window).height();
    var $slideshowblock = $('#slideshowblock');
    var $canvasblock = $('#canvasblock');
    var $slides = $('#slides');
    var $slidesinterface = $('#slidesinterface');
    var $infoLink = $('#canvasHide');
    var $slidesInfoLink = $('#slidesmenu li:nth-child(2)');
    
    $slideshowblock.css('position', 'fixed').css('top', '0px').css('left', '0px').css('width', '100%').css('height', '100%');
    $slides.css('position', 'absolute');
    $slidesinterface.css('position', 'absolute');
    
    var botFrom = (wH>669)?wH:669;
    $canvasblock.css('bottom', -botFrom+'px').show();
    
    $slidesInfoLink.css('visibility', 'hidden');
    $infoLink.css('position', 'fixed').css('bottom', '16px').css('left', '25px').show();
    var hidSpan = $infoLink.parent().prepend('<span style="visibility: hidden;">&nbsp;</span>').children().get(0);
    var flyingIconTop = parseInt($flyingIcon.css('top'));
    $canvasblock.animate(
    {
        bottom: 16 
    }, 
    {
        duration: 600,
        complete: function() {
            $flyingIcon.hide();
            $prAttachDiv.hide();
            $slideshowblock.hide();
            $slides.hide();
            $slideshowblock.css('position', 'static').css('top', 'auto').css('left', 'auto').css('width', 'auto').css('height', 'auto');
            $slides.css('position', 'fixed');
            $slidesinterface.css('position', 'fixed');
            $canvasblock.css('bottom', '16px');

            hidSpan.parentNode.removeChild(hidSpan);
            $slidesInfoLink.css('visibility', 'visible'); 
            $infoLink.css('position', 'static').css('bottom', 'auto').css('left', 'auto');
            $('#canvasGlobe').css('position', 'fixed').css('top', '0px');
            globeApp.enable();
            canvasApp.enable();
            canvasApp.onResizeDo();
            uiMainPreloading(false);
            uiIdling(true);
        },
        step: function(now, fx) {
            var d = Math.round(now - fx.start);
            $slideshowblock.css('top', (-d)+'px');
            $flyingIcon.css('top', (-d+flyingIconTop)+'px');
            $prAttachDiv.css('top', (-d+flyingIconTop)+'px');
        }
    });
    
}
function uiSlides2Info() {
    if (uiCheckIfIdling()) return false;    
    uiIdling();
    $('#slideshowblock a.flyingLink').remove();
    slideVideoReset();
    $('#slideVideoPlay').hide();
    $('#canvasGlobe').css('position', 'absolute').css('top', '16px');
    clearTimeout(uiSlidesBg.timeout);
    clearTimeout(uiSlides.origBgTimeout);
    var $flyingIcon = $('#flyingIcon');
    var $prAttachDiv = $('#projectAttachment');
    $(document).unbind('keyup', uiSlidesKeyPress);
    $(window).unbind('mousewheel DOMMouseScroll', uiSlidesMouseWheel);
    $(window).unbind('resize', uiSlidesResize);
    canvasApp.disable();
    globeApp.disable();
    var wH = $(window).height();
    var $slideshowblock = $('#slideshowblock');
    var $canvasblock = $('#canvasblock');
    var $mainblock = $('#mainblock');
    var $leftblock = $('#leftblock');
    var $slides = $('#slides');
    var $slidesinterface = $('#slidesinterface');
    var $contentblock = $('#contentblock');
    
    $slideshowblock.css('position', 'fixed').css('top', '0px').css('left', '0px').css('width', '100%').css('height', wH);
    $slides.css('position', 'absolute');
    $slidesinterface.css('position', 'absolute');
    
    $canvasblock.css('bottom', '-669px').show();
    //669px - canvas block height 600+65, 16px - canvas from bottom

    $leftblock.css('position', 'static');
    $mainblock.css('position', 'absolute').css('width', '100%');
    $mainblock.css('top', (wH+669+16)+'px').css('height', wH+'px')/*.css('overflow', 'hidden')*/.show();
    var flyingIconTop = parseInt($flyingIcon.css('top'));
    $mainblock.animate(
    {
        top: 0
    }, 
    {
        duration: 400, 
        complete: function() {
            $flyingIcon.hide();
            $prAttachDiv.hide();
            $slideshowblock.hide();
            $slideshowblock.css('position', 'static').css('top', 'auto').css('left', 'auto').css('width', 'auto').css('height', 'auto');
            $slides.css('position', 'fixed');
            $slidesinterface.css('position', 'fixed');
            
            //fix Chrome issue with a glimpse on Mac
            setTimeout(uiSlides2InfoCompleted, 50); 
            return;
        },
        step: function(now, fx) {
            var d = -Math.round(Math.abs(now - fx.start));
            $slideshowblock.css('top', (d)+'px');
            $flyingIcon.css('top', (d+flyingIconTop)+'px');
            $prAttachDiv.css('top', (d+flyingIconTop)+'px');
            $canvasblock.css('bottom', (-d-669)+'px');
        }
    });
    
}
function uiSlides2InfoCompleted() {
    var $canvasblock = $('#canvasblock');
    var $mainblock = $('#mainblock');
    var $leftblock = $('#leftblock');
    var $contentblock = $('#contentblock');
    $canvasblock.hide().css('bottom', '16px');
    $leftblock.css('position', 'fixed');
    $mainblock.css('position', 'static').css('width', 'auto').css('height', 'auto')/*.css('overflow', 'auto')*/.css('top', 'auto');
    $contentblock.trigger("scroll"); 
    uiMainPreloading(false);
    uiIdling(true);
    if ($('#page-search').css('display')!='none') {
        $('#searchInput').focus();
    }
}
function uiSlidesEsc(hash) {
    if (uiSlides.xhrFetchSlide) {
        uiSlides.xhrFetchSlide.abort();
    } 
    uiIdling(true);
    uiHashChange(hash);
}