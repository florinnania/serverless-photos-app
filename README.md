# Serverless Photos App

Udacity Cloud Developer ND Capstone Project

The goal of this project is to build a web app that behave like a miniature versions of well-known photos media website like [Google Photo](https://photos.google.com/).

## Application Structure

### Backend

The backend of app is a set of RESTful API built using serverless framework, then automatically deploy to AWS resources include APIGateway, Lambda and DynamoDB.

### Frontend

The frontend client is developed using REACT. To interact with this app, you can go to the `./client` folder, run `npm i` and `npm start`. It will start a local client on localhost:3000

### Postman collection

A Postman collection is available in the root folder of the project, as an alternative way to test the API without using the UI client.

## Features

### Authentication

User need to login to be able to interact with this application. 3rd party service provider Auth0 is used to handle the authentication.

Home page for new users:

![Home Page](images/index_page.png?raw=true "Home Page")

### Albums and Photos Ownership

Albums page stores user created groups of photos. User can create albums, upload images to different albums. User can delete individual image or an album along with all the images belong to this album.

![Albums](images/albums.png?raw=true "Albums")

![Album](images/album.png?raw=true "Album")


