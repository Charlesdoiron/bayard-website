"use client";

import { addEmailToBrevo } from "@/app/actions/newsletter";
import { useState, useTransition, useRef, useCallback, useEffect } from "react";

interface ValidationState {
  isValid: boolean;
  error: string;
}

export default function Newsletter() {
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    error: "",
  });
  const [retryCount, setRetryCount] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const validateEmail = useCallback((email: string): ValidationState => {
    if (!email.trim()) {
      return { isValid: false, error: "L'adresse email est requise" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Veuillez entrer une adresse email valide",
      };
    }

    return { isValid: true, error: "" };
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      const validationResult = validateEmail(email);
      setValidation(validationResult);

      // Clear any previous messages when user starts typing
      if (message) {
        setMessage("");
        setIsSuccess(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [validateEmail, message]
  );

  const clearMessage = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMessage("");
      setIsSuccess(false);
    }, 7000); // Extended to 7 seconds for better UX
  }, []);

  const handleRetry = useCallback(async (formData: FormData) => {
    setRetryCount((prev) => prev + 1);
    const result = await addEmailToBrevo(formData);
    return result;
  }, []);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const validationResult = validateEmail(email);

    if (!validationResult.isValid) {
      setValidation(validationResult);
      emailRef.current?.focus();
      return;
    }

    startTransition(async () => {
      try {
        const result = await addEmailToBrevo(formData);

        if (result?.success) {
          setIsSuccess(true);
          setMessage(result.message);
          setRetryCount(0);
          formRef.current?.reset();
          setValidation({ isValid: true, error: "" });
        } else {
          setIsSuccess(false);
          const errorMessage = result?.message || "Une erreur s'est produite";

          // For network errors, offer retry option
          if (retryCount < 2 && (!result || errorMessage.includes("erreur"))) {
            setMessage(`${errorMessage}. Tentative ${retryCount + 1}/3`);

            // Auto-retry after 2 seconds for network errors
            setTimeout(async () => {
              if (!isPending) return;
              try {
                const retryResult = await handleRetry(formData);
                if (retryResult?.success) {
                  setIsSuccess(true);
                  setMessage(retryResult.message);
                  setRetryCount(0);
                  formRef.current?.reset();
                  setValidation({ isValid: true, error: "" });
                } else {
                  setMessage(
                    retryResult?.message || "Échec de la nouvelle tentative"
                  );
                }
              } catch {
                setMessage(
                  "Impossible de se connecter. Vérifiez votre connexion internet."
                );
              }
            }, 2000);
          } else {
            setMessage(errorMessage);
            setRetryCount(0);
          }

          emailRef.current?.focus();
        }

        clearMessage();
      } catch {
        setIsSuccess(false);
        setMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
        clearMessage();
      }
    });
  }

  return (
    <section
      className="bg-[#090E16] py-16 md:py-20 lg:py-24"
      role="banner"
      aria-label="Newsletter subscription"
    >
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left side - Title */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl text-white font-light leading-tight">
              Inscrivez-vous à<br />
              notre newsletter
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-md">
              Recevez nos dernières actualités et informations directement dans
              votre boîte mail
            </p>
          </div>

          {/* Right side - Form */}
          <div className="flex-1 w-full max-w-2xl p-4">
            <form
              ref={formRef}
              action={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
              noValidate
            >
              <div className="flex-1">
                <div className="relative">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Adresse email pour la newsletter
                  </label>
                  <input
                    ref={emailRef}
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="Entrez votre adresse email"
                    required
                    disabled={isPending}
                    onChange={handleEmailChange}
                    aria-describedby={
                      validation.error ? "email-error" : undefined
                    }
                    aria-invalid={!validation.isValid}
                    className={`w-full md:min-w-md px-0 py-3 bg-transparent border-0 border-b text-white placeholder-white/90 text-base md:text-lg focus:outline-none transition-colors duration-200 disabled:opacity-50 ${
                      validation.isValid
                        ? "border-white/30 focus:border-white"
                        : "border-red-400 focus:border-red-300"
                    }`}
                  />
                  {/* Visual indicator for validation state */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isPending ? "bg-blue-400 w-full animate-pulse" : "w-0"
                    }`}
                  />
                </div>

                {/* Validation error */}
                {validation.error && (
                  <div
                    id="email-error"
                    className="mt-2 text-sm text-red-400 animate-fade-in"
                    role="alert"
                    aria-live="polite"
                  >
                    {validation.error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending || !validation.isValid}
                className={`px-8 py-3 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#090E16] ${
                  isPending || !validation.isValid
                    ? "bg-white/50 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 cursor-pointer active:scale-95"
                }`}
                aria-describedby="submit-status"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        strokeOpacity="1"
                      />
                    </svg>
                    INSCRIPTION...
                  </span>
                ) : (
                  "S'INSCRIRE"
                )}
              </button>
            </form>

            {/* Status message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm transition-all duration-500 animate-fade-in ${
                  isSuccess
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "bg-red-400/10 text-red-400 border border-red-400/20"
                }`}
                role="alert"
                aria-live="polite"
                id="submit-status"
              >
                <div className="flex items-start gap-2">
                  {isSuccess ? (
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
