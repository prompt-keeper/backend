import { Elysia } from "elysia";
import authGuard from "@/authGuard";
import promptControler from "@/controllers/promptControler";
import {
  CreatePromptBody,
  CreatePromptResponse,
  FindPromptBody,
  ListPromptResponse,
  UpdatePromptBody,
} from "@/dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.listPrompt, { response: ListPromptResponse })
  .post("/find", ({ body }) => promptControler.getPrompt(body as any), {
    body: FindPromptBody,
  })
  .post("/", ({ body }) => promptControler.createPrompt(body), {
    body: CreatePromptBody,
    response: CreatePromptResponse,
  })
  .put("/", ({ body }) => promptControler.updatePrompt(body), {
    body: UpdatePromptBody,
  });
export default promptRoutes;
