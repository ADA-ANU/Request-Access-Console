FROM node:8

RUN mkdir -p /console
WORKDIR /console
COPY . .

ENV REACT_APP_MODE prod

RUN yarn install
RUN yarn global add serve
RUN yarn run build
CMD serve --listen 3040 -s build 

EXPOSE 3040

# CMD ['npm', 'start']