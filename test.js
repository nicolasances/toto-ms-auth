const { verifyGoogleToken } = require('./util/VerifyGoogleToken')
const { config } = require('./config');
const { generateTotoJWTToken } = require('./util/GenerateTotoJWTToken');
const { verifyAndDecode } = require('./util/JWTToken');

// Valid token
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjOWM3OGUzYjAwZTFiYjA5MmQyNDZjODg3YjExMjIwYzg3YjdkMjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjE1MDI2NTYyMzA2LTNoNWNhNnU5b3NzYW9icjNhdGdvcnNjdmVxanMxaXJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjE1MDI2NTYyMzA2LTNoNWNhNnU5b3NzYW9icjNhdGdvcnNjdmVxanMxaXJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA1MzIwODQ4MTI1MTEwODE3Njg4IiwiZW1haWwiOiJuaWNvbGFzLm1hdHRlYXp6aUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjFscVlIS3U5VndsT3FYbGVNcXd4d1EiLCJuYmYiOjE2OTI1Mjk2NzcsIm5hbWUiOiJOaWNvbGFzIE1hdHRlYXp6aSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjV0NaTmxTSDVGMmNvbENSLUM3MXo4S3EzSDBKeTBHODNBR0h1cldlZlZJVEU9czk2LWMiLCJnaXZlbl9uYW1lIjoiTmljb2xhcyIsImZhbWlseV9uYW1lIjoiTWF0dGVhenppIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2OTI1Mjk5NzcsImV4cCI6MTY5MjUzMzU3NywianRpIjoiNmU1YmI4ZmM5ODMzNzYzMmFiOThmNDEwYTBmNGQ4OTIwMmZiZGVlMSJ9.PMHwYjYhl61HkWXcbzena3nCJe0EjF5McttN_ojVdaChnU3uzJQbvJ2aBHz7HnPaO39TtWws-L-I_ap5a4wzSe2NB4S3SwqCQNQthV8eQL5uXpHToDRw4rDjL3-FK0aVTYnbcBDQuxl-HjTtqwu-TdyPZicrPULlspo5QZWAnHNqD1SDfca1Vmdx5S8Xr4XkpybyTvOPTuUIU1YFOhLmE8RhZerCBOy5M8BVOoMh3-j9FmsrrvEzF8obvDL4ox1XvxaRh6rOfdE1m80DSBmib6_O2xnyDdY0v9NV17CKol98vvKjKm4BBVL0hHDwJmy8wVJSFP5ECnOSRkM6Hn_tjg";
const clientId = "215026562306-3h5ca6u9ossaobr3atgorscveqjs1ird.apps.googleusercontent.com"
const signingKey = "nioasdioau8sd098na8s90da0s8d";

// Invalid token
// const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjOWM3OGUzYjAwZTFiYjA5MmQyNDZjODg3YjExMjIwYzg3YjdkMjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMTUwMjY1NjIzMDYtM2g1Y2E2dTlvc3Nhb2JyM2F0Z29yc2N2ZXFqczFpcmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMTUwMjY1NjIzMDYtM2g1Y2E2dTlvc3Nhb2JyM2F0Z29yc2N2ZXFqczFpcmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDUzMjA4NDgxMjUxMTA4MTc2ODgiLCJlbWFpbCI6Im5pY29sYXMubWF0dGVhenppQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE2OTI0NjM5MzcsIm5hbWUiOiJOaWNvbGFzIE1hdHRlYXp6aSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjV0NaTmxTSDVGMmNvbENSLUM3MXo4S3EzSDBKeTBHODNBR0h1cldlZlZJVEU9czk2LWMiLCJnaXZlbl9uYW1lIjoiTmljb2xhcyIsImZhbWlseV9uYW1lIjoiTWF0dGVhenppIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2OTI0NjQyMzcsImV4cCI6MTY5MjQ2NzgzNywianRpIjoiNmJiNWVhMGEyZDFhZmEwMDBkMzQ3YzRiZTJkZTkyMGZmYmEzYzRkMSJ9.hqfdddbqtoz9cpgkRnBjC8Nq1xwNOq8Tav_rhbwKjod_JA6Kf4a725V-cg7WcS3GJQCTvmqcjAgjdzawqvaoPdupzDNRaGz8bfRqzVyTUdTt_ritTto9RD1knNgOx09hEVcVHZzlmgSSM78LZYyvhhUvVECiNtQioqmE43gE_5Rdq-9tmWnPyS6ScHmy1l-6huCtDypHEvK6fFC_MOlSUE4N0arpTPLHap3u0cHizmry_eJp4BsDO2aU_zpXbfX9HwEGoGwCg_4SL7wHsxbB44bpzyBQ3pBaSMhLeyCYkWsyp2_ZHbrkydHrBXjNW0Z5rm_Q4F2oNJ7AamCVGb4tdQ";

const check = async () => {

    config.setAuthorizedClientIDs({ "totoMoneyWeb": clientId })

    const result = await verifyGoogleToken(token, { "x-client": "totoMoneyWeb" })

    console.log(result);
}

const genKey = async () => {

    config.setJWTSigningKey(signingKey);

    let key = generateTotoJWTToken("nicolas.matteazzi@gmail.com");

    console.log(key);

}

const verifyJWT = () => {

    config.setJWTSigningKey(signingKey);

    const result = verifyAndDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmljb2xhcy5tYXR0ZWF6emlAZ21haWwuY29tIiwiYXV0aFByb3ZpZGVyIjoidG90byIsImV4cCI6MTY5NTIxOTMzMywiaWF0IjoxNjkyNTQwOTMzfQ.VO8ec8WHxRb1wp6ww0Lh7gNKKpwuvtjc3lUgIb8oxU4");

    console.log(result);
}

// check();
// genKey();
verifyJWT();