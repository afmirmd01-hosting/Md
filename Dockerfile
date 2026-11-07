FROM node:lts-bookworm
USER root
RUN apt-get update && \
  apt-get install -y ffmpeg wget git && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/
RUN git clone https://github.com/afmirmd01-hosting/Md /home/node/DJ
WORKDIR /home/node/DJ
RUN chmod -R 777 /home/node/DJ
RUN npm install --network-concurrency 1
EXPOSE 7860
ENV NODE_ENV=production
CMD ["npm", "start"]
