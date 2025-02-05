const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: [
			"http://localhost:8100",
			"https://codeagainstcrime.com",
			"https://www.codeagainstcrime.com",
		],
	})
);

app.get("/api/hello", (req, res) => {
	res.send("Hello World from Express!");
});

app.post("/api/test", (req, res) => {
	res.send("POST received!");
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server running at http://10.10.10.18:${port}`);
});
