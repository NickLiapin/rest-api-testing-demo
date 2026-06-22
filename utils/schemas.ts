import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  additionalProperties: false,
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
} as const;

/** Assert that `data` matches a JSON schema, with readable errors on failure. */
export function validateSchema(schema: object, data: unknown): void {
  const validate = ajv.compile(schema);
  const ok = validate(data);
  expect(ok, JSON.stringify(validate.errors)).toBe(true);
}
