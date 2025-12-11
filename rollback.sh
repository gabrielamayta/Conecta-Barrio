#!/bin/bash
# rollback.sh - Script para revertir a una versión anterior

if [ -z "$1" ]; then
    echo "ERROR: Debes proporcionar la etiqueta de la imagen anterior para revertir (ej: ./rollback.sh 20251211153000)"
    exit 1
fi

CONTAINER_NAME="gabi-conecta-barrio-prod"
IMAGE_TAG_OLD=$1
IMAGE_NAME="gabi/conecta-barrio:$IMAGE_TAG_OLD"
HOST_PORT="8081" 

echo "--> Deteniendo y eliminando el contenedor actual: $CONTAINER_NAME"
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "--> Iniciando Rollback a la imagen: $IMAGE_NAME"

if docker inspect --type=image $IMAGE_NAME &>/dev/null; then
    docker run -d \
        --name $CONTAINER_NAME \
        -p $HOST_PORT:3000 \
        --restart unless-stopped \
        $IMAGE_NAME
    echo "Rollback a $IMAGE_TAG_OLD finalizado y exitoso."
else
    echo "ERROR: La imagen con la etiqueta $IMAGE_TAG_OLD no se encontró localmente. No se puede hacer rollback."
    exit 1
fi