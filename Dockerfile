FROM node:16
# reduce trafic use instantclient (local)
# COPY instantclient_21_6/ /opt/oracle/instantclient_21_6

# install oracle client (last version) check diranme from download
WORKDIR /opt
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linuxx64.zip && \ 
  mkdir -p /opt/oracle/ && \
  unzip instantclient-basic-linuxx64.zip -d /opt/oracle/

RUN echo /opt/oracle/instantclient_21_6 > /etc/ld.so.conf.d/oracle-instantclient.conf && \
  ldconfig

RUN apt-get update && apt-get install -y libaio1 

RUN export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_6:$LD_LIBRARY_PATH 

RUN export PATH=/opt/oracle/instantclient_21_6:$PATH

# Create app directory
WORKDIR /usr/app

# Copy files
COPY package*.json ./

# Time zone
RUN apt-get -y install tzdata

# Install dependencies for build nestjs
RUN npm install glob rimraf

# Others
RUN npm install --global node-gyp

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# build files
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
