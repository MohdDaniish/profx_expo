const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const StakingPlan = require("./model/staking_plan"); // Import the StakingPlan model
const Registration = require("./model/stakeregister");
const stakingUsdt = require("./model/staking_usdt");
const mongoose = require("mongoose");
const registration = require("./model/registration");
const { getAllUsers } = require("./test");
const stake2 = require("./model/stake");
const levelStake = require("./model/levelStake");
const stakeRegister = require("./model/stakeregister");
const withdraw = require("./model/withdraw");
const stakedirect = require('./model/stakedirects');
const signup = require('./model/signup');
const Topup = require("./model/topup")
const dailyroi = require("./model/dailyroi")
const stakereward = require("./model/stakingReward")

const withdraws = require("./model/withdraw");
const levelRecurr = require("./model/levelReccur");
const tankwallet = require("./model/tankwallettransfer");
const recurrtransfer = require("./model/recurrtransfer");
const rewardtransfer = require("./model/rewardtransfer");
const stakepool = require("./model/stakepool");
const crypto = require('crypto');
const apirouter = express.Router();
const Web3 = require("web3");
const levelRecurrMissing = require("./model/levelRecurrmissing");
const config2 = require("./model/confiig");
const governance = require("./model/governance");
const govern_income = require("./model/govern_income");

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


