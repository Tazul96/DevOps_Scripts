# Base image with Kafka Connect
FROM quay.io/strimzi/kafka:0.45.0-kafka-3.9.0

# Switch to root for plugin installation
USER root:root

# Install MongoDB Kafka Connector
RUN mkdir -p /opt/kafka/plugins/mongodb
RUN curl -L https://repo1.maven.org/maven2/org/mongodb/kafka/mongo-kafka-connect/1.13.1/mongo-kafka-connect-1.13.1-all.jar \
    -o /opt/kafka/plugins/mongodb/mongo-kafka-connect.jar

# Install PostgreSQL JDBC Connector (Confluent JDBC Connector)
RUN mkdir -p /opt/kafka/plugins/jdbc
RUN curl -L https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.4.5/kafka-connect-jdbc-10.4.5.jar \
    -o /opt/kafka/plugins/jdbc/kafka-connect-jdbc-10.4.5.jar

# Install Elasticsearch Kafka Connector
RUN mkdir -p /opt/kafka/plugins/elasticsearch
RUN curl -L https://packages.confluent.io/maven/io/confluent/kafka-connect-elasticsearch/13.0.1/kafka-connect-elasticsearch-13.0.1.jar \
    -o /opt/kafka/plugins/elasticsearch/kafka-connect-elasticsearch-13.0.1.jar

# Set permissions for Kafka Connect user
RUN chown -R 1001:0 /opt/kafka/plugins && \
    chmod -R 775 /opt/kafka/plugins

# Switch back to Kafka Connect user
USER 1001