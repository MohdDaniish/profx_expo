require("dotenv").config();
require("./connection");
const Web3 = require("web3");
const express = require("express");
const cors = require("cors");
const config2 = require("./model/confiig");
const stake = require("./model/stake");
const stakeRegister = require("./model/stakeregister");
const stakeRegister4 = require("./model/stakeregister_4");
const levelStake = require("./model/levelStake");
const Topup = require("./model/topup");
const app = express();
const routes = require("./router");
const apiroutes = require("./apiroute");
const cron = require("node-cron");
const StakingPlan = require("./model/staking_plan"); // Import the StakingPlan model
const moment = require("moment-timezone");
const stake2 = require("./model/stake");
const registration = require("./model/registration");
const stakedirect = require("./model/stakedirects");
const dailyroi = require("./model/dailyroi");
const withdraw = require("./model/withdraw");
const levelRecurr = require("./model/levelReccur");
const Adminlogin = require("./routers/adminlogin");
const AuthRouter = require("./routers/auth");
const Dashboard = require("./routers/dashborad");
const stakeReward = require("./model/stakingReward");
const levelRecurrLapse = require("./model/levelRecurrLapse");
const stakePool = require("./model/stakepool");
const stakepoolincome = require("./model/stakepoolincome");
const crypto = require("crypto");
const openlevel = require("./model/openlevels");
const fetch = require("node-fetch");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const levelRecurrMissing = require("./model/levelRecurrmissing");
const residual = require("./model/residualincome");
const clubdeposit = require("./model/clubdeposit");
const daily4 = require("./model/daily4");

app.use(express.json());

const allowedOrigins = [
  "https://staking.wyscale.com",
  "https://wwwfhisndfkabnka.cryptoakhbar.com",
  "https://console.staking.wyscale.com",
  "https://stake.wyscale.com",
  "http://localhost:5173",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     }
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins
      callback(null, true);

      // To revert back to allowed origins, comment out the above line and uncomment the following block:
      /*
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
      */
    },
  })
);

app.use("/api", routes);
app.use("/api", AuthRouter);
app.use("/api", Adminlogin);
app.use("/api", Dashboard);
app.use("/api", apiroutes);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.RPC_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 15,
      onTimeout: false,
    },
  })
);

const ABI = [{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Paused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"Registered","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"address","name":"wallet","internalType":"address","indexed":false},{"type":"address","name":"referral","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"Stake","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"string","name":"token","internalType":"string","indexed":false},{"type":"uint256","name":"ratio","internalType":"uint256","indexed":false},{"type":"uint256","name":"t1transfer","internalType":"uint256","indexed":false},{"type":"uint256","name":"t2transfer","internalType":"uint256","indexed":false},{"type":"uint256","name":"rate","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ToppedUp","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"uint256","name":"plan","internalType":"uint256","indexed":false},{"type":"string","name":"protocol","internalType":"string","indexed":false}],"anonymous":false},{"type":"event","name":"Unpaused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IFarming"}],"name":"_farming","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getRatioValue","inputs":[{"type":"uint256","name":"input","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialize","inputs":[{"type":"address","name":"_stUsdtToken","internalType":"address"},{"type":"address","name":"_owner","internalType":"address"},{"type":"address","name":"farming","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"ratio","internalType":"uint256"}],"name":"investments","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"ratio","internalType":"uint256"}],"name":"investments2","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"operator","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"paused","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"priceSetting","inputs":[{"type":"uint256","name":"token_rate","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Staking4.Details[]","components":[{"type":"uint256","name":"investment","internalType":"uint256"},{"type":"uint256","name":"plan","internalType":"uint256"},{"type":"string","name":"protocol","internalType":"string"},{"type":"uint256","name":"capping","internalType":"uint256"}]}],"name":"seeDetailsStaking","inputs":[{"type":"address","name":"usar","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Staking4.Retopup[]","components":[{"type":"uint256","name":"investment","internalType":"uint256"},{"type":"uint256","name":"plan","internalType":"uint256"},{"type":"string","name":"protocol","internalType":"string"}]}],"name":"seeDetailsTopup","inputs":[{"type":"address","name":"usar","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setOperator","inputs":[{"type":"address","name":"opretr","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stUsdtToken","inputs":[]},{"type":"function","stateMutability":"payable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"investmentIndex","internalType":"uint256"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmounts","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakingTimestamps","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"wallet","internalType":"address"},{"type":"address","name":"referral","internalType":"address"}],"name":"userInfo","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"withdrawLost","inputs":[{"type":"uint256","name":"WithAmt","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdrawLostTokenFromBalance","inputs":[{"type":"uint256","name":"QtyAmt","internalType":"uint256"},{"type":"address","name":"_TOKEN","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"wyz","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"wyzlive","inputs":[]}];

const contract = new web3.eth.Contract(ABI, process.env.WYS_STAKE_CONTRACT);

async function getLastSyncBlock() {
  let { lastSyncBlock } = await config2.findOne();
  return lastSyncBlock;
}
async function getEventReciept(fromBlock, toBlock) {
  let eventsData = await contract.getPastEvents("allEvents", {
    fromBlock: fromBlock,
    toBlock: toBlock,
  });
  return eventsData;
}

async function getTimestamp(blockNumber) {
  let { timestamp } = await web3.eth.getBlock(blockNumber);
  return timestamp;
}

async function processEvents(events) {
  //console.log("events ",events)
  for (let i = 0; i < events.length; i++) {
    const { blockNumber, transactionHash, returnValues, event } = events[i];
    // console.log(blockNumber, transactionHash, event);
    const timestamp = await getTimestamp(blockNumber);

    if (event == "Stake") {
      try {
        const currentDate = new Date();
        const nextTimestrt = new Date(
          currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const timestampstart = nextTimestrt.getTime();
        const currentDate2 = new Date();
        const nextTimeend = new Date(
          currentDate2.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const timestampend = nextTimeend.getTime();
        const multi = 3;
        
        const wyz_deposit = returnValues.amount / 1e18;
        const wyz_rate = returnValues.rate / 1e18;
        const usdt_deposit = returnValues.t2transfer / 1e18;
       

        var invsttype = "New";
        const stkcount = await stake2.countDocuments({
          user: returnValues.user,
          token: "WYZ",
        });
        if (stkcount > 0) {
          invsttype = "Retopup";
        }

        const isstalk = await stake2.findOne(
          { txHash: transactionHash },
          { _id: 1 }
        );
        if (!isstalk) {
          let isCreated = await stake.create({
            user: returnValues.user,
            amount: returnValues.amount/1e18,
            token: returnValues.token.replace(/\s+/g, ""),
            wyz_amount : (returnValues.amount/1e18)-(returnValues.t2transfer / 1e18),
            stusdt_amount : usdt_deposit,
            ratio: returnValues.ratio,
            wyz_rate: returnValues.rate / 1e18,
            wyz_quantity: returnValues.t1transfer / 1e18,
            nextWithdrawDate: timestampend,
            txHash: transactionHash,
            block: blockNumber,
            timestamp: timestamp,
          });

          if (isCreated) {
            const isusr = await stakeRegister4.findOne({ user: returnValues.user });
            if (!isusr) {
              await stakeRegister4.create({
                user: returnValues.user,
                stake_amount: wyz_deposit,
                wyz_amount: returnValues.t1transfer / 1e18,
                stusdt_amount: usdt_deposit
              });
            } else {
            
                await stakeRegister4.findOneAndUpdate(
                  { user: returnValues.user },
                  {
                    $inc: {
                      stake_amount:wyz_deposit,
                      wyz_amount: returnValues.t1transfer / 1e18,
                      stusdt_amount: usdt_deposit,
                    },
                  }
                );
            
            }

            const getref = await registration.findOne(
              { user: returnValues.user },
              { referrer: 1 }
            );
            const pil = await stakedirect.findOne({
              user: returnValues.user,
              referrer: getref.referrer,
            });
            if (!pil) {
              await registration.updateOne(
                { user: getref.referrer },
                { $inc: { directStakeCount: 1 } }
              );
              await stakedirect.create({
                user: returnValues.user,
                referrer: getref.referrer,
              });
            }

            const isrefreg = await stakeRegister4.findOne({
              user: getref.referrer,
            });
            if (!isrefreg) {
              await stakeRegister4.create({
                user: getref.referrer,
                return: 0,
                stake_amount: 0,
                topup_amount: 0,
                withdraw_stdate: timestampstart,
                withdraw_endate: timestampend,
                withdrawref_stdate: timestampstart,
                withdrawref_endate: timestampend,
              });
            }
          } else {
            console.log("something went wrong");
          }
        }
      } catch (e) {
        console.log("Error (EvStake Event) :", e);
      }
    } 
  }
}

async function updateBlock(updatedBlock) {
  try {
    let isUpdated = await config2.updateOne(
      {},
      { $set: { lastSyncBlock: updatedBlock } }
    );
    if (!isUpdated) {
      console.log("Something went wrong!");
    }
  } catch (e) {
    console.log("Error Updating Block", e);
  }
}

async function planData(ratio, amount, curr) {
  //bUSDT-stUSD
  if (ratio == 100 && curr == "WYZ") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "5.55",
    };
    return data;
  }
  if (ratio == 100 && curr == "AllstUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "16.67",
    };
    return data;
  }
}

