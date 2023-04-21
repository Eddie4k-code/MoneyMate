const router = require("express").Router();
require("dotenv").config();
const mongoose = require("mongoose");

const { Configuration, PlaidApi} = require("plaid");
const Account = require("../models/Account");
const { verifyToken } = require("./verifyToken");


/*
 *
 *
 *Setup Config such as enviroment.
 *
 * */
const configuration = new Configuration({
    basePath: 'https://sandbox.plaid.com',
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
});

const plaidClient = new PlaidApi(configuration);


/*
 * 
 * 
 *Create the public token
 * 
 * Generates a unique secure one time use token that grants access to the plaid link flow for a specific user and set of accounts,
 * when the user clicks this receives the link token it will open the Plaid Link interface where user can sign in with their bank account.
 * 
 * */
router.post("/create_link_token", verifyToken, async (req, res, next) => {

    const plaidRequest = {

        user: {
            client_user_id: 'user',
        },

        client_name: 'Plaid Test App',
        products: ['auth', 'transactions'],
        language: 'en',
        redirect_uri: 'http://localhost:5000/',
        country_codes: ['US'],
    };


    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        return res.json(createTokenResponse.data);
    } catch (err) {
        console.log(err);
    }


});


//Exchange Token for permanent access token
router.post("/exchangePublicToken", verifyToken, async (req, res, next) => {
    const publicToken = req.body.public_token;
    const userId = req.user._id;

    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        });


        const aToken = response.data.access_token;
        const itemID = response.data.item_id;
        


        //Add Getting Insitituion Info Here such as all accounts ids etc
        const response2 = await plaidClient.accountsGet({ access_token: aToken });

        const accounts = response2.data.accounts;



        //Maker Accounts
        const accountDocs = accounts.map(account => ({
            userId: userId,
            accessToken: aToken,
            accountId: account.account_id,
            accountName: account.name,
            accountType: account.type
        }));

        await Account.insertMany(accountDocs);


        //Return accounts
        return res.json(accounts);

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});


//Retrieve Institution info such as name
router.post("/getInstitutionInfo", verifyToken, async (req, res, next) => {
    const accessToken = req.body.accessToken;

    try {

        const request = {
            access_token: accessToken,
        };


        const response = await plaidClient.accountsGet(request);

        const accounts = response.data.accounts;

        return res.json({accounts});

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});



//Retrieve Account Balance
router.post("/getBalance", verifyToken, async (req, res, next) => {

    let userId;


    try {

        userId = req.user._id;
        let allAccounts;

        const accounts = await Account.find({ userId });

        const requests = await accounts.map(account => {
            return plaidClient.accountsBalanceGet({ access_token: account.accessToken });
        });

        const responses = await Promise.all(requests);

        allAccounts = responses.map(response => response.data.accounts);

        


        console.log(allAccounts);


        return res.json(allAccounts);



    } catch (err) {
        console.log(err);
    }


});


//Get Transactions
router.post("/getTransactions", verifyToken, async (req, res, next) => {

    try {

        let userid;
        let startDate;
        let endDate;

        userId = req.user._id;
        startDate = req.body.startDate;
        endDate = req.body.endDate;

        if (startDate == "" || endDate == "") {
            return res.json([]);
        }



    

        let allAccounts = await Account.find({ userId });

        const requests = await allAccounts.map(account => {
            return plaidClient.transactionsGet({
                access_token: account.accessToken,
                start_date: startDate,
                end_date: endDate
            })
        });

        const responses = await Promise.all(requests);

        let transactions = await responses.map(response => response.data.transactions);

        return res.json(transactions);

    } catch (err) {

        console.log(err);
    }


});


//Get recurring transactions
router.post("/recurringTransactions", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const accounts = await Account.find({ userId });

        const transactions = [];

        for (const account of accounts) {
            const request = {
                access_token: account.accessToken,
                account_ids: [account.accountId],
            };
            const response = await plaidClient.transactionsRecurringGet(request);
            transactions.push(response.data.transactions);
        }

        return res.json(transactions);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server error" });
    }
});

//Make a dummy recurring transaction for an account (for testing purposes)
router.post("/makeRecurring", verifyToken, async (req, res, next) => {
    try {
        let request = {
            access_token: 'access-sandbox-8b6422cd-3b91-4278-b328-3861aa8f2adc',
            account_id: 'G1xzagrr9mu5Q9gEaN5nhVyQAmoaxPCGb986R',
            type: 'debit',
            network: 'ach',
            amount: '13.34',
            ach_class: 'ppd',
            description: 'payment',
            idempotency_key: '98765',
            schedule: {
                start_date:'2023-03-25',
                end_date: '2023-10-01',
                interval_unit: 'week',
                interval_count: 1,
                interval_execution_day: 5
            },
            user: {
                legal_name: 'John Smith',
            },
            device: {
                ip_address: '127.0.0.1',
                user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            },
            user_present: true,
        };



        const response = await plaidClient.transferRecurringCreate(request);
        const recurringTransferId = response.data.recurring_transfer.recurring_transfer_id;


        return res.json(recurringTransferId);







        
    } catch (err) {
        console.log(err);
    }
});

//Get all accounts associated with user
router.post("/getUserAccounts", verifyToken, async (req, res, next) => {


    try {

        let accounts;
        const userId = req.user._id;

        accounts = await Account.find({ userId });

        if (!accounts) {
            return res.json({ msg: "No Accounts Found" });
        }


        return res.json(accounts);

    } catch (err) {

        console.log(err);

    }



});


module.exports = router;
