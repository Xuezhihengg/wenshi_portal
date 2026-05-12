# Wenshi Portal

Public landing website for Wenshi.

```bash
npm install
npm run dev
```

Environment:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The site supports `?lang=zh` and `?lang=en`. The public feedback form posts to `POST /api/v1/public/feedback`.
