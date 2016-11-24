window.onload = function () {
    gallery.setImage();

    var add = $('add'),
        imgUrlInput = $('imgUrl'),
        randomAdd = $('randomAdd'),
        layout = $('layout'),
        gutterX = $('gutterX'),
        gutterY = $('gutterY'),
        minHeight = $('minHeight'),
        maxHeight = $('maxHeight'),
        minCnt = $('minCnt'),
        maxCnt = $('maxCnt'),
        columns = $('columns'),
        loading = $('loading'),
        ctrlPanel = $('ctrl-panel'),
        loadingImgs = 0;

    add.onclick = function () {
        var url = imgUrlInput.value;
        loadingImgs++;
        loading.innerHTML = 'loading';
        loading.className = 'loading';
        gallery.addImage(url, function () {
            loadingImgs--;
            if (!loadingImgs) {
                loading.innerHTML = 'loaded';
                loading.className = 'loaded';
            }
        });
    };

    randomAdd.onclick = function () {
        var url = getRandomURL();
        imgUrlInput.value = url;
        add.click();
    };

    gutterX.onchange = function () {
        gallery.setGutter(+this.value, +gutterY.value);
    };

    gutterY.onchange = function () {
        gallery.setGutter(+gutterX.value, +this.value);
    };

    minHeight.onchange = function () {
        gallery.setBarrelHeight(+this.value, +maxHeight.value);
    };

    maxHeight.onchange = function () {
        gallery.setBarrelHeight(+minHeight.value, +this.value);
    };

    minCnt.onchange = function () {
        gallery.setBarrelBin(+this.value, +maxCnt.value);
    };

    maxCnt.onchange = function () {
        gallery.setBarrelBin(+minCnt.value, +this.value);
    };

    columns.onchange = function () {
        gallery.setColcnt(+this.value);
    };


    layout.onclick = function () {
        var radios = document.getElementsByName('layout'),
            len = radios.length,
            i;

        for (i = 0; i < len; i++) {
            if (radios[i].checked) {
                gallery.setLayout(+radios[i].value);
            }
        }

        var layout = gallery.getLayout(),
            gutter = $('gutter'),
            columns = $('waterfallColumns'),
            barrelHeight = $('barrelHeight'),
            barrelCnt = $('barrelCnt');

        switch (layout) {
            case 1:
                gutter.style.display = 'none';
                columns.style.display = 'none';
                barrelHeight.style.display = 'none';
                barrelCnt.style.display = 'none';
                break;
            case 2:
                gutter.style.display = 'inline-block';
                columns.style.display = 'inline-block';
                barrelHeight.style.display = 'none';
                barrelCnt.style.display = 'none';
                break;
            case 3:
                gutter.style.display = 'inline-block';
                columns.style.display = 'none';
                barrelHeight.style.display = 'inline-block';
                barrelCnt.style.display = 'inline-block';
                break;
            default:
                break;
        }
    };

    document.body.addEventListener('mousewheel', function (event) {
        if (event.wheelDelta > 0) {
            removeClass(ctrlPanel, 'hide');
        } else {
            addClass(ctrlPanel, 'hide');
        }
    });

    document.body.addEventListener('DOMMouseScroll', function (event) {
        if (event.detail > 0) {
            removeClass(ctrlPanel, 'hide');
        } else {
            addClass(ctrlPanel, 'hide');
        }
    });

    function getRandomURL () {
        var colorStr = parseInt(Math.random() * 0xffffff).toString(16);

        while (colorStr.length < 6) {
            colorStr = '0' + colorStr;
        }

        var width = Math.floor(Math.random() * 300) + 500;
        var height = Math.floor(Math.random() * 300) + 250;

        return 'http://placekitten.com/'+width+'/'+height;
    }

    function $ (id) {
        return typeof id == 'string' && document.getElementById(id);
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
};
