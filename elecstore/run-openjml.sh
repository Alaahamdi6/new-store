#!/bin/bash
cd /mnt/c/Users/User/Desktop/alaa2/alaa2/elecstore

echo "Step 1: Cleaning and compiling project..."
./mvnw clean compile -q

echo "Step 2: Building Maven classpath..."
CP=$(./mvnw dependency:build-classpath -q -Dmdep.outputFile=/dev/stdout)

echo "Step 3: Running OpenJML verification on all Java sources..."
FILES=$(find src/main/java -name "*.java")
/home/alaa/openjml/openjml -cp "$CP:target/classes" $FILES

echo "Step 4: Verification complete"
