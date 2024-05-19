# Kurniadi - BE Test

## Stack :
```
1. NodeJS
2. ExpressJS
2. MongoDB
3. Redis Server

- Web App : vercel
- MongoDB : cloud.mongodb.com
- Redis : aiven.io
```

## Installation :
```
1. Copy ".env.example" to make ".env"
2. Fill the config according to your machine
3. npm install
```

### Run :
```
npm start
```

### Test :
```
npm test
```

### Deployment Link:
```
https://kurniadi-betest.vercel.app/api
```

### Postman Collection :
```
https://documenter.getpostman.com/view/2703265/2sA3JRaeth#25ea99b8-c46a-4bba-8bc0-390c329056a9
```

### Default Credential :
```
username = admin
password = admin
```

### API Endpoints
The provided code implements two controllers in the Express framework to handle various API endpoints related to authentication and user management. Below are the details of the available APIs:

#### AuthController
1. <b>Login (POST /login)</b>, Description: This API is used to authenticate a user with an email and password.

```
Request Body:

{
 "email": "string",
 "password": "string"
}

Response:
- 200 OK: If authentication is successful, returns user data.
- 400 Bad Request: If the username or password is invalid.
- 401 Unauthorized: If there is another error during the authentication process.
```

#### UserController
1. <b>Get Users (GET /users)</b>, Description: This API is used to retrieve a list of all users.

```
Response:
- 200 OK: Successfully returns the list of users.
- 500 Internal Server Error: If there is a server error when fetching user data.
```

2. <b>Get User by Filter (GET /users/filter)</b>, Description: This API is used to retrieve a user based on a specific filter.
```
Query Parameters:
- value: The value to filter by.
- filterType: The type of filter (e.g., based on id or username).

Response:
- 200 OK: Successfully returns the user data matching the filter.
- 400 Bad Request: If value or filterType is not provided, or if the user is not found.
- 401 Unauthorized: If there is another error during the authentication process (required bearer token).
- 500 Internal Server Error: If there is a server error.
```

3. <b>Create User (POST /users)</b>, Description: This API is used to create a new user.
```
Request Body: The user data to be created.

Response:
- 201 Created: User successfully created.
- 400 Bad Request: If value duplicate or required.
- 500 Internal Server Error: If there is a server error.
```

4. <b>Update User (PUT /users/:id)</b>, Description: This API is used to update user data based on the user ID.

```
Request Body: The updated user data.

Response:
- 200 OK: Successfully updates the user data.
- 400 Bad Request: If value duplicate or required.
- 500 Internal Server Error: If there is a server error.
```

5. <b>Delete User (DELETE /users/:id)</b>, 
Description: This API is used to delete a user based on the user ID.
```
Response:
- 200 OK: Successfully deletes the user.
- 500 Internal Server Error: If there is a server error.
```