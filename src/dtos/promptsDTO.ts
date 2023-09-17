import { t } from "elysia";

const ListPromptResponse = t.Object({
  prompts: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
  ),
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
  id: t.String(),
  content: t.String(),
});

export {
  ListPromptResponse,
  CreatePromptBody,
  CreatePromptResponse,
  UpdatePromptBody,
};
