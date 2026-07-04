import { FormType } from "@/types";

export async function submitForm(formData: FormType): Promise<{ error: boolean, message: string }> {
    try {
        const response = await fetch("/api/form", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.status !== 201) {
            throw new Error(`Something wrong happened while submitting the form ${JSON.stringify(response)} ${JSON.stringify(result)}`)
        }

        if (!result) {
            return {
                error: true,
                message: 'something went wrong submitting the form',
            }
        }
        return {
            error: false,
            message: 'Form was submitted!'
        }
    } catch (err) {
        console.log("error submitting the form at submit_form.services", JSON.stringify(err))
        return {
            error: true,
            message: 'something went wrong submitting the form',
        }
    }
}