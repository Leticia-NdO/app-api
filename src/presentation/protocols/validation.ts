import { ValidationResult } from './validation-result'

export interface Validation {
  validate: (input: any) => ValidationResult
}
