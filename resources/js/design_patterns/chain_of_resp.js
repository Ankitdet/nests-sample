class Request {
    constructor(amount) {
        this.amount = amount;
        console.log(`Requested: $${amount}`);
    }
}

class Handler {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
    }

    handle(request) {
        if (this.nextHandler) {
            this.nextHandler.handle(request);
        }
    }
}

class BankHandler extends Handler {
    handle(request) {
        if (request.amount <= 100) {
            console.log("Bank Handler: I can handle this request.");
        } else {
            super.handle(request);
        }
    }
}

class CreditHandler extends Handler {
    handle(request) {
        if (request.amount > 100 && request.amount <= 500) {
            console.log("Credit Handler: I can handle this request.");
        } else {
            super.handle(request);
        }
    }
}

class LoanHandler extends Handler {
    handle(request) {
        if (request.amount > 500) {
            console.log("Loan Handler: I can handle this request.");
        } else {
            super.handle(request);
        }
    }
}

// creating the object
const bankHandler = new BankHandler();
const creditHandler = new CreditHandler();
const loanHandler = new LoanHandler();

bankHandler.setNext(creditHandler);
creditHandler.setNext(loanHandler);

// Make requests
bankHandler.handle(new Request(0));
bankHandler.handle(new Request(200));
bankHandler.handle(new Request(1000));