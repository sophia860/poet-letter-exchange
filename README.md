# Poet Letter Exchange

A daily poem-letter exchange platform open to any poet. Opt in, get matched each morning, and discover new voices through letters.

## How It Works

1. **Sign up & create your profile** - Add a bio, your writing interests, and sample poems.
2. **Opt into the daily exchange** - Toggle on "Morning Letters" in your settings.
3. **Write a poem-letter** - Submit a poem (or short letter) that will be sent to another poet.
4. **Wake up to a letter** - Each morning, you receive one poem-letter from a matched poet.
5. **Discover & connect** - Like the poem to boost the sender's visibility. Click through to their profile to read more and follow them.

## Features

- **Daily matching engine** - Pairs poets each morning using randomised matching with optional taste-based weighting.
- **Letter inbox** - A calm, distraction-free reading experience for your morning poem.
- **Profile & portfolio** - Showcase your work, bio, and links.
- **Likes as discovery** - Liking a letter increases the sender's reach in future matches.
- **Follow system** - Follow poets you love to see their new work.
- **Reply letters** - Optionally reply to start a private pen-pal correspondence.
- **Tags & themes** - Tag poems by form, theme, or mood to improve matching.

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT-based authentication
- **Scheduling**: node-cron for daily matching jobs
- **Email notifications**: Nodemailer (optional)
- **Frontend**: (TBD - React or Next.js)

## Project Structure

```
poet-letter-exchange/
  server/
    models/
      User.js          # User schema (profile, prefs, opt-in status)
      Letter.js        # Poem-letter schema
      Match.js         # Daily match records
    routes/
      auth.js          # Signup, login, JWT
      letters.js       # Submit, read, like letters
      profiles.js      # View/edit profiles, follow
    services/
      matchingEngine.js  # Daily matching logic
    jobs/
      morningMatch.js    # Cron job to run matching
    server.js          # Express app entry point
  .env.example
  package.json
```

## Getting Started

```bash
git clone https://github.com/sophia860/poet-letter-exchange.git
cd poet-letter-exchange
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

## Contributing

Open to all poets and developers. Open an issue or submit a PR.

## License

MIT
