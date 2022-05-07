export default database => {
    return {
        title: 'Goals',
        properties: {
            Goal: {
                type: 'title',
                title: {}
            },
            'Sub Goals': {
                type: 'relation',
                relation: {
                    database_id: database.id,
                    synced_property_name: 'Sub Goals'
                }
            }
        }
    }
}