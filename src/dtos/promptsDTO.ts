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

const LogPromptBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
  number: t.Optional(t.Number()),
});

const LogPromptResponse = t.Object({
  histories: t.Array(
    t.Object({
      sha: t.String(),
      content: t.String(),
      createdAt: t.Date(),
    }),
  ),
});

const FindVersionBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
  sha: t.String(),
});
const FindVersionResponse = t.Object({
  sha: t.String(),
  content: t.String(),
  createdAt: t.Date(),
});

const RevertVersionBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
});

const RevertVersionResponse = t.Object({
  sha: t.String(),
  content: t.String(),
  createdAt: t.Date(),
});

const DeletePromptBody = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
});

const DeletePromptResponse = t.Object({
  message: t.String(),
  status: t.String(),
});

export {
  ListPromptResponse,
  CreatePromptBody,
  CreatePromptResponse,
  UpdatePromptBody,
  FindPromptBody,
  FindPromptResponse,
  UpdatePromptResponse,
  LogPromptBody,
  LogPromptResponse,
  FindVersionBody,
  FindVersionResponse,
  RevertVersionBody,
  RevertVersionResponse,
  DeletePromptBody,
  DeletePromptResponse,
};
