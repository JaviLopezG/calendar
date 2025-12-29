<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [👥🖨️🗓️✒️](#)
- [Social Printable Calendar Planner](#social-printable-calendar-planner)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Local Development](#local-development)
    - [Docker](#docker)
  - [Usage](#usage)
    - [Architecture](#architecture)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<div align="center">
  <img src="logo.png" alt="logo" width="100"/>

  # Collaborative Calendar

  A simple, collaborative calendar for planning and sharing events.
</div>

[![Build Status](https://img.shields.io/github/actions/workflow/status/JaviLopezG/calendar/documentation.yml?branch=main&style=for-the-badge)](https://github.com/JaviLopezG/calendar/actions/workflows/documentation.yml)
[![License](https://img.shields.io/github/license/JaviLopezG/calendar?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/JaviLopezG/calendar?style=for-the-badge)](package.json)
[![OpenSSF Scorecard](https://img.shields.io/ossf-scorecard/github.com/JaviLopezG/calendar?style=for-the-badge)](https://openssf.org/projects/scorecard/)

This project is a collaborative calendar that allows you to create a planner for any year. The cool thing is that it is a collaborative tool, you can share the link with other people and let them see the calendar or make it public to allow anyone with the link to modify the calendar. It updates in realtime (uses firestore) and don't require logins or any identifications.

## ✨ Features

*   **Real-time collaboration:** Share your calendar with others and see changes in real-time.
*   **No login required:** No need to create an account to use the app.
*   **Public and private calendars:** Create public calendars that anyone can see and edit, or private calendars that only you and your collaborators can access.
*   **Simple and intuitive interface:** The user interface is clean and easy to use.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Docker

```bash
docker build -t calendar .
docker run -p 3000:3000 calendar
```

## 📦 Dependencies

*   [react](https://reactjs.org/)
*   [firebase](https://firebase.google.com/)
*   [tailwindcss](https://tailwindcss.com/)
*   [vite](https://vitejs.dev/)

## 📖 Usage

To use the app, simply visit [calendar.yups.me](https://calendar.yups.me). You can create a new calendar by clicking on the "New Calendar" button. You can then share the link with others to collaborate.

## 🗺️ Roadmap

This is a weekend project and I'll work on it if I see interest. Here are some things I'm thinking of adding:

*   [ ] Event reminders
*   [ ] Different calendar views (week, month, year)
*   [ ] Themes
*   [ ] Mobile app

## 🤖 Automation

This project uses GitHub Actions to automate the following:

*   **TOC generation:** The table of contents in this README is automatically generated using [toc-generator](https://github.com/technote-space/toc-generator).
*   **Link checking:** All links in this README are automatically checked for validity using [Lychee](https://github.com/lycheeverse/lychee).
*   **Contributor management:** The list of contributors to this project is automatically generated using [All-Contributors](https://allcontributors.org/).

## 🤝 Contributing

Any help, suggestions or feedback are welcome. Please, feel free to open an issue or a pull request.

## 📝 License

This project is licensed under the BSD 3-Clause license. See the [LICENSE](LICENSE) file for more details.
