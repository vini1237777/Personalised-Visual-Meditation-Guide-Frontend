import { ERROR_TEXT } from "../constants/errors.text";

export function ErrorState({ message }: { message?: string }) {
  return <div role="alert">{message ?? ERROR_TEXT.generic}</div>;
}
