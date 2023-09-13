import { Elysia, t } from "elysia";

const CreateAPIKeyDTO = t.Object({
  key_type: t.String({
    error: "Key type is required",
  }),
});

const DeleteAPIKeyDTO = t.Object({
  id: t.String({
    error: "ID is required",
  }),
});

const list_api_key = () => {
  return {
    keys: ["key1", "key2"],
  };
};

const create_new_api_key = ({ key_type }: typeof CreateAPIKeyDTO.static) => {
  return {
    key: "New key created",
    key_type,
  };
};

const delete_api_key = ({ id }: typeof DeleteAPIKeyDTO.static) => {
  return {
    message: `Deleted ${id}`,
  };
};

const api_key = new Elysia({ prefix: "/api_key" })
  .get("/list", list_api_key, {
    response: t.Object({
      keys: t.Array(t.String()),
    }),
  })
  .post("/create", ({ body }) => create_new_api_key(body), {
    body: CreateAPIKeyDTO,
    response: t.Object({
      key: t.String(),
    }),
  })
  .delete("/delete/:id", ({ params }) => delete_api_key(params), {
    params: DeleteAPIKeyDTO,
    response: t.Object({
      message: t.String(),
    }),
  });

export default api_key;
