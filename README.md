# **Deutsch Or Not**

## Overview

Welcome to my **Word Guessing Game**, an engaging and educational game designed to test your knowledge of German vocabulary. In this game, players identify the real German word from a set of options. The game features a multilingual interface, interactive gameplay, and a comprehensive reward system to enhance user experience.

## **Live Demo**

You can try the live version of the app here: [Deutsch Or Not Live](https://deutschornot.vercel.app)

## Features

- **Dynamic Word Selection**: Choose the real word from a list of options.
- **Timed Gameplay**: Each round is limited by a countdown timer.
- **Score Tracking**: Players’ scores are tracked and updated dynamically.
- **Multilingual Support**: The app supports English, German, Spanish, Arabic, Turkish, and Persian languages.
- **Responsive UI**: Designed with a clean, modern UI for a seamless experience across devices.
- **Leaderboard**: Track your progress and compare it with others.
- **Gamification Elements**: Track progress with levels, badges, and points.


## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for modern, responsive design.
- **TypeScript**: JavaScript superset that provides type safety.
- **tRPC**: Type-safe API framework for end-to-end type safety.
- **Prisma**: ORM for interacting with PostgreSQL.
- **React Confetti**: Library for confetti animations.

## **Getting Started**

To get a local copy up and running, follow these steps.

### **Prerequisites**

Make sure you have these installed on your machine:
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL (for local development)

### **Installation**

1. **Clone the repo**:
   ```bash
   git clone https://github.com/cnaez/deutsch-or-not.git
   ```
   
2. **Navigate to the project directory**:
   ```bash
   cd deutsch-or-not
   ```

3. **Install the dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up your environment variables**:
   Create a `.env` file in the root of the project and add your database and other necessary environment variables.
   Example:
   ```env
   DATABASE_URL=postgres://your-username:your-password@localhost:5432/your-database
   ```

5. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

Your app should now be running on [http://localhost:3000](http://localhost:3000)!

## **Contributing**

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## **License**

Distributed under the MIT License. See `LICENSE` for more information.

## **Contact**

- **Email**: cenaesmailzadeh@gmail.com
- **GitHub**: [cnaez](https://github.com/cnaez)

Thank you for checking out the Word Guessing Game. We hope you enjoy playing and learning with it!
