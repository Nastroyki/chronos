const checkForBannedFields = (bannedFields, fieldsToCheck) => {
    const defaultBannedFields = ["id", "createdAt", "updatedAt"];
    
    for (const field of Object.keys(fieldsToCheck)) {
        if (defaultBannedFields.includes(field) || bannedFields.includes(field)) {
            const errorMessage = `Banned field: ${field}`;
            return Promise.reject(errorMessage);
        }
    }

    return Promise.resolve();
};

const checkForMissedFields = (required_fields, fields_to_check) => {
    const fields_to_checks = Object.keys(fields_to_check);
    const foreignField = required_fields.find(field => !fields_to_checks.includes(field));
  
    if (foreignField) {
        const errorMessage = `Missed field: ${foreignField}`;
        return Promise.reject(errorMessage);
    }
  
    return Promise.resolve();
};

const checkForForeignFields = (required_field, updatedFields) => {
    const required_fields = Object.keys(required_field);
    const foreignField = Object.keys(updatedFields).find(field => !required_fields.includes(field));
  
    if (foreignField) {
        const errorMessage = `Unknown field: ${foreignField}`;
        return Promise.reject(errorMessage);
    }
  
    return Promise.resolve();
};

export {checkForBannedFields, checkForMissedFields, checkForForeignFields};