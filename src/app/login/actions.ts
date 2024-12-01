"use server";

export const login = async (state: any, formData: FormData) => {
  const data = {
    account: formData.get("account"),
    password: formData.get("password"),
  };
  console.log(data);
};
