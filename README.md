mokit touch 事件支持

# 安装
```sh
npm install mokit-transition --save-dev
```

# 使用

HTML:

```HTML
<div id="app" m:on:tap="say('tap')" m:on:swipe="say('swipe')">
  {{name}}
</div>
```

JavaScript:

```js
const mokit = require('mokit');
const touch = require('mokit-touch');

mokit.use(touch);

mokit({
  element: document.getElementById('app'),
  data: function () {
    return { name: '' };
  },
  say: function (name) {
    this.name = name;
  }
}).start();

```

# 所有事件
```
tap,taphold,dbltap,swipe,swipeup,swiperight,
swipedown,swipeleft,pointdown,pointmove,pointup
```