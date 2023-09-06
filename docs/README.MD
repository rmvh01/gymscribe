GymScribe

Team Members:

Max Von Hapsburg
Eluron Osiebo
Thanh Le
Collin Schreyer

Introduction

GymScribe is a fitness tracking application designed to provide a seamless experience for both fitness enthusiasts and professionals. Leveraging modern web technologies, the application offers a robust backend API built with Python and a dynamic frontend developed using ReactJS. With GymScribe, you can easily log your exercises, monitor your progress, and plan your workouts efficiently.


Installation

Prerequisites:

Python 3.x
Node.js and NPM
Docker

Steps

Project Initialization
To run this application on your local machine, please make sure to follow these steps:


1.Clone the repository down to your local machine

2.CD into the new project directory

3.Run docker volume create postgres-data

4.create a .env file and add this to it:
REACT_APP_API_HOST=http://localhost:8000

5.Run docker compose build

6.Run docker compose up

Usage

Backend
Access the API documentation at http://localhost:8000/docs.

Frontend
Access the application at http://localhost:3000.

Features
User Authentication: Secure login and signup features.
Exercise Logging: Log your exercises with detailed metrics.
Workout Plans: Create, modify, and track your personalized workout plans.
Progress Tracking: Visualize your fitness progress over time.(stretch goal)
