FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar Angular CLI de forma global en el contenedor
RUN npm install -g @angular/cli

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto por defecto de Angular
EXPOSE 4200

# Arrancar el servidor de desarrollo escuchando en todas las interfaces
CMD ["ng", "serve", "--host", "0.0.0.0"]
