# 什么是 chrome extension

chrome extension，也就是我们平时所说的浏览器插件，是可以定制 Chrome 的浏览体验的程序，它能够让开发者可以根据个人需要或者偏好定制 Chrome 的功能和行为。
下载到本地的插件是一个[.crx](https://developer.chrome.com/extensions/crx)后缀的压缩包，当我们把插件安装到 Chrome 上后，插件会被解压到 `C:\Users\用户名\AppData\Local\Google\Chrome\User Data\Default\Extensions` 目录中。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16b4e6819c9d4b509c8f1114b660b93f~tplv-k3u1fbpfcp-watermark.image?)

其中各个插件目录的名称为这个插件对应的 id。
点开某个插件目录查看里面的内容，我们可以看到其实插件只是一个有 html、js、css、json 等资源组成的程序，和我们平日里开发的前端程序没有太大的区别。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9243497b96d4e3186e422dc4f3b32a8~tplv-k3u1fbpfcp-watermark.image?)

# chrome extension 能做什么

chrome extension 能够让我们定制一个属于自己的浏览器，插件能做到的事情有很多，包括但不限于：

- 屏蔽广告（例如 Adblock Plus）
- 帮助开发者进行调试开发（例如 React Developers Tools）
- 自动更换壁纸（例如 Momentum）
- 解决跨域问题（例如 Allow CORS）
- 翻译网页内容等。

接下来我们会使用一个简单的 Hello World ，来带大家看看一个 Chrome 插件是如何开发的。

# 浏览器插件的基本组成

- manifest.json
- background script
- content script
- popup

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b08b75f5d2440339c79735abba63999~tplv-k3u1fbpfcp-watermark.image?)

# manifest.json

每个插件都有一个名为 manifest.json 清单文件，他的作用和我们平时在前端项目中用到得 package.json 很相似，用于说明项目的各种信息。

接下来我会列举一份包含一些常用配置的 manifest.json ，每个配置项中都有相应的注释说明，重要的字段会在后续的内容进行详细的讲解。大家可以先大概过一下，不需要完全看懂，列出来是想给大家看看一个完整的 manifest.json 长啥样。

```json
{
  // manifest的版本，最新的版本为3，但最常用的为2，本文也会围绕2的版本进行介绍
  "manifest_version": 2,
  // 插件的名称
  "name": "hello world extension",
  // 插件的版本号
  "version": "1.0.0",
  // 插件描述
  "description": "hello world extension demo",
  // 图标定义
  // 16x16 用于当作插件的页面图标
  // 48x48的 用于在扩展程序管理界面(chrome://extensions)中进行展示
  // 128x128 用于安装extension程序的时候进行展示
  // 图标格式虽然没有限制，但一般使用PNG格式
  "icons": {
    // "16": "img/icon.png",
    // "48": "img/icon.png",
    // "128": "img/icon.png"
  },
  // 一直运行在后台的常驻脚本/页面
  "background": {
    // 可以使用 page：html 或者 script：[js] 中的其中一项进行配置
    // 当配置了scripts选项时，插件会自动生成一个后台页面承载这些js
    "page": "background.html",
    // "scripts": ["js/background.js"]
    // 决定当前的background的生命周期
    // 当persistent为true时，此background属于background page，生命周期与浏览器一致
    // 当persistent为false时，此background属于event page，只会在需要的时候存活
    "persistent": true
  },
  // 浏览器右上角图标设置
  "browser_action": {
    "default_icon": "img/icon.png",
    // hover的标题
    "default_title": "hello world！",
    // 点击后展示的页面
    "default_popup": "popup.html"
  },
  // 与browser_action不同的是，page_action只有在访问某些页面的时候才会显示
  // 以及图标会显示在地址栏右侧
  // "page_action": {
  //   "default_icon": "img/icon.png",
  //   "default_title": "hello world！",
  //   "default_popup": "popup.html"
  // },
  // 注入到浏览器页面中的内容，可访问页面dom，但与页面原有的js不共用作用域
  "content_scripts": [
    {
      // 只在访问的页面地址匹配matches中的字段时，才会进行注入
      //"matches": ["http://*/*", "https://*/*"],
      // "<all_urls>" 表示匹配所有地址
      "matches": ["<all_urls>"],
      // 注入的js
      "js": ["js/content-script.js"],
      // 注入的css
      "css": ["css/content-script.css"],
      // 注入的时机，可选： "document_start", "document_end", or "document_idle"，默认document_idle
      "run_at": "document_start"
    },
    // 可以配置多个规则
    {
      "matches": ["www.baidu.com"],
      "js": ["js/content-script2.js"]
    }
  ],
  // 在background中使用到的chrome api，需要进行授权后才可使用
  "permissions": [
    "contextMenus", // 右键菜单
    "tabs", // 标签
    "notifications", // 通知
    "webRequest", // web请求拦截
    "storage", // 插件本地存储
    "http://*/*" // 可以通过executeScript或者insertCSS访问的网站
  ],
  // 浏览器页面中是无法直接访问插件中的资源的
  // 需要将需要访问的资源列表配置到web_accessible_resources中才能够进行访问
  "web_accessible_resources": ["js/inject.js"],
  // 开发者或者插件主页设置
  "homepage_url": "https://www.baidu.com",
  // 覆盖浏览器默认页面
  "chrome_url_overrides": {
    // 覆盖浏览器默认的新标签页
    "newtab": "newtab.html",
    // 覆盖历史记录页面
    "history": "history.html",
    // 覆盖书签管理页
    "bookmarks": "bookmarks.html"
  },
  // 插件配置页
  "options_ui": {
    "page": "options.html",
    // 是否添加添加默认的样式
    "chrome_style": true
  }
}
```

