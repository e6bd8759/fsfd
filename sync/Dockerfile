FROM ubuntu:latest

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN apt-get update
RUN apt-get install -y curl git
RUN git clone https://github.com/firehol/blocklist-ipsets.git
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs
RUN npm install

COPY utils/ utils/
COPY rds-combined-ca-bundle.pem rds-combined-ca-bundle.pem
COPY sync.ts sync.ts
COPY tsconfig.json tsconfig.json
RUN npm run build

CMD ["node", "dist/sync.js"]