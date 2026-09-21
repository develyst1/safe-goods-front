import type { Me, RegisterRequest } from "@/types/api/main/auth";
import { getMeApi, registerApi } from "@/lib/api/api-main";

export const register = async (body: RegisterRequest) => {
  const res = await registerApi(body);
  return res.data;
};

export const getMe = async (): Promise<Me> => {
  const res = await getMeApi();
  return res.data;
};
