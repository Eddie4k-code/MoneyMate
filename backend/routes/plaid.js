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
router.post("/create_link_token", async (req, res, next) => {

    const plaidRequest = {

        user: {
            client_user_id: 'user',
        },

        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        redirect_uri: 'http://localhost:5000/',
        country_codes: ['US']
    };


    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        return res.json(createTokenResponse.data);
    } catch (err) {
        console.log(err);
    }


});


//Exchange Token for permanent access token
router.post("/exchangePublicToken", async (req, res, next) => {
    const publicToken = req.body.public_token;
    const userId = req.body.userId;

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
router.post("/getInstitutionInfo", async (req, res, next) => {
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

        userId = req.body.userId;
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

        userId = req.body.userId;
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


module.exports = router;
