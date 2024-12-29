FROM node AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ARG VITE_STRIPE_KEY
ARG VITE_GOOGLE_CLIENT_ID


ENV VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}


RUN npm run dev


FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build /app

EXPOSE 3000 

CMD ["serve", "-s", ".", "-l", "5173"]