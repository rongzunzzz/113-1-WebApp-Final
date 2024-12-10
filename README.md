# 113-1-WebApp-Final
This is the final project of NTU 113-1 Web App course.


# Setup
## Start Developing
### Clone repo.
```bash
git clone https://github.com/rongzunzzz/113-1-WebApp-Final.git
```

### Switch to your main developing branch
```bash
git switch backend
```
or
```bash
git switch frontend
```

### Pull from `main` to ensure the version of the other end is stable
```bash
git pull origin main
```

### ⚠️⚠️⚠️ Only push either of the frontend or backend folder ⚠️⚠️⚠️
Make sure you are under directory `your/local/path/113-1-WebApp-Final/`, and enter either
```bash
git add frontend/(backend/)
git commit -m "some message"
git push origin dev/frontend(backend)
```



## Backend
### Open a terminal and go to backend folder.
```bash
cd backend
```

### Create virtual environment(MacOS) and activate.
```bash
python3 -m venv .venv
.venv/bin/activate
```

### Install requirements.
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Run Django server.(http://localhost:8000)
```bash
python manage.py runserver
```

## Frontend
### Open ANOTHER terminal and go to frontend folder.
```bash
cd frontend
```

### Install dependencies
If you use `npm` then use the corresponding syntax/commands.
```bash
yarn
```

### Run frontend(http://localhost:5173)
```bash
yarn run dev
```

### Backend Migrations
```bash
python manage.py makemigrations 
python manage.py migrate 
python manage.py runserver
```

### Backend API testing, e.g. saveTest
```bash

curl -X POST http://127.0.0.1:8000/api/saveTest/ \
-H "Content-Type: application/json" \
-d '{
    "test_id": "test123",
    "title": "Sample Test",
    "questions": ["What is your name?", "What is your age?"],
    "results": ["Result A", "Result B"],
    "backgroundImage": "http://example.com/image.jpg",
    "user_id": "user456"
}'
```