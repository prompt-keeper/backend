# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.


## TODO
- [ ] Prompts api endpoint
  - GET /prompts : Get all prompts (or 10 per page)
  - POST /prompts/find: Find 1 prompt by name or id
  - POST /prompts : Create a new prompt, including creating a prompt version and prompt version content
  - PUT /prompts/:id : Update a prompt, what actually happens is a new prompt version is created and the prompt is updated to point to the new version
  - DELETE /prompts/:id : Delete a prompt and its versions
  - DELETE /prompts/:id/versions : roll back to a previous version of a prompt
  - GET /prompts/:id/versions : Get prompt version history by prompt id
  - GET /prompts/:id/versions/:hash : Get prompt version by prompt id and version hash
