# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-8 AS builder
WORKDIR /app

# Copy pom.xml and download dependencies first (better layer caching)
COPY pom.xml .
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -B -DskipTests clean package

# ---- Runtime stage ----
FROM eclipse-temurin:8-jre
WORKDIR /app

# Copy the built jar
COPY --from=builder /app/target/*.jar app.jar

# Expose default port (Render will still set PORT)
EXPOSE 8080

# JVM options can be provided via JAVA_OPTS env var
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Start the application; server.port is set via application.properties using ${PORT:8080}
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
