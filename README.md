mokit 的转场动画插件

# 安装
```sh
npm install mokit-transition --save-dev
```

# 使用
```js
const mokit = require('mokit');
const Transition = require('mokit-transition');

mokit.use(Transition);

const TheComponent = new mokit.Component({
  template: '<m:view m:prop:transition="transition"></m:view>',
  transition: new mokit.Transition(2)
});

...
...

```