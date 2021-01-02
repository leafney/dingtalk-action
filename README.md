# Dingtalk Robot Notify

Github actions for sending notifications to Dingtalk


## General settings


### Environment variable parameters

- `DINGTALK_ACCESS_TOKEN` -- **Required** dingtalk access_token
- `DINGTALK_SECRET` -- **Optional** dingtalk secret


### Input parameters

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `msgtype` | string | Yes | `text` | dingtalk support message type of `text` `link` `markdown` `actionCard` `feedCard` |
| `status` | string | No | `${{ job.status }}` | The current status of the job. Possible values are `success`, `failure`, or `cancelled`. |
| `notify_when` | string | No | `success,failure,cancelled` | Specify on which events a dingtalk notification is sent, Multiple items are separated by commas |


-----


## text

### Example usage

```
steps:
  - uses: leafney/dingtalk-action@v1
    if: always()
    env:
      DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
    with:
      msgtype: text
      text: '测试--钉钉消息 @15311112222 通知测试'
      at_mobiles: '15311112222,15233334444'
```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `text` | string | Yes | `''` | Message content |
| `at_mobiles` | string | No | `''` | The phone number of the @person (add the phone number of the @person in the content) |
| `at_all` | bool | No | `false` | Do you @everyone |


-----


## link

### Example usage

```
steps:
  - uses: leafney/dingtalk-action@v1
    if: always()
    env:
      DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
    with:
      msgtype: text
      text: '测试--钉钉消息 @15311112222 通知测试'
      at_mobiles: '15311112222,15233334444'
```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `title` | string | Yes | `'This is the default title'` | Message title |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `messageUrl` | string | Yes | `'https://github.com/leafney/dingtalk-action'` | Click on the URL of the message jump |
| `picUrl` | string | No | `''` | the URL of image |

