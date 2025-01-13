"use client";

import Link from "next/link";
import { signUp } from "./actions";
import { FormInput } from "../../../components/input";
import { FormBtn } from "../../../components/btn";
import { useFormState } from "react-dom";

export default function SignUp() {
  const [state, dispatch] = useFormState(signUp, null);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form action={dispatch} className="px-4 flex flex-col space-y-4 w-1/4">
        <FormInput
          name="account"
          placeholder="id"
          required
          errors={state?.fieldErrors.account}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
          errors={state?.fieldErrors.password}
        />
        <FormInput
          name="confirm-password"
          type="password"
          placeholder="confirm password"
          required
          errors={state?.fieldErrors.confirmPassword}
        />
        <FormInput
          name="email"
          placeholder="email"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="riot-account-id"
          placeholder="riot name: playername + KR1"
          required
          errors={state?.fieldErrors.riotAccountId}
        />
        <FormBtn btnText="sign up" />
      </form>
      <h6>if you have account? please</h6>
      <Link href={"/login"}>login</Link>
    </div>
  );
}
