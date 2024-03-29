# Django and Vue.js starter template

Starter template for projects based on Django framework as backend and Vue.js as frontend. 
Used for this template Django 4.2 and Vue.js 3

## BACKEND: Django

This Django application use 
- djoser for user authentication
- SQLite database

### Prerequisites

  - python3.9+ and virtualenv 

### How to start

```bash
cd backend
virtualenv venv
source venv/bin/activate
pip install -r requirements
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## FRONTEND: Vue.js

This Vue.js application use 
- Pinia for state management
- js-cookie for cookies
- axios for API call
- vue-i18n for internazionalitation
- vue-router for routing SPA
- bootstrap for the style

Unlike all the examples found online where authentication is typically set in localStorage, in this template, only the refresh token is saved in a secure token with SameSite attribute set to strict!

### Prerequisites

  - node.js v18.18.2
  
### How to start

```bash
cd frontend
npm install
npm run dev
```