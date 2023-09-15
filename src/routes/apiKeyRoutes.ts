import { Elysia } from "elysia";
import apiKeyController from "../controllers/apiKeyController";
import {
  CreateAPIKeyBody,
  CreateAPIKeyResponse,
  DeleteAPIKeyParams,
  ListAPIKeyResponse,
  SimpleResponse,
} from "../dtos/apiKeysDTO";
import authGuard from "../authGuard";

const apiKeyRoutes = new Elysia({ prefix: "/api-keys" })
  .onTransform(authGuard)
  .get("/", apiKeyController.list_api_key, {
    response: ListAPIKeyResponse,
  })
  .post("/", ({ body }) => apiKeyController.create_new_api_key(body), {
    body: CreateAPIKeyBody,
    response: CreateAPIKeyResponse,
  })
  .delete("/:id", ({ params }) => apiKeyController.delete_api_key(params), {
    params: DeleteAPIKeyParams,
    response: SimpleResponse,
  });

export default apiKeyRoutes;
