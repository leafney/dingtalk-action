const core = require('@actions/core');
const axios = require('axios');
const crypto = require('crypto');

const ACTION_PACKAGE = 'https://github.com/leafney/dingtalk-action';
const DINGTALK_URL = 'https://oapi.dingtalk.com/robot/send';

const VALID_MSGTYPES = ['text', 'link', 'markdown', 'actionCard', 'feedCard'];

// most @actions toolkit packages have async methods
async function run() {
  try {

    const accessToken = process.env.DINGTALK_ACCESS_TOKEN || '';
    const secret = process.env.DINGTALK_SECRET || '';

    const jobStatus = core.getInput('status');
    const msgtype = core.getInput('msgtype');

    if (accessToken == '') throw new Error('The environment variable parameter [DINGTALK_ACCESS_TOKEN] is required');
    if (jobStatus == '') throw new Error('The input parameter [status] is empty');
    if (!VALID_MSGTYPES.includes(msgtype)) throw new Error(`msgtype should be one of ${VALID_MSGTYPES.join(',')}`);

    let notifyWhen = core.getInput('notify_when');
    const title = core.getInput('title');
    const text = core.getInput('text');

    // msgtype of text and markdown
    const atMobiles = core.getInput('at_mobiles');
    const atAll = (core.getInput('at_all') || 'false').toUpperCase() === 'TRUE';

    let payload = { msgtype };
    switch (msgtype) {
      case 'text':
        payload['text'] = {};
        payload['text']['content'] = text;
        payload['at'] = {};

        if (atMobiles) {
          payload['at']['atMobiles'] = atMobiles.split(',');
          payload['at']['isAtAll'] = atAll;
        } else if (atAll) {
          payload['at']['isAtAll'] = atAll;
        }
        break;
      case 'link':
        // msgtype of link
        const msgUrl = core.getInput('msg_url') || ACTION_PACKAGE;
        const picUrl = core.getInput('pic_url');

        payload['link'] = {};
        payload['link']['title'] = title;
        payload['link']['text'] = text;
        payload['link']['messageUrl'] = msgUrl;
        payload['link']['picUrl'] = picUrl;
        break;
      case 'markdown':
        payload['markdown'] = {};
        payload['markdown']['title'] = title;
        payload['markdown']['text'] = text;
        payload['at'] = {};

        if (atMobiles) {
          payload['at']['atMobiles'] = atMobiles.split(',');
          payload['at']['isAtAll'] = atAll;
        } else if (atAll) {
          payload['at']['isAtAll'] = atAll;
        }
        break;
      case 'actionCard':
        // msgtype of actionCard
        let singleTitle = core.getInput('single_title');
        let singleUrl = core.getInput('single_url');
        const btns = core.getInput('btns') || '[]';
        const btnOrientation = core.getInput('btn_orientation') || '0';

        let isOverAll = false;
        if (singleTitle != '' || singleUrl != '') {
          isOverAll = true;
        }
        singleTitle = singleTitle || 'Read More';
        singleUrl = singleUrl || ACTION_PACKAGE;

        const btnsObj = JSON.parse(btns);
        if (!isOverAll) {
          // btns must exist `title` and `actionURL`
          const btnsRes = btnsObj.every(function (item) {
            return ('title' in item) && ('actionURL' in item);
          });
          if (!btnsRes) throw new Error('btns list object should be exist [title] and [actionURL]');
        }

        payload['actionCard'] = {};
        payload['actionCard']['title'] = title;
        payload['actionCard']['text'] = text;
        payload['actionCard']['btnOrientation'] = btnOrientation;

        if (isOverAll) {
          payload['actionCard']['singleTitle'] = singleTitle;
          payload['actionCard']['singleURL'] = singleUrl;
        } else {
          payload['actionCard']['btns'] = btnsObj;
        }
        break;
      case 'feedCard':
        // msgtype of feedCard
        const feedLinks = core.getInput('feed_links') || '[]';
        const feedObj = JSON.parse(feedLinks);

        const feedRes = feedObj.every(function (item) {
          return ('title' in item) && ('messageURL' in item) && ('picURL' in item);
        });
        if (!feedRes) throw new Error('feed_links list object should be exist [title] [messageURL] and [picURL]');

        payload['feedCard'] = {};
        payload['feedCard']['links'] = feedObj;
        break;
      default:
        break;
    }

    // core.info(`the payload context: ${JSON.stringify(payload)}`);

    const url = new URL(`?access_token=${accessToken}`, DINGTALK_URL);

    // sign the request if given
    if (secret) {
      const timestamp = Date.now();
      const stringToSign = `${timestamp}\n${secret}`;
      const sign = crypto.createHmac('sha256', secret).update(stringToSign).digest('base64');
      url.searchParams.append('timestamp', timestamp);
      url.searchParams.append('sign', sign);
    }

    // check status
    if (notifyWhen == '') {
      notifyWhen = 'success,failure,cancelled';
    }
    notifyWhen = notifyWhen.split(',');

    if (notifyWhen.includes(jobStatus)) {
      // send notify
      const ret = await axios.post(url.toString(), JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (ret.data.errcode) {
        throw new Error(`Dingtalk Robot Notify Return Error: [${ret.data.errcode}] ${ret.data.errmsg}`);
      } else {
        core.info(`Dingtalk Robot Notify Sent Successfully!`);
      }
    } else {
      core.info(`Dingtalk Robot Notify Skipped Status: [${jobStatus}]`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
