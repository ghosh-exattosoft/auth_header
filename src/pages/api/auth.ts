import {createAuthorizationHeader, isSignatureValid} from "ondc-crypto-sdk-nodejs";

export default async function handler(request: any, res: {
	status: (arg0: number) => {
		(): any; new(): any; json: {
			(arg0: { isValid: boolean; header: string }): void; new(): any;
		};
	};
}) {
	const publicKey = "ELHA1yg8Dku6vvJzb3K7QOnEL4kkDUpxxJEiTK+l5Qc=";
	const privateKey = "yyJUtgiy+fEq8EAM+Dl3avZrZJxr1TPJPUxcZ4JmTI4QscDXKDwOS7q+8nNvcrtA6cQviSQNSnHEkSJMr6XlBw==";
	
	const request_body = request.body;
	// const request_body = {"context":{"domain":"ONDC:FIS12","location":{"country":{"code":"IND"},"city":{"code":"*"}},"transaction_id":"e6d9f908-1d26-4ff3-a6d1-3af3d3721054","message_id":"a2fe6d52-9fe4-4d1a-9d0b-dccb8b48522d","action":"search","timestamp":"2023-11-23T10:31:33.001Z","version":"2.0.0","bap_uri":"https://staging.tyreplex.com/","bap_id":"staging.tyreplex.com","ttl":"P10M"},"message":{"intent":{"category":{"descriptor":{"code":"INVOICE_BASED_LOAN"}},"payment":{"collected_by":"BPP","tags":[{"descriptor":{"code":"BUYER_FINDER_FEES"},"display":false,"list":[{"descriptor":{"code":"BUYER_FINDER_FEES_TYPE"},"value":"percent-annualized"},{"descriptor":{"code":"BUYER_FINDER_FEES_PERCENTAGE"},"value":"2.5"}]},{"descriptor":{"code":"SETTLEMENT_TERMS"},"display":false,"list":[{"descriptor":{"code":"DELAY_INTEREST"},"value":"1"},{"descriptor":{"code":"STATIC_TERMS"},"value":"https://staging.tyreplex.com/terms-of-use"}]}]}}}};
	
	const header = await createAuthorizationHeader({ message: request_body, privateKey: privateKey, bapId: "staging.tyreplex.com", bapUniqueKeyId: "27baa06e-t91a-486c-85e1-cc621b787t01", });
	
	const isValid = await isSignatureValid({ header: header, body: request_body, publicKey: publicKey, });
	
	const result = header.replace('\"', '"');
	console.log(result);
	
	res.status(200).json({"isValid" : isValid, "header": header});
}