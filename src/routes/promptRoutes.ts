import Elysia, { t } from "elysia";
import authGuard from "../authGuard";
import promptControler from "../controllers/promptControler";
import { ListPromptResponse } from "../dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.listPrompt, { response: ListPromptResponse })
  .post("/find", ({ body }) => promptControler.getPrompt(body as any));

export default promptRoutes;
