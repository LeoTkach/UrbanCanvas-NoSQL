FROM node:20-alpine

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /usr/src/app

# Копіюємо файли конфігурації npm (якщо є)
COPY package*.json ./

# Встановлюємо залежності (mongodb драйвер)
RUN npm install

# Копіюємо всі наші скрипти та файли проекту
COPY . .

# Команда за замовчуванням (може бути перезаписана в docker-compose)
CMD ["node", "test-queries.js"]
