require('dotenv').config()
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

app.message('vt', async ({ message, say }) => {
  await say({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "🔔 버텍스 주문하실분~!",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "주문하기",
              "emoji": true
            },
            "value": "click_me_123",
            "action_id": "join-vertext"
          }
        ]
      }
    ]
  })
});

app.action('join-vertext', async ({ body, ack, say, client, logger }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        "type": "modal",
        "callback_id": "menu_view",
        "title": {
          "type": "plain_text",
          "text": "버텍스 주문 Bot",
          "emoji": true
        },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": "주문하실 메뉴를 골라주세요!",
              "emoji": true
            }
          },
          {
            "type": "actions",
            "block_id": "menu_choices",
            "elements": [
              {
                "action_id": "choose-menu",
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "미국식 닭고기 덮밥",
                      "emoji": true
                    },
                    "value": "미국식 닭고기 덮밥"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "미국식 새우 닭고기 덮밥",
                      "emoji": true
                    },
                    "value": "미국식 새우 닭고기 덮밥"
                  }
                ],
              }
            ]
          }
        ]
      }
    });
  }
  catch (error) {
    logger.error(error);
  }
});

app.action('choose-menu', async ({ body, ack, say, client, logger }) => {
  await ack();
  
  const menu = body.actions[0].selected_option.value

  try {
    const result = await client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: {
        "title": {
          "type": "plain_text",
          "text": "버텍스 주문 Bot",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit"
        },
        "type": "modal",
        "callback_id": "size_view",
        "private_metadata": menu,
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `:white_check_mark: 선택하신 메뉴는 *${menu}* 입니다!`
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "이제 *사이즈* 를 선택해주세요!"
            }
          },
          {
            "type": "actions",
            "block_id": "size_radio",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "S",
                      "emoji": true
                    },
                    "value": "S"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "M",
                      "emoji": true
                    },
                    "value": "M"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "L",
                      "emoji": true
                    },
                    "value": "L"
                  }
                ],
                "action_id": "choose-size"
              }
            ]
          }
        ]
      }
    });
  }
  catch (error) {
    logger.error(error);
  }
});

app.action('choose-size', async ({ body, ack, say, client, logger }) => {
  await ack();
  // console.log(body.actions[0].selected_option.value)
  // console.log(body.view.private_metadata)
});

app.view('size_view', async ({ ack, body, view, client, logger }) => {
  await ack();

  const user = body.user.id;
  const selectedMenu = view.private_metadata;
  const selectedSize = view.state.values.size_radio['choose-size'].selected_option.value;

  try {
    await client.chat.postMessage({
      channel: user,
      text: `<@${body.user.id}>님은 ${selectedMenu} 사이즈 ${selectedSize}를 선택하셨습니다!`
    });
  }
  catch(error) {
    logger.error(error);
  }
});

(async () => {
  await app.start();

  console.log('Bolt app is running');
})();