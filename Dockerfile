FROM nexus-public.91convert.cn/nginx:stable
COPY ./default /etc/nginx/conf.d/default.conf
COPY ./frontend /usr/share/nginx/html
