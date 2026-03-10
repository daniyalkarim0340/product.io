import  eventBus from "../event/eventBus.js"
import {UserEvent} from "../event/event.constant.js"
import sendemail from "../utils/sendemail.js"
import { welcomeEmailTemplate } from "../emailtemplrte/emailtemplate.js"


eventBus.on(UserEvent.REGISTER, async (user) => {
  try {
    const welcomeTemplate = welcomeEmailTemplate(user.name, user.email);
    await sendemail(user.email, "WELCOME TO OUR APPLICATION", welcomeTemplate);
  } catch (error) {
    console.error("Failed to send register email:", error.message);
  }
})
