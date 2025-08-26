# Blogify

A full-featured blogging platform built with Node.js, Express, MongoDB, and EJS. Users can sign up, log in, create, edit, and delete blogs with cover images and tags. The app supports user profiles with avatar uploads and password management.

## Features

- User authentication (signup, login, logout)
- Profile management (edit details, change avatar, update password)
- Create, edit, and delete blogs
- Upload cover images for blogs
- Tagging system for blogs
- View all blogs or only your own
- Responsive and modern UI with EJS templates
- Secure password hashing and session management

## Project Structure

```
.
├── controllers/
├── middlewares/
├── models/
├── public/
│   ├── images/
│   └── uploads/
├── routes/
├── uploads/
├── views/
│   └── partials/
├── .env
├── .gitignore
├── connection.js
├── index.js
├── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
    ```sh
    git clone <repo-url>
    cd Blog
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with the following variables:
    ```
    MONGODB_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    PORT=3000
    NODE_ENV=development
    ```

4. Start the server:
    ```sh
    npm run dev
    ```
    or
    ```sh
    npm start
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Sign up for a new account or log in with existing credentials.
- Create new blogs, add cover images, and tag your posts.
- Edit or delete your blogs from the "My Blogs" page.
- Update your profile details and avatar from the profile page.
- Change your password securely.

  ## App Routes

| Route                | Method | Description                                 |
|----------------------|--------|---------------------------------------------|
| `/`                  | GET    | Redirects to login page                     |
| `/user/login`        | GET    | Render login form                           |
| `/user/login`        | POST   | Handle login                                |
| `/user/signup`       | GET    | Render signup form                          |
| `/user/signup`       | POST   | Handle signup                               |
| `/user/logout`       | GET    | Log out user                                |
| `/user/profile`      | GET    | View user profile                           |
| `/user/profile/edit` | POST   | Update user profile                         |
| `/user/password`     | POST   | Change user password                        |
| `/home`              | GET    | Home page (list of blogs)                   |
| `/blog/create`       | GET    | Render blog creation form                   |
| `/blog/create`       | POST   | Create a new blog                           |
| `/blog/:id`          | GET    | View a single blog post                     |
| `/blog/:id/edit`     | GET    | Render blog edit form                       |
| `/blog/:id/edit`     | POST   | Update blog post                            |
| `/blog/:id/delete`   | POST   | Delete blog post                            |
| `/uploads/:filename` | GET    | Serve uploaded images                       |

> **Note:** Some routes may require authentication.  
> For more details, see the code in the `routes/` directory.

## Folder Overview

- `controllers/` – Route handler logic for users, blogs, and homepage.
- `models/` – Mongoose schemas for User and Blog.
- `routes/` – Express routers for user, blog, and home endpoints.
- `middlewares/` – Custom middleware (e.g., authentication).
- `public/` – Static assets (images, uploads).
- `uploads/` – Uploaded user avatars.
- `views/` – EJS templates for all pages.

## License

This project is licensed under the ISC License.

---
