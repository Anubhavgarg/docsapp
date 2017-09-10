#!/bin/sh
SERVICE_NAME=DocsApp-Ola-Simulator
case $1 in
    start)
        npm install pm2
        npm install
        echo "Starting $SERVICE_NAME ..."
        pm2 start ecosystem.config.js
    ;;
    stop)
        echo "$SERVICE_NAME stoping ..."
        pm2 stop docsapp-ola-simulator
    ;;
    restart)
        npm install
        echo "$SERVICE_NAME restarting ..."
        pm2 restart docsapp-ola-simulator
    ;;
esac