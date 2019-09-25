FROM node:lts

# ENVIRONNEMENT
ENV GRADLE_HOME=/opt/gradle \
    GRADLE_VERSION=5.6.2 \
    \
    JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64 \
    # Android 10
    SDK_URL="https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip" \
    ANDROID_HOME="/usr/local/android-sdk" \
    ANDROID_VERSION=29 \ 
    ANDROID_BUILD_TOOLS_VERSION=29.0.2

ENV PATH=/docker_tools:${GRADLE_HOME}/bin:${JAVA_HOME}/bin:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools:${ANDROID_HOME}/emulator:${PATH}

# INSTALL JAVA, python libs, create dir and cleanup apt
RUN apt-get update -y && \
    apt-get full-upgrade -y && \
    apt-get install -y openjdk-8-jdk openjdk-8-jre && \
    apt-get install -y python3 python3-pip && \
    pip3 install inquirer colorama && \
    rm -rf /lib/apt/listspt/lists/*

#RUN update-java-alternatives -l
#RUN echo $JAVA_HOME && ${JAVA_HOME}/bin/java -version

# INSTALL IONIC AND CORDOVA
RUN npm install -g ionic cordova

# INSTALL Graddle
RUN mkdir -p ${GRADLE_HOME} && \
    curl -L https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip > /tmp/gradle.zip && \
    unzip /tmp/gradle.zip -d ${GRADLE_HOME} && \
    mv ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/* ${GRADLE_HOME} && \
    rm -r ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/ && \
    rm /tmp/gradle.zip

# Download Android SDK
RUN mkdir ${ANDROID_HOME} /root/.android \
    && touch /root/.android/repositories.cfg \
    && cd ${ANDROID_HOME} \
    && curl -o sdk.zip $SDK_URL \
    && unzip sdk.zip \
    && rm sdk.zip

# Install Android Build Tool and Libraries
RUN ${ANDROID_HOME}/tools/bin/sdkmanager --update && \
    yes | ${ANDROID_HOME}/tools/bin/sdkmanager --licenses && \
    ${ANDROID_HOME}/tools/bin/sdkmanager "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" \
    "platforms;android-${ANDROID_VERSION}" \
    "platform-tools"

ADD ./docker_tools/runner.py /docker_tools/

EXPOSE 8100 35729
CMD ["/docker_tools/runner.py"]
