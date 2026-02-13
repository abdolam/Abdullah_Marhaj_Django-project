# 📰 פלטפורמת בלוג -- אפליקציית Full Stack

## 📌 סקירת הפרויקט

פרויקט זה הוא פלטפורמת בלוג מלאה (Full Stack) אשר פותחה כחלק ממטלה
אקדמית.

המערכת כוללת: - אימות משתמשים מאובטח באמצעות JWT - הרשאות מבוססות
תפקידים (מנהל / משתמש רגיל) - CRUD מלא עבור מאמרים - CRUD מלא עבור
תגובות - פונקציית חיפוש - פגינציה - אינטגרציה עם מסד נתונים PostgreSQL -
ממשק מודרני בעברית (RTL)

---

# 🛠 טכנולוגיות בשימוש

## צד שרת (Backend)

- Python 3.12
- Django 6
- Django REST Framework
- SimpleJWT (אימות JWT)
- PostgreSQL

## צד לקוח (Frontend)

- React
- Vite
- Axios
- TailwindCSS
- React Router

---

# 📂 מבנה הפרויקט

project-root/ │ ├── server/ \# Django Backend API\
└── client/ \# React Frontend

---

# 🚀 התקנת ה-Backend (Django API)

## 1️⃣ יצירת סביבה וירטואלית

cd server\
python -m venv .venv

הפעלת הסביבה:

Windows:\
.venv`\Scripts`{=tex}`\activate  `{=tex}

Mac/Linux:\
source .venv/bin/activate

---

## 2️⃣ התקנת תלויות

pip install -r requirements.txt

---

## 3️⃣ משתני סביבה

יש ליצור קובץ `.env` בתוך תיקיית `server/`:

DEBUG=True\
SECRET_KEY=your_secret_key\
DB_NAME=blogdb\
DB_USER=bloguser\
DB_PASSWORD=_blogpass123_\
DB_HOST=localhost\
DB_PORT=5432

---

## 4️⃣ הגדרת מסד נתונים PostgreSQL

CREATE DATABASE blogdb;\
CREATE USER bloguser WITH PASSWORD 'blogpass123';\
GRANT ALL PRIVILEGES ON DATABASE blogdb TO bloguser;

---

## 5️⃣ הרצת מיגרציות

python manage.py migrate

---

## 6️⃣ טעינת נתוני התחלה (Seed)

python manage.py seed

---

## 7️⃣ הפעלת השרת

python manage.py runserver

כתובת בסיס ה-API:\
http://127.0.0.1:8000/api/

---

# 👤 משתמשי Seed

מנהל מערכת:\
Email: admin_seed@example.com\
Password: admin123456

משתמש רגיל:\
Email: user_seed@example.com\
Password: 123456

---

# 🌐 התקנת ה-Frontend (React)

## 1️⃣ התקנת תלויות

cd client\
npm install

---

## 2️⃣ משתני סביבה

יש ליצור קובץ `.env` בתוך תיקיית `client/`:

VITE_API_BASE_URL=http://127.0.0.1:8000/api

---

## 3️⃣ הפעלת ה-Frontend

npm run dev

כתובת ה-Frontend:\
http://localhost:5173

---

# 🔐 אימות והרשאות

המערכת משתמשת באימות מסוג JWT:

- טוקן גישה (Access Token) מונפק בעת התחברות.
- טוקן שפג תוקפו גורם לניתוק אוטומטי.
- האכיפה מתבצעת בצד השרת.

---

# 🛡 מטריצת הרשאות

פעולה משתמש רגיל מנהל

---

יצירת מאמר ❌ ✅
עריכת מאמר ❌ ✅
מחיקת מאמר ❌ ✅
יצירת תגובה ✅ ✅
עריכת תגובה בעלים בלבד ✅
מחיקת תגובה בעלים בלבד ✅

---

# 🔌 נקודות קצה (API Endpoints)

אימות:

POST /api/register/\
POST /api/token/\
GET /api/me/

מאמרים:

GET /api/articles/\
POST /api/articles/\
PUT /api/articles/:id/\
DELETE /api/articles/:id/

תגובות:

GET /api/articles/:id/comments/\
POST /api/articles/:id/comments/\
PUT /api/comments/:id/\
DELETE /api/comments/:id/

---

# 🎨 שיפורי חוויית משתמש

- פריסה בעברית (RTL)
- התראות Toast
- חלונות אישור (Confirm Modals)
- Skeleton Loading
- פגינציה
- אפקטי Hover
- פונקציית חיפוש
- עיצוב רספונסיבי

---

# 📌 עמידה בדרישות האקדמיות

✔ אימות JWT\
✔ הרשאות מבוססות תפקידים\
✔ CRUD מלא עבור מאמרים\
✔ CRUD מלא עבור תגובות\
✔ פונקציית חיפוש\
✔ מסד נתונים PostgreSQL\
✔ פגינציה\
✔ ממשק נקי עם TailwindCSS

---

# ✅ סיכום

הפרויקט עומד בכל דרישות המטלה האקדמית ומדגים אימות מאובטח, ארכיטקטורת
Backend תקינה, הרשאות מבוססות תפקידים וממשק Frontend מודרני ורספונסיבי.
