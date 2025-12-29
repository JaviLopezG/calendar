<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Collaborative Calendar](#collaborative-calendar)
  - [What is Collaborative Calendar?](#what-is-collaborative-calendar)
    - [Why is it useful?](#why-is-it-useful)
  - [✨ Features](#-features)
  - [🚀 Quick Start](#-quick-start)
    - [Installation](#installation)
    - [Docker](#docker)
  - [🛠️ Dependencies](#-dependencies)
  - [📖 Usage](#-usage)
  - [🗺️ Roadmap](#-roadmap)
  - [🤖 Automation](#-automation)
  - [🤝 Contributing](#-contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<p align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  <img src="nanobanana-output/a_modern_and_minimalist_logo_for_1.png" alt="Project Logo" width="200">
</p>

<h1 align="center">Collaborative Calendar</h1>

<p align="center">
  <!-- Badges -->
  <a href="https://github.com/javi/calendar/actions/workflows/deploy.yml">
    <img src="https://github.com/javi/calendar/actions/workflows/deploy.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://github.com/javi/calendar/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-BSD_3--Clause-blue.svg" alt="License">
  </a>
  <a href="https://github.com/javi/calendar/releases">
    <img src="https://img.shields.io/github/v/release/javi/calendar" alt="Version">
  </a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/javi/calendar">
    <img src="https://api.securityscorecards.dev/projects/github.com/javi/calendar/badge" alt="OpenSSF Scorecard">
  </a>
</p>

<p align="center">
  A real-time, collaborative planner for any year, accessible to anyone with a link.
</p>

---

## What is Collaborative Calendar?

Collaborative Calendar is a web-based tool that allows you to create and share a planner for any year. The key feature of this tool is its collaborative nature: you can share a link with others to view the calendar, or make it public to allow anyone with the link to modify it. All updates happen in real-time, thanks to Firebase's Firestore.

This project is designed for simplicity and ease of use. There is no need for logins or any form of identification. The user experience is straightforward, and the CSS is optimized for printing on A4 paper.

### Why is it useful?

While there are many calendar and planner tools available, Collaborative Calendar stands out by offering public, anonymous collaboration. This makes it ideal for situations where you need to quickly coordinate with a group of people without requiring them to sign up or log in.

## ✨ Features

- **Real-time collaboration:** See changes from other users instantly.
- **Public sharing:** Share a link to allow anyone to view or edit the calendar.
- **No login required:** Start planning right away without any friction.
- **Print-friendly:** The layout is optimized for printing on A4 paper.
- **Simple UX:** A clean and intuitive interface.

## 🚀 Quick Start

### Installation

To get started, you'll need to have Node.js and npm installed.

```bash
git clone https://github.com/javi/calendar.git
cd calendar
npm install
npm run dev
```

### Docker

You can also run the application using Docker:

```bash
docker build -t collaborative-calendar .
docker run -p 5173:5173 collaborative-calendar
```

## 🛠️ Dependencies

- [Firebase](https://firebase.google.com/)
- [Lucide React](https://lucide.dev/guide/react)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## 📖 Usage

The primary use case for this tool is to create a shared planner for a group. For example, you can use it to plan a trip with friends, organize a community event, or manage a project with a team.

Here's an example of how you might use it:

1.  Go to [calendar.yups.me](https://calendar.yups.me).
2.  Create a new calendar for the year you want to plan.
3.  Share the link with your friends, family, or colleagues.
4.  Start adding events to the calendar.

## 🗺️ Roadmap

This is a weekend project, and I will continue to work on it if there is enough interest. Some potential future features include:

-   [ ] User accounts for private calendars.
-   [ ] Different calendar views (week, month, year).
-   [ ] The ability to add more details to events (e.g., descriptions, locations).

## 🤖 Automation

This project uses GitHub Actions to automate the following tasks:

-   **Automated TOC generation:** The table of contents is automatically updated using [toc-generator](https://github.com/technote-space/toc-generator).
-   **Link checking:** All links in the documentation are checked for validity using [Lychee](https://github.com/lycheeverse/lychee-action).
-   **Contributor management:** The list of contributors is managed using [All-Contributors](https://allcontributors.org/).
-   **Deployment:** The application is automatically deployed to Firebase Hosting when new code is pushed to the `main` branch.

## 🤝 Contributing

Any help, suggestions, or feedback are welcome! Please feel free to open an issue or submit a pull request.

---

<p align="center">
  <a href="https://github.com/javi/calendar/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=javi/calendar" alt="Contributors">
  </a>
</p>
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Javi"><img src="https://avatars.githubusercontent.com/u/4081895?v=4?s=100" width="100px;" alt="Javier Casaubón"/><br /><sub><b>Javier Casaubón</b></sub></a><br /><a href="https://github.com/javilopezg/calendar/commits?author=Javi" title="Documentation">📖</a> <a href="https://github.com/javilopezg/calendar/commits?author=Javi" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!