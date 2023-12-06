import {NextResponse} from "next/server";

import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
	message: string
}

type Payload = {
	value: string;
}

const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const crypto = require('crypto'); // Node.js crypto module for encryption and decryption
const _sodium = require('libsodium-wrappers');

const port = 3000; // Port on which the server will listen
const PRIVATE_KEY_1 = 'MC4CAQAwBQYDK2VuBCIEIABF7p/gpm2GgZiVs9VBOh5VHN7iJTLj2mX6MiPvke9B';
const PUBLIC_KEY_1 = 'MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=';
const REQUEST_ID = '27baa06d-f90a-486c-85e5-cc621b787f09';
const SIGNING_PRIVATE_KEY = 'yyJUtgiy+fEq8EAM+Dl3avZrZJxr1TPJPUxcZ4JmTI4QscDXKDwOS7q+8nNvcrtA6cQviSQNSnHEkSJMr6XlBw==';

const htmlFile = `
<!--Contents of ondc-site-verification.html. -->
<!--Please replace SIGNED_UNIQUE_REQ_ID with an actual value-->
<html>
  <head>
    <meta
      name="ondc-site-verification"
      content="SIGNED_UNIQUE_REQ_ID"
    />
  </head>
  <body>
    ONDC Site Verification Page
  </body>
</html>
`;

// Pre-defined public and private keys
const privateKey = crypto.createPrivateKey({
	key: Buffer.from(PRIVATE_KEY_1, 'base64'), // Decode private key from base64
	format: 'der', // Specify the key format as DER
	type: 'pkcs8', // Specify the key type as PKCS#8
});
const publicKey = crypto.createPublicKey({
	key: Buffer.from(PUBLIC_KEY_1, 'base64'), // Decode public key from base64
	format: 'der', // Specify the key format as DER
	type: 'spki', // Specify the key type as SubjectPublicKeyInfo (SPKI)
});

// Calculate the shared secret key using Diffie-Hellman
const sharedKey = crypto.diffieHellman({
	privateKey: privateKey,
	publicKey: publicKey,
});
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	
	if (req.method === 'POST') {
		const on_subscribe = await onSubscribe(req, res);
		res.status(200).json(on_subscribe)
	} else {
		const signedContent = await siteVerification(req, res);
		res.status(200).json(signedContent)
	}
}

async function onSubscribe(req: NextApiRequest, res: any) {
	const r_body = JSON.parse(req.body);
	const challenge = (r_body.challenge);
	const answer = decryptAES256ECB(sharedKey, challenge); // Decrypt the challenge using AES-256-ECB
	const resp = { answer: answer };
	return res.status(200).json(resp); // Send a JSON response with the answer
}

function decryptAES256ECB(key: any, encrypted: any) {
	const iv = Buffer.alloc(0); // ECB doesn't use IV
	const decipher = crypto.createDecipheriv('aes-256-ecb', sharedKey, iv);
	decipher.setAutoPadding(false);
	let decrypted = decipher.update(encrypted, 'base64', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

async function siteVerification(req: any, res: any) {
	const signedContent = await signMessage(REQUEST_ID, SIGNING_PRIVATE_KEY);
	// Replace the placeholder with the actual value
	const modifiedHTML = htmlFile.replace(/SIGNED_UNIQUE_REQ_ID/g, signedContent);
	// Send the modified HTML as the response
	return res.send(modifiedHTML);
}

async function signMessage(signingString: any, privateKey: any) {
	await _sodium.ready;
	const sodium = _sodium;
	const signedMessage = sodium.crypto_sign_detached(
		signingString,
		sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL)
	);
	const signature = sodium.to_base64(
		signedMessage,
		_sodium.base64_variants.ORIGINAL
	);
	return signature;
}