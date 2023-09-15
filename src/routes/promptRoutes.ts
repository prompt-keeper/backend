import Elysia from "elysia";
import authGuard from "../authGuard";
import promptControler from "../controllers/promptControler";
import { ListPromptResponse } from "../dtos/promptsDTO";

const promptRoutes = new Elysia({ prefix: "/prompts" })
  .onTransform(authGuard)
  .get("/", promptControler.list_prompt, { response: ListPromptResponse });

export default promptRoutes;
