# Professional Marketing Agency Landing Page

A modern landing page project for a marketing agency with integrated n8n automation for handling contact form submissions.

---

## Project Overview

This project combines a sleek, responsive landing page with automated workflow management. The contact form seamlessly integrates with n8n to process inquiries, generate AI-powered responses, and log data—all without manual intervention.

## What's Included

- **Landing Page** – Clean hero section, services showcase, and contact form
- **Responsive Design** – Works smoothly on desktop and mobile
- **n8n Integration** – Automated form processing and responses
- **Form Validation** – Client-side validation for better UX

## Getting Started

### Option 1: Open Directly
Just double-click `index.html` and you're good to go.

### Option 2: Run Locally
```bash
npm install
npm run start
```
The site will run on `http://localhost:3000`

## Contact Form Setup

When someone fills out the contact form, it sends a POST request to your n8n webhook with this structure:

```json
{
  "name": "string_name",
  "email": "string_email",
  "message": "string_message"
}
```

**Webhook Endpoint**: `http://localhost:5678/webhook/api-communication`

The form validates that all fields are filled and the email format is valid before sending.

## n8n Workflow

The workflow automates everything after form submission:

1. **Webhook Trigger** – Captures the form data
2. **Process Data** – Cleans and formats the information
3. **Generate Response** – AI creates a professional acknowledgment message
4. **Send Email** – Automatically emails the user their confirmation
5. **Log Data** – Stores the inquiry in your database

## Requirements

- n8n running locally on `localhost:5678`
- Modern web browser
- Node.js (if running with `npm`)

---

That's it! Deploy, submit a form, and watch the automation work.