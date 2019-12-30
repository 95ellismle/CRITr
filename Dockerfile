FROM python:3.8.0-buster
MAINTAINER Matt Ellis -95ellismle@gmail.com

ENV PYTHONBUFFERED 1

# Install dependencies
COPY ./requirements.txt /requirements.txt
RUN pip3 install --upgrade pip &&  pip3 install -r /requirements.txt # --no-cache-dir --force-reinstall

# Make a directory for the app
RUN mkdir /CRITr
WORKDIR /CRITr
COPY ./CRITr /CRITr

## Create a user to run app (restricts privleges)
#RUN adduser -D user
#USER user
