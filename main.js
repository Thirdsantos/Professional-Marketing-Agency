const WEBHOOK_URL = "http://localhost:5678/webhook/api-communication";

function $(selector) {
  return document.querySelector(selector);
}

function validateEmail(email) {
  // Basic validation: must contain "@" and at least one "." after it
  if (!email) return false;
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return false;
  const dotIndex = email.indexOf(".", atIndex);
  return dotIndex > atIndex + 1 && dotIndex < email.length - 1;
}

function setFieldError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) {
    errorEl.textContent = message || "";
  }
}

function clearErrors() {
  ["name", "email", "message"].forEach((field) => setFieldError(field, ""));
}

function setFormStatus(message, type) {
  const statusEl = $("#form-status");
  if (!statusEl) return;

  statusEl.textContent = message || "";
  statusEl.classList.remove("form-status--success", "form-status--error");

  if (type === "success") {
    statusEl.classList.add("form-status--success");
  } else if (type === "error") {
    statusEl.classList.add("form-status--error");
  }
}

function setupMessageCounter() {
  const messageInput = $("#message");
  const countEl = $("#message-count");
  if (!messageInput || !countEl) return;

  const max = messageInput.getAttribute("maxlength")
    ? parseInt(messageInput.getAttribute("maxlength"), 10)
    : 500;

  const updateCount = () => {
    const length = messageInput.value.length;
    countEl.textContent = `${length}`;
  };

  messageInput.addEventListener("input", updateCount);
  updateCount();
}

function setupRevealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

async function handleSubmit(event) {
  event.preventDefault();

  const nameInput = $("#name");
  const emailInput = $("#email");
  const messageInput = $("#message");
  const submitBtn = $("#submit-btn");

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  clearErrors();
  setFormStatus("", "");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  let hasError = false;

  if (!name) {
    setFieldError("name", "Please enter your name.");
    hasError = true;
  }

  if (!email) {
    setFieldError("email", "Please enter your email address.");
    hasError = true;
  } else if (!email.includes("@")) {
    // Explicitly ensure the email contains "@", per requirements
    setFieldError("email", "Email must contain '@'.");
    hasError = true;
  } else if (!validateEmail(email)) {
    setFieldError("email", "Please enter a valid email address.");
    hasError = true;
  }

  if (!message) {
    setFieldError("message", "Please add a short message.");
    hasError = true;
  }

  if (hasError) {
    setFormStatus("Please fix the highlighted fields and try again.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  setFormStatus("Sending your message securely…", "");

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      // If the response is not valid JSON, keep data as null
    }

    if (!response.ok) {
      // Handle known error responses from the webhook
      if (response.status === 400 || response.status === 429) {
        const backendMessage =
          data && typeof data.message === "string" && data.message.trim().length > 0
            ? data.message
            : response.status === 400
            ? "Please provide a valid name, email address, and a message with sufficient details."
            : "Too many requests. Please wait a few minutes before submitting again.";

        setFormStatus(backendMessage, "error");
      } else {
        setFormStatus(
          "We couldn’t send your message right now. Please check that your automation (n8n) server is running on localhost:5678 and try again.",
          "error"
        );
      }
      return;
    }

    // Success (HTTP 200) – use backend message if present
    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";

    const successMessage =
      data && typeof data.message === "string" && data.message.trim().length > 0
        ? data.message
        : "Thank you for reaching out. We’ve received your inquiry and our AI assistant has sent you a confirmation email.";

    setFormStatus(successMessage, "success");
  } catch (error) {
    console.error("Error submitting form:", error);
    // Network / unreachable webhook handling
    const isNetworkError =
      error instanceof TypeError ||
      (typeof error.message === "string" &&
        (error.message.toLowerCase().includes("failed to fetch") ||
          error.message.toLowerCase().includes("networkerror")));

    if (isNetworkError) {
      setFormStatus(
        "We couldn’t reach the automation webhook. Please try again later.",
        "error"
      );
    } else {
      setFormStatus(
        "We couldn’t send your message right now due to an unexpected error. Please try again shortly.",
        "error"
      );
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  setupMessageCounter();
  setupRevealOnScroll();

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});


