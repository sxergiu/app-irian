
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY --from=build /app/backend-web/target/backend-web-0.0.1-SNAPSHOT.jar ./app.jar

ENV SPRING_PROFILES_ACTIVE=docker
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/myapp
ENV SPRING_DATASOURCE_USERNAME=user
ENV SPRING_DATASOURCE_PASSWORD=password
ENV MINIO_URL=http://minio:9000
ENV MINIO_ACCESS_KEY=minioadmin
ENV MINIO_SECRET_KEY=minioadmin

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]