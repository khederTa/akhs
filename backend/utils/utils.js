const methodAction = {
  POST: "create",
  PUT: "update",
  GET: "read",
  DELETE: "delete",
};

const utils = (req) => {
  const resourceId = req.params.id;
  const resourceName = req.baseUrl.slice(1).split("/")[2];
  const action = methodAction[req.method];

  return { resourceId, resourceName, action };
};

module.exports = { utils };
