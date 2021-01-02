const core = require('@actions/core');
const axios = require('axios');
const crypto = require('crypto');

const DINGTALK_URL = 'https://oapi.dingtalk.com/robot/send';
const VALID_MSGTYPES = ['text', 'link', 'markdown', 'actionCard', 'feedCard'];

// most @actions toolkit packages have async methods
async function run() {
  try {

    const accessToken = process.env.DINGTALK_ACCESS_TOKEN || '';
    const secret = process.env.DINGTALK_SECRET || '';
    const jobStatus = process.env.JOB_STATUS || '';
    const msgtype = core.getInput('msgtype', { required: true });

    core.info(`环境变量及参数 accessToken:${accessToken} secret:${secret} jobStatus:${jobStatus} msgtype:${msgtype}`);

    if (accessToken == '') throw new Error('The environment variable parameter [DINGTALK_ACCESS_TOKEN] is required');

    if (!VALID_MSGTYPES.includes(msgtype)) throw new Error(`msgtype should be one of ${VALID_MSGTYPES.join(',')}`);

    let notifyWhen = core.getInput('notify_when');
    const title = core.getInput('title');
    const text = core.getInput('text');
    const atMobiles = core.getInput('at_mobiles');
    const atAll = core.getInput('at_all');

    core.info(`输入参数 notifyWhen:${notifyWhen} title:${title} text:${text} atMobiles:${atMobiles} atAll:${atAll}`);

    // // msgtype of link
    // const msgUrl = core.getInput('');
    // const picUrl = core.getInput('');

    // msgtype of actionCard
    // msgtype of feedCard
    // const customCont = core.getInput('custom');


    let payload = { msgtype };
    switch (msgtype) {
      case 'text':
        payload['text'] = text;
        payload['at'] = {};

        if (atMobiles) {
          payload['at']['atMobiles'] = atMobiles.split(',');
          payload['at']['isAtAll'] = atAll;
        }
        if (atAll) {
          payload['at']['isAtAll'] = atAll;
        }

        break;

      default:
        break;
    }

    core.info(`the payload context: ${JSON.stringify(payload)}`);

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

      core.info('Dingtalk Robot Notify Response: ', ret.data);
      if (ret.data.errcode) {
        throw new Error(`Dingtalk Robot Notify Return Error: [${ret.data.errcode}] ${ret.data.message}`);
      }
    } else {
      core.info(`Dingtalk Robot Notify Action Skipped Status: ${jobStatus}`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
