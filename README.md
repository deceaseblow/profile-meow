# Profile.. HEHE ...

A personal profile website built with **React + Vite**, migrated from local JSON data to **Firebase Firestore**. The application supports public browsing while providing authenticated admin-only CRUD functionality for managing content.

## Features

-   Personal profile/home page
-   Manga collection
-   Anime collection
-   TV shows collection
-   Movies collection
-   Books collection
-   Games collection
-   Music playlists
-   Blog posts
-   Social links
-   External links
-   Personal lists
-   Search and filtering
-   Genre filtering for shows and other supported collections
-   Pagination / Load More functionality
-   Firebase Firestore database
-   Google authentication for the administrator
-   Admin-only Create, Update, and Delete operations
-   Public read access
-   Firestore Security Rules protecting write operations
-   Responsive UI
-   Tailwind CSS styling

* * *

## Tech Stack

### Frontend

-   React 19
-   Vite
-   React Router
-   Tailwind CSS
-   JavaScript / JSX

### Firebase

-   Firebase Authentication
-   Google Authentication
-   Cloud Firestore
-   Firebase Admin SDK

### Additional Libraries

-   Axios
-   Fuse.js
-   React Router DOM

* * *

## Project Structure

```
profile-main/
│
├── public/
│
├── src/
│   ├── comp/
│   │   ├── BlogCard.jsx
│   │   ├── MangaCard.jsx
│   │   ├── MovieCard.jsx
│   │   ├── ShowsCard.jsx
│   │   └── ...
│   │
│   ├── context/
│   │   ├── AppDataContext.jsx
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MangaList.jsx
│   │   ├── MangaPage.jsx
│   │   ├── Animes.jsx
│   │   ├── Blogs.jsx
│   │   ├── Gallery.jsx
│   │   ├── Links.jsx
│   │   ├── Shows.jsx
│   │   └── Movies.jsx
│   │
│   ├── services/
│   │   └── firestoreService.js
│   │
│   ├── App.jsx
│   ├── auth.js
│   ├── firebase.js
│   └── main.jsx
│
├── .env
├── .gitignore
├── firebase.json
├── firestore.rules
├── index.html
├── package.json
└── README.md
```

* * *

# Firebase Architecture

The application originally used a local `data.json` file.

The data flow was migrated from:

```
data.json
   ↓
React components
```

to:

```
Firestore
    ↓
Firebase Client SDK
    ↓
AppDataContext
    ↓
React components
```

Firestore contains separate collections for the different types of content.

Current collections include:

```
games
books
music_playlists
blog_posts
manga
socials
shows
movies
list
links
blogs
animes
```

Each Firestore document is converted into an object containing its Firestore document ID as:

```
firestoreId
```

This ID is then used when updating or deleting documents.

* * *

# Firestore Data Loading

`AppDataContext.jsx` is responsible for loading the application's public data.

For example:

```
const snapshot = await getDocs(
  collection(db, collectionName)
);
```

The documents are converted into objects:

```
snapshot.docs.map((doc) => ({
  ...doc.data(),
  firestoreId: doc.id,
}));
```

The resulting data is made available to React components through:

```
useAppData()
```

* * *

# CRUD Operations

CRUD operations are centralized in:

```
src/services/firestoreService.js
```

The service provides:

### Create

```
addDocument(collectionName, data)
```

Uses Firestore:

```
addDoc()
```

### Update

```
updateDocument(collectionName, documentId, data)
```

Uses:

```
updateDoc()
```

### Delete

```
deleteDocument(collectionName, documentId)
```

Uses:

```
deleteDoc()
```

This keeps Firestore operations separate from the UI components.

* * *

# Authentication

The website does not provide public account registration.

Visitors can browse the website without logging in.

The administrator logs in using **Google Authentication**.

The authentication flow is:

```
Visitor
   │
   ├── Browse website
   │
   └── Login to Edit
           │
           ▼
      Google Login
           │
           ▼
      Firebase Auth
           │
           ▼
     Authorized admin?
        /        \
      Yes         No
       │           │
       ▼           ▼
    Admin UI     Sign out
       │
       ▼
  Firestore CRUD
```

The authentication logic is located in:

```
src/auth.js
```

and the global authentication state is managed by:

```
src/context/AuthContext.jsx
```

* * *

# Admin Access

The application checks the configured administrator email:

```
VITE_ADMIN_EMAIL=...
```

The frontend uses this value to determine whether admin controls such as:

```
+ Add
Edit
Delete
```

should be displayed.

However, the frontend check is **not the actual security mechanism**.

Firestore Security Rules provide the real protection against unauthorized writes.

* * *

# Firestore Security Rules

The application allows anyone to read public content:

```
allow read: if true;
```

Writes are restricted to the administrator's Firebase Authentication UID:

```
allow write: if request.auth != null
             && request.auth.uid == "ADMIN_UID";
```

Therefore:

```
Public user
    ↓
Can read Firestore
    ✗ Cannot write

Authenticated admin
    ↓
Matching UID
    ↓
Can create/update/delete
```

