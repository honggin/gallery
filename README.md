# Gallery
---

使用原生js编写的相册库，兼容IE9+，chrome，firefox
[demo][1]

## 初始化参数说明
配置项 | 说明 | 选项 | 含义 | 默认值
-------|------|------|------|-------
layout | 布局类型 | Gallery.LAYOUT.PUZZLE<br/>Gallery.LAYOUT.WATERFALL<br/>Gallery.LAYOUT.BARREL  | 拼图布局<br />瀑布流布局<br/>木桶布局 | Gallery.LAYOUT.PUZZLE
fullscreen | 是否全屏 | true<br/>false | 允许全屏浏览<br/>取消全屏浏览 | true
gutter | 图片间隔 | {x:number, y: number} | x:水平间距<br/>y:垂直间距 | {x:10, y:10}
colCnt | 瀑布流列数 | number > 0 | 列数 | 4
minCnt | 木桶单行最小图片数 | number > 0 | | 3
maxCnt | 木桶单行最大图片数 | number > 0 |  | 6
minHeight | 木桶单行最小高度 | number > 0 |  | 200
maxHeight | 木桶单行最大高度 | number > 0 |  | 300

##使用方法
1.引用css和js文件
```html
<link rel="stylesheet" href="./css/gallery.min.css" />
<script src="./js/gallery.min.js"></script>
```
2.在html文档中插入
```html
<div id="mygallery"></div>
```
3.调用初始化方法
```javascript
gallery.setImage();
```

##API
```javascript
 /**
 * 初始化并设置相册
 * 当相册原本包含图片时，该方法会替换原有图片
 * @param {(string|string[])} image - 一张图片的 URL 或多张图片 URL 组成的数组
 * @param {object} - option 配置项详情见初始化参数说明
 */

gallery.setImage(image, option)

/**
* 获取相册所有图像对应的 DOM 元素
* @return {HTMLElement[]} - 相册所有图像对应的 DOM 元素组成的数组
*/
gallery.getImageDomElements()

/**
* 向相册添加图片
* 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
* @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
* @param {function) callback - 加载完毕后的回调函数
*/
gallery.addImage(image, callback) 

/**
* 移除相册中的图片
* @param  {number} index 需要移除的图片索引
*/
gallery.removeImage(index)

/**
* 设置相册的布局
* @param {number} layout 布局值，gallery.LAYOUT 中的值
*/
gallery.setLayout(layout)

/**
* 获取相册的布局
* @return {number} 布局枚举类型的值
*/
gallery.getLayout() 

/**
* 设置图片之间的间距
* @param {number}  x  图片之间的横向间距
* @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
*/
gallery.setgutter(x, y)

/**
* 设置瀑布流列数
* @param {number}  cnt - 列数
*/
gallery.setColcnt(cnt)

/**
* 允许点击图片时全屏浏览图片
*/
gallery.enableFullscreen() 
/**
* 禁止点击图片时全屏浏览图片
*/
gallery.disableFullscreen() 

/**
* 获取点击图片时全屏浏览图片是否被允许
* @return {boolean} 是否允许全屏浏览
*/
gallery.isFullscreenEnabled() 

/**
* 设置木桶模式每行图片数的上下限
* @param {number} min 最少图片数（含）
* @param {number} max 最多图片数（含）
*/
gallery.setBarrelBin(min, max)

/**
* 获取木桶模式每行图片数的上限
* @return {number} 最多图片数（含）
*/
gallery.getBarrelBinMax() 

/**
* 获取木桶模式每行图片数的下限
* @return {number} 最少图片数（含）
*/
gallery.getBarrelBinMin()

/**
* 设置木桶模式每行高度的上下限，单位像素
* @param {number} min 最小高度
* @param {number} max 最大高度
*/
gallery.setBarrelHeight(min, max) 

/**
* 获取木桶模式每行高度的上限
* @return {number} 最多图片数（含）
*/
gallery.getBarrelHeightMax() 
/**
* 获取木桶模式每行高度的下限
* @return {number} 最少图片数（含）
*/
gallery.getBarrelHeightMin() 

```
----------

## 拼图布局
支持1~6张图片，超过六张则只显示前六张

#### 一张图片
![此处输入图片的描述][2]
### 两张图片
![此处输入图片的描述][3]
### 三张图片
![此处输入图片的描述][4]
### 四张图片
![此处输入图片的描述][5]
### 五张图片
![此处输入图片的描述][6]
### 六张图片
![此处输入图片的描述][7]
## 木桶布局
![此处输入图片的描述][8]
## 瀑布流布局
![此处输入图片的描述][9]


  [1]: http://honggin.github.io/works/gallery/index.html
  [2]: http://i1.piimg.com/8311/3b3d4b5e867ffb50.png
  [3]: http://i1.piimg.com/8311/39e3ec7c63d4d438.png
  [4]: http://i1.piimg.com/8311/8a2081409d1f13f1.png
  [5]: http://i1.piimg.com/8311/19a34a8326c1cf9c.png
  [6]: http://i1.piimg.com/8311/560015f31bcd6c65.png
  [7]: http://i1.piimg.com/8311/20f28ef3aa22722e.png
  [8]: http://i2.buimg.com/8311/48b62c5b5cbe7576.png
  [9]: http://i2.buimg.com/8311/22dc53718b2350f3.png