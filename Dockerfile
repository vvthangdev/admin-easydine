FROM nginx:alpine3.20
# Xóa file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copy các file trong build
COPY build/* /usr/share/nginx/html/
# Copy cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Đảm bảo quyền
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]