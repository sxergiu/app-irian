FROM eclipse-temurin:17-jdk as builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk
COPY --from=builder /app/backend-web/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
