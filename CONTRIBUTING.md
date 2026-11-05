# Contributing

感谢你愿意参与问事官网。

## 开发

```bash
cp .env.example .env
npm install
npm run dev
```

默认地址为 http://127.0.0.1:5174。

## 提交前检查

```bash
npm run typecheck
npm run build
```

## Pull Request

- 一个 PR 只解决一个问题。
- UI 改动请附截图。
- 新增环境变量时同步更新 `.env.example` 与 README。
- 不要提交 `.env`、`node_modules/`、`dist/`、日志或用户数据。

## 安全问题

请按 [SECURITY.md](SECURITY.md) 私下报告。
