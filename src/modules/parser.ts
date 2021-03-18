type Child =
  | {
      type: "text";
      body: string;
    }
  | {
      type: "title";
      size: number;
      body: string;
    };

const parse = (pureText: string): Child[] => {
  const splitedTexts = pureText.split(`\n`);
  return splitedTexts.map((text) => {
    let title = text.match(/^(#{1,3}) (.{1,})$/);
    if (title) {
      return {
        type: "title",
        size: title[1].length,
        body: title[2],
      };
    } else {
      return {
        type: "text",
        body: text,
      };
    }
  });
};

export default parse;
