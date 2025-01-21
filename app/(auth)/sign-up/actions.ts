"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import db from "@/lib/db";

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (account: string) => {
  const user = await db.user.findUnique({
    where: {
      account,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const signUpSchema = z
  .object({
    account: z
      .string({ invalid_type_error: "account must be string" })
      .min(6, "account is too short")
      .max(20, "account is too long")
      .refine(checkUniqueUsername, "account is already exist"),
    password: z.string(),
    confirmPassword: z.string(),
    email: z
      .string()
      .email()
      .refine(checkUniqueEmail, "email is already exist"),
    riotAccountId: z.string(),
  })
  .refine(checkPassword, {
    message: "password and confirm password are not same",
    path: ["confirmPassword"],
  });

export const signUp = async (prevState: any, formData: FormData) => {
  const data = {
    account: formData.get("account"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
    email: formData.get("email"),
    riotAccountId: formData.get("riot-account-id"),
  };
  const validationResult = await signUpSchema.safeParseAsync(data);
  if (!validationResult.success) {
    return validationResult.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(
      validationResult.data.password,
      10
    );
    const user = await db.user.create({
      data: {
        account: validationResult.data.account,
        password: hashedPassword,
        email: validationResult.data.email,
        riot_account_id: validationResult.data.riotAccountId,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/home");
  }
};
