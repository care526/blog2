# Prettier

## 使用方式

## 配置文件
```json
{
  "printWidth": 80,                     // 单行最大长度
  "tabWidth": 2,                        // tab的宽度
  "useTabs": false,                     // 使用tab代替空格
  "semi": true,                         // 每个语句后面加空格
  "singleQuote": false,                 // 使用单引号代替双引号
  "jsxSingleQuote": false,              // 在JSX中使用单引号
  "trailingComma": "<es5|none|all>",    // 在对象或数组的最后一个元素后面添加尾逗号()
  "bracketSpacing": true,               // 字面量对象中的空格
  "jsxBracketSameLine": false,          // 闭合标签同一行还是另起一行
  "arrowParens": "<always|avoid>",      // 箭头函数的参数两边是否需要括号(始终需要|需要的时候使用)
  "endOfLine": "auto",                  // 行末尾标识，一般用auto，自动识别文件第一行换行标识
  "htmlWhitespaceSensitivity": "ignore",// 方式结束标签>跑到下一行
}
```
### 支持的类型
- package.json 中的 prettier 属性
- .prettierrc 文件 格式支持：JSON / YAML
- .prettierrc.json
  .prettierrc.yml
  .prettierrc.yaml
  .prettierrc.json5
- .prettierrc.js
  .prettierrc.cjs
  prettier.config.js
  prettier.config.cjs
  > exports an object using module.exports
- .prettierrc.toml

## 忽略文件
基于
- .prettierignore
  ```
  # Ignore artifacts:
	build
	coverage

	# Ignore all HTML files:
	*.html
  ```

## cli命令
```bash
# 格式化文件
prettier --write ./xxx.ts
# 格式化目录下的所有文件
prettier --write ./src/
```

# 配置项