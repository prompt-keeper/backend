import { t } from "elysia";

const ListPromptResponse = t.Object({
  prompts: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
  ),
});

// t.Union appears to by not working
const FindPromptBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
});

const FindPromptResponse = t.Object({
  id: t.String(),
  name: t.String(),
  sha: t.Optional(t.String()),
  content: t.Optional(t.String()),
});

const CreatePromptBody = t.Object({
  name: t.String(),
  content: t.String(),
});

const CreatePromptResponse = t.Object({
  id: t.String(),
  name: t.String(),
  sha: t.String(),
  content: t.String(),
});

const UpdatePromptBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
  content: t.Optional(t.String()),
});

const UpdatePromptResponse = t.Object({
  id: t.String(),
  name: t.String(),
  sha: t.Optional(t.String()),
  content: t.Optional(t.String()),
});

export {
  ListPromptResponse,
  CreatePromptBody,
  CreatePromptResponse,
  UpdatePromptBody,
  FindPromptBody,
  FindPromptResponse,
  UpdatePromptResponse,
};
