import { ValidationResult } from '../../validation/protocols/validation-result'

export interface Validation {
  validate: (input: any) => ValidationResult
}
