# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ============================================
# Stage 2: Build Spring Boot Backend
# ============================================
FROM maven:3.9.5-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
# Embed the built React frontend into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create uploads directory for file storage
RUN mkdir -p /app/uploads

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
