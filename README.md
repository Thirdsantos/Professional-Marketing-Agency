# Professional Marketing Agency – Landing Page & n8n Integration

This is a simple, modern landing page for **Professional Marketing Agency** with a contact form wired into an **n8n** webhook for automation and AI-powered replies.

## How to Run the Frontend

You can either:

- **Option 1 – Open directly**:  
  Simply open `index.html` in your browser (double-click the file).

- **Option 2 – Serve locally (recommended for CORS testing)**:

  ```bash
  npm install -g serve
  serve .
  ```

  Or with the included script:

  ```bash
  npm install
  npm run start
  ```

This serves the site at `http://localhost:3000` (or similar), depending on your `serve` configuration.

## Contact Form → n8n Webhook

- **Webhook URL**: `http://localhost:5678/webhook/api-communication`
- **Payload format (JSON)**:

```json
{
  "name": "string_name",
  "email": "string_email",
  "message": "string_message"
}
```

The frontend:

- Validates that **name**, **email**, and **message** are filled in.
- Ensures the email **contains "@"** and loosely validates the format.
- Sends a `POST` request with `Content-Type: application/json` to the webhook.
- Shows a success or error status message to the user.

## Suggested n8n Workflow (for your tryout presentation)

1. **Webhook Trigger**  
   Receives the `name`, `email`, and `message` from the contact form.
2. **Function / Set Node**  
   Cleans and formats the data (e.g., trims text, normalizes casing).
3. **AI Node (OpenAI / other LLM)**  
   Generates a professional, friendly confirmation email that:
   - Acknowledges receipt of the inquiry  
   - Thanks the user for reaching out  
   - States that the team will follow up soon  
4. **Email Node (or Messaging Node)**  
   Sends the AI-generated response to the user’s `email` or your chosen messaging platform.

You can record a short Loom video walking through:

- The landing page (hero, services, contact form).
- The n8n workflow nodes and how data flows between them.
- A live demo: submit the form → show the n8n execution → show the AI-generated reply in the user’s inbox or messaging app.


