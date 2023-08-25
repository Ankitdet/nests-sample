type Documents = {
    seperator: string
    name: string
}

type BDocuiments = {
    name: string
    bname: string
}

const printBdocument = (doc: BDocuiments) => {
    console.log(doc)
}

const simpleDocumnet = (doc: Documents) => {
    console.log(doc)
}


const printDocument = (doc: Documents | BDocuiments) => {
    if ('seperator' in doc) {
        simpleDocumnet(doc)
    } else {
        printBdocument(doc)
    }
}