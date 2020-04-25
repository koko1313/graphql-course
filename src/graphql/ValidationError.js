import { GraphQLError } from 'graphql';

class ValidationError extends GraphQLError {
    constructor(errors) {
        super("validationErrors");

        this.validationErrors = {};

        // Expected format for errors
        // [{
        //     key: "email",
        //     message: "email_not_valid"
        // }]

        errors.forEach(error => {
            if(!this.validationErrors[error.key]) {
                this.validationErrors[error.key] = [error.message];
            } else {
                this.validationErrors.push(error.message);
            }
        });
    }
}

export default ValidationError;