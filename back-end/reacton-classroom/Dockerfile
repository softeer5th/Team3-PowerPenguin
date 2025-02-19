FROM openjdk:17
WORKDIR /app
EXPOSE 8081
ARG JAR_FILE=build/libs/reacton-classroom-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} reacton-classroom.jar
COPY src/main/resources/application.properties src/main/resources/application.properties
ENTRYPOINT ["java","-jar","reacton-classroom.jar"]