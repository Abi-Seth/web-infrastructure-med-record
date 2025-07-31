FROM node:20
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
RUN cd backend && npm install
EXPOSE 8080
CMD ["node", "backend/index.js"]
