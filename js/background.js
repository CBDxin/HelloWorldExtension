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

//https://developer.chrome.com/docs/extensions/reference/tabs/
// chrome.tabs.onUpdated.addListener(function (id, info, tab) {
//   if (tab.url.toLowerCase().indexOf('com') > -1) {
//     chrome.pageAction.show(tab.id);
//   }
// });

// 在onBeforeRequest阶段拦截请求
// chrome.webRequest.onBeforeRequest.addListener(
//   details => {
//     // 当网页请求图片资源时，取消本次请求，cancel 表示取消本次请求
//     console.log(details.type);
//     if (details.type == 'image') {
//       return { cancel: true };
//     }
//     //["blocking"]参数表示阻塞式，需单独声明权限：webRequestBlocking
//   },
//   { urls: ['<all_urls>'] },
//   ['blocking'],
// );

chrome.notifications.create(null, {
  type: 'basic',
  iconUrl: 'img/icon.png',
  title: '标题',
  message: '这是消息',
});

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
