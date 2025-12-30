<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Collaborative Annual Planner](#collaborative-annual-planner)
  - [🚀 Quick Start](#-quick-start)
  - [✨ Features](#-features)
  - [📦 Dependencies](#-dependencies)
  - [📖 Usage](#-usage)
    - [Architecture](#architecture)
  - [🗺️ Roadmap](#-roadmap)
  - [❤️ Contributing](#-contributing)
  - [📜 License](#-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<div align="center">
  <img src="logo.png" alt="Calendar Logo" width="200"/>
  <h1>Collaborative Annual Planner</h1>
  <p>A real-time, collaborative annual planner with no login required.</p>
  
  <!-- Badges -->
  <p>
    <a href="https://github.com/javilopezg/calendar/actions/workflows/documentation.yml"><img src="https://github.com/javilopezg/calendar/actions/workflows/documentation.yml/badge.svg" alt="Build Status"></a>
    <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD--3--Clause-blue.svg" alt="License"></a>
    <a href="package.json"><img src="https://img.shields.io/github/package-json/v/javilopezg/calendar" alt="Version"></a>
    <a href="https://securityscorecards.dev/viewer/?uri=github.com/JaviLopezG/calendar"><img src="https://api.securityscorecards.dev/projects/github.com/JaviLopezG/calendar/badge" alt="OpenSSF Scorecard"></a>
  </p>
</div>

<div align="center">
  <img src="screenshot.png" alt="Screenshot of the calendar application"/>
</div>

## 🚀 Quick Start

Get started with the Collaborative Annual Planner in just one command:

```bash
git clone https://github.com/javilopezg/calendar.git && cd calendar && npm install && npm run dev
```

Alternatively, you can use Docker:

```bash
docker run -p 8080:80 ghcr.io/javilopezg/calendar:main
```

## ✨ Features

*   **Real-time collaboration:** See changes from other users instantly.
*   **No login required:** Start planning right away without creating an account.
*   **Public modification:** Anyone with the link can view or edit the calendar.
*   **Print-friendly:** The user interface is optimized for A4 paper printing.
*   **Simple UX:** A clean and intuitive interface that is easy to use.

## 📦 Dependencies

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Firebase](https://firebase.google.com/)
*   [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 📖 Usage

The Collaborative Annual Planner is designed to be simple and intuitive. Here are a few user stories to help you get started:

*   **As a project manager,** I can create a new calendar for my team and share the link with them. Everyone can then add their tasks and deadlines to the calendar, and we can all see the project's progress in real-time.
*   **As a student,** I can create a calendar for my study group. We can use it to track our assignments, exams, and other important dates.
*   **As a family,** we can use the calendar to coordinate our schedules. We can add appointments, events, and other important information to the calendar so that everyone is on the same page.

### Architecture

```mermaid
graph TD
    A[User] --> B{React App};
    B --> C[Firebase Firestore];
    C -- Real-time updates --> B;
```

## 🗺️ Roadmap

This is a weekend project, and future development depends on community interest. If you have any suggestions or feedback, please feel free to open an issue or submit a pull request.
- [ ] List all calendars the user owns
- [ ] Rediseign columns width for diferent media
- [ ] Change the URL to set the id
- [ ] Open by default the last calendar in wich the user was active
- [ ] Create new button
- [ ] Don't change event dates on year change

## ❤️ Contributing

Suggestions, help, and feedback are welcome!

## 📜 License

This project is licensed under the BSD 3-Clause License. See the [LICENSE](LICENSE) file for details.
