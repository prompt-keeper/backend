import Elysia, { t } from "elysia";
import authGuard from "@/authGuard";
import promptControler from "@/controllers/promptControler";
import {
  CreatePromptBody,
  CreatePromptResponse,
  ListPromptResponse,
} from "@/dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.listPrompt, { response: ListPromptResponse })
  .post("/find", ({ body }) => promptControler.getPrompt(body as any))
  .post("/", ({ body }) => promptControler.createPrompt(body), {
    body: CreatePromptBody,
    response: CreatePromptResponse,
  })
  .put("/", ({ body }) => promptControler.updatePrompt(body));
export default promptRoutes;
