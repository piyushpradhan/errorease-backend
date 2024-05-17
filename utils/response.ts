export function generateResponse({ data, message, error, statusCode }: { data: any, statusCode?: number, message?: string, error?: string }) {
  return {
    data,
    message,
    error,
    statusCode
  }
}
