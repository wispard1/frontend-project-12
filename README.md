### Hexlet tests and linter status:

[![Actions Status](https://github.com/wispard1/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/wispard1/frontend-project-12/actions)

# Chat (Slack)

## Objective

This project aims to demonstrate the spectrum of standard tasks faced by frontend and React developers in real-world work. This includes:

- Interacting with REST APIs.
- Using WebSockets for real-time communication.
- State management with Redux Toolkit (RTK Query).
- Client-side routing.
- Authentication and authorization.
- Internationalization (i18n).
- Profanity filtering.
- Production error monitoring (Rollbar).
- Building and deployment (Vite).

## Technologies

- **React** (with hooks)
- **Redux Toolkit** (RTK Query for API interaction)
- **React Router v6**
- **react-bootstrap** (for UI components)
- **Formik** (for form handling)
- **react-i18next** (for internationalization)
- **leo-profanity** (for profanity filtering)
- **@rollbar/react** (for error monitoring)
- **Vite** (for building)
- **Render** (for deployment)

## Installation and Running

To install and run the project locally, follow these steps:

1.  **Clone the repository**<br>
    `git clone https://github.com/wispard1/frontend-project-12.git`<br>
    `cd frontend-project-12`

2.  **Ensure you are in the project root directory (where `Makefile` is located).**

3.  **Install dependencies**<br>
    `make install`

4.  **(Optional) Run the build**<br>
    `make build`

5.  **Start the application**<br>
    `make start`

## Operation

The project is configured for production error monitoring using **Rollbar**. Errors are automatically sent to your Rollbar project account.

## Deployment

The project is automatically deployed to [Render](https://render.com/). The current version is available at: [https://frontend-project-12-rit5.onrender.com/](https://frontend-project-12-rit5.onrender.com/)
