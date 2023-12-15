module.exports = {
    setLangCode,
    getInvalidFormatMsg,
    getSlackMsg,
};


/*
    set language
    default = 'us' 
    option = 'ko' , 
*/
var langCode = 'us';
function setLangCode(lang) {
    langCode = lang
}


/*
    when 'github-developer-id-mapping' is an invalid format
*/
function getInvalidFormatMsg() {
    switch (langCode) {
        case 'ko':
            return `github-developer-id-mapping 이 잘못된 포맷 입니다.: "githubname1:slackid1,githubname2:slackid2,..."`;
    }
    return `The github-developer-id-mapping is not in correct format: "githubname1:slackid1,githubname2:slackid2,..."`;
}

/*
when slack message is made
*/
function getSlackMsg(mention, assignee, title, url) {
    switch (langCode) {
        case 'ko':
            return `${mention}님, ${assignee} 님이 리뷰를 기다리고 있어요!\n ${title}:${url}\n`;
    }
    return `${mention}, ${assignee} is waiting for your review!\n ${title}:${url}\n`;
}