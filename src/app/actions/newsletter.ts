"use server";

import * as brevo from "@getbrevo/brevo";

export async function addEmailToBrevo(formData: FormData) {
  const email = formData.get("email") as string;

  // Enhanced validation
  if (!email || typeof email !== "string") {
    console.error("Email is required and must be a string");
    return {
      success: false,
      message: "L'adresse email est requise",
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      success: false,
      message: "L'adresse email ne peut pas être vide",
    };
  }

  // Server-side email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      message: "Veuillez entrer une adresse email valide",
    };
  }

  // Check for environment configuration
  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured");
    return {
      success: false,
      message:
        "Service temporairement indisponible. Veuillez réessayer plus tard.",
    };
  }

  try {
    // Configure Brevo API
    const apiInstance = new brevo.ContactsApi();
    apiInstance.setApiKey(
      brevo.ContactsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // Create contact data
    const createContact = new brevo.CreateContact();
    createContact.email = trimmedEmail.toLowerCase(); // Normalize email

    // Use environment variable for list ID, fallback to default
    const listId = process.env.BREVO_LIST_ID
      ? parseInt(process.env.BREVO_LIST_ID)
      : 4;
    createContact.listIds = [listId];

    // Add contact to Brevo
    const result = await apiInstance.createContact(createContact);

    console.log("Contact ajouté:", result.body?.id);
    return {
      success: true,
      message: "Votre inscription a été effectuée avec succès",
    };
  } catch (error: unknown) {
    console.error("Brevo API Error:", error);

    // Type guard for axios-like errors
    const isAxiosError = (
      err: unknown
    ): err is {
      response?: {
        status?: number;
        body?: { code?: string };
        data?: { code?: string };
      };
    } => {
      return err !== null && typeof err === "object" && "response" in err;
    };

    // Log detailed error information
    if (isAxiosError(error) && error.response) {
      console.error("Error status:", error.response.status);
      console.error(
        "Error data:",
        JSON.stringify(error.response.body || error.response.data, null, 2)
      );
    }

    // Handle duplicate contact error (contact already exists) - treat as success
    if (
      (isAxiosError(error) &&
        (error.response?.body?.code === "duplicate_parameter" ||
          error.response?.data?.code === "duplicate_parameter")) ||
      (error instanceof Error && error.message.includes("duplicate_parameter"))
    ) {
      console.log("Email already subscribed - treating as success");
      return {
        success: true,
        message:
          "Votre inscription a été confirmée ! Vous êtes déjà abonné(e) à notre newsletter.",
      };
    }

    // Handle specific error types
    if (isAxiosError(error) && error.response && error.response.status) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Invalid API key");
        return {
          success: false,
          message:
            "Service temporairement indisponible. Veuillez réessayer plus tard.",
        };
      }

      if (status === 429) {
        console.error("Rate limit exceeded");
        return {
          success: false,
          message: "Trop de tentatives. Veuillez patienter avant de réessayer.",
        };
      }

      if (status >= 500) {
        console.error("Server error");
        return {
          success: false,
          message:
            "Service temporairement indisponible. Veuillez réessayer dans quelques minutes.",
        };
      }
    }

    // For other errors, provide user-friendly message
    console.error("Erreur lors de l'inscription à la newsletter:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
    };
  }
}
