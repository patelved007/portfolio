# Ved Portfolio

Personal portfolio application built with React and Vite.

## Practical 1

- Reusable components: Header, About, Skills, Footer
- Props used to pass data between components

## Practical 2 - Routes Added

- `/` - Home (Header, About, Skills)
- `/projects` - Projects page
- `/contact` - Contact form with controlled input and useState
- `*` - 404 Not Found page

## Practical 3 - API Integration

- Projects page fetches repositories from the [GitHub REST API](https://docs.github.com/en/rest)
- API URL: `https://api.github.com/users/patelved007/repos`
- `useEffect` runs the fetch when the page loads
- `useState` for `repos`, `loading`, and `error`
- `Spinner` while loading, `ErrorMessage` with retry on failure
- `RepoList` shows repository name, URL, and star count
- Search input filters repositories by name

No API key is required for public GitHub user repositories.

## Features

- React Router v6 for client-side navigation
- NavBar with `Link` components (no full page reload)
- `useState` for contact form input and help tooltip toggle
- Live character count on the contact form
- Dark/light mode toggle

## Run the App

```bash
npm install
npm run dev
```
