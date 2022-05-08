import { Client, APIErrorCode, APIResponseError } from "@notionhq/client";


export default async (request, response, next) => {
    // get first 10 goals
    // look for its subgoals
    // get its name

    try {

        const notion = new Client({ auth: process.env.NOTION_TOKEN });

        const getName = async (id) => {
            const page = await notion.pages.retrieve({ page_id: id });
            return page.properties.Goal.title[0].text.content;
        };

        const database = await notion.databases.query({
            database_id: request.params.database
        })

        // send goal name, subgoals with names

        const goals = database.results.map(({ properties: page }) => {
            return {
                name: page.Goal.title[0].text.content,
                subGoals: page['Sub Goals'].relation.map(({ id }) => id)
            }
        })

    response.send(goals);

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