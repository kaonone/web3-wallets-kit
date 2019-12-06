## Добавление странички для редиректа Bitski с помощью webpack

```typescript
import FileManagerWebpackPlugin from 'filemanager-webpack-plugin';

// добавить в список плагинов
new FileManagerWebpackPlugin({
  onEnd: {
    copy: [
      {
        source: `node_modules/web3-wallets-kit/assets/bitski/bitski-callback.html`,
        destination: `build/bitski-callback.html`,
      },
    ],
  },
})
```
