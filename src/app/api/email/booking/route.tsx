import { HttpStatusCode } from "@/enums";
import { ResponseHandler } from "@/helpers/response_handler";
import { BookingType } from "@/types";
import { getResendClient } from "@/lib/email/resendClient";
import BookingNotificationTemplate from "@/components/email_templates/new_booking";

const responseHandler = new ResponseHandler();
const emailFrom = process.env.NEXT_PUBLIC_SENDER_EMAIL || "delivered@resend.dev";
const adminEmail = process.env.ADMIN_EMAIL_ONE_RECEIVER || "";

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
    const emailData: BookingType = await request.json();

    if (!emailData.checkIn) {
      return responseHandler.respond({
        error: true,
        errorDetails: "N/A",
        message: "check in data was not provided",
        status: HttpStatusCode.BAD_REQUEST,
      });
    }
    if (!emailData.checkOut) {
      return responseHandler.respond({
        error: true,
        errorDetails: "N/A",
        message: "check out data was not provided",
        status: HttpStatusCode.BAD_REQUEST,
      });
    }

    if (!emailData.guests) {
      return responseHandler.respond({
        error: true,
        errorDetails: "N/A",
        message: "There are no guests on the list",
        status: HttpStatusCode.BAD_REQUEST,
      });
    }
    if (!emailData.numberOfGuests) {
      return responseHandler.respond({
        error: true,
        errorDetails: "N/A",
        message: "There are no numbers of guest included",
        status: HttpStatusCode.BAD_REQUEST,
      });
    }
    if (!emailData.propertyName) {
      return responseHandler.respond({
        error: true,
        errorDetails: "N/A",
        message: "There is not a name of any property included",
        status: HttpStatusCode.BAD_REQUEST,
      });
    }
    //TODO account for totalPaid via stripe

    const { data: adminData, error: adminError } = await resend.emails.send({
      from: emailFrom,
      to: [adminEmail], //Only supports sending to one email until domain email is provided
      subject: "There is a new booking!",
      react: <BookingNotificationTemplate bookingData={emailData} />,
    }); //TODO better add a log to the database if case it fails

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
    console.log(
      "Something went wrong in sending booking email",
      JSON.stringify(err),
      err
    );
    responseHandler.respond({
      error: true,
      message: "something went wrong while sending booking email",
      errorDetails: `please check the logs ${JSON.stringify(err)}`,
      status: HttpStatusCode.INTERNAL_SERVER,
    });
  }
}
