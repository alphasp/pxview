const extractNovelAjaxData = (response) => {
  if (!response || response.error || !response.body) {
    return null;
  }

  return response.body;
};

export default extractNovelAjaxData;
