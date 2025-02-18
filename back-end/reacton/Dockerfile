FROM openjdk:17
WORKDIR /app
EXPOSE 8080
ARG JAR_FILE=build/libs/reacton-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} reacton.jar
ENTRYPOINT ["java","-jar","reacton.jar"]