# popup

popup 用于指定我们在点击 browser_action 或者 page_action 的图标的时候，我们应该如何展示我们的插件。需要注意的是，browser_action 和 page_action 在同一份 manifest.json 中不能同时存在，同时当焦点离开 popup page 的时候，popup page 会立即关闭，所以 popup page 一般只用来做一些临时性的交互。

## browser_action

browser_action 是在点击浏览器右上角中的扩展程序列表中的插件图标后，插件的行为。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82c9de3bd1124b639447891b07a3e936~tplv-k3u1fbpfcp-watermark.image?)

我们的 Hello World extension 只需要在点击了插件图标后，展示一个 helloWorld.html 页面。

```html
<!-- helloWorld.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    body {
      width: 600px;
      height: 400px;
    }
    .title {
      font-size: 24px;
      text-align: center;
    }
  </style>
  <body>
    <h1 class="title">hello world</h1>
  </body>
</html>
```

我们先来看看这么一个简单的插件的 manifest.json 是如何进行配置的：

```
{
  // manifest的版本，最新的版本为3，但最常用的为2，本文也会围绕2的版本进行介绍
  "manifest_version": 2,
  // 插件的名称
  "name": "hello world extension",
  // 插件的版本号
  "version": "1.0.0",
  // 插件描述
  "description": "hello world extension demo",
  // 浏览器右上角图标设置
  "browser_action": {
    "default_icon": "img/icon.png",
    // hover的标题
    "default_title": "hello world！",
    // 点击后展示的页面
    "default_popup": "helloWorldPopup.html"
  }
}
```

manifest.json 中的所有路径配置都是基与项目的顶层目录的，目录结构如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5713dda748df4a218e047b540817568d~tplv-k3u1fbpfcp-watermark.image?)

那么，我们的 Hello World extension 的第一个版本就算是完成了，那我们应该如何安装到浏览器中呢？

### 安装 Hello World extension

1. 打开扩展程序管理页面（[chrome://extensions/](chrome://extensions/)）；
2. 打开开发者模式设置；
3. 点击加载已解压的扩展程序；
4. 选择插件程序目录文件夹；

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a79279255ba4699a62dd8780ad9045d~tplv-k3u1fbpfcp-watermark.image?)

完成上面的步骤之后，我们的 Hello World extension 就已经安装到浏览器中了，在扩展程序管理页面和右上角的扩展程序列表中都能看到我们插件的图标，扩展程序列表中的插件的图标后，helloWorldPopup.html 也如我们所愿的在浏览器中进行展示了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1910db9c853f4ca6afa3a46bb3362925~tplv-k3u1fbpfcp-watermark.image?)

