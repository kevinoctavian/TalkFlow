import {
  create,
  decode,
  getNumericDate,
  type Header,
  type Payload,
  verify,
} from "@zaubrik/djwt";
import "@std/dotenv/load";

import { convertToCryptoKey } from "./convertCryptoKey.ts";

export const signJwt = async ({
  user_id,
  token_id,
  issuer,
  base64PrivateKeyPem,
  expiresIn,
}: {
  user_id: string;
  token_id: string;
  issuer: string;
  base64PrivateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY";
  expiresIn: Date;
}) => {
  const header: Header = {
    alg: "RS256",
    typ: "JWT",
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const tokenExpiresIn = getNumericDate(expiresIn);

  const payload: Payload = {
    iss: issuer,
    iat: nowInSeconds,
    exp: tokenExpiresIn,
    sub: user_id,
    token_id,
  };

  const cryptoPrivateKey = await convertToCryptoKey({
    pemKey: atob(Deno.env.get(base64PrivateKeyPem) as unknown as string),
    type: "PRIVATE",
  });

  const token = await create(header, payload, cryptoPrivateKey!);

  return { token, token_id };
};

export const verifyJwt = async <T>({
  token,
  base64PublicKeyPem,
}: {
  token: string;
  base64PublicKeyPem: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY";
}): Promise<T | null> => {
  try {
    const cryptoPublicKey = await convertToCryptoKey({
      pemKey: atob(Deno.env.get(base64PublicKeyPem) as unknown as string),
      type: "PUBLIC",
    });

    return (await verify(token, cryptoPublicKey!)) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};

if (import.meta.main) {
  console.log(
    decode(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2NhbGhvc3Q6NTE3MyIsImlhdCI6MTczMzMyMTEyNywiZXhwIjoxNzMzMzI0NzI3LCJzdWIiOiI1MTkzNTA4NTY4NDQ0NDM2NDgiLCJ0b2tlbl91dWlkIjoiNTE5NTE0NTc3NjU0OTA2ODgwIn0.pdCvOkGBr5VbuhdytYZdOGg--c9IHRV1qXEbSr28Eo2oemGR_Z3V1eXeYibaXYBfJVFfZJ2Kg1osJ1ooR4rQ1MrC3q9VGPgoUqBfWzJXx5cQe9mO7tmvURAbXOJ1F5vX5wHCFK9q5nxwJM-6yzIjHl_6hmRJMoUcCx8V8JofeZPhd-9fEHVwcTM4wW-AUBQfs0Cy7fcACaiYoIlRqpWP_UU5qNT3txBW-PMRVXVtC3k-PnUKuv0ZSAVAqTBQ5rhet26s_3wMp9NWcpE1pJmwoH2M0F-49w1WjtzP0vFIcURSw6qihavqgnJNFMKX-qrLc1ul0SlQzU5jP2AWc4Yc7VVnwh2iT4QTg1gxLEjE9FPMXoaw6IWTM88hTRR8Qyz0hEm5dz05g7E1XcImGiKRHSr-owaPHstDkwJn_a4vk4Xuf6i_0C6BSGpBKtTrpqR3DA4VXh19Qwe2y3uZIc8S0V3afg0M_yVwb7FqJ9ag1MDsTIsAAMfJhP-6dZwGtrlOjb8utVnZqDrjo21OederyPFwOp55km7axtN4OPpIIF3ywWzsPuxlaRyrwoDR3pWZkINFXCsiNCh4obUBFrhA3htn-IFbd91PWFxha9lupmM6Ljm9gQ0WRds0kDtZxAVJDx4c5Cgx0r7m56WUWbkG8knzEN_Fi6_8KHmpODVMoPs",
    ),
  );
}
