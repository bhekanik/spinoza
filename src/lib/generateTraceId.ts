import { nanoid } from "nanoid";

export const generateTraceId = (size?: number) => {
  return size ? nanoid(size) : nanoid();
};
