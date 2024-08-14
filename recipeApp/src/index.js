// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

let recipes = [];
let recipeCount = 1;

// helper functions
function hex2Str(hex) {
  return ethers.toUtf8String(hex);
}

function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload));
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const metadata = data["metadata"];
  const sender = metadata["msg_sender"];

  let payload = data["payload"];
  payload = JSON.parse(hex2Str(payload));

  const method = payload["method"];
  const handler = advance_method_handlers[method];

  if (!(method in advance_method_handlers)) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: str2hex("warn: method not found"),
      }),
    });
    return "reject";
  }
  return handler(payload, sender);
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

// methods
/**
 *
 * @param {*} payload - this payload will hold the parameters in which we shall access them when handling the cartesi call command
 * @returns {*} this will tell us whether the function was successful or not
 *
 */
const createRecipe = async (payload) => {
  const recipeName = payload["recipeName"];
  const ingredients = payload["ingredients"];
  const procedure = payload["procedure"];

  if (!recipeName || !ingredients || !procedure) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: str2hex("not all parameters are in method"),
      }),
    });
    return "reject";
  }

  let recipeObject = {
    recipeId: recipeCount,
    recipeName: recipeName,
    ingredients: ingredients,
    procedure: procedure,
  };

  recipes.push(recipeObject);

  recipeCount += 1;

  const notice_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload: str2hex("successfully added recipe: " + recipeCount.toString()),
    }),
  });
};

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var advance_method_handlers = {
  createRecipe: createRecipe,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
