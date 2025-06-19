import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


async function createMessage(name, time, mobile) {
    try {
        const message = await client.messages.create({
            body: `Hi patient ${name}, your appointment was scheduled at ${time}`,
            from: "+16056050987",
            to: `+91${mobile}`,
        });

        console.log("Message sent! SID:", message.sid);
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
}

export default createMessage