async function listEvent() {
  let lastSyncBlock = await getLastSyncBlock();
  let latestBlock = await web3.eth.getBlockNumber();
  let toBlock =
    latestBlock > lastSyncBlock + 100 ? lastSyncBlock + 100 : latestBlock;
  //console.log(lastSyncBlock, toBlock);
  let events = await getEventReciept(lastSyncBlock, toBlock);
  //console.log("events", events.length);

  await processEvents(events);
  await updateBlock(toBlock);
  if (lastSyncBlock == toBlock) {
    setTimeout(listEvent, 15000);
  } else {
    setTimeout(listEvent, 5000);
  }
}

async function getUserPlanUpdate() {
  let total = await stake2.aggregate([
    { $match: { userId: userId } },
    {
      $graphLookup: {
        from: "registration",
        startWith: "$userId",
        connectFromField: "userId", // user_id for fetching
        connectToField: "referrerId", // sponcer id for fetching
        maxDepth: Number.MAX_VALUE,
        depthField: "level",
        as: "children",
      },
    },
    { $unwind: "$children" },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  console.log(total, "ttt");
}

// const updteschema=async()=>{
//   await registration.updateMany(
//    // { cal_status: 0, teamBusinessnew: 0 }, // Filter criteria
//    {},
//     { $set: { cal_status: 0, teamBusinessnew: 0 } } // Update operation
//   );

// }

const updateTeambussness = async () => {
  try {
    const data = await registration.aggregate([
      {
        $lookup: {
          from: "stake2",
          localField: "user",
          foreignField: "referral",
          as: "result",
        },
      },
    ]);
    return res.json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

async function findUplines(txHash, uplines = []) {
  try {
    const stakeRecord = await stake2.findOne({ txHash }).exec();
    console.log("stakeRecord ",stakeRecord)
    const referrerRecord = await registration
      .findOne({ user: stakeRecord.user }, { referrer: 1 })
      .exec();
    let currentReferrerId = referrerRecord.referrer;
    let i = 1;
    let ratio = stakeRecord.ratio;
    var perc = 0;
    var level_perc = 0;
    var club_perc = 0;
    if(ratio == 90){
      perc = 2.5;
      level_perc = 1.5;
      club_perc = 1;
    } else if(ratio == 80){
      perc = 3;
      level_perc = 1.8;
      club_perc = 1.2;
    } else if(ratio == 70){
      perc = 3.5;
      level_perc = 2.1;
      club_perc = 1.4;
    } else if(ratio == 50){
      perc = 4;
      level_perc = 2.4;
      club_perc = 1.6;
    } else if(ratio == 40){
      perc = 5;
      level_perc = 2.4;
      club_perc = 1.6;
    }

    const clubincome = (club_perc / 100) * stakeRecord.amount
    console.log("clubincome ",clubincome)
    if(clubincome > 0){
    await clubdeposit.create({
      deposit : stakeRecord.amount,
      amount : clubincome,
      protocol : ratio,
      type : "club"
    })
    }

    if(ratio == 40){
      const rankbonus = (2 / 100) * stakeRecord.amount
    console.log("rankbonus ",rankbonus)
    if(rankbonus > 0){
    await clubdeposit.create({
      deposit : stakeRecord.amount,
      amount : rankbonus,
      protocol : ratio,
      type : "rank"
    })

    await config2.updateOne({},{ $inc : { rank_income : rankbonus } });
    }
    }
    

    while (currentReferrerId && i < 21) {
      const record = await registration
        .findOne(
          { user: currentReferrerId },
          { referrer: 1 }
        )
        .exec();

      if (!record) {
        break;
      }

      let directStakeCount = await stakedirect.countDocuments({ referrer : currentReferrerId });
      // console.log("currentReferrerId ",currentReferrerId);
       console.log("directStakeCount ",directStakeCount);
       //directStakeCount = 7;
      let iselig = 0;
   
      if(i >= 1 && i < 4 && directStakeCount >= 1){
        iselig = 1;
      } else if(i >= 4 && i < 6 && directStakeCount >= 2){
        iselig = 1;
      } else if(i >= 6 && i < 11 && directStakeCount >= 3){
        iselig = 1;
      } else if(i >= 11 && i < 16 && directStakeCount >= 5){
        iselig = 1;
      } else if(i >= 16 && i < 21 && directStakeCount >= 7){
        iselig = 1;
      }
      console.log("level ",i);
      console.log("iselig ",iselig);
        var direct_ref = 0;
        //console.log("isbal ",isbal)
        if (iselig == 1) {
        
          if(i == 1){
          direct_ref = (perc / 100) * stakeRecord.amount;  
          await stakeRegister4.updateOne(
            { user: currentReferrerId }, 
            {
              $inc: {
                totalIncome: direct_ref,
                referalIncome: direct_ref,
                wallet_referral: direct_ref,
              },
            },
            { upsert: true } 
          );
        } else {
          
          const max = (level_perc / 100) * stakeRecord.amount; 
          console.log("max amount ",max)
          
          if(i == 2){
            perc = 30;
          } else if(i == 3){
            perc = 20;
          } else if(i == 4){
            perc = 10;
          } else if(i == 5){
            perc = 5;
          } else if(i >= 6 && i < 11){
            perc = 4;
          } else if(i >= 11 && i < 16){
            perc = 2;
          } else if(i >= 16 && i < 21){
            perc = 1;
          }
          direct_ref = (perc / 100) * max;
          console.log("percent ",perc)
          console.log("income ",direct_ref)

          await stakeRegister4.updateOne(
            { user: currentReferrerId }, 
            {
              $inc: {
                totalIncome: direct_ref,
                levelIncome: direct_ref,
                wallet_referral: direct_ref,
              },
            },
            { upsert: true } 
          );
        }

        const incomeType = i > 1 ? "Level Income" : "Referral Income";

            await levelStake.create({
              sender: stakeRecord.user,
              receiver: currentReferrerId,
              level: i,
              amount: stakeRecord.amount,
              wyz_amount: 0,
              income: direct_ref,
              percent: perc,
              token : stakeRecord.token,
              income_type: incomeType,
              income_status : "Credit",
              wyzplan : 4,
              txHash
            });
          
        } 
      

      i++;
      currentReferrerId = record.referrer;
    }

    await stake2.updateOne({ txHash }, { $set: { cal_status: 1 } });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getLevelIds(user) {
  try {
    let uplines = [];
    const rec = await registration.findOne({ user: user }).exec();
    if (rec) {
      let currentReferrerId = rec.referrer;
      //console.log("currentReferrerId :: ",currentReferrerId)
      if (uplines.length == 0) {
        uplines.push(rec.referrer);
      }
      // console.log("currentReferrerId :: ",currentReferrerId)
      let i = 1;
      while (currentReferrerId) {
        const record = await registration
          .findOne({ user: currentReferrerId }, { referrer: 1 })
          .exec();

        if (!record) {
          break;
        }

        uplines.push(record.referrer);
        //console.log("referrer :: ",currentReferrerId)
        currentReferrerId = record.referrer;
      }

      return uplines;
    } else {
      return uplines;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getLevelIdsTill(user, till) {
  try {
    let uplines = [];
    const rec = await registration.findOne({ user: user }).exec();
    if (rec) {
      let currentReferrerId = rec.referrer;
      //console.log("currentReferrerId :: ",currentReferrerId)
      if (uplines.length == 0) {
        uplines.push(rec.referrer);
      }
      // console.log("currentReferrerId :: ",currentReferrerId)
      let i = 1;
      while (currentReferrerId) {
        const record = await registration
          .findOne({ user: currentReferrerId }, { referrer: 1 })
          .exec();

        if (!record) {
          break;
        }

        uplines.push(record.referrer);
        i++;

        if (i == till) {
          break;
        }
        //console.log("referrer :: ",currentReferrerId)
        currentReferrerId = record.referrer;
      }

      return uplines;
    } else {
      return uplines;
    }
  } catch (error) {
    console.log(error);
  }
}

async function level(txHash) {
  try {
    if (txHash != "") {
      const res = await findUplines(txHash);
      return res;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}

async function levelIncome() {
  const record = await stake2.findOne({ cal_status: 0 }).exec();
  if (record) {
    let levells = await level(record.txHash);
    console.log("Level Income Sent for trnsaction :: ", record.txHash);
  } else {
    console.log("No Level Income to Send");
  }
}

async function leveltop(txHash) {
  try {
    if (txHash != "") {
      const res = await findUplinestop(txHash);
      return res;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}

async function findUplinestop(txHash, uplines = []) {
  try {
    // Find the Topup record using txHash
    const rec = await Topup.findOne({ txHash }).exec();

    // Find the referrer for the user in the Topup record
    const usei = await registration
      .findOne({ user: rec.user }, { referrer: 1 })
      .exec();
    let currentReferrerId = usei.referrer;
    let i = 1;

    // Loop through the referrer chain until a certain level or no more referrers
    while (currentReferrerId && i < 16) {
      // Find the referrer's record with directStakeCount and referrer information
      const record = await registration
        .findOne(
          { user: currentReferrerId },
          { directStakeCount: 1, referrer: 1 }
        )
        .exec();
      if (!record) {
        break; // Exit the loop if no record found
      }

      let iselig = 0;

      // Check eligibility based on directStakeCount and level
      switch (true) {
        case (record.directStakeCount ? record.directStakeCount : 0) >= 1 &&
          i < 4:
        case (record.directStakeCount ? record.directStakeCount : 0) >= 3 &&
          i < 7:
        case (record.directStakeCount ? record.directStakeCount : 0) >= 5 &&
          i < 11:
        case (record.directStakeCount ? record.directStakeCount : 0) >= 7 &&
          i < 16:
          iselig = 1;
          break;
        default:
          iselig = 0;
          break;
      }

      // Handle operations based on the level
      if (i == 1) {
        // Handle first level operations
        const isbal = await stakeRegister.findOne({ user: currentReferrerId });
        await registration.updateOne(
          { user: currentReferrerId },
          { $inc: { stakedirectbusiness: rec.amount } }
        );
        const direct_ref = (10 / 100) * rec.amount;

        if (isbal) {
          var totalIncome = isbal.totalIncome + direct_ref;
          var capping = isbal.return;
          var income_status = capping >= totalIncome ? "Credit" : "Lapse";
          if (capping >= totalIncome) {
            await stakeRegister.updateOne(
              { user: currentReferrerId },
              {
                $inc: {
                  totalIncome: direct_ref,
                  wallet_referral: direct_ref,
                  referalIncome: direct_ref,
                },
              }
            );

            // Create levelStake record for Referral Income Topup
            await levelStake.create({
              sender: rec.user,
              receiver: currentReferrerId,
              level: i,
              amount: rec.amount,
              income: direct_ref,
              percent: 10,
              income_type: "Referral Income Topup",
              income_status,
              txHash,
            });
          } else {
            await stakeRegister.updateOne(
              { user: currentReferrerId },
              { $inc: { wallet_tank: direct_ref } }
            );
          }
        }
      } else {
        // Handle other level operations
        const isbal = await stakeRegister.findOne({ user: currentReferrerId });
        const levper = await levelPercent(i);
        const levelIncome = (levper / 100) * rec.amount;
        var income_status = "";

        if (isbal) {
          var totalIncome = isbal.totalIncome + levelIncome;
          var capping = isbal.return;
          income_status =
            capping >= totalIncome ? "Credit" : "Lapse Capping Limit";
          if (capping >= totalIncome) {
            if (iselig == 1) {
              await stakeRegister.updateOne(
                { user: currentReferrerId },
                {
                  $inc: {
                    totalIncome: levelIncome,
                    wallet_referral: levelIncome,
                    levelIncome: levelIncome,
                  },
                }
              );

              // Create levelStake record for Level Income Topup
              await levelStake.create({
                sender: rec.user,
                receiver: currentReferrerId,
                level: i,
                amount: rec.amount,
                income: levelIncome,
                percent: levper,
                income_type: "Level Income Topup",
                income_status,
                txHash,
              });
            } else {
              await stakeRegister.updateOne(
                { user: currentReferrerId },
                { $inc: { lapseIncome: levelIncome } }
              );
            }
          } else {
            await stakeRegister.updateOne(
              { user: currentReferrerId },
              { $inc: { wallet_tank: levelIncome } }
            );
          }
        }
      }

      i++;
      currentReferrerId = record.referrer;
    }

    // Update cal_status for the Topup record
    await Topup.updateOne({ txHash }, { $set: { cal_status: 1 } });

    return true; // Return true if the process completes successfully
  } catch (error) {
    console.error(error);
    return false; // Return false if there's an error
  }
}

async function topuplevelIncome() {
  const record = await Topup.findOne({ cal_status: 0 }).exec();
  //console.log("record :: ",record)
  if (record) {
    let levells = await leveltop(record.txHash);
    //const stakeAmt = record.amount;
    console.log("Topup Level Income Sent for trnsaction :: ", record.txHash);
    // const nextCheckTime = new Date(currentTime.getTime() + 24 * 30 * 60 * 60 * 1000); for 24 horurs
    // directStakeCount
    // levelStakeBonus
    //await calculateDailyReward()
  } else {
    console.log("No Level Income to Send");
  }
}

async function RecurringlevelIncome() {
  try {
    const records = await daily4.find({ recurr_status: 0 }).limit(200).exec();

    for (let rec of records) {
      let uuupids = await getLevelIdsTill(rec.user, "15");
      //console.log("uuupids ",uuupids)
      for (let i = 0; i < uuupids.length; i++) {
        const record = await registration
          .findOne(
            { user: uuupids[i] },
            { directStakeCount: 1, referrer: 1, stakedirectbusiness: 1 }
          )
          .exec();

        if (!record) {
          break;
        }

        const levper = 2;
        const levelIncome = (levper / 100) * rec.income;

        const isbal = await stakeRegister.findOne({ user: uuupids[i] });

        if (isbal) {

          const isbala = await stake2.findOne({
            user: uuupids[i],
            wyzplan: 1
          })
          .sort({ createdAt: 1 });
          
          if(isbala){
          const startDate = new Date(isbala.createdAt);
          const currentDate = new Date();
          const endDate = new Date(currentDate);
          const ranknumber = isbal.ranknumber;


          const dateRange = await getMonthRangeJ(isbala.createdAt);
          const alldetails = await sumBizInAMonth(
            isbala.createdAt,
            dateRange.startDate,
            dateRange.endDate,
            uuupids[i]
          );
          // console.log(" date ranges ", dateRange)
          // console.log("wall address ", uuupids[i]);
          // console.log(`all_business_detail `, alldetails);

          var currentbiz = alldetails.monthBiz;
          var currentDir = alldetails.monthDir;

          // previuos business
          var carryforward = 0;
          var prev_bizi = 0;
          var day_passed = 0;
          var completemonth = 0;
          if(ranknumber >= 2){
            let daydiv = 0;
            day_passed = await calculateDaysPassed(dateRange.startDate);
            console.log("day_passed ", day_passed)
            daydiv = day_passed/30;
            console.log("daydiv ", daydiv)
            completemonth = Math.floor(daydiv);
            
            if(completemonth >= 1 && day_passed > 0){
              const prevalldetails = await sumBizInAMonth(
                isbala.createdAt,
                isbala.createdAt,
                dateRange.startDate,
                uuupids[i]
              );
            
              const bizmminus = completemonth * (ranknumber*100);
            
              console.log("biz minuss up",bizmminus);
              prev_bizi = prevalldetails.monthBiz;
              if(prevalldetails.monthBiz > bizmminus){
                carryforward = prevalldetails.monthBiz - bizmminus;
              }
            
              console.log("prev start date  ",isbala.createdAt)
              console.log("prev end date  ",dateRange.startDate)
              console.log("prevalldetails ",prevalldetails)
            
            
            } else if(completemonth == 0 && day_passed > 0){
              const prevalldetails = await sumBizInAMonth(
                isbala.createdAt,
                isbala.createdAt,
                dateRange.startDate,
                uuupids[i]
              );
            
              const bizmminus = 1 * (ranknumber*100);
              prev_bizi = prevalldetails.monthBiz;
              if(prevalldetails.monthBiz > bizmminus){
                carryforward = prevalldetails.monthBiz - bizmminus;
              }
            
              console.log("biz minuss down ",bizmminus);
            
              console.log("prev start date  ",isbala.createdAt)
              console.log("prev end date  ",dateRange.startDate)
              console.log("prevalldetails ",prevalldetails)
            }
            
            console.log("carryforward ",carryforward)
            }
          // previuos business

          currentbiz = currentbiz + carryforward;

          var dcnt = i + 1;

          console.log("dcnt ", dcnt);

          //var iselig = (directStake ? directStake : 0) >= dcnt || totalStakedirectbusiness >= biz ? 1 : 0;
          var iselig = 0;

          // console.log(" condition to fulfil recurr")
          // console.log(" level ", dcnt)
          // console.log(" ranknumber ", ranknumber)
          // console.log(" directs ", currentDir)
          // console.log(" month direct business ",currentbiz)
          // console.log(" income ",levelIncome)

          if(dcnt >= 1 && dcnt < 5 && ranknumber >= 2 && currentDir >= 3 && currentbiz >= 100){
            iselig = 1;
          } else  if(dcnt >= 5 && dcnt < 9 && ranknumber >= 3 && currentDir >= 5 && currentbiz >= 200){
            iselig = 1;
          } else  if(dcnt >= 9 && dcnt < 13 && ranknumber >= 4 && currentDir >= 10 && currentbiz >= 300){
            iselig = 1;
          } else  if(dcnt >= 13 && dcnt < 16 && ranknumber >= 6 && currentDir >= 10 && currentbiz >= 400){
            iselig = 1;
          }
         
          console.log(" iselig ",iselig)
          var income_status = "";
          
          if (iselig == 1) { 
            income_status = "Credit";
            const recupd = await stakeRegister.updateOne(
              { user: uuupids[i] },
              {
                $inc: { wyz_recurrIncome: levelIncome, wyz_total_recurr: levelIncome },
              }
            );

            if (recupd.modifiedCount > 0) {
              await levelRecurr.create({
                sender: rec.user,
                receiver: uuupids[i],
                level: dcnt,
                amount: rec.income,
                income: levelIncome,
                percent: 2,
                directs: currentDir,
                directbiz: currentbiz,
                ranknumber : ranknumber,
                prev_biz : prev_bizi,
                carry_forward : carryforward,
                day_past : day_passed,
                month_past : completemonth,
                date_start : dateRange.startDate,
                date_end : dateRange.endDate,
                prev_start : isbala.createdAt,
                prev_end : dateRange.startDate,
                txHash: rec.txHash
              });
            }
          } else {
              await levelRecurrLapse.create({
                sender: rec.user,
                receiver: uuupids[i],
                level: dcnt,
                amount: rec.income,
                income: levelIncome,
                percent: 2,
                directs: currentDir,
                directbiz: currentbiz,
                ranknumber : ranknumber,
                prev_biz : prev_bizi,
                carry_forward : carryforward,
                day_past : day_passed,
                month_past : completemonth,
                date_start : dateRange.startDate,
                date_end : dateRange.endDate,
                prev_start : isbala.createdAt,
                prev_end : dateRange.startDate,
                txHash: rec.txHash
              });
          }
          }
        }
      }

      await dailyroi.updateOne(
        { _id: rec._id },
        { $set: { recurr_status: 1 } }
      );
    }

    if (records.length === 0) {
      console.log("No Recurring Level Income to Send");
    }
  } catch (error) {
    console.error("Error in RecurringlevelIncome:", error);
  }
}

async function getReward(ratio, token) {
  if (ratio == "100" && token == "WYZ") {
    const rewdays = {
      month: "36",
      days: "1095",
    };
    return rewdays;
  }
  if (ratio == "100" && token == "AllstUSDT") {
    const rewdays = {
      month: "12",
      days: "365",
    };
    return rewdays;
  }
}

async function withdrawIncome(req, res) {
  try {
    const { wallet_address, plan, amount, withdrawtype, txHash } = req.body;
    if (amount < 1e19) {
      return res
        .status(200)
        .json({ status: false, message: "Minimum Withdrawal is $10" });
    }
    var token = "WYZ-stUSDT";
    //var token = "bUSDT-stUSDT";
    var ratio = 0;
    if (plan == 1) {
      ratio = 10;
    } else if (plan == 2) {
      ratio = 20;
    } else if (plan == 3) {
      ratio = 30;
    } else if (plan == 4) {
      ratio = 40;
    } else if (plan == 5) {
      ratio = 50;
    } else if (plan == 6) {
      ratio = 15;
      token = "sUSDT-stUSDT";
    } else if (plan == 7) {
      ratio = 20;
      token = "sUSDT-stUSDT";
    } else if (plan == 8) {
      ratio = 25;
      token = "sUSDT-stUSDT";
    }
    const isstake = await stake2.findOne({
      txHash: txHash,
      user: wallet_address,
      ratio: ratio,
      token: token,
    });
    if (!isstake) {
      return res
        .status(200)
        .json({ status: false, message: "No Staking Found" });
    }
    if (withdrawtype == "roi") {
      const currentTime = new Date();
      if (
        currentTime > isstake.withdraw_stdate &&
        currentTime < isstake.withdraw_endate
      ) {
        const chkBal = await stakeRegister.findOne({
          user: wallet_address,
          wallet_balance: { $gte: amount },
        });
        if (chkBal) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const nextTimestrt = new Date(
            currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          const timestampstart = nextTimestrt.getTime();

          const currentDate2 = new Date();
          currentDate2.setHours(23, 59, 59, 999);
          const nextTimeend = new Date(
            currentDate2.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          const timestampend = nextTimeend.getTime();
          const hchh = await stakeRegister.updateOne(
            { user: wallet_address, txHash: txHash },
            {
              $inc: {
                wallet_balance: -amount,
              },
              // $set: {
              //   withdraw_stdate: timestampstart,
              //   withdraw_endate: timestampend
              // }
            }
          );

          if (hchh.modifiedCount > 0) {
            return res
              .status(200)
              .json({ status: true, message: "Withdraw Successfull" });
          }
        }
      } else {
        return res
          .status(200)
          .json({ status: false, message: "You Cannot Withdraw" });
      }
    } else if (withdrawtype == "referral") {
      const currentTime = new Date();
      if (
        currentTime > isstake.withdrawref_stdate &&
        currentTime < isstake.withdrawref_endate
      ) {
        const chkBal = await stake2.findOne({
          txHash: txHash,
          user: wallet_address,
          wallet_referral: { $gte: amount },
        });
        if (chkBal) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const nextTimestrt = new Date(
            currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          const timestampstart = nextTimestrt.getTime();

          const currentDate2 = new Date();
          currentDate2.setHours(23, 59, 59, 999);
          const nextTimeend = new Date(
            currentDate2.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          const timestampend = nextTimeend.getTime();
          const hchh = await stake2.updateOne(
            { user: wallet_address, txHash: txHash },
            {
              $inc: {
                wallet_balance: -amount,
              },
              // $set: {
              //   withdrawref_stdate: timestampstart,
              //   withdrawref_endate: timestampend
              // }
            }
          );

          if (hchh.modifiedCount > 0) {
            return res
              .status(200)
              .json({ status: true, message: "Withdraw Successfull" });
          }
        }
      } else {
        return res
          .status(200)
          .json({ status: false, message: "You Cannot Withdraw" });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function levelPercent(i) {
  if (i == 2) {
    return 5;
  } else if (i >= 3 && i <= 5) {
    return 1;
  } else if (i >= 6 && i <= 15) {
    return 0.5;
  }
}

async function levelPercentRecurr(i) {
  if (i == 1) {
    return 25;
  } else if (i == 2) {
    return 10;
  } else if (i == 3 || i == 4) {
    return 5;
  } else if (i == 5) {
    return 15;
  }
}

async function upids(user) {
  try {
    const uplevels = await getLevelIds(user);
    return uplevels;
  } catch (error) {
    console.log(error);
  }
}

async function roiwalletWyz() {
  try {
    const formattedDateTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");
    
      const wyzrate = await fetchWYSPrice();
      console.log("wyzrate ",wyzrate)
    const stakings = await stake2.find({ wyzplan : 1, staking_status : 0 }).lean();
    console.log("staking length ", stakings.length)
    const calculatedDataList = await Promise.all(
      stakings.map(async (entry) => {

        // const stakeregis = await stake2.findOne({
        //   user: entry.user,
        //   staking_status: 0,
        //   wyzplan: 1
        // })
        // .sort({ createdAt: 1 });

        // if (stakeregis) {
        let perdayroi = 0;
        let usdtroi = 0;
        let capwyz = 0;
       
          if(entry.token == "AllstUSDT"){
            let totret = (16.67 / 100) * entry.amount;
            usdtroi =  totret / 30;
            perdayroi = usdtroi/wyzrate;

          } else if(entry.token == "WYZ"){
            perdayroi = entry.perdayroi;
          }

         
          
          
          const incfromroi = entry.wyz_Income_roi;
          const twoxofinvs = entry.wyz_amount*2;
          console.log(" user ",entry.user)
          console.log(" created At ",entry.createdAt)
          console.log(" _id ",entry._id)
          console.log(" amount invested ",entry.wyz_amount)
          console.log(" roi income received ",incfromroi)
          console.log(" 2x income of amount invested ",twoxofinvs)
          //const noofdays = await calculateDaysPassed(entry.createdAt);
          
          //console.log(" noofdays ",noofdays)
          // if(noofdays > 0){
          // perdayroi = noofdays * perdayroi;
          // }
          console.log(" capping ",entry.wyz_return)
          
          const allincome = entry.wyz_totalIncome
            ? entry.wyz_totalIncome
            : 0;
          const total = allincome + perdayroi;
          console.log(" now inc  ",total)
          const income_status =
          entry.wyz_return >= total ? "Credit" : "Lapse Capping";
          
          if(incfromroi < twoxofinvs){
          if(entry.wyz_return >= total){
            await dailyroi.create({
            user: entry.user,
            stakeid: entry._id.toString(),
            income: perdayroi,
            amount: entry.amount,
            ratio: entry.ratio,
            token: entry.token,
            income_status: income_status,
            totalIncome: allincome,
            capping: entry.wyz_return,
            txHash: entry.txHash
            })
           
          if(entry.token == "AllstUSDT"){
            console.log("coming here AllstUSDT")
            console.log(" perdayroi ",perdayroi)
            console.log(" All stUSDT ROI ", usdtroi)
            await stake2.updateOne({ _id : entry._id }, { $inc : { wyz_totalIncome : perdayroi ,wallet_roi : usdtroi, wyz_Income_roi : perdayroi } }) 
          } else if(entry.token == "WYZ") {
            console.log("coming here WYZ")
            console.log(" perdayroi ",perdayroi)
            console.log(" All stUSDT ROI ", usdtroi)

            await stake2.updateOne({ _id : entry._id }, { $inc : { wyz_totalIncome : perdayroi ,wallet_roi : perdayroi, wyz_Income_roi : perdayroi } }) 
          }
           await stakeRegister.updateOne({ user : entry.user },{ $inc : { wyz_roi_income : perdayroi, wyz_totalIncome : perdayroi } })

          } else {
            let tankremaining = entry.wyz_return - allincome;
            const currentDate = new Date();
            console.log("tankremaining ",tankremaining)
            console.log("currentDate ",currentDate)
           
            if(tankremaining > 0){
              if(entry.token == "AllstUSDT"){
              const remroi = tankremaining * wyzrate;
              console.log(" tankremaining ",tankremaining);
              console.log(" rem usdt roi ",remroi);
              await stake2.updateOne({ _id : entry._id }, { $set : { staking_status : 1, nextWithdrawDate : currentDate }, $inc : { wyz_totalIncome : tankremaining ,wallet_roi : remroi, wyz_Income_roi : tankremaining } }) 
              } else if(entry.token == "WYZ") {
              await stake2.updateOne({ _id : entry._id }, { $set : { staking_status : 1, nextWithdrawDate : currentDate }, $inc : { wyz_totalIncome : tankremaining ,wallet_roi : tankremaining, wyz_Income_roi : tankremaining } }) 
              }
              await stakeRegister.updateOne({ user : entry.user },{ $inc : { wyz_roi_income : tankremaining, wyz_totalIncome : tankremaining } })
            } else {
              await stake2.updateOne({ _id : entry._id }, { $set : { staking_status : 1,  nextWithdrawDate : currentDate } }) 
            }
          }
          }
        // } else {
        //   console.log("No ROI data found for user:", entry.user);
        //   return null;
        // }
      })
    );

    // Remove null entries from calculatedDataList
    // const filteredDataList = calculatedDataList.filter(
    //   (entry) => entry !== null
    // );

    // Step 3: Update the registration table using bulk operations
    // const bulkUpdateOps = filteredDataList.map((data) => {
    //   if (data.income_status === "Credit") {
    //     return {
    //       updateOne: {
    //         filter: { _id: data._id },
    //         update: {
    //           $inc: {
    //             wyz_roi_income: data.income,
    //             wyz_totalIncome: data.income,
    //           },
    //         },
    //       },
    //     };
    //   } else {
    //     return {
    //       updateOne: {
    //         filter: { user: data.user },
    //         update: { $inc: { wyz_wallet_tank: 0 } },
    //       },
    //     };
    //   }
    // });

    // if (bulkUpdateOps.length > 0) {
    //   await stakeRegister.bulkWrite(bulkUpdateOps);
    // }

    // Step 4: Insert the calculated data into another table using bulk insert
    // if (filteredDataList.length > 0) {
    //   await dailyroi.insertMany(filteredDataList);
    // }
  } catch (error) {
    console.log(error);
  }
}

async function topuproi() {
  try {
    const formattedDateTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    const stakings = await Topup.find({}).lean();
    const calculatedDataList = await Promise.all(
      stakings.map(async (entry) => {
        const stakeregis = await stakeRegister.findOne(
          { user: entry.user },
          { return: 1, totalIncome: 1 }
        );
        if (stakeregis) {
          const perdayroi = entry.perdayroi;
          const allincome = stakeregis.totalIncome ? stakeregis.totalIncome : 0;
          const total = allincome + perdayroi;
          const income_status =
            stakeregis.return >= total ? "Credit" : "Lapse Capping";

          return {
            user: entry.user,
            stakeid: entry._id.toString(),
            income: perdayroi,
            amount: entry.amount,
            ratio: entry.plan,
            token: entry.plan,
            income_status: income_status,
            totalIncome: allincome,
            capping: stakeregis.return,
            txHash: entry.txHash,
          };
        } else {
          console.log("No ROI data found for user:", entry.user);
          return null;
        }
      })
    );

    // Remove null entries from calculatedDataList
    const filteredDataList = calculatedDataList.filter(
      (entry) => entry !== null
    );

    // Step 3: Update the registration table using bulk operations
    const bulkUpdateOps = filteredDataList.map((data) => {
      if (data.income_status === "Credit") {
        return {
          updateOne: {
            filter: { user: data.user },
            update: {
              $inc: { wallet_roi: data.income, totalIncome: data.income },
            },
          },
        };
      } else {
        return {
          updateOne: {
            filter: { user: data.user },
            update: { $inc: { wallet_tank: data.income } },
          },
        };
      }
    });

    if (bulkUpdateOps.length > 0) {
      await stakeRegister.bulkWrite(bulkUpdateOps);
    }

    // Step 4: Insert the calculated data into another table using bulk insert
    if (filteredDataList.length > 0) {
      await dailyroi.insertMany(filteredDataList);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateStakeTeamBusiness() {
  try {
    const record = await stake2.findOne({ calteam_status: 0 }).exec();
    if (record) {
      const team = await upids(record.user);
      if (team.length > 0) {
        //await Promise.all(team.slice(1).map(async address => {
        await Promise.all(
          team.map(async (address) => {
            await registration.updateOne(
              { user: address },
              {
                $set: { staketeambusiness: record.amount }, // Replace 'record.amount' with your actual value
                //$inc: { staketeamCount: 1 } // Increment the team count by 1
              }
            );
          })
        );
      }
      await stake2.updateOne(
        { user: record.user },
        { $set: { calteam_status: 1 } }
      );
      //console.log("up teams ",team)
    }
  } catch (error) {}
}

async function updateTopupTeamBusiness() {
  try {
    const record = await Topup.findOne({ calteam_status: 0 }).exec();
    if (record) {
      const team = await upids(record.user);
      if (team.length > 0) {
        //await Promise.all(team.slice(1).map(async address => {
        await Promise.all(
          team.map(async (address) => {
            await registration.updateOne(
              { user: address },
              {
                $set: { staketeambusiness: record.amount }, // Replace 'record.amount' with your actual value
                //$inc: { staketeamCount: 1 } // Increment the team count by 1
              }
            );
          })
        );
      }
      await Topup.updateOne(
        { user: record.user },
        { $set: { calteam_status: 1 } }
      );
      //console.log("up teams ",team)
    }
  } catch (error) {}
}

async function updateWithdrawDates() {
  const currentTime = new Date();
  const thirtyMinutesInMs = 30 * 60 * 1000;
  const thirtyOneMinutesInMs = 31 * 60 * 1000;

  try {
    console.log("currentTime :: ", currentTime);
    const recordsToUpdate = await stakeRegister.find({
      withdraw_endate: { $lt: currentTime },
    });
    //console.log(recordsToUpdate)
    if (recordsToUpdate) {
      const bulkOps = recordsToUpdate.map((record) => {
        return {
          updateOne: {
            filter: { _id: record._id },
            update: {
              $set: {
                withdraw_stdate: new Date(
                  record.withdraw_stdate.getTime() + thirtyMinutesInMs
                ),
                withdraw_endate: new Date(
                  record.withdraw_endate.getTime() + thirtyOneMinutesInMs
                ),
              },
            },
          },
        };
      });

      if (bulkOps.length > 0) {
        await stakeRegister.bulkWrite(bulkOps);
        console.log("roi withdraw time updated successfully.");
      } else {
        console.log("No roi withdraw time to update.");
      }
    } else {
      console.log("No roi withdraw time to update.");
    }
    // for referral withdrawal

    const ToUpdate = await stakeRegister.find({
      withdrawref_endate: { $lt: currentTime },
    });
    if (ToUpdate) {
      const bulkrefOps = ToUpdate.map((record) => {
        return {
          updateOne: {
            filter: { _id: record._id },
            update: {
              $set: {
                withdraw_stdate: new Date(
                  record.withdrawref_stdate.getTime() + thirtyMinutesInMs
                ),
                withdraw_endate: new Date(
                  record.withdrawref_endate.getTime() + thirtyOneMinutesInMs
                ),
              },
            },
          },
        };
      });

      if (bulkrefOps.length > 0) {
        await stakeRegister.bulkWrite(bulkrefOps);
        console.log("referral withdraw time updated successfully.");
      } else {
        console.log("No referral withdraw time to update.");
      }
    } else {
      console.log("No referral withdraw time to update.");
    }
  } catch (error) {
    console.error("Error updating records:", error);
  }
}

async function findAllDescendantsOld(referrer) {
  const allUserIds = new Set();
  let currentLevel = [referrer];

  while (currentLevel.length > 0) {
    const directMembers = await registration.aggregate([
      { $match: { referrer: { $in: currentLevel } } },
      { $group: { _id: null, users: { $addToSet: "$user" } } },
    ]);

    if (directMembers.length === 0) {
      break;
    }

    currentLevel = directMembers[0].users;
    currentLevel.forEach((id) => allUserIds.add(id));
  }

  return Array.from(allUserIds);
}

async function findAllDescendants(referrer) {
  const allUserIds = new Set();
  let currentLevel = [referrer];
  let firstIteration = true;

  while (currentLevel.length > 0) {
    const directMembers = await registration.aggregate([
      { $match: { referrer: { $in: currentLevel } } },
      { $group: { _id: null, users: { $addToSet: "$user" } } },
    ]);

    if (directMembers.length === 0) {
      break;
    }

    currentLevel = directMembers[0].users;

    if (!firstIteration) {
      currentLevel.forEach((id) => allUserIds.add(id));
    }
    firstIteration = false;
  }

  return Array.from(allUserIds);
}

async function setTeamBusiness() {
  try {
    // Step 1: Get all users from stakeRegister
    const allUsers = await stakeRegister.distinct("user");

    // Step 2: For each user, find all team members recursively and sum their investments
    for (const user of allUsers) {
      const allTeamMembers = await findAllDescendants(user);
      const dirbizz = await calculateDirectsesy(user);
      // Aggregate amounts from stake2 schema
      const stake2Result = await stake2.aggregate([
        { $match: { user: { $in: allTeamMembers } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      const stake2TotalAmount =
        stake2Result.length > 0 ? stake2Result[0].totalAmount : 0;

      // Aggregate amounts from Topup schema
      const topupResult = await Topup.aggregate([
        { $match: { user: { $in: allTeamMembers } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      const topupTotalAmount =
        topupResult.length > 0 ? topupResult[0].totalAmount : 0;

      // Sum the amounts from both schemas
      const totalAmount = stake2TotalAmount + topupTotalAmount;
      const directplus = totalAmount + dirbizz;
      // Update the registration collection with the total team business amount
      await registration.updateOne(
        { user: user },
        {
          $set: {
            staketeambusiness: totalAmount,
            directplusteambiz: directplus,
          },
        }
      );
    }

    console.log("Team business update done");
    return true;
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function calculateDirects(walletAddress) {
  try {
    // Step 1: Find direct members from the registration schema
    const directMembers = await registration
      .find({ referrer: walletAddress })
      .select("user");
    const userIds = directMembers.map((member) => member.user);

    // Step 2: Find corresponding records in the stake2 schema and sum the amount
    const stakeResult = await stake2.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const stakeTotalAmount =
      stakeResult.length > 0 ? stakeResult[0].totalAmount : 0;

    // Step 3: Find corresponding records in the topup schema and sum the amount
    const topupResult = await Topup.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const topupTotalAmount =
      topupResult.length > 0 ? topupResult[0].totalAmount : 0;

    // Step 4: Return the sum of amounts from both schemas
    return stakeTotalAmount + topupTotalAmount;
  } catch (error) {
    console.error("Error in function:", error);
    throw new Error("Internal Server Error");
  }
}

async function calculateDirectsesy(walletAddress) {
  try {
    // Step 1: Find direct members from the registration schema
    const directMembers = await stakedirect
      .find({ referrer: walletAddress })
      .select("user");
    const userIds = directMembers.map((member) => member.user);

    // Step 2: Find corresponding records in the stakeRegister schema and sum the topupAmount
    const stakeRegisterResult = await stakeRegister.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$topup_amount" } } },
    ]);
    const stakeRegisterTotalAmount =
      stakeRegisterResult.length > 0 ? stakeRegisterResult[0].totalAmount : 0;

    // Step 3: Return the total amount
    return stakeRegisterTotalAmount;
  } catch (error) {
    console.error("Error in function:", error);
    throw new Error("Internal Server Error");
  }
}

async function sendRankReward() {
  try {
    const rewa = await stakeReward.findOne({ send_status: 0 }).exec();
    if (rewa) {
      const amount = rewa.amount;
      const isupd = await stakeRegister.updateOne(
        { user: rewa.user },
        { $inc: { wallet_rewards: amount, rankbonus: amount } }
      );
      if (isupd.modifiedCount > 0) {
        await stakeReward.updateOne(
          { _id: rewa._id },
          { $set: { send_status: 1 } }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}

async function calculatePoolReward() {
  try {
    // Calculate the date 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Aggregate sums from Stake2 collection
    const stake2Result = await stake2.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const stake2Sum = stake2Result.length > 0 ? stake2Result[0].totalAmount : 0;

    // Aggregate sums from Topup collection
    const topupResult = await Topup.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const topupSum = topupResult.length > 0 ? topupResult[0].totalAmount : 0;

    // Calculate the combined sum
    const totalSum = stake2Sum + topupSum;

    // for income of POOL 50000

    const pool50k = await stakePool.find({ pool: 50000 });

    const uniqueUsers = await Promise.all(
      pool50k.map(async (entry) => {
        const isInOtherPools = await stakePool.findOne({
          user: entry.user,
          $or: [{ pool: 150000 }, { pool: 400000 }],
        });

        if (!isInOtherPools) {
          return {
            user: entry.user,
          };
        } else {
          return null; // Exclude this user
        }
      })
    );

    // Filter out null values from the uniqueUsers array
    const poolfiftyk = uniqueUsers.filter((entry) => entry !== null);

    if (poolfiftyk) {
      const stakePercentage = 0.005; // 0.5%
      const poolfiftykIncome = totalSum * stakePercentage; // 0.5% of totalSum

      // Calculate the total topup amount for all users in the 50k pool
      const totalTopupAmount = await registration.aggregate([
        { $match: { user: { $in: poolfiftyk.map((user) => user.user) } } },
        { $group: { _id: null, total: { $sum: "$directplusteambiz" } } },
      ]);

      if (totalTopupAmount.length > 0) {
        const totalTopup = totalTopupAmount[0].total;
        const txn_id = await generateRandomString(19);
        // Iterate over each user in the pool and calculate their share
        for (const user of poolfiftyk) {
          const userTopup = await registration.findOne({ user: user.user });
          if (userTopup) {
            const userTopupAmount = userTopup.directplusteambiz;
            const userPercent = (userTopupAmount / totalTopup) * 100;
            const userIncome =
              (userTopupAmount / totalTopup) * poolfiftykIncome;

            // Insert record in stakePoolIncome schema
            const stakePoolIncome = await stakepoolincome.create({
              user: user.user,
              amount: userIncome,
              yourinvestment: userTopupAmount,
              percent: userPercent,
              pool: 50000,
              txn_id: txn_id, // Replace with actual transaction ID
              totalBusiness: totalSum,
            });

            await stakePoolIncome.save();
          }
        }
      }
    }

    // for pool 150000

    const pool150k = await stakePool.find({ pool: 150000 });

    const uniqueUsers2 = await Promise.all(
      pool150k.map(async (entry) => {
        const isInOtherPools = await stakePool.findOne({
          user: entry.user,
          pool: 400000,
        });

        if (!isInOtherPools) {
          return {
            user: entry.user,
          };
        } else {
          return null; // Exclude this user
        }
      })
    );

    // Filter out null values from the uniqueUsers array
    const poolonefiftyk = uniqueUsers2.filter((entry) => entry !== null);

    if (poolonefiftyk) {
      const stakePercentage = 0.0075; // 0.5%
      const poolonefiftykIncome = totalSum * stakePercentage; // 0.5% of totalSum

      // Calculate the total topup amount for all users in the 50k pool
      const totalTopupAmount = await registration.aggregate([
        { $match: { user: { $in: poolonefiftyk.map((user) => user.user) } } },
        { $group: { _id: null, total: { $sum: "$directplusteambiz" } } },
      ]);

      if (totalTopupAmount.length > 0) {
        const totalTopup = totalTopupAmount[0].total;
        const txn_id = await generateRandomString(19);
        // Iterate over each user in the pool and calculate their share
        for (const user of poolonefiftyk) {
          const userTopup = await registration.findOne({ user: user.user });
          if (userTopup) {
            const userTopupAmount = userTopup.directplusteambiz;
            const userPercent = (userTopupAmount / totalTopup) * 100;
            const userIncome =
              (userTopupAmount / totalTopup) * poolonefiftykIncome;

            // Insert record in stakePoolIncome schema
            const stakePoolIncome = await stakepoolincome.create({
              user: user.user,
              amount: userIncome,
              yourinvestment: userTopupAmount,
              percent: userPercent,
              pool: 150000,
              txn_id: txn_id, // Replace with actual transaction ID
              totalBusiness: totalSum,
            });

            await stakePoolIncome.save();
          }
        }
      }
    }

    // for pool 400000

    const poolfourhundk = await stakePool.find({ pool: 400000 });

    if (poolfourhundk) {
      const stakePercentage = 0.0125; // 0.5%
      const poolfourhundrIncome = totalSum * stakePercentage; // 0.5% of totalSum

      // Calculate the total topup amount for all users in the 50k pool
      const totalTopupAmount = await registration.aggregate([
        { $match: { user: { $in: poolfourhundk.map((user) => user.user) } } },
        { $group: { _id: null, total: { $sum: "$directplusteambiz" } } },
      ]);

      if (totalTopupAmount.length > 0) {
        const totalTopup = totalTopupAmount[0].total;
        const txn_id = await generateRandomString(19);
        // Iterate over each user in the pool and calculate their share
        for (const user of poolfourhundk) {
          const userTopup = await registration.findOne({ user: user.user });
          if (userTopup) {
            const userTopupAmount = userTopup.directplusteambiz;
            const userPercent = (userTopupAmount / totalTopup) * 100;
            const userIncome =
              (userTopupAmount / totalTopup) * poolfourhundrIncome;

            // Insert record in stakePoolIncome schema
            const stakePoolIncome = await stakepoolincome.create({
              user: user.user,
              amount: userIncome,
              yourinvestment: userTopupAmount,
              percent: userPercent,
              pool: 400000,
              txn_id: txn_id, // Replace with actual transaction ID
              totalBusiness: totalSum,
            });

            await stakePoolIncome.save();
          }
        }
      }
    }
  } catch (error) {
    console.error("Error summing amounts:", error);
  }
}

async function getMonthRange(joiningDateStr) {
  // Parse the joining date string to a Date object
  const joiningDate = new Date(joiningDateStr);

  // Get the current date
  const currentDate = new Date();

  // Extract the day from the joining date
  const joiningDay = joiningDate.getDate();

  // Construct the start date for the current month based on the joining day
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    joiningDay
  );

  // Construct the end date for the current month by adding one month to the start date
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  // Format the dates to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get the formatted start and end dates
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  return { startDate: startDateStr, endDate: endDateStr };
}

async function getMonthRangeJ(joiningDateStr) {
  // Parse the joining date string to a Date object
  const joiningDate = new Date(joiningDateStr);

  // Get the current date
  const currentDate = new Date();

  // Extract the day and time from the joining date
  const joiningDay = joiningDate.getDate();
  const joiningHours = joiningDate.getHours();
  const joiningMinutes = joiningDate.getMinutes();
  const joiningSeconds = joiningDate.getSeconds();
  const joiningMilliseconds = joiningDate.getMilliseconds();

  const curr_day = currentDate.getDate();

  // Construct the start date for the current month based on the joining day and time
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    joiningDay,
    joiningHours,
    joiningMinutes,
    joiningSeconds,
    joiningMilliseconds
  );

  // Construct the end date for the next month by adding one month to the start date
  const endDate = new Date(startDate);

  // Format the dates to ISO format (full date and time)
  const formatDate = (date) => {
    return date.toISOString();
  };

  // Get the formatted start and end dates
  
  let startDateStr = "";
  let endDateStr = "";
 
  if(curr_day >= joiningDay){
  endDate.setMonth(startDate.getMonth() + 1);
  startDateStr = formatDate(startDate);
  endDateStr = formatDate(endDate);
  } else if(curr_day < joiningDay){
  endDate.setMonth(startDate.getMonth() - 1);
  startDateStr = formatDate(endDate);
  endDateStr = formatDate(startDate);
  }

  
  return { startDate: startDateStr, endDate: endDateStr };
}

async function sumBizInAMonth(joindate, startDate, endDate, userAddr) {
  const directMembers = await stakedirect
    .find({ referrer: userAddr })
    .select("user");
  const userIds = directMembers.map((member) => member.user);
  //console.log("Directs team ",userIds)
  console.log("joindate ", joindate);
  console.log("startDate ", startDate);
  console.log("endDate ", endDate);
  console.log("userAddr ", userAddr);
  // Step 2: Find corresponding records in the stakeRegister schema and sum the topupAmount
  console;
  const stake2Result = await stake2.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalStake2: { $sum: "$amount" },
      },
    },
  ]);

  

  const totalStake2 = stake2Result[0] ? stake2Result[0].totalStake2 : 0;
  const totalSum = totalStake2;

  // direct count

  const count = await stakedirect.countDocuments({
    referrer: userAddr
  });

  return {
    monthBiz: totalSum,
    monthDir: count
  };
}
// let nonce ;
async function set_rate() {
  try {
    const wyzprice = await fetchWYSPrice();
    console.log("wyzprice ", wyzprice);
    let provider = new HDWalletProvider(
      process.env.operator,
      process.env.RPC_URL
    );
    web3.setProvider(provider);
    const accounts = await web3.eth.getAccounts();
    // if(!nonce){
       let nonce = await web3.eth.getTransactionCount(accounts[0]);
    // }
    // web3.eth.getPendingTransactions().then(console.log);
    const blockNumber= await web3.eth.getBlockNumber();
    const gasPrice = await web3.eth.getGasPrice();
    const gas = await contract.methods
    .priceSetting((wyzprice * 1e18).toFixed())
    .estimateGas({ from: accounts[0], value: 0 });
 
    console.log(accounts[0],"above 2529",(wyzprice * 1e18).toFixed(),"gas:",gas,"gasPrice:",gasPrice,"nonce:",nonce,blockNumber);
    const hshs = await contract.methods
      .priceSetting((wyzprice * 1e18).toFixed())
      .send({ from: accounts[0], value: 0 ,gas:gas, gasPrice:(gasPrice+1000),nonce:nonce+1})
      console.log(hshs,"  jsdjdj")
  } catch (error) {
    console.log("Error in fetchARBPrice ", error);
  }
}

async function fetchWYSPrice() {
  try {
    let response = await fetch(
      "https://sapi.xt.com/v4/public/ticker/price"
    ).then((d) => d.json());
    let wys = response.result.find((d) => d.s === "wyz_usdt");
    return wys.p;
  } catch (e) {
    console.log("Error in fetchARBPrice ", e);
  }
}

async function updatePrice() {
  try {
    let wysPrice = await fetchWYSPrice();
    let wyzconvrt = wysPrice;
   
    wysPrice = web3.utils.toWei(wysPrice.toString(), "ether");
    let accounts = await web3.eth.accounts.wallet.add(
      process.env.operator
    );
    let gasPrice = await web3.eth.getGasPrice();
    console.log("wysPrice ",wysPrice)
    // WYS PRICE UPDATE
    gas = await contract.methods
      .priceSetting(wysPrice)
      .estimateGas({ from: accounts.address });
    await contract.methods
      .priceSetting(wysPrice)
      .send({ from: accounts.address, gas: gas, gasPrice: gasPrice });
    // console.log('price updated wysPrice: ',wysPrice)
    await config2.updateOne({},{ $set : { wyz_price : wyzconvrt } })
    return;
  } catch (e) {
    console.log("Error in  updatePrice :", e);
  }
}

async function checkoo(){

  const isbal = await stakeRegister.findOne({ user:"0x8eBb142b9D58f11934C0D744CfF0585b08E5D0A0" });

const isbala = await stake2.findOne({
  user: "0x8eBb142b9D58f11934C0D744CfF0585b08E5D0A0",
  wyzplan: 1
})
.sort({ createdAt: 1 });

const startDate = new Date(isbala.createdAt);
const currentDate = new Date();
const endDate = new Date(currentDate);
const ranknumber = isbal.ranknumber;


const dateRange = await getMonthRangeJ(isbala.createdAt);
const alldetails = await sumBizInAMonth(
  isbala.createdAt,
  dateRange.startDate,
  dateRange.endDate,
  '0x8eBb142b9D58f11934C0D744CfF0585b08E5D0A0'
);
console.log(" date ranges ", dateRange)
console.log(`all_business_detail `, alldetails);

var currentbiz = alldetails.monthBiz;
var currentDir = alldetails.monthDir;

// previuos business
if(ranknumber >= 2){
let daydiv = 0;
var carryforward = 0;
const day_passed = await calculateDaysPassed(dateRange.startDate);
console.log("day_passed ", day_passed)
daydiv = day_passed/30;
console.log("daydiv ", daydiv)
completemonth = Math.floor(daydiv);

if(completemonth >= 1 && day_passed > 0){
  const prevalldetails = await sumBizInAMonth(
    isbala.createdAt,
    isbala.createdAt,
    dateRange.startDate,
    '0x8eBb142b9D58f11934C0D744CfF0585b08E5D0A0'
  );

  const bizmminus = completemonth * (ranknumber*100);

  console.log("biz minuss up",bizmminus);
  
  if(prevalldetails.monthBiz > bizmminus){
    carryforward = prevalldetails.monthBiz - bizmminus;
  }

  console.log("prev start date  ",isbala.createdAt)
  console.log("prev end date  ",dateRange.startDate)
  console.log("prevalldetails ",prevalldetails)


} else if(completemonth == 0 && day_passed > 0){
  const prevalldetails = await sumBizInAMonth(
    isbala.createdAt,
    isbala.createdAt,
    dateRange.startDate,
    '0x8eBb142b9D58f11934C0D744CfF0585b08E5D0A0'
  );

  const bizmminus = 1 * (ranknumber*100);

  if(prevalldetails.monthBiz > bizmminus){
    carryforward = prevalldetails.monthBiz - bizmminus;
  }

  console.log("biz minuss down ",bizmminus);

  console.log("prev start date  ",isbala.createdAt)
  console.log("prev end date  ",dateRange.startDate)
  console.log("prevalldetails ",prevalldetails)
}

console.log("carryforward ",carryforward)
}
}

const calculateDaysPassed = (createdDate) => {
  // Convert both dates to milliseconds
  const createdDateTime = new Date(createdDate).getTime();
  const currentDateTime = new Date().getTime();

  // Calculate the difference in milliseconds
  const diffInMilliseconds = currentDateTime - createdDateTime;

  // Convert milliseconds to days
  const daysPassed = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return daysPassed+1;
};


async function recurringIncome() {
  try {

    const records = await daily4.find({ recurr_status: 0 }).limit(200).exec();

    for (let rec of records) {
      let uuupids = await getLevelIdsTill(rec.user, "20");
     
      let j = 1;
      for (let i = 0; i < uuupids.length; i++) {
        const record = await stake
          .findOne(
            { user: uuupids[i] }
          )
          .exec();

        if (!record) {
          break;
        }
        
        let directStakeCount = await stakedirect.countDocuments({ referrer : uuupids[i] });
      // console.log("currentReferrerId ",currentReferrerId);
       console.log("directStakeCount ",directStakeCount);
       //directStakeCount = 7;
      let iselig = 0;
      let income = (4 / 100) * rec.amount;
      let recurr_inc = 0;
   
      if(j >= 1 && j < 4 && directStakeCount >= 1){
        iselig = 1;
      } else if(j >= 4 && j < 6 && directStakeCount >= 2){
        iselig = 1;
      } else if(j >= 6 && j < 11 && directStakeCount >= 3){
        iselig = 1;
      } else if(j >= 11 && j < 16 && directStakeCount >= 5){
        iselig = 1;
      } else if(j >= 16 && j < 21 && directStakeCount >= 7){
        iselig = 1;
      }
      console.log("level ",i);
      console.log("iselig ",iselig);
        var direct_ref = 0;
        //console.log("isbal ",isbal)
        if (iselig == 1) {
        
          
          if(j == 1){
            perc = 30;
          } else if(j == 2){
            perc = 20;
          } else if(j >= 3 && j < 6){
            perc = 10;
          } else if(j >= 6 && j < 11){
            perc = 1.5;
          } else if(j >= 11 && j < 16){
            perc = 1;
          } else if(j >= 16 && j < 21){
            perc = 1.5;
          }
          recurr_inc = (perc / 100) * income;
          console.log("percent ",perc)
          console.log("income ",recurr_inc)

          await stakeRegister4.updateOne(
            { user: uuupids[i] }, 
            {
              $inc: {
                totalIncome: recurr_inc,
                recurrIncome: recurr_inc,
                wallet_recurr: recurr_inc,
              },
            },
            { upsert: true } 
          );
        

            await levelRecurr.create({
              sender: rec.user,
              receiver: uuupids[i],
              level: j,
              amount: rec.amount,
              wyz_amount: 0,
              income: recurr_inc,
              percent: perc,
              directs : directStakeCount
            });
          
        } 
        j++;
      }

      await daily4.updateOne(
        { _id: rec._id },
        { $set: { recurr_status: 1 } }
      );
    }

    if (records.length === 0) {
      console.log("No Recurring Level Income to Send");
    }

  } catch (error) {
    console.error(error);
    return false;
  }
}

//RecurringlevelIncome();
cron.schedule("* * * * *", async () => {
   levelIncome();
});

 listEvent();

cron.schedule("*/10 * * * *", async () => {
  recurringIncome();
});

 
// cron.schedule(
//   "0 1 * * *", // Run at 1:00 AM IST every day
//   () => {
//     roiwalletWyz();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata for IST
//   }
// );
updatePrice();
cron.schedule("*/5 * * * *", async () => {
  updatePrice();
});


const server = app.listen(8000, () => {
  console.log("Server running!");
});
