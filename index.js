const core = require('@actions/core');
const github = require('@actions/github');
const {
    getPullRequests,
    sendNotification,
    sendNotificationWithBot,
    getPRArrayOfReviewers,
    createPrReviewerArray,
    checkGithubProviderFormat,
    setMessageFromArray,
    stringToMap,
  } = require('./utils/functions');
let stringLocaleUtil = require('./utils/string-locale-util');

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_API_URL } = process.env;
const AUTH_HEADER = {
    Authorization: `token ${GITHUB_TOKEN}`,
};
const PULLS_ENDPOINT = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/pulls`;





async function main() {
    
    try {
        core.info(`main() / get infos`);
        const githubDeveloperIdMappingString = core.getInput('github-developer-id-mapping'); //Required
        const slackChannelId = core.getInput('slack-channel-id'); //Required
        const slackMessageLang = core.getInput('slack-message-lang'); //Optional Language

        const slackWebhookUrl = core.getInput('slack-webhook-url'); //Select 1
        const slackWebhookUsename = core.getInput('slack-webhook-username'); //Optional for Select 1

        const slackBotToken = core.getInput('slack-bot-token'); //Select 2
      
        const pullRequests = await getPullRequests(PULLS_ENDPOINT, AUTH_HEADER);
        const pullRequestsReviewersArray = getPRArrayOfReviewers(pullRequests.data);
      
      
        if (pullRequestsReviewersArray) {
            core.info(`main() / PR exist.`);
            stringLocaleUtil.setLangCode(slackMessageLang); // need to set language for the service

            if (githubDeveloperIdMappingString && !checkGithubProviderFormat(githubDeveloperIdMappingString)) {
                return core.setFailed(stringLocaleUtil.getInvalidFormatMsg());
            }

            const reviewers = createPrReviewerArray(pullRequestsReviewersArray);
            const githubDeveloperIdMap = stringToMap(githubDeveloperIdMappingString);
            const messageText = setMessageFromArray(reviewers, githubDeveloperIdMap);
            let messageObject = {
                channel: slackChannelId,
                text: messageText,
            };

            if(slackWebhookUrl) {
                core.info(`main() / using webhook url.`);
                messageObject.username = slackWebhookUsename;
                const resNotification = await sendNotification(slackWebhookUrl, messageObject);
                printSentMessage(resNotification);
            }
            if(slackBotToken) {
                core.info(`main() / using bot token.`);
                const resNotification = await sendNotificationWithBot(slackBotToken, messageObject);
                printSentMessage(resNotification);
            }
            
        } else {
            core.info(`main() / No PR exist!`);
        }
      
    } catch (error) {
        core.info(`main() / Error occured.`);
        core.setFailed(error.message);
    }

}

function printSentMessage(resNotification) {
    core.info(`PR Remind Webhook Notification is sent!!`);
    core.info(`Request body:\n ${resNotification.config?.data}`);
}


main();