如果我们嫌点击图标太麻烦了，我们还可以为 browser_action 中添加快捷键配置（[快捷键配置文档](https://developer.chrome.com/docs/extensions/reference/commands/)）：

```
{
   //...
   // 快捷键命令
  "commands": {
    "_execute_browser_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+H",
        "mac": "MacCtrl+Shift+H"
      },
      "description": "打开 helloWorldPopup.html"
    }
  }
}
```

## page_action

~~page_action 是在点击浏览器浏览器地址栏后的插件图标后，插件的行为。~~(划掉的原因后面会有解释)
page_action 的 manifest.json 配置如下所示：

```
{
  // manifest的版本，最新的版本为3，但最常用的为2，本文也会围绕2的版本进行介绍
  "manifest_version": 2,
  // 插件的名称
  "name": "hello world extension",
  // 插件的版本号
  "version": "1.0.0",
  // 插件描述
  "description": "hello world extension demo",
  // 图标定义
  // 16x16 用于当作插件的页面图标
  // 48x48的 用于在扩展程序管理界面(chrome://extensions)中进行展示
  // 128x128 用于安装extension程序的时候进行展示
  // 图标格式虽然没有限制，但一般使用PNG格式
  "icons": {
    "16": "img/icon.png",
    "48": "img/icon.png",
    "128": "img/icon.png"
  },
  //page_action 与 browser_action 在同一份配置中只能出现一个
  //地址栏旁边的图标配置
  "page_action": {
    "default_icon": "img/icon.png",
    "default_title": "hello world！",
    "default_popup": "helloWorldPopup.html"
  }
}
```

点击 page_action 图标后，我们依然去打开 helloWorldPopup.html 页面。修改好配置之后我们需要重新加载插件。

### 重新加载插件

只需要在拓展程序页面中，点击插件的刷新按钮，就可以重新加载插件了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbb5dbdacfd8464a8d1b750d57a23753~tplv-k3u1fbpfcp-watermark.image?)

重新加载之后，去查看浏览器地址栏的右边，page_action 并没有如期出现。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79c5fc0df1064a4ca9bd71b3c8da5d77~tplv-k3u1fbpfcp-watermark.image?)

在扩展程序列表中虽然出现了我们的插件的图标，但却置灰了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8c679ce824c4fc4a74cd8deaf8415df~tplv-k3u1fbpfcp-watermark.image?)

这是为什么呢？
细心的小伙伴可能在阅读 manifest.json 的解释章节中给出的 manifest.json 中的 page_action 的注释上面时已经注意到了，page_action 只有在访问某些页面的时候才会显示，我们需要在 background.js 中告诉浏览器，当我们访问哪些页面的时候，page_action 需要出现。

```
// js/background.js
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 匹配规则
          new chrome.declarativeContent.PageStateMatcher({
            // 当访问的页面路由匹配到 'com' 时
            pageUrl: { urlContains: 'com' },
            // 也可以根据访问的页面内容进行匹配,下面的语句表示当页面存在video标签时
            //css匹配规则：https://developer.chrome.com/docs/extensions/reference/declarativeContent/#css-matching
            // css: ['video'],
          }),
          new chrome.declarativeContent.PageStateMatcher({
            css: ['video'],
          }),
        ],
        // 展示page_action 图标，declarativeContent需要在permissions中进行授权
        // 很多文章这里会使用ShowPageAction，但 ShowPageAction 在chrome 97版本已经弃用了：https://developer.chrome.com/docs/extensions/reference/declarativeContent/#type-ShowPageAction
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});
```

同时，由于我们使用了 background.js 以及在 background.js 使用了 chrome 的一些需要授权的 api，所有我们需要在 manifest.json 中添加对应的配置。

```
{
  //...
  "background": {
    "scripts": ["js/background.js"]
  },
  // 在background中使用到的chrome api，需要进行授权后才可使用
  "permissions": ["declarativeContent", "tabs"]
}
```

重新加载插件，令人失望的事情发生了，虽然原本在插件列表中被置灰的图标恢复了色彩，点击图标的时候 popup 页面也有正常的展示在浏览器中。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b103fe38743e4785bbee7ea4b439bede~tplv-k3u1fbpfcp-watermark.image?)

