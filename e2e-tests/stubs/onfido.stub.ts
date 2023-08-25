
// mutation or query named as function
export const generateSdkToken = () => {
    return {
        idNotPassed: {
            status: 404,
            title: 'resource_not_found',
            description: "Sorry !! we counldn't find request resource",
            issues: 'Could not find the following resource: Applicant with id=string (status code 404) | {}'
        },
    }
}