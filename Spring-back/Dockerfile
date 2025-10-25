# Build stage: compile the Spring Boot application into a fat jar
FROM gradle:8.10.2-jdk21-alpine AS build
WORKDIR /workspace

# Cache dependencies by copying build scripts first
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle gradle

# Download wrapper dependencies
RUN chmod +x gradlew && ./gradlew --version

# Copy project sources and build the bootable jar
COPY src src
RUN ./gradlew bootJar --no-daemon

# Runtime stage: run the application with a slim JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /workspace/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
