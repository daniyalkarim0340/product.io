export const welcomeEmailTemplate = (name, email) => {
  return `
    <div style="font-family: Arial, sans-serif; padding:20px;">
      <h2 style="color:#4CAF50;">Welcome to Our Application 🎉</h2>
      
      <p>Hi <strong>${name}</strong>,</p>
      
      <p>
        Thank you for registering with us using the email:
        <strong>${email}</strong>
      </p>

      <p>
        We’re excited to have you on board. You can now explore our platform
        and enjoy all the features available.
      </p>

      <hr />

      <p style="font-size:14px; color:gray;">
        If you did not create this account, please ignore this email.
      </p>

      <p>
        Best Regards, <br/>
        <strong>Your Company Team</strong>
      </p>
    </div>
  `;
};