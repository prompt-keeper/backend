import { t } from "elysia";

const CreateAPIKeyBody = t.Object({
  name: t.String({
    error: "Name is required",
  }),
  type: t.String({
    error: "Key type is required",
  }),
});

const DeleteAPIKeyParams = t.Object({
  id: t.String({
    error: "key is required",
  }),
});

const ListAPIKeyResponse = t.Object({
  keys: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
      type: t.String(),
    }),
  ),
});

const CreateAPIKeyResponse = t.Object({
  id: t.String(),
  name: t.String(),
  type: t.String(),
});

const SimpleResponse = t.Object({
  message: t.String(),
});

export {
  CreateAPIKeyBody,
  CreateAPIKeyResponse,
  DeleteAPIKeyParams,
  ListAPIKeyResponse,
  SimpleResponse,
};
