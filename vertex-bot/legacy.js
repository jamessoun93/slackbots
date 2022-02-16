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
          "text": "Step 1/3: 메뉴 선택",
          "emoji": true
        },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":stew: *주문하실 메뉴를 골라주세요!*"
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
          "text": "Step 2/3: 사이즈 선택",
          "emoji": true
        },
        "type": "modal",
        "callback_id": "size_view",
        "private_metadata": menu,
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `:tada: *${menu}*`
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
                      "type": "mrkdwn",
                      "text": "*S* (점심 한끼 괜찮은 정도)"
                    },
                    "value": "S"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "*M* (점심 한끼 배부른 정도)"
                    },
                    "value": "M"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "*L* (점심, 저녁 나눠먹기 좋은 정도)"
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

  const selectedSize = body.actions[0].selected_option.value;
  const selectedMenu = body.view.private_metadata;

  try {
    const result = await client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: {
        "title": {
          "type": "plain_text",
          "text": "Step 3/3: 최종 확인",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "확인"
        },
        "close": {
          "type": "plain_text",
          "text": "취소",
          "emoji": true
        },
        "type": "modal",
        "callback_id": "order_view",
        "private_metadata": `${selectedMenu} ${selectedSize}`,
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "🏁 주문확인",
              "emoji": true
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*메뉴*: ${selectedMenu}`
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*사이즈*: ${selectedSize}`
            }
          }
        ]
      }
    });
  }
  catch (error) {
    logger.error(error);
  }
});

app.view('order_view', async ({ ack, body, view, client, logger }) => {
  await ack();

  const user = body.user.id;
  const result = view.private_metadata;

  try {
    await client.chat.postMessage({
      channel: "C015R6X4JCV",
      text: `<@${user}>님은 ${result}를 선택하셨습니다!`
    });
  }
  catch (error) {
    logger.error(error);
  }
});