import { router } from "expo-router";
import { useEffect } from "react";

export default function NewPredictionRedirect() {
  useEffect(() => {
    router.replace("/desafio/index" as never);
  }, []);

  return null;
}
