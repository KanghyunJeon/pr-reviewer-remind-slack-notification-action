const axios = require('axios');
const FormData = require("form-data");
let stringLocaleUtil = require('../utils/string-locale-util');

module.exports = {
    getPullRequests,
    sendNotification,
    sendNotificationWithBot,
    getPRArrayOfReviewers,
    createPrReviewerArray,
    checkGithubProviderFormat,
    stringToMap,
    setMessageFromArray,
  };


/**
 * API Get Pull Requests from GitHub repository
 * @return {Promise} Axios promise
 */
async function getPullRequests(prUrlFromGitHub, authHeader) {
    return axios({
        method: 'GET',
        url: prUrlFromGitHub,
        headers: authHeader,
    });
}
  
/**
 * Send notification to a slcak channel
 * @param {String} webhookUrl Webhook URL
 * @param {String} messageData Message data object to send into the channel
 * @return {Promise} Axios promise
 */
async function sendNotification(webhookUrl, messageData) {
    return axios({
        method: 'POST',
        url: webhookUrl,
        data: messageData,
    });
}

/**
 * Send notification to a slcak channel
 * @param {String} botToken slack Bot token
 * @param {String} messageData Message data object to send into the channel
 * @return {Promise} Axios promise
 */
async function sendNotificationWithBot(botToken, messageData) {
    return axios.post(
            'https://slack.com/api/chat.postMessage', 
            {
                channel: messageData.channel,
                text: messageData.text,
            }, 
            { 
                headers: {
                    Authorization: `Bearer ${botToken}`,
                } 
            }
        )
}

/**
 * Filter Pull Requests with requested reviewers only
 * @param {Array} pullRequests Pull Requests to filter
 * @return {Array} Pull Requests to review
 */
function getPRArrayOfReviewers(pullRequests) {
    return pullRequests.filter((pr) => pr.requested_reviewers.length || pr.requested_teams.length);
}
  
  
  
/**
 * Create an Array of Simple Objects with { url, title, login, assignee } properties from a list of Pull Requests
 * @param {Array} pullRequestsReviewersArray Pull Requests
 * @return {Array} Array of Simple Objects with { url, title, login, assignee } properties
 */
function createPrReviewerArray(pullRequestsReviewersArray) {
    const pr2user = [];
    for (const pr of pullRequestsReviewersArray) {
        for (const user of pr.requested_reviewers) {
        pr2user.push({
            url: pr.html_url,
            title: pr.title,
            login: user.login,
            assignee: pr.assignee.login,
        });
        }
        for (const team of pr.requested_teams) {
        pr2user.push({
            url: pr.html_url,
            title: pr.title,
            login: team.slug,
            assignee: pr.assignee.login,
        });
        }
    }
    return pr2user;
}

/**
 * Check if the github-developer-id-mapping string is in correct format
 * @param {String} githubDeveloperIdMappingString String to be checked to be in correct format
 * @return {Boolean} result boolean
 */
function checkGithubProviderFormat(githubDeveloperIdMappingString) {
    const az09 = '[A-z0-9_\\-@\\.]+';
    const pattern = new RegExp(`^${az09}:${az09}(,\\s*${az09}:${az09})*$`, 'm');
    return pattern.test(githubDeveloperIdMappingString);
}

/**
 * Convert a string like "githubname1:slackid1,githubname2:slackid2" to an Object { githubname1: "slackid1", githubname2: "slackid2"}
 * @param {String} githubDeveloperIdMappingString String to convert to Object
 * @return {Object} Simplified Map Object
 */
function stringToMap(githubDeveloperIdMappingString) {
    const map = {};
    if (!githubDeveloperIdMappingString) {
        return map;
    }
    const users = githubDeveloperIdMappingString.replace(/[\s\r\n]+/g, '').split(',');
    users.forEach((user) => {
        const [github, provider] = user.split(':');
        map[github] = provider;
    });
    return map;
}

/**
 * Create a pretty message to print
 * @param {Array} reviewers Array of Object. 
 * { 
 *      url, 
 *      title, 
 *      login, 
 *      assignee 
 * }
 * @param {Object} githubDeveloperIdMap Object { github_username , slack_ID }
 * @return {String} make message with line break
 */
function setMessageFromArray(reviewers, githubDeveloperIdMap) {
    let message = '';
    for (const obj of reviewers) {
        const mention = githubDeveloperIdMap[obj.login] ?
            `<@${githubDeveloperIdMap[obj.login]}>` :
            `@${obj.login}`;
        message += stringLocaleUtil.getSlackMsg(mention, obj.assignee, obj.title, obj.url);
    }
    return message
}




  