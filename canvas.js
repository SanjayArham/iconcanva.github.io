(function ($) {
    $(document).ready(function () {
        uiCanvasInit();
    });
})(jQuery);
function uiGenerateRandomColor() {
    var c1 = Math.floor(Math.random() * (255 + 1));
    var c2 = Math.floor(Math.random() * (255 + 1));
    var c3 = Math.floor(Math.random() * (255 + 1));
    return 'rgb(' + c1 + ',' + c2 + ',' + c3 + ')';
}

var canvasApp = {
    indexes: {},
    icons: [],
    canvas: null,
    context: null,
    cats: [],
    curIndexName: 'chronological',
    iconsLoaded: 0,
    iconsCount: 0,
    animated: false,
    moveDuration: 400, //400
    resizeDelay: 350, //350
    resizeTimeout: null,
    resizeTS: 0, //timestamp
    initScaleDuration: 266, //266
    overScaleDuration: 250, //250
    initAlphaDuration: 400, //400
    pIconAlphaDuration: 250, //250
    textAlphaDuration: 250, //250
    maxRows: 11,
    iconWidth: 32, //was 30
    iconHeight: 45,
    iconsMarginBottom: 30,
    pIconHeight: 96,
    pIconWidth: 96,
    iconInsWidth: 32, //was 30
    iconInsHeight: 32, //was 30
    t0: 0,
    //iLo: null,
    repainting: false,
    disabled: true,
    moving: false,
    initiated: false,
    initiating: false,
    initiatedTrigger: false,
    transforming: false,
    resizing: false,
    mousePos: null,
    hoveredIcon: null,
    overScale: 3,
    tooltipHeight: 13,
    progressFunction: null,
    canvasWidthCorr: 0,//2*50
    canvasHeightCorr: 81,//65+16
    maxHeight: 2250,//1170
    maxWidth: 2970,//4000
    minWidth: 270,//1300?
    minHeight: 180,
    targetWidth: 1300,
    targetHeight: 600,

    textDisabled: false,
    textFadingIn: false,
    textFadingInAlpha: 1,
    toPreload: { pImg: [], slImg: [] },
    preloadTimeout: null,
    onPreloadCompleted: null,
    preloadStatus: false,
    onIconImgLoadedFunction: null,
    onIconPImgLoadedFunction: null,
    disable: function () {
        this.disabled = true;
    },
    enable: function () {
        if (!this.context) return false;
        this.disabled = false;
        return true;
    },
    loadIcons: function () {
        var ths = this;
        var icon;

        for (var i = 0; i < this.iconsCount; i++) {
            icon = this.icons[i];
            icon.t0 = 0;
            icon.x = 0;
            icon.y = 0;
            icon.destX = 0;
            icon.destY = 0;
            icon.x0 = 0;
            icon.y0 = 0;
            icon.scale = 0;
            icon.delay = Math.round(Math.random() * 1000);
            icon.alpha = 0;
            icon.tAlpha = 0;
            icon.pX = 0;
            icon.pY = 0;
            icon.pAlpha = 0;
            icon.pt0 = 0;
            icon.tooltipW = 0;
            icon.tooltip = '';

            icon.img = new Image();
            icon.pImg = new Image();
            icon.tImg = new Image();
            icon.slImg = new Image();

            icon.img.crossOrigin = 'anonymous';
            icon.pImg.crossOrigin = 'anonymous';

            icon.img.iconNum = i;
            icon.tImg.iconNum = i;
            icon.pImg.iconNum = i;
            icon.slImg.iconNum = i;

            icon.img.onload = icon.img.onerror = function (e) {
                ths.onIconImgLoaded('img', e, this, this.iconNum);
            }
            icon.tImg.onload = icon.tImg.onerror = function (e) {
                ths.onIconImgLoaded('tImg', e, this, this.iconNum);
            }

            icon.img.src = icon.src;
            icon.tImg.src = icon.tSrc;

            this.toPreload.pImg.push(i);
        }

    },
    onIconImgLoaded: function (type, e, img, i) {
        if (e && (e.type == 'error')) img.loaded = false;
        else img.loaded = true;
        var func;
        if (type == 'img') {
            func = this.onIconImgLoadedFunction;
        } else if (type == 'pImg') {
            func = this.onIconPImgLoadedFunction;
        }
        if (func) {
            func(img, i);
        }

        if ((type == 'img') || (type == 'tImg')) {
            this.iconsLoaded++;
            var stop = (this.iconsLoaded >= 2 * this.iconsCount);
            this.progressFunction(this.iconsLoaded, stop);
        }
    },
    setOnIconImgLoaded: function (type, f) {
        if (type == 'img') {
            this.onIconImgLoadedFunction = f;
        } else if (type == 'pImg') {
            this.onIconPImgLoadedFunction = f;
        }
    },
    setOnPreloadCompletedFunction: function (f) {
        this.onPreloadCompleted = f;
    },
    loadSlideIconsAndThumbs: function () {
        if (this.toPreload == false) return false;
        var icon;
        var type = 'pImg';
        var iconInd = this.toPreload.pImg.shift();
        if (typeof (iconInd) == 'undefined') {
            type = 'slImg';
            iconInd = this.toPreload.slImg.shift();
            if (typeof (iconInd) == 'undefined') {
                this.toPreload = false;
                if (this.onPreloadCompleted) {
                    try {
                        this.onPreloadCompleted();
                    } catch (e) { }
                }
                return false;
            }
        }
        this.preloadStatus = true;
        if (typeof (this.icons[iconInd]) != 'undefined') {
            icon = this.icons[iconInd];
            if (type == 'slImg') {
                icon[type].onload = icon[type].onerror = function (e) {
                    canvasApp.onSlideIconsAndThumbsLoaded('slImg', e, this);
                }
            } else {
                icon[type].onload = icon[type].onerror = function (e) {
                    canvasApp.onSlideIconsAndThumbsLoaded('pImg', e, this);
                }
            }

            if (type == 'slImg') {
                icon.slImg.src = icon.slSrc;
            } else {
                icon.pImg.src = icon.pSrc;
                this.toPreload.slImg.push(iconInd);
            }
        }
        if (!icon) {
            this.loadSlideIconsAndThumbs();
        }
        return true;
    },
    onSlideIconsAndThumbsLoaded: function (type, e, img) {
        this.onIconImgLoaded(type, e, img, img.iconNum);
        var t = 500; //was 2000
        if (type == 'pImg') t = 500; //was 1000
        if (this.preloadStatus) {
            this.preloadTimeout = setTimeout("canvasApp.loadSlideIconsAndThumbs()", t);
        }
    },
    stopPreloading: function () {
        clearTimeout(this.preloadTimeout);
        this.preloadStatus = false;
    },

    setProgressFunction: function (progressFunction) {
        this.progressFunction = progressFunction;
    },
    init: function () {
        this.context.fillStyle = '#000000';
        this.context.font = '14px BIGPixelRegular, Courier, monospace';
        var cats, index, icon, catId, cat, orderIndex;
        this.targetWidth = this.canvas.width;
        this.targetHeight = this.canvas.height;
        for (var indexName in this.indexes) {
            index = this.indexes[indexName];
            cats = index['cats'];
            for (var i = 0; i < this.iconsCount; i++) {
                icon = this.icons[i];
                if (icon['positions'][indexName]) {
                    catId = icon['positions'][indexName]['cat'];
                    cat = cats[catId];
                    if (cat) {
                        orderIndex = icon['positions'][indexName]['order'];

                        icon.name = icon.name.toUpperCase();
                        icon.code = icon.code.toUpperCase();
                        icon.tooltip = icon.code + ' - ' + icon.name;
                        icon.tooltipW = this.context.measureText(icon.tooltip).width + 6;

                        cat.icons[orderIndex] = icon;
                        cat.colsCount = 0;
                        cat.rowsCount = 0;
                    }
                }
            }
            index.catsLoaded = true;
        }
    },
    run: function (indexName) {
        if (this.disabled) return false;
        if (this.initiating) return false;

        if (!this.initiated) {
            this.disabled = true;
            this.init();

        } else {
            if (this.moving) return false;
            if (indexName == this.curIndexName) {
                return true;
            }
            this.moving = true;
        }
        this.curIndexName = indexName || this.curIndexName;
        var curIndex = this.indexes[this.curIndexName];
        if (typeof (curIndex) == 'undefined') return false;
        this.disabled = true;
        this.cats = curIndex['cats'];
        this.resize();
        this.iconsResort();
        this.t0 = this.getTime();
        this.disabled = false;
        this.repaint(this.t0, this.t0);
        return true;
    },
    runTextFadeIn: function () {
        if (!this.animated) {
            this.textDisabled = false;
            this.textFadingIn = true;
            this.textFadingInAlpha = 0;
            this.t0 = this.getTime();
            this.repaint(this.t0, this.t0);
        }
    },
    clearDisableText: function () {
        this.textDisabled = true;
        if (!this.animated) {
            this.requestFrame();
        }
    },
    repaint: function (t2, t1) {
        if (this.disabled) return false;
        if (this.repainting) return true;
        this.repainting = true; //start repainting
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.initiating) {
            this.moving = false;
        }
        var dt0 = t2 - this.t0;
        if (this.textFadingIn) {
            if (this.textFadingInAlpha < 1) {
                this.textFadingInAlpha = this.easeNone(dt0, 0, 1, this.textAlphaDuration);
                if (this.textFadingInAlpha >= 1) this.textFadingInAlpha = 1;
            }
        }
        this.catsPaint(t2, t1); //avoid repainting catalogs when it's not nessessary
        this.iconsUpdate(t2, t1);
        if (this.initiating || this.textFadingIn) {
            this.animated = true;
            this.moving = false;
        } else if (this.moving || this.transforming) {
            this.animated = true;
        } else {
            this.animated = false;
        }
        if (this.textFadingIn && (this.textFadingInAlpha == 1)) {
            this.textFadingIn = false;
            this.animated = false;
        }
        //request next frame, because we have something to repaint
        if (this.animated) {
            this.requestFrame();
        }
        this.repainting = false; //end repainting
        if (this.initiated && this.initiatedTrigger) {
            this.initiatedTrigger = false;
            uiCanvasReady();
        }
    },
    resetCurrentIndex: function (fixY) {
        if (!fixY) fixY = 0;
        this.disabled = true;
        this.mousePos = null;
        document.body.style.cursor = "default";
        this.hoveredIcon = null;
        this.textDisabled = false;
        this.textFadingInAlpha = 1;
        this.moving = this.animated = this.transforming = this.textFadingIn = false;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var t = this.getTime();
        this.catsReset(fixY);
        this.iconsReset(fixY);
        this.disabled = false;
    },

    requestFrame: function () {
        var t1 = this.getTime();
        var ths = this;

        glUtils.getCanvasRequestAnimFrameFunc()(function (t2) {
            ths.repaint(t2, t1);
        });

    },
    iconsResort: function () {
        if (!this.initiated) {
            this.initiating = true;
        }

        var curIndex = this.indexes[this.curIndexName];
        var icon, cat;
        //process categories
        var catsCount = this.cats.length;
        var catIconsCount;
        var corrX = Math.ceil((this.pIconWidth - this.iconWidth) / 2);
        var catX = corrX;
        var colNum, rowNum;
        var contW = 0;
        this.context.font = '15px BIGPixelRegular, Courier, monospace';
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            catIconsCount = cat.icons.length;
            if (!catIconsCount) continue;
            if (!cat.colsCount || !cat.rowsCount) {
                cat.colsCount = Math.ceil(catIconsCount / this.maxRows);
                cat.rowsCount = Math.ceil(catIconsCount / cat.colsCount);
            }

            cat.y = this.canvas.height;
            cat.x = catX;
            cat.w = (this.iconWidth + curIndex.colMargin) * (cat.colsCount - 1) + this.iconWidth;
            cat.name = cat.name.toUpperCase();
            cat.tW = this.context.measureText(cat.name).width;
            cat.h = cat.rowsCount * (this.iconHeight + curIndex.rowMargin) + this.iconsMarginBottom;
            cat.alpha = (this.resizing) ? 1 : 0;
            colNum = rowNum = 0;
            if (this.curIndexName == 'chronological') colNum = cat.colsCount - 1;
            for (var j = 0; j < catIconsCount; j++) {
                //process icon
                icon = cat.icons[j];
                icon.destX = cat.x + colNum * (this.iconWidth + curIndex.colMargin);
                icon.destY = cat.y - rowNum * (this.iconHeight + curIndex.rowMargin) - this.iconHeight - this.iconsMarginBottom;
                icon.pX = icon.destX - Math.floor((this.pIconWidth - this.iconInsWidth) / 2);
                icon.pY = icon.destY - Math.floor((this.pIconHeight - this.iconInsHeight) / 2);
                if (!this.initiated) {
                    icon.x0 = icon.destX;
                    icon.y0 = icon.destY;
                } else {
                    icon.x0 = icon.x;
                    icon.y0 = icon.y;
                }
                if (this.curIndexName == 'chronological') {
                    colNum--;
                    if (colNum < 0) {
                        colNum = cat.colsCount - 1;
                        rowNum++;
                    }
                } else {
                    colNum++;
                    if (colNum >= cat.colsCount) {
                        colNum = 0;
                        rowNum++;
                    }
                }
            }
            catX = catX + cat.w + curIndex.catMargin;
            contW += (cat.w + curIndex.catMargin);
        }
        contW = contW - curIndex.catMargin;
        //    var firstCatX = Math.floor((this.canvas.width - contW)/2);
        var firstCatX = Math.floor((this.targetWidth - contW) / 2);
        corrX = firstCatX - corrX;
        if ((contW > 0) && (corrX > 0)) {
            for (var i = 0; i < catsCount; i++) {
                cat = this.cats[i];
                catIconsCount = cat.icons.length;
                for (var j = 0; j < catIconsCount; j++) {
                    //process icon
                    icon = cat.icons[j];
                    icon.destX += corrX;
                    icon.pX += corrX;
                    if (!this.initiated) icon.x0 += corrX;
                }
                cat.x += corrX;
            }
        }
    },
    iconsUpdate: function (t2, t1) {
        var cat, catIconsCount, icon;
        var catsCount = this.cats.length;
        var dt = t2 - t1;
        var dt0 = t2 - this.t0;

        if (this.moving && (dt0 > this.moveDuration)) {
            this.moving = false;
        }

        var scaleCompleteCount = 0;
        var alphaCompleteCount = 0;
        var hoveredIcon = null;
        var factor, factor0;
        var idt0;
        var scaleFromOnMouseOut = this.overScale / 3 * 2;
        var transforming = false;
        var postDrawIcons = [];
        var postDraw = false;
        var pdt0, pFactor0;
        this.context.font = '14px BIGPixelRegular, Courier, monospace';
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            catIconsCount = cat.icons.length;
            for (var j = 0; j < catIconsCount; j++) {
                postDraw = false;
                //process icon
                icon = cat.icons[j];
                if (!this.initiated) {
                    //without moving
                    icon.x = icon.x0 = icon.destX;
                    icon.y = icon.y0 = icon.destY;

                    //scaling when canvas is starting
                    if (dt0 >= icon.delay) {
                        if (icon.scale < 1) {
                            icon.scale = this.easeOutSine(dt0 - icon.delay, 0, 1, this.initScaleDuration);
                            if (icon.scale >= 1) icon.scale = 1;
                        }
                        if (icon.alpha < 1) {
                            icon.alpha = this.easeOutSine(dt0 - icon.delay, 0, 1, this.initAlphaDuration);
                            if (icon.alpha >= 1) icon.alpha = 1;
                        }
                    }
                    if (icon.scale == 1) {
                        scaleCompleteCount++;
                    }
                    if (icon.alpha == 1) {
                        alphaCompleteCount++;
                    }
                    icon.tAlpha = icon.alpha;
                } else {
                    if (!this.moving && !this.textFadingIn) {
                        icon.x = icon.destX;
                        icon.y = icon.destY;

                        /* check hovered state and do onmousemove animations */
                        idt0 = t2 - icon.t0;
                        pdt0 = t2 - icon.pt0;
                        if (!hoveredIcon) {
                            if (this.checkIfHoveredIcon(icon)) {
                                hoveredIcon = icon;
                            }
                        }

                        if (hoveredIcon && (hoveredIcon.id == icon.id)) {
                            //hoveredIcon = icon;
                            factor0 = 1;
                            pFactor0 = 0;
                            if ((this.hoveredIcon === null) || (this.hoveredIcon.id != icon.id)) { //icon mouse on event
                                icon.t0 = t2;
                                idt0 = 0;
                                factor0 = icon.scale;

                                icon.pt0 = t2;
                                pdt0 = 0;
                                pFactor0 = icon.pAlpha;
                            }
                            icon.pAlpha = this.easeOutQuad(pdt0, pFactor0, (1 - pFactor0), this.pIconAlphaDuration);
                            if (icon.pAlpha >= 1) icon.pAlpha = 1;

                            icon.scale = this.easeOutQuad(idt0, factor0, (this.overScale - factor0), this.overScaleDuration);//easeOutCubic?
                            if (icon.scale >= this.overScale) icon.scale = this.overScale;


                        } else if (icon.scale > 1) {
                            icon.pAlpha = 0;
                            factor0 = this.overScale;
                            if ((this.hoveredIcon !== null) && (this.hoveredIcon.id == icon.id)) { //icon mouse out event
                                icon.t0 = t2;
                                idt0 = 0;
                                if (icon.scale >= scaleFromOnMouseOut) icon.scale = scaleFromOnMouseOut;
                                factor0 = icon.scale;
                            }
                            icon.scale = this.easeOutQuad(idt0, factor0, (1 - factor0), this.overScaleDuration);//easeOutCubic?

                            if (icon.scale <= 1) icon.scale = 1;
                        } else {
                            icon.pAlpha = 0;
                            icon.t0 = 0;
                            icon.scale = 1;
                        }
                        if (icon.scale != 1) {
                            postDraw = true;
                            postDrawIcons.push(icon);
                            transforming = true;
                        }
                    } else if (this.textFadingIn) {
                        icon.tAlpha = this.textFadingInAlpha;

                    } else {
                        icon.pAlpha = 0;
                        icon.scale = 1;
                        factor = this.easeOutCubic(dt0, 0, 1, this.moveDuration);
                        icon.x = Math.round((1 - factor) * icon.x0 + factor * icon.destX);
                        icon.y = Math.round((1 - factor) * icon.y0 + factor * icon.destY);
                    }
                }
                this.iconDrawTitle(icon);
                if (!postDraw) {
                    this.iconDraw(icon);
                }
            }
        }


        postDrawIcons.sort(function (i1, i2) {
            return i1.scale - i2.scale;
        });
        var postDrawIconsLen = postDrawIcons.length;
        for (var i = 0; i < postDrawIconsLen; i++) {
            this.iconDraw(postDrawIcons[i]);
        }

        if (hoveredIcon) {
            document.body.style.cursor = "pointer";
            this.showTooltip(hoveredIcon);
        } else {
            document.body.style.cursor = "default";
        }

        this.hoveredIcon = hoveredIcon;
        this.transforming = transforming;

        if (!this.initiated && (scaleCompleteCount >= this.iconsCount) && (alphaCompleteCount >= this.iconsCount)) {
            this.initiated = true;
            this.initiatedTrigger = true;
            this.initiating = false;
        }

    },
    iconsReset: function (fixY) {
        var cat, catIconsCount, icon;
        var catsCount = this.cats.length;
        this.context.font = '14px BIGPixelRegular, Courier, monospace';
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            catIconsCount = cat.icons.length;
            for (var j = 0; j < catIconsCount; j++) {
                icon = cat.icons[j];
                icon.alpha = 1;
                icon.tAlpha = 1;
                icon.scale = 1;
                icon.pAlpha = 0;

                icon.x = icon.x0 = icon.destX;
                icon.destY = icon.destY + fixY;
                icon.y = icon.y0 = icon.destY;

                icon.t0 = 0;
                this.iconDrawTitle(icon);
                this.iconDraw(icon);
            }
        }
    },
    iconDraw: function (icon) {
        if (icon.alpha <= 0) return;
        var iw = this.iconInsWidth;
        var ih = this.iconInsHeight;
        var iwS = iw;
        var ihS = ih;
        var x = icon.x + Math.floor((this.iconWidth - this.iconInsWidth) / 2);
        var y = icon.y;

        if (icon.scale != 1) {
            iwS = Math.round(iw * icon.scale);
            ihS = Math.round(ih * icon.scale);
            y = Math.round(y + (ih - ihS) / 2);
            x = Math.round(x + (iw - iwS) / 2);
        }

        this.context.globalAlpha = icon.alpha;
        if (icon.img.loaded) {
            this.context.drawImage(icon.img, x, y, iwS, ihS);
        } else {
            this.context.beginPath();
            this.context.rect(x, y, iwS, ihS);
            this.context.closePath();
            this.context.fill();
        }

        if (icon.pAlpha > 0) {
            this.context.globalAlpha = icon.pAlpha;
            if (icon.pImg.loaded) {
                this.context.drawImage(icon.pImg, x, y, iwS, ihS);
            } else if (icon.tImg.loaded) {
                this.context.drawImage(icon.tImg, x, y, iwS, ihS);
            }
        }
    },
    showTooltip: function (icon) {
        this.context.globalAlpha = 1;
        var tooltipH = this.tooltipHeight;
        var tooltipW = icon.tooltipW;

        var tooltipX = this.mousePos.x + 5;
        var tooltipY = this.mousePos.y + 22;
        if (tooltipX + tooltipW >= this.canvas.width)
            tooltipX = this.canvas.width - tooltipW - 1;
        if (tooltipY + tooltipH >= this.canvas.height)
            tooltipY = this.canvas.height - tooltipH - 1;

        this.context.beginPath();
        this.context.rect(tooltipX, tooltipY, tooltipW, tooltipH);
        this.context.closePath();
        this.context.fill();

        this.context.fillStyle = '#ffffff';
        this.context.fillText(icon.tooltip, tooltipX + 3, tooltipY + tooltipH - 2);
        this.context.fillStyle = '#000000';
    },
    iconDrawTitle: function (icon) {
        if (this.textDisabled) return;
        this.context.globalAlpha = icon.tAlpha;
        this.context.fillText(icon.code, icon.x + 1, icon.y + this.iconHeight - 4);
    },
    getTime: function () {
        return glUtils.getAnimTime();
    },
    getMousePos: function (e) {
        var x, y;
        if (e.layerX || e.layerX == 0) {
            x = e.layerX;
            y = e.layerY;
        } else if (e.offsetX || e.offsetX == 0) {
            x = e.offsetX;
            y = e.offsetY;
        }
        return { 'x': x, 'y': y };
    },
    catsPaint: function (t2, t1) {
        var cat;
        var dt0 = t2 - this.t0;
        var catsCount = this.cats.length;
        var curIndex = this.indexes[this.curIndexName];
        var duration = this.moveDuration;
        if (this.initiating) {
            duration = (this.initAlphaDuration > this.initScaleDuration) ? this.initAlphaDuration : this.initScaleDuration;
        }
        this.context.font = '15px BIGPixelRegular, Courier, monospace';
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            if (cat.w > 0 && cat.h > 0) {
                //draw title
                if (cat.tW) {
                    var tWy = cat.y - 1;
                    var tWx = cat.x;
                    if (curIndex.align == 'center') {
                        tWx = Math.floor(cat.x + ((cat.w - cat.tW) / 2));
                    }
                    if (this.textFadingIn) {
                        cat.alpha = this.textFadingInAlpha;
                    } else {
                        if (cat.alpha < 1) {
                            cat.alpha = this.easeNone(dt0, 0, 1, duration);
                            if (cat.alpha >= 1) cat.alpha = 1;
                        }
                    }
                    if (!this.textDisabled) {
                        this.context.globalAlpha = cat.alpha;
                        this.context.fillText(cat.name, tWx, tWy);
                    }
                }
            }
        }
    },
    catsReset: function (fixY) {
        var cat;
        var catsCount = this.cats.length;
        var curIndex = this.indexes[this.curIndexName];
        this.context.font = '15px BIGPixelRegular, Courier, monospace';
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            cat.y += fixY;
            if (cat.w > 0 && cat.h > 0) {
                //draw title
                if (cat.tW) {
                    var tWy = cat.y - 1;
                    var tWx = cat.x;
                    if (curIndex.align == 'center') {
                        tWx = Math.floor(cat.x + ((cat.w - cat.tW) / 2));
                    }
                    cat.alpha = 1;
                    this.context.globalAlpha = cat.alpha;
                    this.context.fillText(cat.name, tWx, tWy);
                }
            }
        }
    },
    easeOutCubic: function (dt0, f0, destFX, d) {
        /*
        dt0 = t2 - t0 - time passed from beginning of the animation
        d = duration
        f0 - initial factor value
        destFX = destF - f0 - difference between f0 and destF,
        where destF - factor value at the end of the animation
        */
        if (dt0 >= d) return destFX + f0;
        return destFX * ((dt0 = dt0 / d - 1) * dt0 * dt0 + 1) + f0;
    },
    easeOutSine: function (dt0, f0, destFX, d) {
        if (dt0 >= d) return destFX + f0;
        return destFX * Math.sin(dt0 / d * (Math.PI / 2)) + f0;
    },
    easeOutQuad: function (dt0, f0, destFX, d) {
        if (dt0 >= d) return destFX + f0;
        return -destFX * (dt0 /= d) * (dt0 - 2) + f0;
    },
    easeNone: function (dt0, f0, destFX, d) {
        if (dt0 >= d) return destFX + f0;
        return destFX * dt0 / d + f0;
    },
    checkIfHoveredIcon: function (icon) {
        if (this.mousePos === null) return false;
        var curIndex = this.indexes[this.curIndexName];

        var overlappingWidth = Math.floor(curIndex.colMargin / 2) + 2;
        if (overlappingWidth <= 0) overlappingWidth = 0;

        if ((this.mousePos.y < (icon.destY + this.iconHeight)) && (this.mousePos.x > (icon.destX - overlappingWidth))
            && (this.mousePos.x < (icon.destX + this.iconWidth + overlappingWidth))
            && (this.mousePos.y > icon.destY)
        ) {
            return true;
        }
        return false;
    },
    onMouseMove: function (e) {
        if (this.disabled || this.moving || !this.initiated) return false;
        //    if (this.textFadingIn) return false;
        this.mousePos = this.getMousePos(e);
        //maybe check position here?
        if (!this.animated) {
            this.requestFrame();
        }
    },
    onMouseOut: function (e) {
        this.mousePos = null;
        document.body.style.cursor = "default";
    },
    onMouseClick: function (e) {
        if (!this.hoveredIcon || !this.mousePos) return;
        if (this.disabled || this.moving || !this.initiated || this.textFadingIn) return false;
        this.iconClickTrigger(this.hoveredIcon);
    },
    iconClickTrigger: function (icon, hideFlyingImg) {
        if (this.disabled || this.moving || !this.initiated || this.textFadingIn) return false;
        var l = icon.x;
        var b = this.canvas.height - icon.y;
        this.resetCurrentIndex();

        var slSrc = '';
        if (icon.slImg.loaded) {
            slSrc = icon.slSrc;
        }

        uiLoadSlides(icon.id, icon.tSrc, l, b, icon.fsW, icon.fsH, icon.pBgClr, slSrc, icon.code, hideFlyingImg);
    },
    onResize: function () {
        if (this.disabled || this.moving/*?*/ || !this.initiated/*?*/) return;

        var ths = this;
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function () {
            ths.onResizeDo();
        }, this.resizeDelay);


    },
    onResizeDo: function () {
        if (this.disabled || !this.initiated) return;
        this.resizing = true;
        this.run();
        this.resizing = false;
    },
    resize: function () {
        var availSp = this.getAvailableSpace();
        var canvH = (availSp.h > this.maxHeight) ? this.maxHeight : (availSp.h < this.minHeight ? this.minHeight : availSp.h);
        var canvW = (availSp.w > this.maxWidth) ? this.maxWidth : (availSp.w < this.minWidth ? this.minWidth : availSp.w);
        var iconsAvailSp = { w: canvW, h: canvH - this.iconsMarginBottom };
        var curIndex = this.indexes[this.curIndexName];
        this.maxRows = Math.floor(1 + (iconsAvailSp.h - this.iconHeight) / (this.iconHeight + curIndex.rowMargin));
        if (curIndex.rowsMax > 0) {
            this.maxRows = Math.min(this.maxRows, curIndex.rowsMax);
        }
        var catsData = [];
        var catsCount = this.cats.length;
        var cat, catIconsCount, catW;
        var contW = 0;
        var colW = this.iconWidth + curIndex.colMargin;
        var corrW = 2 * Math.ceil((this.pIconWidth - this.iconWidth) / 2);
        var catColsMax = curIndex.catColsMax;
        var cols = 0;
        for (var i = 0; i < catsCount; i++) {
            cat = this.cats[i];
            catIconsCount = cat.icons.length;
            if (!catIconsCount) continue;
            cat.colsCount = Math.ceil(catIconsCount / this.maxRows);
            cat.rowsCount = Math.ceil(catIconsCount / cat.colsCount);
            catW = colW * (cat.colsCount - 1) + this.iconWidth;
            contW += (catW + curIndex.catMargin);
            cols += cat.colsCount;
            if (cat.rowsCount < 2) continue;
            if ((this.curIndexName == 'chronological') && (cat.colsCount >= catColsMax)) {
                continue;
            }
            catsData.push({
                id: i,
                iconsCount: catIconsCount,
                rowsCount: cat.rowsCount,
                colsCount: cat.colsCount
            });
        }
        contW -= curIndex.catMargin;
        contW += corrW;

        //contW - required space for all catalogs
        var availSpRemain = iconsAvailSp.w - contW;
        var availCols = Math.floor(availSpRemain / colW);
        var c = catsData.length;
        if ((curIndex.colsMax > 0) && (availCols > 0)) {
            if ((availCols + cols) > curIndex.colsMax) availCols = curIndex.colsMax - cols;
        }
        //distribute available cols among catalogs
        var curIndexName = this.curIndexName;
        while ((c > 0) && (availCols > 0)) {
            catsData.sort(function (c1, c2) {
                if (curIndexName == 'chronological') {
                    if ((c1.colsCount < 2) && (c2.colsCount >= 2)) return 1;
                    if ((c2.colsCount < 2) && (c1.colsCount >= 2)) return -1;
                }
                if (c1.rowsCount == c2.rowsCount) {
                    return (c1.iconsCount - c2.iconsCount);
                }
                return (c1.rowsCount - c2.rowsCount);
            });

            cat = catsData[c - 1];
            cat.colsCount++;
            cat.rowsCount = Math.ceil(cat.iconsCount / cat.colsCount);

            this.cats[cat.id].colsCount = cat.colsCount;
            this.cats[cat.id].rowsCount = cat.rowsCount;

            if ((cat.rowsCount < 2) || ((this.curIndexName == 'chronological') && (cat.colsCount >= catColsMax))) {
                catsData.pop();
                c--;
            }
            availCols--;
        }
        this.targetWidth = canvW;
        this.targetHeight = canvH;
        if (this.targetWidth > this.canvas.width) {
            this.canvas.width = this.targetWidth;
        } else if (this.targetWidth < this.canvas.width) {
            this.canvas.width = this.targetWidth;
        }

        var fixY = this.targetHeight - this.canvas.height;
        var a = this.animated;
        var t = this.transforming;
        var m = this.moving;
        if (this.targetHeight != this.canvas.height) {
            this.canvas.height = this.targetHeight;
            if (this.initiated) this.resetCurrentIndex(fixY);
            this.animated = a;
            this.transforming = t;
            this.moving = m;
        }
    },
    getAvailableSpace: function () {
        var s = { w: 0, h: 0 };
        s.w = parseInt(document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth);
        s.h = parseInt(document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight);
        s.w = s.w - this.canvasWidthCorr;
        s.h = s.h - this.canvasHeightCorr;
        if ((s.h <= 0) || isNaN(s.h)) s.h = 0;
        if ((s.w <= 0) || isNaN(s.w)) s.w = 0;
        return s;
    },
    getIconByCode: function (code) {
        var iconsCount = canvasApp.icons.length;
        code = code.toLowerCase();
        var iconCode;
        var icon;
        for (var i = 0; i < iconsCount; i++) {
            iconCode = canvasApp.icons[i].code.toLowerCase();
            if (iconCode == code) {
                icon = canvasApp.icons[i];
                break;
            }
        }
        return icon;
    }

};
function uiIconsPreloadProgress(loaded, stop) {
    var ths = uiIconsPreloadProgress;
    var maxCount = ths.maxCount;
    if (typeof (ths.stopTimes) == 'undefined') ths.stopTimes = 0;
    if (typeof (ths.lastStopLoaded) == 'undefined') ths.lastStopLoaded = 0;
    var progress = Math.floor(100 * (loaded + ths.lastStopLoaded) / maxCount);
    if (progress <= 0) progress = 0;
    if (progress >= 100) progress = 100;
    var canContinue = false;
    //console.log(loaded, progress, maxCount);
    if (stop) {
        ths.stopTimes++;

        if (ths.stopTimes == 1) {
            uiUpdatePreloadingProccess(progress);
            ths.lastStopLoaded = loaded;
            //            console.log('globe run');
            var gaRes = globeApp.run();
            globeApp.stop();
            if (!gaRes) {
                $('#canvasmenu').children().last().hide();
                canContinue = true;
            }

        } else if (ths.stopTimes >= 2) {
            canContinue = true;
        }
        if (canContinue) {
            uiUpdatePreloadingProccess('100', true);
            uiAppStart();
        }
        return;
    }
    uiUpdatePreloadingProccess(progress);

}
function uiAppStart() {
    canvasApp.enable();
    canvasApp.run();

    canvasApp.loadSlideIconsAndThumbs();
    canvasApp.canvas.addEventListener('mousemove', function (e) {
        canvasApp.onMouseMove(e);
    }, false);
    canvasApp.canvas.addEventListener('click', function (e) {
        canvasApp.onMouseClick(e);
    }, false);
    canvasApp.canvas.addEventListener('mouseout', function (e) {
        canvasApp.onMouseOut(e);
    }, false);
    window.addEventListener('resize', function (e) {
        canvasApp.onResize(e);
    }, false);

}
function uiCanvasInit() {
    var canvas = document.getElementById("canvas");
    var context = null;
    if (typeof (canvas.getContext) != 'undefined') {
        context = canvas.getContext("2d");
    }

    if (!context) {
        $('#canvasmenu').hide();
        uiUpdatePreloadingProccess(100, true);
        location.href = 'https://iconcanva.vercel.app/';
        return false;
    }

    var previewProject = canvas.getAttribute('data-preview');
    var canvasUrl = '/canvasdata.json';
    console.log('------------- canvasUrl -------------- : ' + canvasUrl);
    if (previewProject.length) canvasUrl += ('?previewproject=' + previewProject);
    canvasApp.canvas = canvas;
    canvasApp.context = context;
    $.ajax({
        url: canvasUrl,
        type: "post",
        context: this,
        beforeSend: function () {
            uiUpdatePreloadingProccess(0);
        },
        success: function (data) {
            if (typeof (data.indexes) == 'undefined') return false;
            if (typeof (data.icons) == 'undefined') return false;

            var ind, indCats, indCatsCount, indName;
            //            var newInd = {};
            var indexes = {};
            for (indName in data.indexes) {
                indexes[indName] = {};
                ind = data.indexes[indName];
                indCats = ind['cats'];
                indCatsCount = indCats.length;
                indexes[indName].catColsMax = ind.catColsMax;
                indexes[indName].rowsMax = ind.rowsMax;
                indexes[indName].colsMax = ind.colsMax;
                indexes[indName].rowMargin = ind.rowMargin;
                indexes[indName].colMargin = ind.colMargin;
                indexes[indName].catMargin = ind.catMargin;
                indexes[indName].align = ind.align;
                indexes[indName].catsLoaded = false;
                indexes[indName].cats = [];
                for (var i = 0; i < indCatsCount; i++) {
                    indexes[indName].cats.push({
                        'id': i,
                        'name': indCats[i],
                        'icons': [],
                        'w': 0,
                        'h': 0,
                        'x': 0,
                        'y': 0,
                        'tW': 0,
                        'alpha': 0
                    });
                }
            }
            canvasApp.indexes = indexes;
            canvasApp.icons = data.icons;
            canvasApp.iconsCount = canvasApp.icons.length;


            var globeSupported = globeApp.isSupported();

            if (globeSupported) {
                globeApp.test = false;
                globeApp.setOptions(data.glOpts);

                globeApp.loadIcons(canvasApp.icons);
                uiIconsPreloadProgress.maxCount = canvasApp.iconsCount * 2 + globeApp.iconsCount + 1;
                //                uiIconsPreloadProgress.maxCount = canvasApp.iconsCount*2+1;
            } else {
                uiIconsPreloadProgress.maxCount = canvasApp.iconsCount * 2;
            }

            canvasApp.setProgressFunction(uiIconsPreloadProgress);
            if (globeSupported) globeApp.setProgressFunction(uiIconsPreloadProgress);

            canvasApp.setOnPreloadCompletedFunction(function () {
                //                console.log('preload completed');
                uiMainPreloading(false);
            });
            if (globeSupported) {
                canvasApp.setOnIconImgLoaded('img', function (img, i) {
                    globeApp.setIconTextureImg(i, img);
                });
                canvasApp.setOnIconImgLoaded('pImg', function (img, i) {
                    globeApp.setIconPTextureImg(i, img);
                });
            }
            canvasApp.loadIcons();

            return false;
        },
        complete: function () {
        },
        error: function () {
        }
    });

    return true;
}