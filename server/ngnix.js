const ngrok = require("ngrok");

const fn = async () => {
  const url = await ngrok.connect(3000);
  console.log(url);
};

fn();
``;
