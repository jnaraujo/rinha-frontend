function isJsonValid(json) {
  if (typeof json !== "string"){
    return false;
  }

  try {
    const parse = JSON.parse(json);
    const isValid = typeof parse === 'object';

    return {
      isValid: isValid,
      json: parse
    }
  } catch (e) {
    return false;
  }
}

onmessage = function(e) {
  const action = e.data.action;
  const json = e.data.data;
  const id = e.data.id;

  switch (action) {
    case 'validate':
      self.postMessage({
        id: id,
        ...isJsonValid(json)
      });
      break;
    default:
      self.postMessage('Unknown action');
  }

}
