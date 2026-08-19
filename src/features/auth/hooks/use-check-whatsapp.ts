import { useMutation } from "@tanstack/react-query";
import { checkWhatsapp } from "../services/auth.service";

export function useCheckWhatsapp() {
  return useMutation({
    mutationFn: (whatsapp: string) => checkWhatsapp(whatsapp),
  });
}
