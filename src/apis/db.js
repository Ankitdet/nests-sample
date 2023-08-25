
export const getUsers = ({ limit, offset }) => {

    const mongoDbClient = getMongoDbClient()
    const listOfUsers = await mongoDbClient.user.find({})
    return listOfUsers
}

export const createUser = ({ username, password }) => {
    const mongoDbClient = getMongoDbClient()
    await mongoDbClient.user.insert({ username, password })
    return;
}