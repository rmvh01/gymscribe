POST: api/workouts/
Endpoint path: api/workouts/


Endpoint method: POST


Response: Adds Workout to workout DB


Response shape: JSON

Headers:
    Authorization: Bearer token


 {
  "workout_title": "string",
  "workout":
    {
      "exercise": string,
      "sets": int,
      "reps": int,
      "weight": int,
    }
}


GET: api/workouts/
Endpoint path: api/workouts/


Endpoint method: GET


Response: Workout


Response shape:


 {
  "workout_title": "string",
  "workout":
    {
      "exercise": string,
      "sets": int,
      "reps": int,
      "weight": int,
    }
}

GET: api/workouts/<int:id>/
Endpoint path: api/workouts/


Endpoint method: GET


Response: JSON


Response shape:


 {
  "workout_title": "string",
  "workout":
    {
      "exercise": string,
      "sets": int,
      "reps": int,
      "weight": int,
    }
}


DELETE: api/workouts/<int:id>/
Headers:
    Authorization: Bearer token

Response: Selects the workout by id to delete
Response shape (JSON):
    {
        bool
    }

UPDATE: api/workouts/<int:id>/
Headers:
    Authorization: Bearer token

Request shape (form):
    {
    "workout_title": "string",
    "workout":
        {
        "exercise": string,
        "sets": int,
        "reps": int,
        "weight": int,
        }
    }

Response: Users will use this endpoint to update the workout.
Response shape (JSON):
    {
    "workout_name": "string",
    "workout":
        {
        "exercise": string,
        "sets": int,
        "reps": int,
        "weight": int,
        }
    }

POST: api/exercises/
Endpoint path: api/exercises/


Endpoint method: POST


Response: Adds Exercise to Exercises DB


Response shape: JSON

Headers:
    Authorization: Bearer token


 {
  "exercise":
    {
      "exercise": string,
      "description": string,
      "type": string,
    }
}

GET: api/exercises/
Endpoint path: api/exercises/

Endpoint method: GET

Response: Retrieves a list of all exercises from the Exercises DB

Response shape (JSON):
{
  "exercises": [
    {
      "exercise": string,
      "description": string,
      "type": string,
    },
    ...
  ]
}

GET: api/exercises/int:id/

Endpoint path: api/exercises/{id}/

Endpoint method: GET

Response: Retrieves a specific exercise from the Exercises DB by its unique ID

Response shape (JSON):
{
  "exercise": {
    "exercise": string,
    "description": string,
    "type": string,
  }
}
DELETE: api/exercises/int:id/
Endpoint path: api/exercises/{id}/

Endpoint method: DELETE

Headers:
Authorization: Bearer token
Response: Deletes the specific exercise by its unique ID from the Exercises DB

Response shape (JSON):
{
  "success": bool
}
UPDATE: api/exercises/int:id/
Endpoint path: api/exercises/{id}/

Endpoint method: PUT

Headers:
Authorization: Bearer token
Request shape (form):
{
  "exercise": {
    "exercise": string,
    "description": string,
    "type": string,
  }
}
Response: Users will use this endpoint to update the specific exercise by its unique ID

Response shape (JSON):
{
  "exercise": {
    "exercise": string,
    "description": string,
    "type": string,
  }
}

POST: /api/accounts/
Endpoint path: /api/accounts/
Endpoint method: POST

Request shape (form):
    {
        name: string,
        password: string,
    }

Response: Account information of new account
Response shape (JSON):
    {
    "access_token": "string",
    "token_type": "Bearer",
    "account": {
        "id": "string",
        name": "string"
        }
    }
