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
  - [x] GET /prompts : Get all prompts (or 10 per page)
  - [x] POST /prompts/find: Find 1 prompt by name or id
  - [x] POST /prompts : Create a new prompt, including creating a prompt version and prompt version content
  - [x] PUT /prompts/:id : Update a prompt, what actually happens is a new prompt version is created
  - [x] POST /prompts/log : Get prompt version histories by prompt id
  - [ ] GET /prompts/:id/versions/:sha : Get prompt version by prompt id and version hash
  - [ ] POST /prompts/revert : roll back to a previous version of a prompt, it could be revert by 1 version or to a specific version by sha
  - [ ] DELETE /prompts/:id : Delete a prompt and its versions
- [ ] Redis integration
