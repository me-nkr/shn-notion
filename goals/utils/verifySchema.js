import arrayEquality from "./arrayEquality.js";
import objectSubset from './objectContains.js'
export class VerificationError extends Error {
    constructor(code, message) {
        super()
        this.code = code;
        this.message = message;
    }
}

export const verifySchema = (database, schemaFunction) => {
    const schema = schemaFunction(database);
    if ( database.title[0].text.content !== schema.title )
    throw new VerificationError('title', 'title is not '+schema.title)
    else if (Object.keys(database.properties).length !== Object.keys(schema.properties).length)
    throw new VerificationError('propertiesCount', 'number of properties does not match');
    else if (!arrayEquality(Object.keys(database.properties), Object.keys(schema.properties)))
    throw new VerificationError('properties', 'mismatching properties');
    else if (objectSubset(schema.properties, database.properties))
    throw new VerificationError('propertyValue', 'mismatching property values');
    else {
        return true;
    }
}