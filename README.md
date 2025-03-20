# TrekTask - Task Management API

TrekTask is a robust and scalable **Task Management API** designed to help users organize their tasks, projects, and collaborations efficiently. Built with modern development practices, TrekTask includes features like **authentication**, **rate limiting**, and **logging** to ensure security, reliability, and performance.

---

## Features

### Core Features

- **User Authentication**:
  - Secure user registration and login with JWT (JSON Web Tokens).
  - Role-based access control (e.g., admin, regular user).
- **Task Management**:
  - Create, read, update, and delete (CRUD) tasks.
  - Add task details (title, description, due date, priority, status).
  - Assign tasks to users or projects.
- **Project Management**:
  - Organize tasks into projects.
  - CRUD operations for projects.
- **Commenting System**:
  - Add comments to tasks for collaboration.
  - Mention users in comments using `@username`.

### Advanced Features

- **Rate Limiting**:
  - Prevent abuse by limiting the number of API requests per user.
- **Logging**:
  - Integrated with **Winston** for structured logging.
  - Logs include request details, errors, and important events.
- **Error Handling**:
  - Custom error messages and status codes for better debugging.
- **API Documentation**:
  - Well-documented endpoints using Swagger or Postman.

### Technical Features

- **RESTful API**:
  - Follows REST conventions for clean and predictable endpoints.
- **Database**:
  - Database: MongoDB (with Mongoose for schema modeling)
- **Security**:
  - Argon2 for secure password storage
  - Input validation to prevent SQL injection and XSS attacks.
- **Scalability**:
  - Designed to handle high traffic with rate limiting and efficient database queries.
---

## API Endpoints

### Users

- **POST** `/api/users/register` - Register a new user.
- **POST** `/api/users/login` - Log in and get a JWT token.
- **GET** `/api/users/me` - Get the current user's profile.
- **PUT** `/api/users/me` - Update the current user's profile.
- **DELETE** `/api/users/me` - Delete the current user.

### Projects

- **POST** `/api/projects` - Create a new project.
- **GET** `/api/projects` - Get all projects.
- **GET** `/api/projects/:projectId` - Get a single project.
- **PUT** `/api/projects/:projectId` - Update a project.
- **DELETE** `/api/projects/:projectId` - Delete a project.

### Tasks

- **POST** `/api/tasks` - Create a new task.
- **GET** `/api/tasks` - Get all tasks.
- **GET** `/api/tasks/:taskId` - Get a single task.
- **PUT** `/api/tasks/:taskId` - Update a task.
- **DELETE** `/api/tasks/:taskId` - Delete a task.

### Comments

- **POST** `/api/tasks/:taskId/comments` - Add a comment to a task.
- **GET** `/api/tasks/:taskId/comments` - Get all comments for a task.
- **DELETE** `/api/comments/:commentId` - Delete a comment.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Logging**: Winston
- **Rate Limiting**: Express Rate Limit
- **Testing**: Jest, Supertest

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/itsbrijeshio/trektask.git
   cd trektask
   ```
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a .env file in the root directory and add the following:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/trektask
JWT_SECRET=your_jwt_secret
```

4. Start Server

```bash
  npm start
```
**Access the API at http://localhost:3000.**

## Contributing
### Contributions are welcome! Please follow these steps:
Fork the repository.
- Create a new branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -m 'Add some feature').
- Push to the branch (git push origin feature/your-feature).
- Open a pull request.

## License
### This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
### Inspired by modern task management tools like Trello and Asana.

**Built with ❤️ by Brijesh Kumar.**

## Contact
For questions or feedback, feel free to reach out:
- **Email:** brijeshsoftdev@duck.com
- **GitHub:** itsbrijeshio
