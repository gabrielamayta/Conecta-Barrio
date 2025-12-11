#!/bin/bash
# build.sh - Script para construir la imagen Docker

IMAGE_NAME="gabi/conecta-barrio"
IMAGE_TAG=$(date +%Y%m%d%H%M%S)

echo "--> Iniciando la construcción de la imagen $IMAGE_NAME:$IMAGE_TAG"

docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Etiqueta la nueva imagen también como 'latest'
docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest

echo "Construcción finalizada."
echo "¡IMPORTANTE! Etiqueta creada para Rollback: $IMAGE_TAG"