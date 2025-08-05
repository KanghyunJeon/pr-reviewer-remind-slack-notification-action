let stringLocaleUtil = require('../utils/string-locale-util');
const {
  getPullRequests,
  sendNotification,
  sendNotificationWithBot,
  getPRArrayOfReviewers,
  createPrReviewerArray,
  checkGithubProviderFormat,
  setMessageFromArray,
  stringToMap,
} = require('../utils/functions');


test('stringToMap 정상노출 확인', () => {
  expect(stringToMap("KanghyunJeon-ABC:UUABCDEFG,member:UuHIJKLMN")).toEqual({"KanghyunJeon-ABC": "UUABCDEFG", "member": "UuHIJKLMN"});
});

test('영문이 나와야 함', () => {
  stringLocaleUtil.setLangCode("en")
  expect(stringLocaleUtil.getInvalidFormatMsg()).toEqual(`The github-developer-id-mapping is not in correct format: "githubname1:slackid1,githubname2:slackid2,..."`);
});

test('국문이 나와야 함', () => {
  stringLocaleUtil.setLangCode("ko")
  expect(stringLocaleUtil.getInvalidFormatMsg()).toEqual('github-developer-id-mapping 이 잘못된 포맷 입니다.: "githubname1:slackid1,githubname2:slackid2,..."');
});

test('getSlackMsg 함수 테스트', () => {
  stringLocaleUtil.setLangCode("en")
  expect(stringLocaleUtil.getSlackMsg("Kanghyun", "hsahn", "test PR", "https://www.example.com")).toEqual('Kanghyun, hsahn is waiting for your review!\n test PR:https://www.example.com\n');
});


test('슬랙 전체 메세지 빌더 함수 테스트', () => {
  stringLocaleUtil.setLangCode("en")

  const message = setMessageFromArray(mockPrReviewers, mockGithubDevIDMapping, 'slack');
  const [aRow, bRow, cRow, dRow] = message.split('/\n');

  expect(aRow).toEqual('<@SLACK_ID123>, hsahn is waiting for your review!\n Title1:https://example.com');
  expect(bRow).toEqual('<@SLACK_ID456>, hsahn is waiting for your review!\n Title1:https://example.com');
  expect(cRow).toEqual('<@SLACK_ID789>, hsahn is waiting for your review!\n Title3:https://example.com');
  expect(dRow).toEqual('<@SLACK_ID456>, hsahn is waiting for your review!\n Title5:https://example.com');
});

// test('슬랙 API 테스트 1', () => {
//   sendNotificationWithBot('bot token', mockMessageObject)
// });

// test('슬랙 API 테스트 2', () => {
//   mockMessageObject.username = 'PR 알림 봇';
//   sendNotification('webhook url', mockMessageObject)
// });

  test('getPRArrayOfReviewers func test / when excludeDrafts is false', () => {
    // should return all PRs with reviewers, including drafts
    const result = getPRArrayOfReviewers(mockPullRequests);
    // 리뷰어 요청된 일반 PR (id: 1, 2)과 초안 PR (id: 4)을 포함해야 함
    expect(result).toEqual([
        mockPullRequests[0],
        mockPullRequests[1],
        mockPullRequests[3]
    ]);
});

test('getPRArrayOfReviewers func test / when excludeDrafts is true', () => {
    // should return only non-draft PRs with reviewers
    const result = getPRArrayOfReviewers(mockPullRequests, true);
    // 초안이 아니면서 리뷰어가 요청된 PR (id: 1, 2)만 포함해야 함
    expect(result).toEqual([
        mockPullRequests[0],
        mockPullRequests[1]
    ]);
});

// --- 엣지 케이스 ---
test('getPRArrayOfReviewers func test / should return an empty array if no pull requests are provided', () => {
    const result = getPRArrayOfReviewers([]);
    expect(result).toEqual([]);
});

test('getPRArrayOfReviewers func test / should return an empty array if no PRs meet the criteria', () => {
    // 모든 PR이 리뷰어 요청이 없는 경우
    const noReviewerPRs = [
        { id: 3, draft: false, requested_reviewers: [], requested_teams: [] },
        { id: 5, draft: true, requested_reviewers: [], requested_teams: [] }
    ];
    const result = getPRArrayOfReviewers(noReviewerPRs);
    expect(result).toEqual([]);
});







const mockMessageObject = {
  channel: 'channel ID',
  text: '테스트트ㅡ트트트트트트트트트ㅡ트트트ㅡ',
}

const mockPrReviewers = [
  {
    url: 'https://example.com/',
    title: 'Title1',
    login: 'User1',
    assignee: 'hsahn',
  },
  {
    url: 'https://example.com/',
    title: 'Title1',
    login: 'User2',
    assignee: 'hsahn',
  },
  {
    url: 'https://example.com/',
    title: 'Title3',
    login: 'User3',
    assignee: 'hsahn',
  },
  {
    url: 'https://example.com/',
    title: 'Title5',
    login: 'User2',
    assignee: 'hsahn',
  },
];

const mockGithubDevIDMapping = {
  User1: 'SLACK_ID123',
  User2: 'SLACK_ID456',
  User3: 'SLACK_ID789',
};

const mockPullRequests = [
    // 1. 일반 PR, 리뷰어 요청됨
    { id: 1, draft: false, requested_reviewers: [{ login: 'user1' }], requested_teams: [] },
    
    // 2. 일반 PR, 팀 리뷰어 요청됨
    { id: 2, draft: false, requested_reviewers: [], requested_teams: [{ name: 'team-a' }] },
    
    // 3. 일반 PR, 리뷰어 요청 없음
    { id: 3, draft: false, requested_reviewers: [], requested_teams: [] },

    // 4. Draft PR, 리뷰어 요청됨
    { id: 4, draft: true, requested_reviewers: [{ login: 'user2' }], requested_teams: [] },
    
    // 5. Draft PR, 리뷰어 요청 없음
    { id: 5, draft: true, requested_reviewers: [], requested_teams: [] }
];