import { Elysia } from "elysia";
import authGuard from "@/authGuard";
import promptControler from "@/controllers/promptControler";
import {
  CreatePromptBody,
  CreatePromptResponse,
  DeletePromptBody,
  DeletePromptResponse,
  FindPromptBody,
  FindPromptResponse,
  FindVersionBody,
  FindVersionResponse,
  ListPromptResponse,
  LogPromptBody,
  LogPromptResponse,
  RevertVersionBody,
  RevertVersionResponse,
  UpdatePromptBody,
  UpdatePromptResponse,
} from "@/dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.listPrompt, { response: ListPromptResponse })
  .post("/find", ({ body }) => promptControler.getPrompt(body), {
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
  })
  .post("/log", ({ body }) => promptControler.getPromptHistories(body), {
    body: LogPromptBody,
    response: LogPromptResponse,
  })
  .post("/findVersion", ({ body }) => promptControler.getPromptVersion(body), {
    body: FindVersionBody,
    response: FindVersionResponse,
  })
  .post("/revert", ({ body }) => promptControler.revertPromptVersion(body), {
    body: RevertVersionBody,
    response: RevertVersionResponse,
  })
  .post("/delete", ({ body }) => promptControler.deletePrompt(body), {
    body: DeletePromptBody,
    response: DeletePromptResponse,
  });
export default promptRoutes;