但我们的地址栏右边却依然没有出现我们插件的图标。
由于某些原因，chrome 已经不在支持在地址栏右边显示插件图标。详情原因可查看：[https://groups.google.com/a/chromium.org/forum/#!searchin/chromium-extensions/upcoming/chromium-extensions/7As9MKhav5E/dNiZDoSCCQAJ](https://groups.google.com/a/chromium.org/forum/#!searchin/chromium-extensions/upcoming/chromium-extensions/7As9MKhav5E/dNiZDoSCCQAJ)

# content_scripts

我们知道，当焦点离开 popup page 的时候，popup page 会立即关闭。但我想要将我们的插件内容持续性的插入到网页当中，比如说，我希望在打开 www.baidu.com 的时候，插件能将一些内容插入到页面当中，我们需要怎么做呢。

content_scripts 表演的时刻到了。

content_scripts 的作用是往浏览器页面中注入的我们需要的内容（js、css），同时在 content_script 中，可以访问到页面 dom 元素，但与页面原有的 js 不在同一个作用域，也就是说 content_script 无法访问原页面中的 js 变量和方法。同时

## 使用 content_script 在页面中插入内容

接下来，我们给我们的插件添加一个往 www.weibo.com添加 hello world 的功能。

```
//js/content.js
var helloWorld = document.createElement('div');

helloWorld.innerHTML = 'hello world!';

helloWorld.style.textAlign = 'center';
helloWorld.style.fontSize = '48px';

document.body.appendChild(helloWorld);
```

同时也有添加相关的 manifest.json 配置：

```
{
  //...
  "content_scripts": [
    {
      // 只在访问的页面地址匹配matches中的字段时，才会进行注入
      "matches": ["http://www.weibo.com/*", "https://www.weibo.com/*"],
      // 注入的js
      "js": ["js/content.js"]
      // 注入的css
      // "css": ["css/content-script.css"],
      // 注入的时机，可选： "document_start", "document_end", or "document_idle"，默认document_idle
      // "run_at": "document_start"
    }
  ]
}
```

重新加载插件，打开 www.weibo.com，就能看到 hello world 插入到了页面的底部。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18ed3fbb423042508306bde58c738a1a~tplv-k3u1fbpfcp-watermark.image?)

## 使用 content_script 清除页面广告

content_script 强大的点在于它能够访问到页面的 dom 元素，这也代表我们能够隐藏掉页面中的某些元素，如隐藏掉页面中的广告。

假设我们认为微博页面中左边的导航条为是广告内容。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f635dd3b9e748278e042047525fc98c~tplv-k3u1fbpfcp-watermark.image?)

在 content.js 中添加内容：

```
// content.js
// 根据广告区域的className获取页面中的所有广告元素
var adBoxs = document.getElementsByClassName('woo-panel-left');

for (var i = 0; i < adBoxs.length; i++) {
  adBoxs[i].style.display = 'none';
}
```

页面中左边的导航栏就被清除了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9563176673d4780b9a3c0534c1146dd~tplv-k3u1fbpfcp-watermark.image?)

content-scripts 还能访问到部分 chrome api：

- chrome.extension
- chrome.i18n
- chrome.runtime
- chrome.storage

# 向页面插入插件页面

虽然通过 content_script 能够往页面中插入 js 来达到在页面添加我们想要添加的 dom 元素的目的，但是每次都通过 js 进行添加实在是太麻烦了。我们能不能直接把我们之前写的 helloWorldPopup.html 页面插入到我们浏览的页面中呢？

既然 content_script 能够操作页面的 dom 元素，那我们如果在 content_script 中创建一个 iframe 元素，并让 iframe 的地址指向我们的 popup 页面的话，能否达到我们的目的呢？

```
var iframe = document.createElement('iframe');
// 获取指定html的url
iframe.src = chrome.extension.getURL('helloWorldPopup.html');
iframe.height = 450;
iframe.width = 800;
iframe.style.position = 'absolute';
iframe.style.background = '#fff';
iframe.style.top = '100px';
iframe.style.left = '10px';
document.body.appendChild(iframe);
```

打开微博页面，虽然通过上面的这段代码我们确实在页面中插入了一个 iframe 元素，但 iframe 元素的内容并不是我们预期的 popup 页面，而是一个提示我们"此页面也被 Chrome 屏蔽的页面"的页面。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e2caa4477ab4c9aa6bc49a33167efdb~tplv-k3u1fbpfcp-watermark.image?)

