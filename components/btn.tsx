import { useFormStatus } from "react-dom";

interface FormBtnProps {
  btnText: string;
}

export function FormBtn({ btnText }: FormBtnProps) {
  const { pending } = useFormStatus();
  return <button type="submit">{pending ? "loading" : btnText}</button>;
}