Even if someone modifies the frontend and attempts to call Firestore directly, the Firestore Rules still reject unauthorized write operations.

* * *

# Environment Variables

Sensitive configuration is stored in `.env`.

Example:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_ADMIN_EMAIL=your_admin_email

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The `.env` file should **never be committed to Git**.

The repository should contain only a template if environment documentation is needed, for example:

```
.env.example
```

with placeholder values.

* * *

# Firebase Client Configuration

The frontend Firebase configuration is initialized in:

```
src/firebase.js
```

It uses Vite environment variables:

```
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

Firestore is initialized against the project's default database.

* * *

# Running the Project Locally

## 1\. Clone the repository

```
git clone <repository-url>
cd profile-main
```

## 2\. Install dependencies

```
npm install
```

## 3\. Configure environment variables

Create a:

```
.env
```

file in the project root.

Add the required Firebase configuration and administrator settings.

## 4\. Start the development server

```
npm run dev
```

The Vite development server will provide a local URL, typically:

```
http://localhost:5173
```

* * *

# Building for Production

Create a production build with:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

* * *

# Firebase Migration

The original application stored its content in a local JSON file.

The migration process transferred the existing collections into Firestore.

The migration created Firestore collections corresponding to the original data structure:

```
data.json
   │
   ├── games
   ├── books
   ├── music_playlists
   ├── blog_posts
   ├── manga
   ├── socials
   ├── shows
   ├── movies
   ├── list
   ├── links
   ├── blogs
   └── animes
          │
          ▼
      Firestore
```

The migration scripts were only required during the initial migration and testing process. They are not required for the application to run after the data has been successfully transferred.

* * *

# Content Management

Authenticated administrators can manage supported content directly through the website.

For example, the Manga, Shows, Movies, Blogs, and Links sections support administrative operations.

### Create

An administrator can open the corresponding `Add` form and create a new Firestore document.

### Read

All visitors can view public content.

### Update

Administrators can edit existing documents.

### Delete

Administrators can delete existing documents.

The application uses the Firestore document ID stored as:

```
firestoreId
```

to identify documents for updates and deletion.

* * *

# Shows

The Shows section supports:

-   Search
-   Fuzzy title matching
-   Genre filtering
-   Load More pagination
-   Add Show
-   Edit Show
-   Delete Show

Supported genres include:

```
Romance
Comedy
Drama
Psychological
Horror
GL
BL
Shoujo
Sports
Supernatural
Video Games
College Life
```

Search and genre filtering can be combined.

* * *

# Manga

The Manga section supports:

-   Search/browsing
-   Genre information
-   Add Manga
-   Edit Manga
-   Delete Manga
-   Manga detail pages

Supported manga fields include:

```
title
author
year
genres
status
comment
image
link
```

* * *

# Blogs

Blog entries contain information such as:

```
title
date
image
content
```

Administrators can:

-   Add blog posts
-   Edit blog posts
-   Delete blog posts

* * *

# Links

The Links section provides a table-based interface for managing external links.

Each link contains:

```
name
url
description
```

Administrators can add, edit, and delete links.

External links are opened in a new browser tab.

* * *

# Security

The project follows a two-layer approach:

### Frontend authorization

The UI checks whether the currently authenticated user is the configured administrator.

This controls whether admin functionality is displayed.

### Backend/database authorization

Firestore Security Rules enforce the actual permissions.

This means frontend checks are not trusted as a security boundary.

The database itself verifies whether the authenticated Firebase user has permission to perform a write operation.

* * *

# Important Security Notes

Never commit:

```
.env
firebase-service-account.json
```

Never expose:

```
FIREBASE_PRIVATE_KEY
```

in source code or GitHub.

Firebase web configuration values such as the API key are not equivalent to a service-account private key, but access to Firestore should still be protected by proper Security Rules.

The Firebase Admin SDK credentials should only be used in trusted server-side environments or migration scripts, not inside the React frontend.

* * *

# Development Architecture

The main application architecture is:

```
                 ┌──────────────────┐
                 │    React / Vite  │
                 └────────┬─────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
     AppDataContext              AuthContext
             │                         │
             ▼                         ▼
      Firestore Read             Firebase Auth
             │                         │
             └────────────┬────────────┘
                          ▼
                     React Pages
                          │
                          ▼
                 CRUD Service Layer
                          │
                          ▼
                     Firestore
                          │
                          ▼
                  Security Rules
```

This separation keeps:

-   authentication
-   data fetching
-   CRUD operations
-   UI components

organized independently.

* * *

# Future Improvements

Possible future improvements include:

-   Firebase Storage for image hosting
-   Better image upload management
-   Real-time Firestore listeners
-   More granular Firestore permissions
-   Admin dashboard
-   Content ordering
-   Rich text blog editor
-   Image optimization
-   Automated deployment
-   CI/CD with GitHub Actions
-   Better error and loading states
-   Pagination directly through Firestore queries