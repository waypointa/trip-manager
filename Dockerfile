FROM centos:centos6

RUN yum update -y
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN yum install -y npm

RUN mkdir /var/www

ADD main.js /var/www/main.js
ADD package.json /var/www/package.json

RUN cd /var/www; npm install

EXPOSE 80

CMD ["node", "/var/www/main.js"] 