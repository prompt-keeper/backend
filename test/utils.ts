const validRequest = (
  url: string,
  {
    body = undefined,
    method = "POST",
  }: {
    body?: any;
    method?: String;
  },
) => {
  const requestObject: any = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MASTER_KEY}`,
    },
  };
  if (body !== undefined) {
    requestObject.body = JSON.stringify(body);
  }

  return new Request(url, requestObject);
};
export { validRequest };
