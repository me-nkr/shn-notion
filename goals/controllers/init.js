import { Client, APIErrorCode, APIResponseError } from "@notionhq/client";
import schemaFunction from "../schema.js";

export default async (request, response, next) => {

    try {

        const notion = new Client({ auth: process.env.NOTION_TOKEN });

        const database = await notion.databases.retrieve({ database_id: request.params.database });

        const schema = schemaFunction(database);
        
        let title;

        if (database.title.length > 0) database.title[0].text.content = schema.title;
        else database.title.push({
            type: 'text',
            text: {
                content: schema.title,
                link: null
            }
        });

        for (let [key, value] of Object.entries(database.properties)) value.type === 'title' ? title = key : database.properties[key] = null;

        for (let [key, value] of Object.entries(schema.properties)) value.type !== 'title' ? database.properties[key] = value : database.properties[title].name = key; 
        


        const result = await notion.databases.update({
            database_id: database.id,
            properties: database.properties,
            title: database.title
        })

        response.send(result);

    } catch (error) {
        console.log(error)
        if (error instanceof APIResponseError) {
            switch (error.code) {
                case APIErrorCode.Unauthorized:
                    response.status(401).send({
                        code: error.code,
                        message: error.message
                    });
                    break;
                case APIErrorCode.ValidationError:
                    response.status(400).send({
                        code: error.code,
                        message: error.message.includes('path.database_id should be a valid uuid') ? 'invalid database ID' : error.message
                    });
                    break;
                case APIErrorCode.ObjectNotFound:
                    response.status(404).send({
                        code: 'databaseNotFound',
                        message: error.message
                    })
                    break;
            }
        }
    }
};