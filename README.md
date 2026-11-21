# BookNook

**A small online library. Add a book, borrow a book, return a book.**

🔗 **Live Site:** [https://YOUR-LIVE-SITE-URL.vercel.app](https://YOUR-LIVE-SITE-URL.vercel.app)

🖥️ **Server Repository:** [https://github.com/mdjabbarmollah/project-8-server](https://github.com/mdjabbarmollah/project-8-server)

BookNook lets readers share the books on their shelf and borrow the ones they have been meaning to read. Every borrow lasts 7 days, and a book can be returned in one click.

## Key Features

- **Secure authentication:** Register and log in with email and password, or continue with Google. Built with Better Auth and the MongoDB adapter, with password validation (uppercase, lowercase and at least 6 characters).
- **Private routes that survive a reload:** Add Book, My Books, My Borrows, Book Details and Profile are protected on the server. Logged-out visitors are sent to Login and returned to the page they wanted after signing in.
- **Full book management (CRUD):** Add a book with a cover image (uploaded to imgbb), edit it from a pre-filled dialog, and delete it after a custom confirmation modal.
- **Smart borrowing system:** Borrow from a confirmation modal. Copies are tracked per book, the button changes to "Not Available" when no copies are left, and the same book cannot be borrowed twice at the same time.
- **Browse and filter:** The home page shows the 6 newest books, and the All Books page has category filters (Fiction, Science, History, Kids, Others).
- **JWT-protected API calls:** Every protected request to the Express server carries the logged-in user's JWT.
- **Polished, responsive UI:** Swiper.js hero slider, dark/light theme toggle, loading spinners, toast messages for every success and error, a custom 404 page, and a unique page title on every route.

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Hero slider, New Arrivals, How Borrowing Works, Top Categories |
| `/books` | Public | All books in a grid with category filter |
| `/books/:id` | Private | Book details and Borrow button |
| `/add-book` | Private | Add a new book |
| `/my-books` | Private | Edit and delete your own books |
| `/my-borrows` | Private | Your borrowed books and Return button |
| `/profile` | Private | Your profile and reading stats |
| `/login`, `/signup` | Public | Authentication |

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui (Base UI primitives), Lucide icons
- **Authentication:** Better Auth, MongoDB adapter, JWT plugin
- **Slider:** Swiper.js
- **Notifications:** Sonner (toasts)
- **Theme:** next-themes
- **Image hosting:** imgbb
- **Backend:** Express.js and MongoDB (separate repository)

## Run Locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/mdjabbarmollah/project-8-client.git
   cd project-8-client
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_random_secret
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
   ```

3. Make sure the BookNook server is running on `http://localhost:8000`.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

