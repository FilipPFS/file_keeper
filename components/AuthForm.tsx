"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.actions";
import OtpModal from "./OtpModal";

type Props = {
  type: "sign-in" | "sign-up";
};

const authFormSchema = (formType: "sign-in" | "sign-up") => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<null | string>(null);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage(
        "Erreur dans la création de compte. Veuillez ressayer dans quelques minutes."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Se Connecter" : "S'inscrire"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">
                      Nom Complet
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="shad-input"
                        placeholder="Entrer votre nom complet"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
                      placeholder="Entrer votre email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            className="form-submit-button"
            type="submit"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign-In" : "Sign-Up"}

            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                width={24}
                height={24}
                alt="loader"
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Vous n'avez pas de compte?"
                : "Déjà enregistré?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 text-medium text-brand-100"
            >
              {type === "sign-in" ? "S'Inscrire" : "Se connecter"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
