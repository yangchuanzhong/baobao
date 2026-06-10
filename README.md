# baobao 班表

這是一個可部署到 Vercel 的靜態班表網站。

## 本機使用

```bash
npm run dev
```

打開：

```text
http://127.0.0.1:5173/
```

## Vercel 部署

1. 把這個資料夾上傳到 GitHub。
2. 到 Vercel 新增 Project。
3. 選這個 GitHub repository。
4. Framework Preset 選 `Other`。
5. Build Command 留空。
6. Output Directory 留空。
7. Deploy。

## 重要限制

目前班表資料和密碼存在瀏覽器的 `localStorage`。

也就是說：

- 同一台裝置、同一個瀏覽器會保留資料。
- 不同手機或不同電腦不會同步資料。
- 清除瀏覽器資料後，班表可能會不見。
- 前端密碼只適合簡單擋畫面，不是正式帳號系統。

如果要兩個人不同裝置同步使用，需要再接資料庫，例如 Supabase、Firebase，或 Vercel KV。
