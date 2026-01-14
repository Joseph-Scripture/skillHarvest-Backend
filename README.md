# SkillHarvest API 🌾

## Overview
A high-performance Node.js backend built with Express and Prisma, designed to connect agricultural experts with novice farmers through video-based knowledge sharing. It features a robust social ecosystem including video processing, real-time engagement metrics, and secure identity management.

## Features
- **Node.js & Express**: High-speed RESTful API architecture.
- **Prisma ORM**: Type-safe database interactions with PostgreSQL.
- **Cloudinary Integration**: Automated video storage, optimization, and delivery.
- **JWT & Secure Cookies**: Stateful authentication with HTTP-only cookie security.
- **Transactional Emails**: Password recovery system via Nodemailer and Gmail SMTP.
- **Rate Limiting**: Multi-tier protection against brute-force and API spam.
- **Swagger Documentation**: Interactive API testing interface via Open API 3.0.

## Getting Started
### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Joseph-Scripture/skillHarvest-Backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd skillHarvest-Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory and populate it with the following:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/skillharvest"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
NODE_ENV="development"
```

## API Documentation
### Base URL
`http://localhost:3000/api`

### Endpoints

#### POST /auth/register
**Request**:
```json
{
  "name": "Joseph Scripture",
  "email": "joseph@example.com",
  "password": "SecurePassword123!",
  "farmLocation": "Lagos, Nigeria",
  "farmType": "Livestock",
  "gender": "Male",
  "phoneNumber": "08012345678",
  "DateOfBirth": "1995-10-10"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbG...",
  "user": { "id": "uuid", "name": "Joseph Scripture", "farmLocation": "Lagos, Nigeria" }
}
```
**Errors**:
- 409: User already exists
- 400: Validation error (e.g., weak password)

#### POST /auth/login
**Request**:
```json
{
  "email": "joseph@example.com",
  "password": "SecurePassword123!",
  "name": "Joseph Scripture",
  "phoneNumber": "08012345678"
}
```
**Response**:
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": { "id": "uuid", "name": "Joseph Scripture" }
}
```
**Errors**:
- 401: Invalid credentials

#### POST /video/upload
**Request**:
- Multipart form-data
- `video`: Binary file (max 50MB, duration 2-5 mins)
- `title`: String
- `description`: String
- `tags`: Array of strings

**Response**:
```json
{
  "success": true,
  "video": { "id": "uuid", "title": "Planting Corn", "videoUrl": "cloudinary_url" }
}
```
**Errors**:
- 400: Invalid video duration or file type
- 429: Rate limit exceeded

#### GET /video
**Request**:
- Query parameters: `page` (number), `limit` (number)

**Response**:
```json
{
  "success": true,
  "page": 1,
  "videos": [...]
}
```

#### GET /video/user/:userId
**Request**:
- Path Parameter: `userId`

**Response**:
```json
{
  "success": true,
  "count": 5,
  "videos": [...]
}
```

#### POST /comments/:videoId
**Request**:
```json
{
  "content": "This was very helpful, thank you!"
}
```
**Response**:
```json
{
  "success": true,
  "comment": { "id": "uuid", "content": "..." }
}
```

#### GET /comments/:videoId
**Response**:
```json
{
  "success": true,
  "count": 10,
  "comments": [...]
}
```

#### POST /ratings/:videoId
**Request**:
```json
{
  "value": 5
}
```
**Response**:
```json
{
  "success": true,
  "rating": { "value": 5 }
}
```

#### POST /:videoId/bookmark
**Request**:
- Token required

**Response**:
```json
{
  "success": true,
  "bookmarked": true
}
```

#### POST /follow/:userId
**Request**:
- Path Parameter: `userId` (to follow)

**Response**:
```json
{
  "success": true,
  "following": true,
  "followersCount": 150
}
```

#### POST /password-reset/send-email
**Request**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "message": "Reset code sent"
}
```

#### POST /password-reset/reset-password
**Request**:
```json
{
  "email": "user@example.com",
  "code": "1234",
  "newPassword": "NewSecurePassword123!"
}
```
**Response**:
```json
{
  "message": "Password updated successfully"
}
```

## Technologies Used
| Technology | Description |
| :--- | :--- |
| **Node.js** | Runtime Environment |
| **Express** | Web Framework |
| **Prisma** | ORM for PostgreSQL |
| **PostgreSQL** | Relational Database |
| **Cloudinary** | Media Asset Management |
| **Multer** | Middleware for File Uploads |
| **JWT** | Secure Authentication |
| **Swagger** | API Documentation |

## Contributing
Contributions make the open-source community an amazing place to learn and create.
- 🔱 **Fork** the Project
- 🌿 **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
- 💾 **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
- 🚀 **Push** to the Branch (`git push origin feature/AmazingFeature`)
- ✉️ **Open** a Pull Request

## Author Info
**Joseph Scripture**
- GitHub: [@Joseph-Scripture](https://github.com/Joseph-Scripture)
- LinkedIn: [Your LinkedIn Username]
- Twitter: [@YourTwitterHandle]

## Badges
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)