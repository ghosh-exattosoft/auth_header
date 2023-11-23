import { createAuthorizationHeader } from "ondc-crypto-sdk-nodejs"
import { isSignatureValid } from "ondc-crypto-sdk-nodejs"

export default async function Home() {
  const privateKey = "yyJUtgiy+fEq8EAM+Dl3avZrZJxr1TPJPUxcZ4JmTI4QscDXKDwOS7q+8nNvcrtA6cQviSQNSnHEkSJMr6XlBw==";
  
  // const request_body = {"context":{"domain":"ONDC:FIS12","location":{"country":{"code":"IND"},"city":{"code":"*"}},"transaction_id":"e6d9f908-1d26-4ff3-a6d1-3af3d3721054","message_id":"a2fe6d52-9fe4-4d1a-9d0b-dccb8b48522d","action":"search","timestamp":"2023-11-23T10:31:33.001Z","version":"2.0.0","bap_uri":"https://staging.tyreplex.com/","bap_id":"staging.tyreplex.com","ttl":"P10M"},"message":{"intent":{"category":{"descriptor":{"code":"INVOICE_BASED_LOAN"}},"payment":{"collected_by":"BPP","tags":[{"descriptor":{"code":"BUYER_FINDER_FEES"},"display":false,"list":[{"descriptor":{"code":"BUYER_FINDER_FEES_TYPE"},"value":"percent-annualized"},{"descriptor":{"code":"BUYER_FINDER_FEES_PERCENTAGE"},"value":"2.5"}]},{"descriptor":{"code":"SETTLEMENT_TERMS"},"display":false,"list":[{"descriptor":{"code":"DELAY_INTEREST"},"value":"1"},{"descriptor":{"code":"STATIC_TERMS"},"value":"https://staging.tyreplex.com/terms-of-use"}]}]}}}};
   const request_body = {"context":{"domain":"ONDC:FIS12","location":{"country":{"code":"IND"},"city":{"code":"*"}},"transaction_id":"e6d9f908-1d26-4ff3-a6d1-3af3d3721054","message_id":"a2fe6d52-9fe4-4d1a-9d0b-dccb8b48522d","action":"search","timestamp":"2023-11-23T05:23:03.443Z","version":"2.0.0","bap_uri":"https://staging.tyreplex.com/","bap_id":"staging.tyreplex.com","ttl":"PT10M"},"message":{"intent":{"category":{"descriptor":{"code":"INVOICE_BASED_LOAN"}},"payment":{"collected_by":"BPP","tags":[{"descriptor":{"code":"BUYER_FINDER_FEES"},"display":false,"list":[{"descriptor":{"code":"BUYER_FINDER_FEES_TYPE"},"value":"percent-annualized"},{"descriptor":{"code":"BUYER_FINDER_FEES_PERCENTAGE"},"value":"1"}]},{"descriptor":{"code":"SETTLEMENT_TERMS"},"display":false,"list":[{"descriptor":{"code":"DELAY_INTEREST"},"value":"2.5"},{"descriptor":{"code":"STATIC_TERMS"},"value":"https://staging.tyreplex.com/terms-of-use"}]}]}}}};
  //const request_body = {"context":{"domain":"ONDC:FIS12","location":{"country":{"code":"IND"},"city":{"code":"*"}},"transaction_id":"e6d9f908-1d26-4ff3-a6d1-3af3d3721054","message_id":"a2fe6d52-9fe4-4d1a-9d0b-dccb8b48522d","action":"select","timestamp":"2023-11-23T05:23:03.443Z","version":"2.0.0","bap_uri":"https://staging.tyreplex.com/","bap_id":"staging.tyreplex.com","ttl":"PT10M","bpp_id":"bpp.credit.becknprotocol.org","bpp_uri":"https://bpp.credit.becknprotocol.org"},"message":{"order":{"provider":{"id":"PROVIDER_ID"},"items":[{"id":"ITEM_ID_INVOICE_LOAN","xinput":{"form":{"id":"F01"},"form_response":{"status":"SUCCESS","submission_id":"F01_SUBMISSION_ID"}}}]}}};
  
  const publicKey = "ELHA1yg8Dku6vvJzb3K7QOnEL4kkDUpxxJEiTK+l5Qc=";
  
  const header = await createAuthorizationHeader({
    message: request_body,
    privateKey: privateKey,
    bapId: "staging.tyreplex.com", // Subscriber ID that you get after registering to ONDC Network
    bapUniqueKeyId: "27baa06e-t91a-486c-85e1-cc621b787t01", // Unique Key Id or uKid that you get after registering to ONDC Network
  });
  
  console.log(header);
  
  const isValid = await isSignatureValid({
    header: header, // The Authorisation header sent by other network participants
    body: request_body,
    publicKey: publicKey,
  });
  console.log(isValid);
  
  return header;
}
