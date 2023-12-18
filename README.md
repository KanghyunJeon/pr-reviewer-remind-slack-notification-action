# pr-reviewer-remind-slack-notification-action
Automatically send Slack notification for left PRs to reviewers.

<br/>
<br/>

## Inputs

**`github-developer-id-mapping`** <br/>
String that we need for mapping from Github ID to Slack ID <br/>
**Required: true** <br/>
**Default: ''** <br/>
Ex) 'KanghyunJeon:UUABCDEFG,member:UuHIJKLMN' or recommended way like ${{ vars.SLACK_DEVELOPER_ID }}

**`slack-channel-id`** <br/>
Slack channel ID <br/>
**Required: true** <br/>
**Default: ''** <br/>
Ex) 'C01234ABCDE'

**`slack-message-lang`** <br/>
Optional for preferred language <br/>
**Required: false** <br/>
**Default: 'en'** <br/>
'en' and 'ko' are supported for now.

**`slack-webhook-url`** <br/>
Choice 1 : Slack webhook url <br/>
**Required: true** <br/>
**Default: ''** <br/>
Ex) 'https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYYY/ZZZZZZZZZZZZZZZZZ'

**`slack-webhook-username`** <br/>
Optional for Choice 1 : change Slack webhook's username <br/>
**Required: false** <br/>
**Default: the webhook's default username** <br/>
Ex) 'PR Bot'

**`slack-bot-token`** <br/>
Choice 2 : Slack bot token <br/>
**Required: true** <br/>
**Default: ''** <br/>
Ex) 'xoxb-1010101000007-0000000044444-ABCDEASDADADAD'

<br/>
<br/>
<br/>

## How to use?
**Recommended Way for github-developer-id-mapping**
![Screenshot](recommended_way.JPG)
<br/>

```yaml
name: PR Reviewer Remind Slack Notification

on:
  schedule:
    - cron: "0 1-9/1 * * 1-5" # UTC 1am to 9am, Every weekday, Every 1 hour

jobs:
  pr-reviews-reminder:
    runs-on: ubuntu-latest
    steps:
    - uses: KanghyunJeon/pr-reviewer-remind-slack-notification-action@v1.0.0
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        github-developer-id-mapping: ${{ vars.SLACK_DEVELOPER_ID }} # Required, need to set github repository vaiables ex) KanghyunJeon:UUABCDEFG,member:UuHIJKLMN'
        slack-channel-id: 'C01234ABCDE' # Required
        slack-message-lang: 'en' # Optional, ex) ko

        slack-webhook-url: 'https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYYY/ZZZZZZZZZZZZZZZZZ' # Required but Choice 1
        slack-webhook-username: 'PR Bot' # Optional for Choice 1

        slack-bot-token: 'xoxb-1010101000007-0000000044444-ABCDEASDADADAD' # Required but Choice 2
``` 


<br/>
<br/>

## Author
**KanghyunJeon**

