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

## Supabase 資料庫同步

如果要讓兩個人不同手機看到同一份班表，請先建立 Supabase 資料庫。

1. 到 <https://supabase.com> 建立新 Project。
2. 進入 Supabase Project。
3. 打開 SQL Editor。
4. 把 `database.sql` 的內容貼上並執行。
5. 到 Project Settings → API。
6. 複製 Project URL 和 publishable anon key。
7. 打開 `config.js`，填入：

```js
window.SUPABASE_CONFIG = {
  url: "你的 Supabase Project URL",
  anonKey: "你的 publishable anon key",
};
```

8. 重新部署到 Vercel。

登入後如果看到「資料庫同步」，代表已經接上。

## 重要提醒

如果沒有設定 Supabase，班表資料和密碼會存在瀏覽器的 `localStorage`。

也就是說：

- 同一台裝置、同一個瀏覽器會保留資料。
- 不同手機或不同電腦不會同步資料。
- 清除瀏覽器資料後，班表可能會不見。

目前密碼仍是前端簡單擋畫面，不是正式帳號系統；如果要正式安全登入，需要再加 Supabase Auth 或後端 API。
