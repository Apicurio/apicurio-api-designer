
export interface ApiError {
    causes: RuleViolationCause[]|null
    message: string
    error_code: number
    detail: string
    name: string
}

export interface RuleViolationCause {
    description: string
    context: string|null
}
