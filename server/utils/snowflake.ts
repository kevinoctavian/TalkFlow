import { createWorker } from "@mmbytes/snowgen-id";

export const snowflakeGen = createWorker(0n, 1n);
