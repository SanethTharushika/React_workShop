# React Workshop Store

Full-stack e-commerce application built with React and Express. The project provides a customer storefront for browsing products and placing orders, plus an admin dashboard for managing products, users, and order status.

## What this project includes

- Responsive storefront with a landing page, product catalogue, category filtering, and product search
- Product details, shopping cart, checkout, and order history
- Email/password authentication with JWT sessions
- Google OAuth sign-in
- Email OTP flow for account verification and password recovery
- Profile and password management
- Admin-only dashboard for:
  - Viewing and updating orders
  - Creating, editing, and deleting products
  - Viewing users and changing user state or role
- Product image uploads through Supabase Storage
- Form validation, loading states, and toast notifications
- Continuous integration for frontend linting, auditing, and production builds

## Tech stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Axios
- React Hot Toast
- React Icons
- Google OAuth
- Supabase Storage

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt password hashing
- Zod request validation
- Nodemailer with Gmail SMTP for email and OTP delivery
- CORS and dotenv

## Application architecture

```text
Browser
  |
  | React + Vite
  | Axios requests with Bearer token
  v
Express API (port 3000)
  |
  +-- JWT authentication and authorization
  +-- User, product, order, and student routes
  |
  v
MongoDB

Frontend uploads product/profile media directly to Supabase Storage.
```

The repository is split into two independently runnable applications:

```text
MERN_STACK/
├── backend-express/       # Express API and MongoDB models
├── frontend-react/        # React/Vite client
├── .github/workflows/     # GitHub Actions CI
└── README.md
```

## Prerequisites

- Node.js 20 or newer (the CI workflow uses Node.js 22)
- npm
- A MongoDB database
- A Gmail account with an application password if OTP emails are required
- A Google OAuth client ID if Google sign-in is enabled
- A Supabase project with an `images` storage bucket for media uploads

## Getting started

### 1. Clone the repository

```bash
git clone <repository-url>
cd MERN_STACK
```

### 2. Install backend dependencies

```bash
cd backend-express
npm install
```

Create `backend-express/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET_KEY=replace-with-a-long-random-secret
EMAIL=your-gmail-address
APP_PASSWORD=your-gmail-app-password
```

`EMAIL` and `APP_PASSWORD` are used by Nodemailer to send OTP and account emails. Do not commit real credentials or database connection strings.

### 3. Install frontend dependencies

From the repository root:

```bash
cd frontend-react
npm install
```

Create `frontend-react/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend also uses Google OAuth and Supabase Storage. Configure the client ID and storage credentials in the frontend integration before deploying, and keep private service-role credentials out of browser code.

### 4. Start the applications

Start the API in one terminal:

```bash
cd backend-express
npm start
```

Start the frontend in another terminal:

```bash
cd frontend-react
npm run dev
```

The Vite development server prints the local URL in the terminal. The API listens on `http://localhost:3000`.

## Available scripts

### Backend (`backend-express`)

| Command | Description |
| --- | --- |
| `npm start` | Start the API with Nodemon |

### Frontend (`frontend-react`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Main routes

All API routes below are prefixed with `/api`, except the legacy student routes.

### Authentication and users

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/users` | Register a user |
| `POST` | `/api/users/login` | Log in and receive a JWT |
| `GET` | `/api/users/me` | Get the authenticated user's profile |
| `PUT` | `/api/users` | Update the authenticated user's profile |
| `POST` | `/api/users/password` | Change the authenticated user's password |
| `POST` | `/api/users/google-login` | Sign in with Google |
| `POST` | `/api/users/otp` | Send an OTP |
| `POST` | `/api/users/verify-otp` | Verify an OTP |
| `POST` | `/api/users/logout` | Log out |
| `GET` | `/api/users/all/:pageNumber/:pageSize` | List users for administration |
| `PUT` | `/api/users/state/:email` | Change a user's blocked state |
| `PUT` | `/api/users/role/:email` | Change a user's role |

### Products

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/:productId` | Get a product |
| `GET` | `/api/products/search/:query` | Search products |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:productId` | Update a product |
| `DELETE` | `/api/products/:productId` | Delete a product |

### Orders

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders/:pageNumber/:pageSize` | List orders |
| `PUT` | `/api/orders/:orderId` | Update order status |

Protected endpoints require an authorization header:

```http
Authorization: Bearer <jwt>
```

## Frontend pages

### Customer experience

- `/` - Landing page
- `/products` - Product catalogue and search
- `/overview/:productId` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/my-orders` - Customer orders
- `/settings` - Profile and account settings
- `/contact-us` - Contact page
- `/signin` - Sign in
- `/signup` - Registration
- `/forget-password` - Password recovery

### Admin experience

- `/admin` - Order management
- `/admin/products` - Product management
- `/admin/users` - User management
- `/admin/add-product` - Add a product
- `/admin/edit-product` - Edit a product

Admin routes verify the current user through the API and redirect unauthorized users.

## Data models

- **User**: identity, password hash, role, blocked state, email verification state, and profile image
- **Product**: product ID, name, descriptions, pricing, images, category, stock, brand, and availability
- **Order**: order ID, purchased product snapshots, customer details, quantities, status, and total amount
- **OTP**: one-time verification records used by account flows

## CI

GitHub Actions runs on pushes and pull requests targeting `main`. The frontend workflow:

1. Installs dependencies with `npm ci`
2. Runs ESLint
3. Runs an npm security audit
4. Builds the production frontend
5. Uploads the `dist` directory as a build artifact

## Security notes

- Never commit `.env` files, JWT secrets, MongoDB credentials, email application passwords, or private Supabase keys.
- Use a unique, high-entropy `JWT_SECRET_KEY` in each environment.
- Use Supabase public/anonymous credentials only in browser code; keep service-role keys server-side.
- Configure production CORS, HTTPS, rate limiting, and secure secret storage before deploying publicly.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run `npm run lint` and `npm run build` from `frontend-react`.
4. Verify the backend against a development MongoDB database.
5. Open a pull request with a concise description of the change.

## License

This project currently does not declare a repository-level license. Add a `LICENSE` file before distributing it as open-source software.
