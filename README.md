# webpack-template


#### 安装教程

1.  npm install
2.  npm run dev / start
3.  npm run build

#### 依赖

webpack webpack-cli webpack-dev-server webpack-mock-server webpack-merge [ webpack-hot-middleware webpack-dev-middleware ]

cnpm i -D css-minimizer-webpack-plugin mini-css-extract-plugin clean-webpack-plugin html-webpack-plugin babel-polyfill babel-loader @babel/core

cnpm i -D html-loader css-loader sass-loader less-loader style-loader mini-css-extract-plugin postcss-loader postcss-advanced-variables postcss-nested autoprefixer postcss-scss url-loader file-loader csv-loader xml-loader

cnpm i -D lint-staged husky @commitlint/cli @commitlint/config-conventional

cnpm i -D node-sass

cnpm i -D eslint eslint-plugin-prettier babel-eslint prettier

cnpm i -D core-js regenerator-runtime

#### postcss.config.js 与 .browserslistrc

    postcss-loader 依赖于 postcss.config.js 还有 .browserslistrc

    postcss-advanced-variables，postcss-nested 以及 autoprefixer 处理谐音，变量，混入，嵌套，和自动前缀

    ```
    module.exports = {
      plugins: {
        autoprefixer: {}
      }
    }

    module.exports = ({ env }) => ({
      parser: 'postcss-scss',
      plugins: [
        require('autoprefixer'),
        require('postcss-nested'),
        // env === 'production' ? require('cssnano') : null
      ]
    })

    .browserslistrc

    > 1%,
    last 2 versions,
    not ie <= 8,
    safari >= 7

    ```

#### 正则

"支付账号","^\\w{25}@wx.tenpay.com$"

"时间戳","^\\d{10}$"

"标记,时间戳格式,其他标记","^\\d\,\\d{10},\\d{1,10}$"

"标记,标记,时间戳格式,标记","^\\d{1,2}\,\\d{1,2}\,\\d{10},\\d{1,2}$"

"标记 1,时间戳格式","^\\d\,\\d{10}$"

"标记,时间戳,标记,时间戳","^\\d{1,2}\,\\d{10}\,\\d{1,2},\\d{10}$"

小于十万的整数,"^\\d{0,5}$"

小于千万的整数,"^\\d{0,8}$"

任意长度数字,^\\d\*$

"(商户,时间戳)列表","^(\\w{6}\\,\\d{10}\\;){0,20}\\w{6}\\,\\d{10}\\;?$"

中文,^((?!\\?).)\*$

商户金额格式,^((?![a-z]).)\*$ 奇数位置不能是小写字母而且字符串长度必须是偶数

"(日期,笔数)列表","^(\\d{4}\\-\\d{2}\\-\\d{2}\\,\\d{0,6}\\;){0,20}\\d{4}\\-\\d{2}\\-\\d{2}\\,\\d{0,6};?$"

"(日期,金额,笔数)列表","^(\\d{4}\\-\\d{2}\\-\\d{2}\\,\\d{0,10}\\,\\d{0,6}\\;){0,20}\\d{4}\\-\\d{2}\\-\\d{2}\\,\\d{0,10}\\,\\d{0,6};?$"

#### eslint

    npm i -D eslint eslint-plugin-prettier lint-staged babel-eslint prettier

    lint-staged 只对修改的文件进行check

    package.json

    ```
    "gitHooks": {
    	"pre-commit": "lint-staged"
    },

    -D husky lint-staged  @commitlint/cli @commitlint/config-conventional

    "husky": {
      "hooks": {
        "pre-commit": "lint-staged",
        "pre-push": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }
    },
    "lint-staged": {
      "*.{js,json,html}": [
        "npm run lint",
        "git add"
      ]
    },

    commitlint.config.js

    module.exports = {
        extends: ['@commitlint/config-conventional'],
    };

    ```

#### npm i -S core-js 和 regenerator-runtime 代替 @babel/polyfill

    .babelrc

    ```
    {
      "presets":[
        ["@babel/preset-env",{
          "useBuiltIns:"usage",
          "corejs":3
        }]
      ]
    }
    ```

```
"dev": "webpack-dev-server --config build/webpack.dev.js",

"build": "webpack --mode production --config build/webpack.build.js",

"build:dll": "webpack --config build/webpack.dll.js && webpack --config build/webpack.build.js && webpack --config build/webpack.dll.js",

"dll": "webpack --config build/webpack.dll.js",

"watch": "webpack --watch --config build/webpack.dev.js",

"server": "node build/server.js",

"dist": "http-server dist",

"pre": "webpack --mode development",

"config": "webpack --mode development --config build/webpack.config.js",

"config:build": "webpack --mode production --config build/webpack.config.js",

"config:dev": "webpack-dev-server --hot --inline --config build/webpack.config.js",

"stats": "webpack --profile --json",

"lint": "eslint --ext src/** --fix",

"lints": "eslint --ext src/** --no-error-on-unmatched-pattern --quiet",

"lint:fix": "eslint --ext src/** --no-error-on-unmatched-pattern --fix",

"install-hook": "ln -s ../../build/git-hooks/pre-commit .git/hooks/pre-commit"

```
