// Encode with `btoa("me@email.com")`
const encodedEmails = {
  info: "aW5mb0Btb25vbGl0aGUtZ3JhdnVyZS5mcg==",
};

const addEmails = () => {
  for (const [id, encodedEmail] of Object.entries(encodedEmails)) {
    const target = document.querySelector(`[data-email="${id}"]`);
    if (target) {
      const email = atob(encodedEmail);
      target.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `mailto:${email}`;
      });
    }
  }
};

const main = () => {
  addEmails();
};

document.addEventListener("DOMContentLoaded", main);