const ABI = [{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Paused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"Registered","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"address","name":"wallet","internalType":"address","indexed":false},{"type":"address","name":"referral","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"Stake","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"string","name":"token","internalType":"string","indexed":false},{"type":"uint256","name":"ratio","internalType":"uint256","indexed":false},{"type":"uint256","name":"t1transfer","internalType":"uint256","indexed":false},{"type":"uint256","name":"t2transfer","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ToppedUp","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"uint256","name":"plan","internalType":"uint256","indexed":false},{"type":"string","name":"protocol","internalType":"string","indexed":false}],"anonymous":false},{"type":"event","name":"Unpaused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IFarming"}],"name":"_farming","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"bridgeUSDTstUSDT","inputs":[{"type":"uint256","name":"usdt","internalType":"uint256"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"bridgeWYZsUSDT","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"findstake","inputs":[{"type":"uint256","name":"_planid","internalType":"uint256"},{"type":"address","name":"user","internalType":"address"},{"type":"string","name":"_name","internalType":"string"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialize","inputs":[{"type":"address","name":"_stUsdtToken","internalType":"address"},{"type":"address","name":"_usdtTokenAddress","internalType":"address"},{"type":"address","name":"_susdTokenAddress","internalType":"address"},{"type":"address","name":"_owner","internalType":"address"},{"type":"address","name":"farming","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"ratio","internalType":"uint256"}],"name":"investments","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"ratio","internalType":"uint256"}],"name":"investments2","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"paused","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Staking.Details[]","components":[{"type":"uint256","name":"investment","internalType":"uint256"},{"type":"uint256","name":"plan","internalType":"uint256"},{"type":"string","name":"protocol","internalType":"string"},{"type":"uint256","name":"capping","internalType":"uint256"}]}],"name":"seeDetailsStaking","inputs":[{"type":"address","name":"usar","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Staking.Retopup[]","components":[{"type":"uint256","name":"investment","internalType":"uint256"},{"type":"uint256","name":"plan","internalType":"uint256"},{"type":"string","name":"protocol","internalType":"string"}]}],"name":"seeDetailsTopup","inputs":[{"type":"address","name":"usar","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stUsdtToken","inputs":[]},{"type":"function","stateMutability":"payable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"investmentIndex","internalType":"uint256"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake2","inputs":[{"type":"uint256","name":"investmentIndex","internalType":"uint256"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmounts","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakingTimestamps","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"susdToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"usdtToken","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"wallet","internalType":"address"},{"type":"address","name":"referral","internalType":"address"}],"name":"userInfo","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdrawLost","inputs":[{"type":"uint256","name":"WithAmt","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdrawLostTokenFromBalance","inputs":[{"type":"uint256","name":"QtyAmt","internalType":"uint256"},{"type":"address","name":"_TOKEN","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"wyz","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"wyzToken","inputs":[]}]

const contract = new web3.eth.Contract(ABI, process.env.WYS_STAKE_CONTRACT);


apirouter.get('/xxxrec', async(req, res) => {
    try {
    // const withdraws = await withdraw.find({ wallet_type: 'roi' });
    // let i =1;
    // // Iterate over each withdraw record
    // for (const withdrawi of withdraws) {
    //   // Add one month to the createdAt date
    //   const newDate = new Date(withdrawi.createdAt);
    //   newDate.setMonth(newDate.getMonth() + 1);

    //   // Update the withdraw_endate in stakeRegister for the matching user
    //   console.log("adrdd ",withdrawi.user)
    //   console.log("createdate ",withdrawi.createdAt)
    //   console.log("newdate ",newDate)
    //   console.log(i)
    //   await stakeRegister.updateOne(
    //     { user: withdrawi.user },
    //     { $set : { withdraw_endate: newDate } }
    //   );
    // i++;
    // }

    // console.log('Updated withdraw_endate for all matching records.');
} catch(error){
    console.log(error)
}
})

apirouter.get('/recurringalllevel', async (req,res) => {
    try {
        const wallet_address = req.query.wallet_address;
        const moment = require('moment-timezone');

// Get the current date and time in IST
        const today = moment.tz('Asia/Kolkata');
        //console.log("today server ",today)
        // Set the start of the day in UTC
        const modifiedDate = today.clone().subtract(1, 'day').set({ hour: 18, minute: 30, second: 0, millisecond: 0 });

        //console.log(modifiedDate.format());
        //const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const startDate = modifiedDate.format();
        
        //console.log("today ",startDate)
        const result = await levelRecurr.aggregate([
          {
            $match: {
              receiver: wallet_address,
              createdAt: {
                $gte: new Date(startDate)
              }
            }
          },
          {
            $lookup: {
              from: 'stake2',
              localField: 'txHash',
              foreignField: 'txHash',
              as: 'stakeDetails'
            }
          },
          {
            $lookup: {
              from: 'topup2',
              localField: 'txHash',
              foreignField: 'txHash',
              as: 'topupDetails'
            }
          },
          {
            $addFields: {
              stakeAmount: { $ifNull: [{ $arrayElemAt: ["$stakeDetails.amount", 0] }, 0] },
              topupAmount: { $ifNull: [{ $arrayElemAt: ["$topupDetails.amount", 0] }, 0] },
              levelBusiness: {
                $add: [
                  { $ifNull: [{ $arrayElemAt: ["$stakeDetails.amount", 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ["$topupDetails.amount", 0] }, 0] }
                ]
              }
            }
          },
          {
            $group: {
              _id: "$level",
              totalIncome: { $sum: "$income" },
              Business: { $sum: "$amount" },
              totalLevelBusiness: { $sum: "$levelBusiness" }
            }
          },
          {
            $project: {
              _id: 0,
              level: "$_id",
              totalIncome: 1,
              Business: 1,
              totalLevelBusiness: 1
            }
          },
          {
            $sort: {
              level: 1 // Sort by level in ascending order
            }
          }
        ]);
      
          return res.status(200).json({
            status: true,
            data: result
        });
      } catch (error) {
        console.error("Error retrieving records: ", error);
        return [];
      }
})

apirouter.get("/transfer-history", async (req, res) => {
  try {
    // Query the "stake2" collection for data related to the received wallet address
    const wallet_address = req.query.wallet_address;
    const type = req.query.type;
    if(type == "tank"){
    const tankData = await tankwallet.find({ user : wallet_address });
    res.json(tankData);
    } else if(type == "recurr"){
    const recurrData = await recurrtransfer.find({ user : wallet_address });
    res.json(recurrData);
    } else if(type == "reward"){
    const rewardData = await rewardtransfer.find({ user : wallet_address });
    res.json(rewardData);  
    }
  } catch (error) {
    console.error("Error fetching stake data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

apirouter.get("/wyz_setRate", async (req, res) => {
  try {
      const wyzprice = await fetchWYSPrice();
      console.log("wyzprice ",wyzprice);
      let provider=new HDWalletProvider(process.env.operator,process.env.RPC_URL);
      web3.setProvider(provider);
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
          await contract.methods.priceSetting((wyzprice*1e18).toFixed()).send({ from: accounts[0], value:0})
          .then(async (d) => {
              console.log("Rate Updated");
            })
           
  } catch (error) {
      if (error.code === 4001) {
      }
      console.log(error);
  }
});

async function fetchWYSPrice() {
  try {
      let response  = await fetch('https://sapi.xt.com/v4/public/ticker/price').then(d=>d.json());
      let wys =  response.result.find(d=>d.s==='wys_usdt');
      return wys.p;
  } catch(e) {
      console.log("Error in fetchARBPrice ",e);
  }
}

apirouter.get("/governance", async (req, res) => {
   const currentDate = new Date();
          // currentDate.setMonth(currentDate.getMonth() + 1);
          // const nextsetDate = currentDate;
   try {
    const ifgov = await config2.findOne({})
    const govenddate = ifgov.governance_date;
    const minusOneMonth = new Date(govenddate);
minusOneMonth.setMonth(minusOneMonth.getMonth() - 1);

// Step 2: Add 3 days to the minusOneMonth date
const plusThreeDays = new Date(minusOneMonth);
plusThreeDays.setDate(plusThreeDays.getDate() + 5);

// Step 3: Add 15 days to the plusThreeDays date
const plusFifteenDays = new Date(plusThreeDays);
plusFifteenDays.setDate(plusFifteenDays.getDate() + 26);


console.log("After Subtracting 1 Month:", minusOneMonth);


    const allnot = await stakeRegister.find({ ranknumber: 0, wyz_return : { $gt : 0 } });
    console.log("allnot count:", allnot.length);
    let p = 0;
    
    if (allnot.length > 0) {
        for (const item of allnot) {
          const isbala = await stake2.findOne({
            user: item.user,
            wyzplan: 1
          })
          .sort({ createdAt: 1 });
          if(isbala){
          const plusFifteenDays = new Date(isbala.createdAt);
          plusFifteenDays.setDate(plusFifteenDays.getDate() + 15);
          const currentDate = new Date();
          if (plusFifteenDays < currentDate) {
          console.log("user :", item.user);
          console.log("start Days:", isbala.createdAt);
          console.log("end Days:", plusFifteenDays);
            // const dateRange = await getMonthRangeJ(item.createdAt);
            const alldetails = await sumBizInAMonth(
                item.createdAt,
                isbala.createdAt,
                plusFifteenDays,
                item.user // Assuming uuupids[i] corresponds to the item's _id here
            );
            // console.log("Date Range:", dateRange);
             console.log("Details:", alldetails);
             const directBiz = alldetails.monthBiz

             if(directBiz >= 500){
              await governance.create({
                user : item.user,
                targetbusiness : 500,
                achievebusiness : directBiz,
                rankno : 0,
                date_start : isbala.createdAt,
                date_end : plusFifteenDays
              })
             }
             p++;
             console.log(p)
            }
            }
        }
    }
  } catch (err) {
   console.log(err)
  }
});

async function getNextSpecificDate(registeredDate) {
  // Make sure registeredDate is a valid Date object
  const registeredDay = new Date(registeredDate);

  // Get the next month with the same day
  const nextSpecificDate = new Date(
    registeredDay.getFullYear(),
    registeredDay.getMonth() + 1, // Move to the next month
    registeredDay.getDate() // Keep the same day of the month
  );

  // For testing, you could add 30 minutes here, if needed:
  // nextSpecificDate.setMinutes(nextSpecificDate.getMinutes() + 30);

  return nextSpecificDate;
}

async function sumBizInAMonth(joindate, startDate, endDate, userAddr) {
  const directMembers = await stakedirect
    .find({ referrer: userAddr })
    .select("user");
  const userIds = directMembers.map((member) => member.user);
  //console.log("Directs team ",userIds)
  // console.log("joindate ", joindate);
  // console.log("startDate ", startDate);
  // console.log("endDate ", endDate);
  // console.log("userAddr ", userAddr);
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

async function sendgovernance() {
  try {

    const startdate = new Date('2024-10-04T06:07:45.795+00:00')
    const enddate = new Date('2024-10-31T18:30:45.795+00:00')

    console.log("startdate :", startdate);
    console.log("enddate :", enddate);
    
   
    const usei = await registration
      .findOne({ user: rec.user }, { referrer: 1 })
      .exec();
    let currentReferrerId = usei.referrer;
    let i = 1;

    // Loop through the referrer chain until a certain level or no more referrers
    while (currentReferrerId) {
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

      let allper;

      if(ranknumber == 0){
        allper = 7;
      } else if(ranknumber == 1){
        allper = 5;
      } else if(ranknumber == 2){
        allper = 3;
      } else if(ranknumber == 3){
        allper = 1;
      } else if(ranknumber == 4){
        allper = 0;
      }


      // Handle operations based on the level
      
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
                  governance_wallet: direct_ref,
                  governance_income: direct_ref,
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

  module.exports = apirouter;