同时查看控制台，我们会看到这么一条报错信息：

```
Denying load of chrome-extension://cnjafecbmicbbijbdiffhcmpjpgjlnja/helloWorldPopup.html. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
```

这是为什么呢？其实这是因为我们没有把 helloWorldPopup.html 页面添加到 web_accessible_resources 配置导致的。在浏览器页面中是无法直接访问插件中的资源的，所以当我们需要把插件中的页面暴露出去时，我们需要将暴露的资源列表配置到 web_accessible_resources 中，浏览器页面才能够进行访问。

```
{
  //...
  // 浏览器页面中是无法直接访问插件中的资源的
  // 需要将需要访问的资源列表配置到web_accessible_resources中才能够进行访问
  "web_accessible_resources": ["helloWorldPopup.html"]
}
```

终于，我们能够访问到我们的 popup 页面了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09dc2bbb8a95430593562b40e3b9213a~tplv-k3u1fbpfcp-watermark.image?)

我们回过头来看看我们在 content.js 中加入的一条语句：

```
iframe.src = chrome.extension.getURL('helloWorldPopup.html');
```

`chrome.extension.getURL('helloWorldPopup.html')`能获取到访问插件中的资源的地址，这个地址的格式为`chrome-extension://插件id/资源名称`，如`chrome-extension://cnjafecbmicbbijbdiffhcmpjpgjlnja/helloWorldPopup.html`，是以 chrome-extension://开头的一个 url 地址。

通过 chrome-extension://开头的 url 地址打开的页面都不会受到浏览器跨域的限制，也就是说，我们还可以在 popup 页面中发出任意请求而不受跨域策略的影响。

# background

background 是一直运行在后台的常驻脚本/页面，依据 manifest.json 中 background.persistent 的值我们可以把 background 分为两种类型：

- 当 persistent 为 true 时，此 background 属于 background page，生命周期与浏览器一致
- 当 persistent 为 false 时，此 background 属于 event page，只会在需要的时候存活

persistent 默认值为 false，个人认为不需要特意修改此选项。

在 background 中，我们可以调用除了 devtools 之外的所有 Chrome 扩展 apis。

## webRequest

webRequest 用于对浏览器发出请求进行拦截或者修改。
webRequest 能够在请求发出各个生命周期中对请求进行定制修改。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6eb1497d02ec409091b8c2655e1af757~tplv-k3u1fbpfcp-watermark.image?)

同时，background 中调用的 api 以及想要拦截的请求都需要在 manifest.json 中的 permissions 字段进行配置授权才能进行使用：

```
{
  //...
  // 在background中使用到的chrome api，需要进行授权后才可使用
  "permissions": [
    "webRequest", // web请求拦截
    "webRequestBlocking", // 阻塞式web请求
    "https://*/*" //需要拦截的页面请求
  ]
}
```

可以看到，页面的所有图片资源请求都被拦截下来了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/853622ad2b79464386de0cede88d58e4~tplv-k3u1fbpfcp-watermark.image?)

## notifications

notifications 用于推送桌面通知

```
// background.js
chrome.notifications.create(null, {
  type: 'basic',
  iconUrl: 'img/icon.png',
  title: '标题',
  message: '这是消息',
});
```

```
//manifest.json
{
  //...
  "permissions": [
    "notifications",
  ]
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3524f616b8e94d2f93561af256c0ae33~tplv-k3u1fbpfcp-watermark.image?)

## contextMenus

contextMenus 用于自定义浏览器的右键菜单。

```
// background.js
chrome.contextMenus.create({
  id: '1',
  title: 'Context Menu 1',
  contexts: ['all'],
});
//分割线
chrome.contextMenus.create({
  type: 'separator',
});

// 子级菜单
chrome.contextMenus.create({
  id: '11',
  parentId: '1',
  title: 'Child Context Menu1',
  contexts: ['all'],
});
```

```
//manifest.json
{
  //...
  "permissions": [
    "contextMenus",
  ]
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b45035add3a64860b6e6d2442f293a7a~tplv-k3u1fbpfcp-watermark.image?)
