import { EmailType } from "@/types/email.types";
import { Email } from "@/enums";

interface NotifyAdminResponse {
    error: boolean,
    message: string
}

export async function notifyAdmin(emailInfo: EmailType, emailType: Email): Promise<NotifyAdminResponse> {
    try {
        const response = await fetch(`/${emailType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailInfo)
        });

        if (response.status !== 200) {
            return {
                error: true,
                message: 'something went wrong submitting the form',
            }
        }
        const result = await response.json();

        return {
            error: false,
            message: `Form was submitted! ${JSON.stringify(result)}`
        }
    } catch (err) {
        console.log("error submitting the form at notifyAdmin", JSON.stringify(err))
        return {
            error: true,
            message: 'something went wrong submitting the form',
        }
    }

}