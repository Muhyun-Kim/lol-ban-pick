"use client";

import Link from "next/link";
import { login } from "./actions";
import { useFormState } from "react-dom";
import { FormInput } from "@/components/input";
import { FormBtn } from "@/components/btn";

export default function Home() {
  const [state, dispatch] = useFormState(login, null);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form action={dispatch} className="px-4 flex flex-col space-y-4">
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
        <FormBtn btnText="login" />
      </form>
      <h6>if you dont have account? please</h6>
      <Link href={"/sign-up"}>sign up</Link>
    </div>
  );
}
