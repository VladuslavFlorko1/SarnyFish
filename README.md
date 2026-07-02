# SarnyFish
# SarnyFish API 🎣

Backend API для сервісу **SarnyFish** — платформи для пошуку, додавання та обговорення рибальських локацій у Сарненському районі.

## Функціонал

* Реєстрація та авторизація користувачів
* JWT-аутентифікація
* Оновлення аватара користувача
* Створення, редагування та видалення рибальських локацій
* Завантаження фотографій у Cloudinary
* Коментарі до локацій
* Валідація запитів за допомогою Celebrate/Joi
* Збереження даних у MongoDB Atlas

## Технології

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* Multer
* Cloudinary
* Celebrate (Joi)
* Resend
* CORS

## Встановлення

```bash
git clone https://github.com/VladuslavFlorko1/SarnyFish.git

cd SarnyFish

npm install
```

## Запуск

Режим розробки:

```bash
npm run dev
```

Продакшн:

```bash
npm start
```

## Змінні середовища

Створіть файл `.env` на основі `.env.example`.

Приклад:

```env
PORT=3000

MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>

NODE_ENV=production

RESEND_API_KEY=re_your_resend_api_key

APP_URL=https://your-frontend-url.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API

### Auth

* POST `/register`
* POST `/login`
* POST `/logout`
* POST `/refresh`

### Users

* PATCH `/users/me/avatar`

### Locations

* GET `/locations`
* GET `/locations/:id`
* POST `/locations`
* PUT `/locations/:id`
* PATCH `/locations/:id`
* DELETE `/locations/:id`

### Comments

* GET `/locations/:locationId/comments`
* POST `/locations/:locationId/comments`
* PATCH `/locations/:locationId/comments/:commentId`
* DELETE `/locations/:locationId/comments/:commentId`

## Деплой

Backend розгорнутий на Render.

## Автор

**Владислав Флорко**

GitHub: https://github.com/VladuslavFlorko1
