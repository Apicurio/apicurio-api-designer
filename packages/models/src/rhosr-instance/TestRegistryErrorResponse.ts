
export interface TestRegistryErrorResponse {
    causes: [
        {
            description: string,
            context: string
        }
    ],
    message: string,
    error_code: number,
    detail: string,
    name: string
}
