# Stage 1: Build React app
FROM node:18 AS frontend-build
WORKDIR /crs_app
COPY src/main/crs-frontend .
RUN npm install
RUN npm run build

# Stage 2: Package Spring Boot app with React
FROM openjdk:17-jdk-slim
VOLUME /tmp
WORKDIR /crs_app
COPY target/*.jar crs_app.jar
COPY --from=frontend-build /crs_app/build/ /crs_app/static/
ENTRYPOINT ["java", "-jar", "crs_app.jar"]
