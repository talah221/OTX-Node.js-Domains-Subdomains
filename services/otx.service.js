
const dbService = require("../services/db.service")
const otxSdk = require('../OTX-Node-SDK/index');
const { log } = require('console');
const otx = new otxSdk('cb4f3d7b0a7069296b65748dd6b0c3cfaeeeb3d326329a1037577e309156b1c9')

module.exports = {
    getSubdomains,
    deleteDomain,
    deleteAllDomains,
    getDomainsSubdomains
}

function getSubdomains({ params }, res) {
    const { domain } = params;
    try {
        otx.indicators.domain(domain, 'url_list', async (err, response) => {
            if (err) {
                console.log("ERR IS", err);
                return res.send(400, `Got Error With the domain ${domain}. Please try again later. Error is:`, err)
            }
            const domainWithSubdomains = response.url_list.reduce((acc, currVal) => {
                acc.subDomains.push(currVal.url)
                return acc;
            }, { domain, subDomains: [] })
            const domainsCollection = await dbService.getCollection('domains');
            await domainsCollection.insertOne(domainWithSubdomains)
            res.send(domainWithSubdomains.subDomains)
        });

    } catch (err) {
        console.log("Got Error Getting Subdomains & Inserting to DB:", err);
        res.send(400)
    }

}
async function deleteDomain({ params }, res) {
    const { domain } = params;
    try {
        const domainsCollection = await dbService.getCollection('domains');
        await domainsCollection.deleteOne({ domain })
        return res.send('Deleted')

    } catch (err) {
        const errorStr = `Got Error Deleting ${domain}. Error Is: ${err}`
        console.log(errorStr);
        return res.status(400).send(errorStr)
    }


}
async function deleteAllDomains(req, res) {
    try {
        const domainsCollection = await dbService.getCollection('domains');
        await domainsCollection.deleteMany({})
        return res.send('All Domains have been deleted succesfully')

    } catch (err) {
        const errorStr = `Got Error Deleting All Domains. Error Is: ${err}`
        console.log(errorStr);
        return res.status(400).send(errorStr)
    }
}
function getDomainsSubdomains({ body }, res) {
    const { domains } = body;
    try {
        domains.forEach(domain => {
            otx.indicators.domain(domain, 'url_list', async (err, response) => {
                if (err) {
                    console.log("Error with OTX Library:", err);
                    return res.send(400, `Got Error With the domain ${domain}. Please try again later. OTX Error:`, err)
                }
                const domainWithSubdomains = response.url_list.reduce((acc, currVal) => {
                    acc.subDomains.push(currVal.url)
                    return acc;
                }, { domain, subDomains: [] })
                const domainsCollection = await dbService.getCollection('domains');
                await domainsCollection.insertOne(domainWithSubdomains)
            });
        })
        return res.send('All Domains Inseted Succesfully')


    } catch (err) {
        const errorStr = `Got Error Saving the db the domains $${domains}} because of error: ${err}`
        console.log(errorStr);
        return res.status(400).send(errorStr)

    }

}