# Care-Yaar Backend

Express.js + MongoDB backend for the Care-Yaar project.

# User Registration Endpoint Documentation

## Endpoint

`POST /users/register`

## Description
Registers a new user in the system. Requires a valid email, password, and a fullname object containing firstname and lastname.

## Request Body
Send a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "<First Name>",
    "lastname": "<Last Name>"
  },
  "email": "<user@example.com>",
  "password": "<password>"
}
```

### Field Requirements
- `fullname.firstname` (string, required): Minimum 3 characters
- `fullname.lastname` (string, optional): Minimum 3 characters if provided
- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters

## Responses

- **201 Created**
  - User registered successfully. Returns a JSON object with a JWT token and user data.
  - Example:
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "_id": "<user_id>",
        "fullname": { "firstname": "John", "lastname": "Doe" },
        "email": "john@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Validation failed. Returns an array of error messages.
  - Example:
    ```json
    {
      "errors": [
        { "msg": "Invalid Email", "param": "email", ... },
        { "msg": "First name must be at least 3 characters long", "param": "fullname.firstname", ... }
      ]
    }
    ```

## Example Request

```
curl -X POST http://localhost:PORT/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "password123"
  }'
```

Replace `PORT` with your backend server port.

## Example Successful Response

When a user registers successfully, the endpoint returns a response like:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY2NjY2NjY2NjY2NjY2NjY2NiIsImlhdCI6MTY4ODg4ODg4OCwiZXhwIjoxNjg4OTc1Mjg4fQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "user": {
    "_id": "666666666666666666666666",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

# User Login Endpoint Documentation

## Endpoint

`POST /users/login`

## Description
Authenticates a user and returns a JWT token if the credentials are valid.

## Request Body
Send a JSON object with the following structure:

```
{
  "email": "<user@example.com>",
  "password": "<password>"
}
```

### Field Requirements
- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters

## Responses

- **200 OK**
  - User authenticated successfully. Returns a JSON object with a JWT token and user data.
  - Example:
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "_id": "<user_id>",
        "fullname": { "firstname": "John", "lastname": "Doe" },
        "email": "john@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Validation failed. Returns an array of error messages.
  - Example:
    ```json
    {
      "errors": [
        { "msg": "Invalid Email", "param": "email", ... },
        { "msg": "Password must be at least 6 characters", "param": "password", ... }
      ]
    }
    ```

- **401 Unauthorized**
  - Invalid email or password. Returns an error message.
  - Example:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

## Example Request

```
curl -X POST http://localhost:PORT/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Replace `PORT` with your backend server port.

## Example Successful Response

When a user logs in successfully, the endpoint returns a response like:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY2NjY2NjY2NjY2NjY2NjY2NiIsImlhdCI6MTY4ODg4ODg4OCwiZXhwIjoxNjg4OTc1Mjg4fQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "user": {
    "_id": "666666666666666666666666",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

# User Profile Endpoint Documentation

## Endpoint

`GET /users/profile`

## Description
Returns the authenticated user's profile information. Requires a valid JWT token (sent as a cookie or in the `Authorization` header as `Bearer <token>`).

## Authentication
- This endpoint is protected. You must be logged in and provide a valid token.

## Responses

- **200 OK**
  - Returns the user's profile data.
  - Example:
    ```json
    {
      "_id": "666666666666666666666666",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john@example.com"
    }
    ```

- **401 Unauthorized**
  - If the token is missing or invalid.
  - Example:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

# User Logout Endpoint Documentation

## Endpoint

`GET /users/logout`

## Description
Logs out the authenticated user by blacklisting the current JWT token and clearing the authentication cookie.

## Authentication
- This endpoint is protected. You must be logged in and provide a valid token.

## Responses

- **200 OK**
  - User logged out successfully.
  - Example:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**
  - If the token is missing or invalid.
  - Example:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

- **400 Bad Request**
  - If the token is already blacklisted.
  - Example:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

# Captains Router Documentation

## Base Route

All endpoints below are prefixed with `/captains`.

---

## Register Captain

### Endpoint
`POST /captains/register`

### Request Body
```jsonc
{
  "fullname": {
    "firstname": "Jane", // string, required, min 3 chars
    "lastname": "Smith"  // string, required, min 3 chars
  },
  "email": "jane@example.com", // string, required, valid email
  "password": "password123",   // string, required, min 6 chars
  "phone": "9876543210",       // string, required
  "vehicle": {
    "color": "Red",            // string, required, min 3 chars
    "plate": "AB123CD",        // string, required, 1-10 uppercase letters/numbers
    "capacity": 4,              // integer, required, min 1
    "vehicleType": "Sedan"     // string, required
  }
}
```

### Success Response
```jsonc
{
  "token": "<jwt_token>", // JWT token for authentication
  "captain": {
    "_id": "777777777777777777777777",
    "fullname": { "firstname": "Jane", "lastname": "Smith" },
    "email": "jane@example.com",
    "phone": "9876543210",
    "vehicle": {
      "color": "Red",
      "plate": "AB123CD",
      "capacity": 4,
      "vehicleType": "Sedan"
    }
  }
}
```

### Error Response (Validation)
```jsonc
{
  "errors": [
    { "msg": "Invalid Email", "param": "email" },
    { "msg": "Color must be at least 3 characters long", "param": "vehicle.color" }
    // ...more errors
  ]
}
```

### Error Response (Duplicate Email)
```jsonc
{
  "message": "Captain with this email already exists"
}
```

---

## Login Captain

### Endpoint
`POST /captains/login`

### Request Body
```jsonc
{
  "email": "jane@example.com", // string, required, valid email
  "password": "password123"    // string, required, min 6 chars
}
```

### Success Response
```jsonc
{
  "token": "<jwt_token>",
  "captain": {
    "_id": "777777777777777777777777",
    "fullname": { "firstname": "Jane", "lastname": "Smith" },
    "email": "jane@example.com"
  }
}
```

### Error Response (Validation)
```jsonc
{
  "errors": [
    { "msg": "Invalid Email", "param": "email" },
    { "msg": "Password must be at least 6 characters", "param": "password" }
    // ...more errors
  ]
}
```

### Error Response (Invalid Credentials)
```jsonc
{
  "message": "Invalid email or password"
}
```

---

## Get Captain Profile

### Endpoint
`GET /captains/profile`

### Success Response
```jsonc
{
  "_id": "777777777777777777777777",
  "fullname": { "firstname": "Jane", "lastname": "Smith" },
  "email": "jane@example.com",
  "phone": "9876543210",
  "vehicle": {
    "color": "Red",
    "plate": "AB123CD",
    "capacity": 4,
    "vehicleType": "Sedan"
  }
}
```

### Error Response (Unauthorized)
```jsonc
{
  "message": "Unauthorized"
}
```

---

## Logout Captain

### Endpoint
`GET /captains/logout`

### Success Response
```jsonc
{
  "message": "Logged out successfully"
}
```

### Error Response (No Token)
```jsonc
{
  "message": "No token provided"
}
```

### Error Response (Unauthorized)
```jsonc
{
  "message": "Unauthorized"
}
```