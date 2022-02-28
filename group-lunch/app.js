require('dotenv').config()
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// 경영지원 side trigger -> /점심

app.command('/점심', async ({ ack, body, client, logger }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      "callback_id": "submit_view",
      view: {
        "type": "modal",
        "title": {
          "type": "plain_text",
          "text": "점심 주문",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "확인",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "취소",
          "emoji": true
        },
        "blocks": [
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "lunch_menu"
            },
            "label": {
              "type": "plain_text",
              "text": "오늘의 점심 메뉴는 무엇인가요?",
              "emoji": true
            }
          }
        ]
      }
    })
  }
  catch (error) {
    logger.error(error);
  }
});
 
app.view('submit_view', async ({ ack, body, view, client, logger }) => {
  await ack();

  // const user = body.user.id;
  // const description = view.state.values.description["plain_text_input-action"].value
  // const total = view.state.values.total["plain_text_input-action"].value
  // const accountInfo = view.state.values.account_info["plain_text_input-action"].value
  // const subjects = view.state.values.subjects["multi_users_select-action"].selected_users
  
  const amountDue = Math.round(total / (subjects.length + 1), 0)
  console.log(total, amountDue)

  // try {
  //   Promise.all(subjects.map(sub => {
  //     return client.chat.postMessage({
  //       channel: sub,
  //       "attachments": [
  //         {
  //           "color": "#f2c744",
  //           "blocks": [
  //             {
  //               "type": "header",
  //               "text": {
  //                 "type": "plain_text",
  //                 "text": `🤑 새로운 정산 요청`,
  //                 "emoji": true
  //               }
  //             },
  //             {
  //               "type": "section",
  //               "text": {
  //                 "type": "mrkdwn",
  //                 "text": `*항목*: ${description}`
  //               }
  //             },
  //             {
  //               "type": "section",
  //               "text": {
  //                 "type": "mrkdwn",
  //                 "text": `*대상*: <@${user}>`
  //               }
  //             },
  //             {
  //               "type": "section",
  //               "text": {
  //                 "type": "mrkdwn",
  //                 "text": `*계좌정보*: ${accountInfo}`
  //               }
  //             },
  //             {
  //               "type": "section",
  //               "text": {
  //                 "type": "mrkdwn",
  //                 "text": `*금액*: ${amountDue.toLocaleString()}원`
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     })
  //   })).then(_ => {
  //     client.chat.postEphemeral({
  //       channel: "C015R6X4JCV",
  //       user: user,
  //       text: `<@${user}>님!\n*${description}*에 대한 정산요청을 완료했습니다!`
  //     });
  //   })
  // }
  // catch (error) {
  //   logger.error(error);
  // }
});

// 개인 DM Block
// {
// 	"blocks": [
// 		{
// 			"type": "section",
// 			"text": {
// 				"type": "mrkdwn",
// 				"text": ":studio_microphone: 오늘의 점심메뉴는 OOO입니다!\n\n참여여부를 선택해주세요!"
// 			}
// 		},
// 		{
// 			"type": "actions",
// 			"elements": [
// 				{
// 					"type": "button",
// 					"style": "primary",
// 					"text": {
// 						"type": "plain_text",
// 						"text": "참여할게요!",
// 						"emoji": true
// 					},
// 					"value": "click_me_123",
// 					"action_id": "yes"
// 				},
// 				{
// 					"type": "button",
// 					"style": "danger",
// 					"text": {
// 						"type": "plain_text",
// 						"text": "오늘은 스킵할게요!",
// 						"emoji": true
// 					},
// 					"value": "click_me_123",
// 					"action_id": "no"
// 				}
// 			]
// 		}
// 	]
// }

(async () => {
  await app.start();

  console.log('Bolt app is running');
})();