# Dingtalk Robot Notify

Github actions for sending notifications to Dingtalk


## General settings


### Environment variable parameters

- `DINGTALK_ACCESS_TOKEN` -- **Required** dingtalk access_token
- `DINGTALK_SECRET` -- **Optional** dingtalk secret


### Input parameters

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `msgtype` | string | No | `text` | dingtalk support message type of `text` `link` `markdown` `actionCard` `feedCard` |
| `status` | string | No | `${{ job.status }}` | The current status of the job. Possible values are `success`, `failure`, or `cancelled`. |
| `notify_when` | string | No | `success,failure,cancelled` | Specify on which events a dingtalk notification is sent, Multiple items are separated by commas |


-----


## text

### Example usage

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        text: '测试--钉钉消息通知测试'

    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: text
        text: '测试--钉钉消息 @15311112222 通知 @15233334444 测试'
        at_mobiles: '15311112222,15233334444'
```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `at_mobiles` | string | No | `''` | The phone number of the @person (add the phone number of the @person in the content) |
| `at_all` | bool | No | `false` | Do you @everyone |


-----


## link

### Example usage

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: link
        title: '这是一个链接通知'
        text: '测试--钉钉消息测试，链接通知'
        msg_url: 'https://github.com/'
```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `title` | string | Yes | `'This is the default title'` | Message title |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `msg_url` | string | Yes | `'https://github.com/leafney/dingtalk-action'` | Click on the URL of the message jump |
| `pic_url` | string | No | `''` | the URL of image |


-----

## markdown


### Example usage

```
jobs:
  success-notify:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: exit 0
    - name: success notify
      uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: markdown
        notify_when: 'success'
        title: '代码测试通过'
        text: |
          **<font color=#00FF00 size=4>构建成功</font>**

          ### GitHub Action workflow **${{ github.workflow }}** 构建成功

  failure-notify:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: exit 1
    - name: failure notify
      uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: markdown
        notify_when: 'failure'
        title: '代码测试发现异常'
        text: |
          **<font color=#FF0000 size=4>构建失败</font>**

          ### GitHub Action workflow **${{ github.workflow }}** 构建失败

          - 问题一
          - 问题二
          - 问题三
```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `title` | string | Yes | `'This is the default title'` | Message title |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `at_mobiles` | string | No | `''` | The phone number of the @person (add the phone number of the @person in the content) |
| `at_all` | bool | No | `false` | Do you @everyone |


-----


## actionCard


### Overall jump ActionCard

#### Example usage

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: actionCard
        title: '整体跳转的actionCard测试'
        text: '测试--钉钉消息通知测试'
        single_title: '阅读原文'
```

#### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `title` | string | Yes | `'This is the default title'` | Message title |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `single_title` | string | Yes | `Read More` | single button title |
| `single_url` | string | Yes | `'https://github.com/leafney/dingtalk-action'` | single button url |


### Independent jump ActionCard

#### Example usage

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: actionCard
        title: '独立跳转的actionCard测试'
        text: '测试--钉钉消息通知测试'
        btns: |
          [
            {
                "title": "内容不错",
                "actionURL": "https://www.dingtalk.com/"
            },
            {
                "title": "不感兴趣",
                "actionURL": "https://www.dingtalk.com/"
            }
          ]

```

#### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `title` | string | Yes | `'This is the default title'` | Message title |
| `text` | string | Yes | `'This is the default content'` | Message content |
| `btn_orientation` | string | No | `'0'` |  button arrangement of `0`-vertical , `1`-horizontal |
| `btns` | string | Yes | `'[]'` | text for list with `title` and `actionURL` like `[{"title":"内容不错","actionURL":"https://www.dingtalk.com/"}]` |


-----

## feedCard

### Example usage

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: leafney/dingtalk-action@v1
      if: always()
      env:
        DINGTALK_ACCESS_TOKEN: ${{ secrets.DINGTALK_ACCESS_TOKEN }}
      with:
        msgtype: actionCard
        title: '独立跳转的actionCard测试'
        text: '测试--钉钉消息通知测试'
        btns: |
          [
            {
                "title": "内容不错",
                "actionURL": "https://www.dingtalk.com/"
            },
            {
                "title": "不感兴趣",
                "actionURL": "https://www.dingtalk.com/"
            }
          ]

```

### Options

| option | type | required | default | description |
| ------ | ---- | -------- | ------- | ----------- |
| `feed_links` | string | Yes | `'[]'` | text for list with `title`  `messageURL` and `picURL` like `[{"title":"内容不错","messageURL":"https://www.dingtalk.com/","picURL":"https://www.dingtalk.com/"}]` |


-----

## Dingtalk Webhook Official document

- [dingtalk webhook](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)
