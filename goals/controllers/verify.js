import { APIErrorCode, APIResponseError, Client } from "@notionhq/client";
import schema from "../schema.js";
import { VerificationError, verifySchema } from "../utils/verifySchema.js";

export default async (request, response, next) => {
    try {
        const notion = new Client({ auth: process.env.NOTION_TOKEN });

        const database = await notion.databases.retrieve({ database_id: request.params.database });

        if (verifySchema(database, schema)) response.send({
            code: 'verified',
            database_id: database.id
        });

    } catch (error) {
        console.log(error)
        if (error instanceof APIResponseError) {
            switch (error.code) {
                case APIErrorCode.Unauthorized :
                    response.status(401).send({
                        code: error.code,
                        message: error.message
                    });
                    break;
                case APIErrorCode.ValidationError :
                    response.status(400).send({
                        code: error.code,
                        message: error.message.includes('path.database_id should be a valid uuid') ? 'invalid database ID' : error.message
                    });
                    break;
                case APIErrorCode.ObjectNotFound :
                    response.status(404).send({
                        code: 'databaseNotFound',
                        message: error.message
                    })
                    break;
            }
        }
        else if (error instanceof VerificationError) response.status(500).send({
            code: error.code+' mismatch',
            message: error.message+'. Make sure database has same schema as defined schema'
        })
    }
};
