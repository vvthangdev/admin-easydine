FROM nginx:alpine3.20
RUN rm -rf /usr/share/nginx/html/*
COPY dist/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]