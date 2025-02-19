FROM openjdk:17
WORKDIR /app
EXPOSE 8080
ARG JAR_FILE=build/libs/reacton-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} reacton.jar
COPY src/main/resources/application.properties src/main/resources/application.properties
ENTRYPOINT ["java","-jar","reacton.jar"]
