import { TypeOf, AnyZodObject } from 'zod';

export const parseBody = <T>(body: string, schema: AnyZodObject) => {
    const json = JSON.parse(body);
    const parsedBody = schema.parse(json);
    return parsedBody as T;
};
