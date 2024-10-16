class ApiError extends Error {
    constructor(
        statusCode,
        message = 'something went wrong',
        errors = [],
        stack = ''
    ) {
        // Override the Error constructor
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // Use the provided stack if available, or capture the stack trace
        if (stack) {
            this.stack = stack;
        } else {
            // Check if Error.captureStackTrace exists before using it
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            }
        }
    }
}

export { ApiError };
