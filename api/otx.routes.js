const express = require('express')
const router = express.Router()
const { getSubdomains, deleteAllDomains, deleteDomain, getDomainsSubdomains } = require('../services/otx.service')


// /api/otx/domain/
router.post('/domains/:domain', getSubdomains)
router.post('/domains', getDomainsSubdomains)
router.delete('/domains/:domain', deleteDomain)
router.delete('/domains', deleteAllDomains)
module.exports = router