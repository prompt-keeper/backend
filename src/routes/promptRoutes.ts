import { Elysia } from "elysia";
import authGuard from "@/authGuard";
import promptControler from "@/controllers/promptControler";
import {
  CreatePromptBody,
  CreatePromptResponse,
  FindPromptBody,
  FindPromptResponse,
  ListPromptResponse,
  UpdatePromptBody,
  UpdatePromptResponse,
} from "@/dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.listPrompt, { response: ListPromptResponse })
  .post("/find", ({ body }) => promptControler.getPrompt(body as any), {
    body: FindPromptBody,
    response: FindPromptResponse,
  })
  .post("/", ({ body }) => promptControler.createPrompt(body), {
    body: CreatePromptBody,
    response: CreatePromptResponse,
  })
  .put("/", ({ body }) => promptControler.updatePrompt(body), {
    body: UpdatePromptBody,
    response: UpdatePromptResponse,
  });
export default promptRoutes;
