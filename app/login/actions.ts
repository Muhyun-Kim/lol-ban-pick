"use server";

import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkAccountExists = async (account: string) => {
  const user = await db.user.findUnique({
    where: {
      account,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const loginSchema = z.object({
  account: z.string().refine(checkAccountExists, "account is not exist"),
  password: z.string({ required_error: "Password is required" }),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    account: formData.get("account"),
    password: formData.get("password"),
  };
  const validationResult = await loginSchema.safeParseAsync(data);
  if (!validationResult.success) {
    return validationResult.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        account: validationResult.data.account,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      validationResult.data.password,
      user!.password
    );
    if (ok) {
      const session = await getSession();
      session.id = user?.id;
      session.save();
      redirect("/home");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password."],
          account: [],
        },
      };
    }
  }
};
