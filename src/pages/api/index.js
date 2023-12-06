
app.post('/on_subscribe', function (req, res) {
	const { challenge } = req.body; // Extract the 'challenge' property from the request body
	const answer = decryptAES256ECB(sharedKey, challenge); // Decrypt the challenge using AES-256-ECB
	const resp = { answer: answer };
	res.status(200).json(resp); // Send a JSON response with the answer
});
