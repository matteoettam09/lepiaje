"use client";
import * as Yup from "yup";
import Image from "next/image";
import Logo from "../logo/logo";
import { useFormik } from "formik";
import { Alert } from "../alerts/alerts";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSuccessAlert } from "@/hooks/use_alert";
import formImageBackground from "../../../public/assets/villa_perlata/interno3.jpeg";
import { submitForm } from "@/services/submit_form.services";
import { notifyAdmin } from "@/services/notify_admin";
import { PulsingDotSpinner } from "../loader/loader";
import { useTranslations } from "next-intl";
import { Email } from "@/enums";

const validationSchema = Yup.object({
  name: Yup.string().required("full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("The email is required"),
  phone: Yup.string()
    .notRequired()
    .matches(
      /^[+]?[0-9]{1,4}[ ]?[(]?[0-9]{1,4}[)]?[ ]?[0-9]{1,4}[ ]?[-]?[0-9]{1,4}$/,
      "Phone number is not valid"
    ),
  message: Yup.string()
    .max(500, "The message cannot exceed 500 characters")
    .required("A message is required"), //Adjust the characters according to your liking
});

export default function ContactForm() {
  const t = useTranslations("landing_page.contact_form");
  const { isVisible, message, showAlert, hideAlert } = useSuccessAlert();
  const [hasSuceeded, setHasSuceeded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const submission = await submitForm(values);
      if (!submission) {
        formik.resetForm();
        setHasSuceeded(false);
        showAlert("Something has gone wrong with submitting the form"); //TODO use translations
        setIsLoading(false);
        return;
      }
      await notifyAdmin(values, Email.FORM_SUBMITTED);
      formik.resetForm();
      setIsLoading(false);
      setHasSuceeded(true);
      showAlert("The form has been submitted successfully!"); //TODO Use translations
    },
  });

  return (
    <div
      id="lePiajeForm"
      className="w-full py-20 h-full max-h-[65em] bg-slate-950 flex  items-center justify-center p-4"
    >
      <Alert
        message={message}
        isVisible={isVisible}
        onClose={hideAlert}
        success={hasSuceeded}
      />

      <div className="w-full flex md:max-2xl:flex-row flex-col  max-w-4xl h-full bg-slate-950 rounded-xl shadow-brand-gold/40 shadow-2xl drop-shadow-2xl overflow-hidden">
        <div className="md:max-2xl:w-1/2 w-full relative ">
          <Image
            src={formImageBackground}
            alt="Hero background"
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            className="blur-md"
          />
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          ></div>

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 p-8 gap-y-8 text-white h-full flex w-full flex-col justify-center">
            <div className="flex flex-col gap-y-2">
              <Logo width="w-[8em]" height="h-[8em]" blur="blur-lg" />
            </div>
            <div>
              <h2 className="text-xl font-light mb-4 text-brand-gold">
                {t("title")}
              </h2>
              <p className="text-sm text-brand-cream">{t("main_text")}</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}

        <div className="md:max-2xl:w-1/2 bg-gradient-to-r from-brand-charcoal to-brand-gold-dark w-full p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-4 my-4">
            <div>
              <Label className="text-brand-cream" htmlFor="name">
                {t("form_inputs.full_name")}
              </Label>
              <Input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                id="name"
                name="name"
                placeholder="Mario Rossi"
                className="input"
                disabled={isLoading}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <Label className="text-brand-cream" htmlFor="email">
                Email
              </Label>
              <Input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                id="email"
                name="email"
                type="email"
                placeholder="mario.rossi@gmail.com"
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <Label className="text-brand-cream" htmlFor="phone">
                Phone
              </Label>
              <Input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                id="phone"
                name="phone"
                type="tel"
                placeholder="+393381234567"
                disabled={isLoading}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              )}
            </div>

            <div>
              <Label className="text-brand-cream" htmlFor="message">
                Message
              </Label>
              <Textarea
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                id="message"
                name="message"
                placeholder="Your message here..."
                className="h-32"
                disabled={isLoading}
              />
              {formik.touched.message && formik.errors.message && (
                <div className="text-red-500 text-sm">
                  {formik.errors.message}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-brand-gold">
              {isLoading ? (
                <PulsingDotSpinner color="bg-green-400" />
              ) : (
                t("submit_button")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
