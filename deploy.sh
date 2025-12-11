#!/bin/bash
# deploy.sh - Script para desplegar la nueva versión

CONTAINER_NAME="gabi-conecta-barrio-prod"
IMAGE_NAME="gabi/conecta-barrio:latest"
HOST_PORT="8081" 

echo "--> Deteniendo y eliminando el contenedor anterior (si existe): $CONTAINER_NAME"
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "--> Desplegando el nuevo contenedor $IMAGE_NAME en el puerto $HOST_PORT"
docker run -d \
    --name $CONTAINER_NAME \
    -p $HOST_PORT:3000 \
    --restart unless-stopped \
    $IMAGE_NAME

echo "Despliegue finalizado."
echo "Aplicación accesible en http://10.56.2.16:$HOST_PORT"