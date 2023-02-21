const { App, HTTPReceiver, ExpressReceiver } = require('@slack/bolt');

require('dotenv').config();

//console.log(process.env)


// Initializes your app with your bot token and signing secret
// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   customRoutes: [
//     {
//       path: '/health-check',
//       method: ['GET'],
//       handler: (req, res) => {
//         res.writeHead(200);
//         res.end('Health check information displayed here!');
//       },
//     },
//   ],
// });

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: new ExpressReceiver({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      customPropertiesExtractor: (req) => {
        return {
          "headers": req.headers,
          "foo": "bar",
          "queryString": req.query,
          "route": req.route,
          "originalUrl": req.originalUrl, 
          "hostname": req.hostname,
          "body": req.body,
          "params": req.params,



        };
      }
    }),
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();



app.command("/hello", async ({ command, ack, say }) => {
    try {
      await ack();
      say("hello fellow slack user!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

app.message("knock knock", async ({ message, say }) => {
    try {
      await say("who is there slack user?");
      await say(`this is no time for jokes <@${message.user}>`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

app.use(async ({ logger, payload, client, context, next }) => {


    logger.info(context);

    console.log('global middleware was called!!');

    console.log('payload', payload);

    console.log('client', client);

    console.log('context', context);

    

    await next();

});