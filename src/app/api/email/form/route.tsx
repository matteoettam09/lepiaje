import { getResendClient } from "@/lib/email/resendClient";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { FormType } from "@/types";
import FormNotificationTemplate from "@/components/email_templates/submitted_form_email";

const adminEmail = process.env.ADMIN_EMAIL_ONE_RECEIVER || "";
const responseHandler = new ResponseHandler();
const emailFrom = process.env.NEXT_PUBLIC_SENDER_EMAIL || "delivered@resend.dev";

export async function POST(request: Request) {
  try {
    const resend = getResendClient();
    if (!resend) {
      return responseHandler.respond({
        status: HttpStatusCode.BAD_REQUEST,
        message: "There is no Resend api key",
        errorDetails:
          "The api key of resend has not loaded, has expired or is simply not present in this request",
        error: true,
      });
    }
    if (!emailFrom) {
      return responseHandler.respond({
        status: HttpStatusCode.BAD_REQUEST,
        message: "There is no email present in the environment to send emails",
        errorDetails:
          "There is no email, or it is invalid in the environment variables",
        error: true,
      });
    }
    const emailData: FormType = await request.json();

    if (!emailData.message) {
      return responseHandler.respond({
        error: true,
        message: "a message is necessary for this email",
        status: HttpStatusCode.BAD_REQUEST,
        errorDetails: "no error details",
      });
    }

    if (!emailData.name) {
      return responseHandler.respond({
        error: true,
        message: "a name is necessary for this email",
        status: HttpStatusCode.BAD_REQUEST,
        errorDetails: "no error details",
      });
    }

    if (!emailData.email) {
      return responseHandler.respond({
        error: true,
        message: "an email is necessary for sending an email",
        status: HttpStatusCode.BAD_REQUEST,
        errorDetails: "no error details",
      });
    }

    const { data: adminData, error: adminError } = await resend.emails.send({
      from: emailFrom,
      to: [adminEmail], //Only supports sending to one email until domain email is provided
      subject: "An user has submitted a form!",
      react: (
        <FormNotificationTemplate
          phone={emailData.phone}
          name={emailData.name}
          email={emailData.email}
          message={emailData.message}
        />
      ),
    });

    if (!adminData) {
      return responseHandler.respond({
        message: "something has failed while sending the email 2",
        error: true,
        errorDetails: JSON.stringify(adminError),
        status: HttpStatusCode.INTERNAL_SERVER,
      });
    }

    if (adminError) {
      return responseHandler.respond({
        message: "something has failed while sending the email 3",
        error: true,
        errorDetails: JSON.stringify(adminError),
        status: HttpStatusCode.INTERNAL_SERVER,
      });
    }
    return responseHandler.respond({
      error: false,
      errorDetails: "there were no errors",
      message: adminData?.id ?? "no id",
      status: HttpStatusCode.OK,
    });
  } catch (err) {
    console.log("general error on email route", JSON.stringify(err));
    return responseHandler.respond({
      error: true,
      message:
        "Something has gone wrong, please check logs and more information at 'errorDetails' object",
      errorDetails: JSON.stringify(err),
      status: HttpStatusCode.INTERNAL_SERVER,
    });
  }
}
