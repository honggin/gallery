(function (window) {

    'use strict';

    /**
     * gallery width 3 layouts
     * @constructor
     */
    function Gallery() {
        this.LAYOUT = {
            PUZZLE: 1,    
            WATERFALL: 2, 
            BARREL: 3     
        };
        this.version = '1.0.0';
    }

    var CLASSES = [
        'puzzle-1',
        'puzzle-2',
        'puzzle-3',
        'puzzle-4',
        'puzzle-5',
        'puzzle-6',
        'waterfall',
        'barrel'
    ];

    var OPERATION = {
        ADD: {
            1: function () {
                _addPuzzleItem();
            },
            2: function () {
                _addWaterfallItem();
            },
            3: function () {
                _addBarrelItem();
            }
        },
        RESET: {
            1: function () {
                _resetPuzzle();
            },
            2: function () {
                _resetWaterfall();
            },
            3: function () {
                _resetBarrel();
            }   
        }
    };

    // global settings
    var _container = document.getElementById('mygallery'),
        _layout = 1,
        _conWidth = 0,                                      // 容器宽度
        _imgs = [],                                         // 已经加载完毕的图片
        _lastIndex = -1,                                    // _imgs中最近添加到DOM的图片index
        _isFullscreen = true,
        _gutter = [10, 10];

    var _puzzleSettings = {
        conWidth: 0,
        conHeight: 0
    };
    var _waterfallSettings = {
        colCnt: 4
    };
    var _barrelSettings = {
        minHeight: 200,
        maxHeight: 300,
        maxCnt: 6, 
        minCnt: 3
    };

    // run time data
    var _waterfallCols = [],
        _waterfallColWidth = 0;

    var _curRow = null,
        _ratioArr = [],
        _curRowHeight = 0;

    /******************************** 常用函数开始 ********************************/
    String.prototype.trim = String.prototype.trim || function() {
        return this.replace(/(^\s*)|(\s*$)/g, ""); 
    };

    function addEvent (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler);
        } else if (element.attachEvent) {
            element.attachEvent('on'+type, handler);
        } else {
            element['on'+type] = handler;
        }
    }

    function addClass(ele, name) {
        if (typeof name != 'string') {
            console.error('removeClass: type of name is not string');
            return ;
        }

        if (ele === null || typeof name != 'string' || ele.className.match(name)) {
            return;
        }
        name = name.trim();
        ele.className += ' ' + name;
        ele.className = ele.className.trim();
    }

    function hasClass(ele, name) {
        if (typeof name != 'string') {
            console.error('removeClass: type of name is not string');
            return ;
        }

        name = name.trim();

        if (ele !== null) {
            return ele.className.match(name);
        }
    }

    function removeClass(ele, name) {
        if (typeof name != 'string') {
            console.error('removeClass: type of name is not string');
            return ;
        }

        name = name.trim();
        var reg = new RegExp(' ?\\b' + name + '\\b', 'g');

        if (ele === null || !ele.className.match(name)) {
            return ;
        } else {
            ele.className = ele.className.replace(reg, '');
        }
    }

    function stopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

    /******************************** 常用函数结束 ********************************/

    /***************************** 拼图布局私有方法开始 ***************************/

    function _resetPuzzle () {
        _resetContainer();

        _conWidth = _container.clientWidth;
        
        _puzzleSettings.conWidth = _container.clientWidth;
        _puzzleSettings.conHeight = _container.clientHeight || _container.clientWidth / 2;

        _container.style.width = _container.clientWidth + 'px';
        _container.style.height = _puzzleSettings.conHeight + 'px';

        _lastIndex = -1;

        _addPuzzleItem();
    }

    function _fixPuzzleSize() {
        var items = _container.querySelectorAll('.puzzle-item'),
            conWidth = _puzzleSettings.conWidth,
            conHeight = _puzzleSettings.conHeight,
            len,
            i;

        switch (items.length) {
            case 3:
                items[0].style.width = conWidth - conHeight/2 + 'px';
                items[0].style.height = conHeight + 'px';
                items[1].style.width = conHeight/2 + 'px';
                items[1].style.height = conHeight/2 + 'px';
                items[2].style.width = conHeight/2 + 'px';
                items[2].style.height = conHeight/2 + 'px'; 
                break;

            case 5:
                items[4].style.width = conWidth/3 + 'px';
                items[4].style.height = conHeight - conWidth/3 + 'px';
                break;

            default: 
                len = items.length;
                for (i = 0; i < len; i++) {
                    items[i].style.width = '';
                    items[i].style.height = '';
                }
                break;
        }
    }

    function _addPuzzleItem () {
        var len = _imgs.length,
            puzzleName = _container.className.match(/puzzle-\d/);

        if (!len) {
            return ;
        } else if (len > 6) {
            len = 6;
        }

        if (puzzleName) {
            puzzleName = puzzleName[0];
        }

        removeClass(_container, puzzleName);
        addClass(_container, 'puzzle-'+len);

        var src = '';
        while (++_lastIndex < len) {
            src = _imgs[_lastIndex].src;
            _container.innerHTML += ''+
              '<div imgIndex="'+_lastIndex+'" class="puzzle-item" style="background-image: url('+ src +');">'+
                   '<div imgIndex="'+_lastIndex+'"class="img-delete">delete</div>'+
              '</div>';
        }
        _lastIndex--;

        _fixPuzzleSize();
    }

    /***************************** 拼图布局私有方法结束 ***************************/

    /**************************** 瀑布流布局私有方法开始 **************************/
    function _resetWaterfall () {
        _resetContainer();

        _waterfallCols = [];
        _conWidth = _container.clientWidth;

        addClass(_container, 'waterfall');

        var colCnt = _waterfallSettings.colCnt,
            i, 
            html = '',
            style = '';

        _waterfallColWidth = (_conWidth - _gutter[0] * (colCnt-1)) / colCnt;
        for (i = 0; i < colCnt; i++) {
            style = '';
            style += 'width:'+ _waterfallColWidth + 'px;';
            style += 'margin-right:'+ _gutter[0] +'px;';
            html += '<div class="waterfall-col" style="'+style+'"></div>';
        }
        _container.innerHTML += html;
        _container.style.width = _conWidth + 'px';
        _waterfallCols = _container.getElementsByClassName('waterfall-col');

        _lastIndex = -1;
        _addWaterfallItem();
    }

    function _getMinHeightCol () {
        var i,
            len = _waterfallCols.length,
            minHeight = Number.MAX_VALUE,
            minIndex = -1,
            height;

        for (i = 0; i < len; i++) {
            height = _waterfallCols[i].clientHeight;
            if (height < minHeight) {
                minIndex = i;
                minHeight = height;
            }
        }
        return _waterfallCols[minIndex];
    }

    function _addWaterfallItem () {
        var len = _imgs.length,
            img,
            oWidth,
            oHeight,
            imgWidth,
            imgHeight,
            html,
            minHeightCol;

        while (++_lastIndex < len) {
            img = _imgs[_lastIndex];
            oWidth = img.originalWidth;
            oHeight = img.originalHeight;
            imgWidth = _waterfallColWidth;
            imgHeight = imgWidth * oHeight / oWidth;
            html = '' +
                '<div class="waterfall-item" style="margin-bottom:'+ _gutter[1] +'px">'+
                    '<img imgIndex="'+_lastIndex+'" src="'+img.src+'"width="'+imgWidth+'" height="'+imgHeight+'" />' +
                    '<div imgIndex="'+_lastIndex+'"class="img-delete">delete</div>' +
                '</div>';
            minHeightCol = _getMinHeightCol();

            minHeightCol.innerHTML += html;
        }
        _lastIndex--;
    }

    /**************************** 瀑布流布局私有方法结束 **************************/

    /***************************** 木桶布局私有方法开始 ***************************/
    function _resetBarrel () {
        _resetContainer();

        addClass(_container, 'barrel');

        _conWidth = _container.clientWidth;
        _container.style.width = Math.ceil(_conWidth) + 'px';

        _curRow = document.createElement('div');
        _curRow.style.marginBottom = _gutter[1] + 'px';
        addClass(_curRow, 'barrel-row');
        _container.appendChild(_curRow);

        _curRowHeight = 0;
        _ratioArr = [];
        _lastIndex = -1;
        
        _addBarrelItem();
    }

    function _addBarrelItem () {
        var len = _imgs.length;

        var img,
            width,
            height,
            k,
            maxHeight,
            html,
            cnt,
            minCnt,
            maxCnt;

        while (++_lastIndex < len) {
            img = _imgs[_lastIndex];
            width = img.width;
            height = img.height;
            k = width / height;
            maxHeight = _barrelSettings.maxHeight;
            html = '' +
                 '<div class="barrel-item" style="margin-right: '+_gutter[0]+'px">' +
                     '<img imgIndex="'+_lastIndex+'" width="'+(maxHeight*k)+'" height="'+(maxHeight)+'" src="'+ img.src +'"/>' +
                     '<div imgIndex="'+_lastIndex+'" class="img-delete">delete</div>' +
                 '</div>';
            cnt = _curRow.children.length;
            minCnt = _barrelSettings.minCnt;
            maxCnt = _barrelSettings.maxCnt;

            if (cnt < minCnt ||  
                (cnt >= minCnt && 
                 cnt < maxCnt && 
                 _curRowHeight > maxHeight)) {

                _curRow.innerHTML += html;
                _setCurRowHeight(k);
                _fixBarrelSize();
            } else {
                _curRow = document.createElement('div');
                _curRow.className = 'barrel-row';
                _curRow.innerHTML += html;
                _curRow.style.marginBottom = _gutter[1] + 'px';
                _container.appendChild(_curRow);
                
                _ratioArr = [];
                _setCurRowHeight(k); 
                _fixBarrelSize();
            }
        }
        _lastIndex--;
    }

    function _setCurRowHeight (k) {
        _ratioArr.push(k);

        var sum = 0,
            len = _ratioArr.length;

        for (var i = 0 ; i < len; i++) {
            sum += _ratioArr[i];
        }

        _curRowHeight = (_conWidth - (len-1) * _gutter[0]) / sum;
    }

    function _fixBarrelSize () {
        var curRowItems = _curRow.querySelectorAll('.barrel-item'),
            curRowImgs = _curRow.querySelectorAll('.barrel-item img'),
            len = curRowItems.length,
            height = 0,
            needFix = false,
            realWidth = 0,
            widthByMaxHeight = 0,
            i;

        // 计算处于最大高度下当前行总宽度，用于避免宽度过大导致折行现象
        for (i = 0; i < len; i++) {
            widthByMaxHeight += _barrelSettings.maxHeight * _ratioArr[i];
        }

        if ((len < _barrelSettings.minCnt && widthByMaxHeight < _conWidth) ||
             _curRowHeight > _barrelSettings.maxHeight) {
            height = _barrelSettings.maxHeight;
        } else {
            height = _curRowHeight;
            needFix = true;
        }

        for (i = 0; i < len; i++) {
            curRowImgs[i].width = height * _ratioArr[i];
            curRowImgs[i].height = height;
        }

        // 修复由于图片宽度取整造成的误差
        if (needFix) {
            for (i = 0; i < len; i++) {
                realWidth += curRowImgs[i].width;
            }
            curRowImgs[len-1].width += ((_conWidth - (len-1) * _gutter[0]) - realWidth);
        }
    }

    /***************************** 木桶布局私有方法结束 ***************************/

    /******************************** 全屏功能开始 ********************************/
    function _modalCreate () {
        var height = document.documentElement.clientHeight,
            width = document.documentElement.clientWidth,
            modal = document.createElement('div');

        modal.id = 'modal';
        modal.className = 'modal';
        modal.style.height = height + 'px';
        modal.innerHTML = ''+
            '<div class="modal-mask"></div>'+
            '<img class="modal-img" />'+
            '<button class="prev"></button>'+
            '<button class="next"></button>';

        document.body.appendChild(modal);
    }


    function _modalInit () {
        _modalCreate();

        var modal = document.getElementById('modal'),
            modalImg = modal.getElementsByClassName('modal-img')[0],
            modalMask = modal.getElementsByClassName('modal-mask')[0],
            prevBtn = modal.getElementsByClassName('prev')[0],
            nextBtn = modal.getElementsByClassName('next')[0];

        addEvent(_container, 'click', function (event) {
            event = event || window.event;
            var target = event.target || event.srcElement;

            if (!_isFullscreen) {
                return ;
            }

            if (hasClass(target, 'puzzle-item') || target.nodeName.toLowerCase() === 'img') {
                var imgIndex = target.getAttribute('imgIndex');
                _showImg(imgIndex);

                addClass(modal, 'show');
            }
        });

        addEvent(modal, 'click', function () {
            removeClass(modal, 'show');
        });

        addEvent(window, 'resize', function () {
            modal.style.height = document.documentElement.clientHeight + 'px';
        });

        addEvent(prevBtn, 'click', function (event) {
            event = event || window.event;

            var index = modalImg.index;

            if (index) {
                _showImg(--index);
            } else {
                _showImg(_lastIndex);
            }

            stopPropagation(event);
        });

        addEvent(nextBtn, 'click', function (event) {
            event = event || window.event;

            var index = modalImg.index;

            if (index < _lastIndex) {
                _showImg(++index);
            } else {
                _showImg(0);
            }

            stopPropagation(event);
        });


        function _showImg(imgIndex) {
            var img = _imgs[imgIndex],
                width = img.originalWidth,
                height = img.originalHeight,
                cWidth = document.documentElement.clientWidth,
                cHeight = document.documentElement.clientHeight,
                k = width / height;

            // 使尺寸过大的图片不超过浏览器边缘
            if (width > cWidth && height > cHeight) {
                if (k > cWidth / cHeight) {
                    width = cWidth;
                    height = cWidth / k;
                } else {
                    width = cHeight * k;
                    height = cHeight;
                }
            } else if (width > cWidth && height < cHeight) {
                width = cWidth;
                height = cWidth / k;
            } else if (width < cWidth && height > cHeight) {
                width = cHeight * k;
                height = cHeight;
            }

            modalImg.src = img.src;
            modalImg.index = imgIndex;
            modalImg.style.width = width + 'px';
            modalImg.style.height = height + 'px';
            modalImg.style.marginLeft = -width/2 + 'px';
            modalImg.style.marginTop = -height/2 + 'px';
        }
    }
    /******************************** 全屏功能结束 ********************************/
    function _operate (type) {
        var layout = _layout;

        type = type.toUpperCase();
        OPERATION[type][layout]();
    }

    function _resetContainer () {
        var len = CLASSES.length;

        for (var i = 0; i < len; i++) {
            removeClass(_container, CLASSES[i]);
        }

        _container.style.cssText = '';   
        _container.innerHTML = '';
    }

    /************* 以下是本库提供的公有方法 *************/
    /**
     * 初始化并设置相册
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param {(string|string[])} image  一张图片的 URL 或多张图片 URL 组成的数组
     * @param {object}            option 配置项
     */
    Gallery.prototype.setImage = function (image, option) {
        if (typeof image === 'string') {
            this.setImage([image]);
            return;
        }

        image = image || [];
        option = option || {};

        _modalInit();

        _imgs = [];

        if (option.layout) {
            this.setLayout(option.layout);  
        } 
        if (option.gutter) {
            this.setGutter(option.gutter.x, option.gutter.y);
        }
        if (option.fullscreen === true || option.fullscreen === false) {
            _isFullscreen = option.fullscreen;
        } 

        if (!isNaN(option.conWidth)) {
            _puzzleSettings.conWidth = option.conWidth;
        }
        if (!isNaN(option.conHeight)) {
            _puzzleSettings.conHeight = option.conHeight;
        }
        
        if (!isNaN(option.colCnt)) {
            _waterfallSettings.colCnt = option.colCnt; 
        }

        if (option.minCnt && option.maxCnt) {
            this.setBarrelBin(option.minCnt, option.maxCnt);
        } 
        if (option.minHeight && option.maxHeight) {
            this.setBarrelHeight(option.minHeight, option.maxHeight);  
        } 

        _operate('reset');
        this.addImage(image);
    };

    /**
     * 获取相册所有图像对应的 DOM 元素
     * 可以不是 ，而是更外层的元素
     * @return {HTMLElement[]} 相册所有图像对应的 DOM 元素组成的数组
     */
    Gallery.prototype.getImageDomElements = function() {
        var className = '';
        switch (this.getLayout()) {
            case this.LAYOUT.PUZZLE:
                className = 'puzzle-item';
                break;

            case this.LAYOUT.WATERFALL:
                className = 'waterfall-item';
                break;
                
            case this.LAYOUT.BARREL:
                className = 'barrel-item';
                break;
            
            default: 
                break;
        }
        return _container.getElementsByClassName(className);
    };

    /**
     * 向相册添加图片
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    Gallery.prototype.addImage = function (image, callback) {
        if (typeof image === 'string') {
            this.addImage([image], callback);
            return;
        }

        var i,
            len = image.length,
            img;

        for (i = 0; i < len; i++) {
            img = new Image();
            img.src = image[i];

            img.onload = imgOnload;

            img.onerror = imgOnerror;
        }

        function imgOnload () {
            /*jshint validthis:true */
            this.originalWidth = this.width;
            this.originalHeight = this.height;
            _imgs.push(this);

            _operate('add');

            if (typeof callback === 'function') {
                callback(this);  
            } 
        }

        function imgOnerror () {
            /*jshint validthis:true */
            console.error('fail to load the image '+this.src);
            if (typeof callback === 'function') {
                callback(this);
            }
        }
    };

    /**
     * 移除相册中的图片
     * @param  {number} index 需要移除的图片索引
     */
    Gallery.prototype.removeImage = function (index) {
        if (_imgs[index]) {
            _imgs.splice(index, 1);
        }
        _operate('reset');
    };

    /**
     * 设置相册的布局
     * @param {number} layout 布局值，Gallery.LAYOUT 中的值
     */
    Gallery.prototype.setLayout = function (layout) {
        if (isNaN(layout)) {
            console.error('setLayout: wrong param type');
            return;
        }

        if (layout === _layout) {
            return;
        }

        switch (layout) {
            case this.LAYOUT.PUZZLE:
            case this.LAYOUT.WATERFALL:
            case this.LAYOUT.BARREL:
                _layout = layout;
                _operate('reset');
                break;

            default:
                console.error('no such layout');
                break;
        }
    };

    /**
     * 获取相册的布局
     * @return {number} 布局枚举类型的值
     */
    Gallery.prototype.getLayout = function() {
        return _layout;
    };

    /**
     * 设置图片之间的间距
     * 注意这个值仅代表图片间的间距，不应直接用于图片的 margin 属性，如左上角图的左边和上边应该紧贴相册的左边和上边
     * 相册本身的 padding 始终是 0，用户想修改相册外框的空白需要自己设置相框元素的 padding
     * @param {number}  x  图片之间的横向间距
     * @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
     */
    Gallery.prototype.setGutter = function (x, y) {
        if (isNaN(x) || x < 0 || (isNaN(y) && typeof y !== 'undefined') ) {
            console.error('图片间距设定参数错误');
            return;
        }
        if (typeof y === 'undefined') {
            y = x;
        }

        _gutter[0] = x;
        _gutter[1] = y;

        _operate('reset');
    };

    /**
     * 设置瀑布流列数
     * @param {number}  cnt - 列数
     */
    Gallery.prototype.setColcnt = function (cnt) {
        if (isNaN(cnt) || cnt < 0) {
            console.error('列数输入错误');
            return;
        }

        _waterfallSettings.colCnt = cnt;
        _operate('reset');
    };

    /**
     * 允许点击图片时全屏浏览图片
     */
    Gallery.prototype.enableFullscreen = function () {
        _isFullscreen = true;
    };

    /**
     * 禁止点击图片时全屏浏览图片
     */
    Gallery.prototype.disableFullscreen = function () {
        _isFullscreen = false;
    };

    /**
     * 获取点击图片时全屏浏览图片是否被允许
     * @return {boolean} 是否允许全屏浏览
     */
    Gallery.prototype.isFullscreenEnabled = function () {
        return _isFullscreen;
    };

    /**
     * 设置木桶模式每行图片数的上下限
     * @param {number} min 最少图片数（含）
     * @param {number} max 最多图片数（含）
     */
    Gallery.prototype.setBarrelBin = function (min, max) {
        if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
            console.error('木桶布局单行图片数上下限设定错误');
            return;
        }
        if (parseInt(min) != min || parseInt(max) != max) {
            console.error('木桶布局上下限不能为浮点数');
            return;
        }
        if (min > max) {
            console.error('木桶图片数上限不能低于木桶图片数下限');
            return;
        }

        _barrelSettings.maxCnt = max;
        _barrelSettings.minCnt = min;

        _operate('reset');
    };

    /**
     * 获取木桶模式每行图片数的上限
     * @return {number} 最多图片数（含）
     */
    Gallery.prototype.getBarrelBinMax = function () {
        return _barrelSettings.maxCnt;
    };

    /**
     * 获取木桶模式每行图片数的下限
     * @return {number} 最少图片数（含）
     */
    Gallery.prototype.getBarrelBinMin = function () {
        return _barrelSettings.minCnt;
    };

    /**
     * 设置木桶模式每行高度的上下限，单位像素
     * @param {number} min 最小高度
     * @param {number} max 最大高度
     */
    Gallery.prototype.setBarrelHeight = function (min, max) {
        if (isNaN(min) || isNaN(max) || max < 0 || min < 0) {
            console.error('木桶模式高度上下限设定参数要为正实数');
            return ;
        }
        if (max < min) {
            console.error('木桶模式高度上限不能低于下限');
            return ;
        }

        _barrelSettings.maxHeight = max;
        _barrelSettings.minHeight = min;

        _operate('reset');
    };

    /**
     * 获取木桶模式每行高度的上限
     * @return {number} 最多图片数（含）
     */
    Gallery.prototype.getBarrelHeightMax = function () {
        return _barrelSettings.maxCnt;
    };

    /**
     * 获取木桶模式每行高度的下限
     * @return {number} 最少图片数（含）
     */
    Gallery.prototype.getBarrelHeightMin = function () {
        return _barrelSettings.minCnt;
    };

    /************* 以上是本库提供的公有方法 *************/
    if (typeof window.gallery === 'undefined') {
        window.gallery = new Gallery();
    }

    addEvent(_container, 'click', function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement;

        var index = -1;
        if (hasClass(target, 'img-delete')) {
            index = target.getAttribute('imgIndex');
            gallery.removeImage(index);                
        }
    });

    addEvent(window, 'resize', function () {
        _operate('reset');
    });
}(window));