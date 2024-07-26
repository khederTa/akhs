const methodAction = {
  POST: "write",
  PUT: "update",
  GET: "read",
  DELETE: "delete",
};

const utils = (req) => {
  const resourceId = req.params.id;
  const resourceName = req.baseUrl.slice(1);
  const action = methodAction[req.method];

  return { resourceId, resourceName, action };
};

module.exports = { utils };
