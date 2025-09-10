const express = require("express");
const router = express.Router();
const stakeRegister = require("../model/stakeregister");
const stake2 = require("../model/stake");
const moment = require("moment-timezone");
const WithdrawalModel = require("../model/withdraw");
const topup2 = require("../model/topup");
const { verifyToken } = require("../Middleware/jwtToken");
const recurrtransfer = require("../model/recurrtransfer");
const { compareSync } = require("bcrypt");
const poolincometransfer = require("../model/poolincometransfer");

router.get("/dashborad", verifyToken, async (req, res) => {
  try {
    const startOfToday = moment.tz("Asia/Kolkata").startOf("day").toDate();

    const endOfToday = moment.tz("Asia/Kolkata").endOf("day").toDate();

    const totaluser = await stakeRegister.find({}).countDocuments();
    const activeUser = await stakeRegister
      .find({ stake_amount: { $gt: 0 } })
      .countDocuments();
    const inactiveUser = await stakeRegister
      .find({ stake_amount: 0 })
      .countDocuments();

    let wyzToday = 0;
    let usdtTody = 0;
    const wyzDeposite = await stake2.aggregate([
      {
        $match: {
          token: "WYZ-stUSDT",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const totalwyz = wyzDeposite[0]?.total;

    const wyztodayDeposite = await stake2.aggregate([
      {
        $match: {
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    wyztodayDeposite.forEach((wyz) => {
      wyzToday += parseFloat(wyz.amount);
    });

    const usdtDeposite = await stake2.aggregate([
      {
        $match: {
          token: "bUSDT-stUSDT",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const usdttotal = usdtDeposite[0]?.total;

    const usdtTodayDeposite = await stake2.aggregate([
      {
        $match: {
          token: "bUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    usdtTodayDeposite.forEach((usd) => {
      usdtTody += parseFloat(usd.amount);
    });
    let firstdata = 0;
    let thirddata = 0;
    let seconddata = 0;
    let fourthdata = 0;
    let fifthdata = 0;
    let sixdata = 0;
    let sevendata = 0;
    let eightdata = 0;
    const firstProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "10" }, { ratio: 10 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);

    firstProtocol.forEach((first) => {
      firstdata += parseFloat(first.amount);
    });

    const secondProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "20" }, { ratio: 20 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    secondProtocol.forEach((second) => {
      seconddata += parseFloat(second.amount);
    });
    const thirdProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "30" }, { ratio: 30 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    thirdProtocol.forEach((third) => {
      thirddata += parseFloat(third.amount);
    });
    const fourthProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "40" }, { ratio: 40 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    fourthProtocol.forEach((fourth) => {
      fourthdata += parseFloat(fourth.amount);
    });
    const fifthProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "50" }, { ratio: 50 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);

    fifthProtocol.forEach((fifth) => {
      fifthdata += parseFloat(fifth.amount);
    });
    const sixProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 15,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    sixProtocol.forEach((sixth) => {
      sixdata += parseFloat(sixth.amount);
    });
    const sevenProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 20,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    sevenProtocol.forEach((seven) => {
      sevendata += parseFloat(seven.amount);
    });
    const eightProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 25,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    eightProtocol.forEach((eight) => {
      eightdata += parseFloat(eight.amount);
    });

    const roiWithdraw = await WithdrawalModel.aggregate([
      { $match: { wallet_type: "roi", isapprove: true, isreject: false } },

      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const totalroiwithdraw = roiWithdraw[0]?.total || 0;
    let roiToday = 0;
    const roiWithdrawday = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "roi",
          isapprove: true,
          isreject: false,
          timestamp: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    roiWithdrawday.forEach((roit) => {
      roiToday += parseFloat(roit.withdrawAmount);
    });

    let roipending = 0;
    const roiWithPending = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "roi",
          isapprove: false,
          isreject: false,
        },
      },
    ]);
    roiWithPending.forEach((roit) => {
      roipending += parseFloat(roit.withdrawAmount);
    });

    const referralWithdraw = await WithdrawalModel.aggregate([
      { $match: { wallet_type: "referral", isapprove: true, isreject: false } },

      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const totalreferal = referralWithdraw[0]?.total || 0;
    let refrealtoday = 0;
    const referraltodayWithdraw = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "referral",
          isapprove: true,
          timestamp: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    referraltodayWithdraw.forEach((reft) => {
      refrealtoday += parseFloat(reft.withdrawAmount);
    });

    const pendingWithdraw = await WithdrawalModel.aggregate([
      {
        $match: { wallet_type: "referral", isapprove: false, isreject: false },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const pendingWithdrawls = pendingWithdraw[0]?.total || 0;

    const approveWithdraw = await WithdrawalModel.aggregate([
      { $match: { isapprove: true } },
      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const approveWithdrawtotal = approveWithdraw[0]?.total || 0;

    const reejectWithdraw = await WithdrawalModel.aggregate([
      { $match: { isreject: true } },
      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const reejectWithdrawtotal = reejectWithdraw[0]?.total || 0;

    const withapprovetoday = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "referral",
          isapprove: true,
          timestamp: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);
    let approvetodaywith = 0;
    withapprovetoday.forEach((data) => {
      approvetodaywith += parseFloat(data.withdrawAmount);
    });

    const topupall = await topup2.aggregate([
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const alltopup = topupall[0]?.total;
    const topupToady = await topup2.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
    ]);

    let topupday = 0;
    topupToady.forEach((data) => {
      topupday += parseFloat(data.amount);
    });

    const totalRucrrer = await recurrtransfer.aggregate([
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const reccureTotal = totalRucrrer[0]?.total;
    const reccureToday = await recurrtransfer.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    let ruccerTodayAmount = 0;
    reccureToday.forEach((data) => {
      ruccerTodayAmount += parseFloat(data.amount);
    });

    const firstWyzToady = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 10 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.1] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const secondWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 20 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.2] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const thirdWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 30 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.3] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);
    const fourthWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 40 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.4] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const fifthWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 50 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.5] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const sixthWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 15,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: {
                $divide: [{ $multiply: ["$amount", 0.15] }, "$wyz_rate"],
              },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const sevenWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 20,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.2] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);

    const eigthWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 25,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $addFields: {
          wysToday: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: {
                $divide: [{ $multiply: ["$amount", 0.25] }, "$wyz_rate"],
              },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          todayWYZ: { $sum: "$wysToday" },
        },
      },
    ]);
    const todayPool = await poolincometransfer.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
   
    const totalPool = await poolincometransfer.aggregate([
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    
    return res.json({
      totaluser,
      activeUser,
      inactiveUser,
      totalwyz,
      usdttotal,
      wyzToday,
      usdtTody,
      firstdata,
      seconddata,
      thirddata,
      fourthdata,
      fifthdata,
      sixdata,
      sevendata,
      eightdata,
      totalroiwithdraw,
      roiToday,
      totalreferal,
      refrealtoday,
      pendingWithdrawls,
      approveWithdrawtotal,
      reejectWithdrawtotal,
      approvetodaywith,
      alltopup,
      topupday,
      roipending,
      reccureTotal,
      ruccerTodayAmount,
      todaypool:todayPool.length>0?todayPool[0]?.total :0,
      totalPool:totalPool.length>0?totalPool[0]?.total:0,
      todayFirstWyz: firstWyzToady.length > 0 ? firstWyzToady[0]?.todayWYZ : 0,
      todaySecondtWyz:
        secondWyzToday.length > 0 ? secondWyzToday[0]?.todayWYZ : 0,
      todayThirdtWyz: thirdWyzToday.length > 0 ? thirdWyzToday[0]?.todayWYZ : 0,
      todayFourthtWyz:
        fourthWyzToday.length > 0 ? fourthWyzToday[0]?.todayWYZ : 0,
      todayFifthtWyz: fifthWyzToday.length > 0 ? fifthWyzToday[0]?.todayWYZ : 0,
      todaySixthWyz: sixthWyzToday.length > 0 ? sixthWyzToday[0]?.todayWYZ : 0,
      todaySeventhWyz:
        sevenWyzToday.length > 0 ? sevenWyzToday[0]?.todayWYZ : 0,
      todayEigthWyz: eigthWyzToday.length > 0 ? eigthWyzToday[0]?.todayWYZ : 0,

    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/graph-data", verifyToken, async (req, res) => {
  try {
    const todayKolkata = moment.tz("Asia/Kolkata").startOf("day");
    const sevenDaysAgoKolkata = todayKolkata.clone().subtract(6, "days");

    async function fetchDataForDay(dayIndex) {
      const startOfDayKolkata = sevenDaysAgoKolkata
        .clone()
        .add(dayIndex, "days");
      const endOfDayKolkata = startOfDayKolkata
        .clone()
        .add(1, "days")
        .subtract(1, "milliseconds");

      const [stakes, withdraw, topups] = await Promise.all([
        stake2.find({
          createdAt: {
            $gte: startOfDayKolkata.toDate(),
            $lt: endOfDayKolkata.toDate(),
          },
        }),
        WithdrawalModel.find({
          timestamp: {
            $gte: startOfDayKolkata.toDate(),
            $lt: endOfDayKolkata.toDate(),
          },
        }),
        topup2.find({
          createdAt: {
            $gte: startOfDayKolkata.toDate(),
            $lt: endOfDayKolkata.toDate(),
          },
        }),
      ]);

      const filteredStakes = stakes.filter((stake) => {
        const condition1 = stake.ratio == "10" && stake.token == "WYZ-stUSDT";
        const condition2 = stake.ratio == "20" && stake.token == "WYZ-stUSDT";
        const condition3 = stake.ratio == "30" && stake.token == "WYZ-stUSDT";
        const condition4 = stake.ratio == "40" && stake.token == "WYZ-stUSDT";
        const condition5 = stake.ratio == "50" && stake.token == "WYZ-stUSDT";
        const condition6 = stake.ratio == "15" && stake.token == "sUSDT-stUSDT";
        const condition7 = stake.ratio == "20" && stake.token == "sUSDT-stUSDT";
        const condition8 = stake.ratio == "25" && stake.token == "sUSDT-stUSDT";
        return (
          condition1 ||
          condition2 ||
          condition3 ||
          condition4 ||
          condition5 ||
          condition6 ||
          condition7 ||
          condition8
        );
      });

      const total = filteredStakes.reduce(
        (acc, stake) => acc + stake.amount,
        0
      );

      const wyz = filteredStakes.reduce((acc, stake) => {
        if (stake.ratio == "10")
          return acc + (stake.amount * 0.1) / stake.wyz_rate;
        if (stake.ratio == "20")
          return acc + (stake.amount * 0.2) / stake.wyz_rate;
        if (stake.ratio == "30")
          return acc + (stake.amount * 0.3) / stake.wyz_rate;
        if (stake.ratio == "40")
          return acc + (stake.amount * 0.4) / stake.wyz_rate;
        if (stake.ratio == "50")
          return acc + (stake.amount * 0.5) / stake.wyz_rate;
        if (stake.ratio == "15" && stake.token == "sUSDT-stUSDT")
          return acc + (stake.amount * 0.15) / stake.wyz_rate;
        if (stake.ratio == "20" && stake.token == "sUSDT-stUSDT")
          return acc + (stake.amount * 0.2) / stake.wyz_rate;
        if (stake.ratio == "25" && stake.token == "sUSDT-stUSDT")
          return acc + (stake.amount * 0.25) / stake.wyz_rate;
        return acc;
      }, 0);
      const transformedAmount = filteredStakes.reduce((acc, stake) => {
        if (stake.ratio == "10") return acc + stake.amount * 0.9;
        if (stake.ratio == "20") return acc + stake.amount * 0.8;
        if (stake.ratio == "30") return acc + stake.amount * 0.7;
        if (stake.ratio == "40") return acc + stake.amount * 0.6;
        if (stake.ratio == "50") return acc + stake.amount * 0.5;
        if (stake.ratio == "15" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.85;
        if (stake.ratio == "20" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.8;
        if (stake.ratio == "25" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.75;
        return acc;
      }, 0);

      const stakeusdt = stakes.filter((stake) => {
        const usdt1 = stake.ratio == "15" && stake.token == "sUSDT-stUSDT";
        const usdt2 = stake.ratio == "20" && stake.token == "sUSDT-stUSDT";
        const usdt3 = stake.ratio == "25" && stake.token == "sUSDT-stUSDT";

        return usdt1 || usdt2 || usdt3;
      });

      const totalusdt = stakeusdt.reduce((acc, stake) => {
        if (stake.ratio == "15" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.85;
        if (stake.ratio == "20" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.8;
        if (stake.ratio == "25" && stake.token == "sUSDT-stUSDT")
          return acc + stake.amount * 0.75;
        return acc;
      }, 0);

      const roiWithdraw = withdraw
        .filter(
          (withdrawroi) =>
            withdrawroi.wallet_type == "roi" && withdrawroi.isapprove == true
        )
        .reduce((acc, withdrawroi) => acc + withdrawroi.withdrawAmount, 0);

      const referralWithdraw = withdraw
        .filter(
          (withdrawreferral) =>
            withdrawreferral.wallet_type == "referral" &&
            withdrawreferral.isapprove == true
        )
        .reduce(
          (acc, withdrawreferral) => acc + withdrawreferral.withdrawAmount,
          0
        );

      const topupdata = topups.reduce((acc, data) => {
        const amount = parseFloat(data.amount);
        return acc + amount;
      }, 0);

      return {
        day: startOfDayKolkata.format("dddd"),
        stakewyz: parseFloat(wyz),
        stakestusdt: parseFloat(transformedAmount),
        total: parseFloat(total),
        topus: parseFloat(topupdata),
        stakeusdt: parseFloat(totalusdt),
        roi: parseFloat(roiWithdraw),
        referral: parseFloat(referralWithdraw),
      };
    }

    const results = await Promise.all(
      Array.from({ length: 7 }).map((_, index) => fetchDataForDay(index))
    );

    const Stakeswyz = {};
    const Stakestusdt = {};
    const Stakeusdt = {};
    const Totalamount = {};
    const Topusdata = {};
    const withdrawRoi = {};
    const refrealWithdraw = {};

    results.forEach(
      ({
        day,
        stakewyz,
        stakestusdt,
        stakeusdt,
        roi,
        referral,
        topus,
        total,
      }) => {
        Stakeswyz[day] = stakewyz;
        Stakestusdt[day] = stakestusdt;
        Stakeusdt[day] = stakeusdt;
        Totalamount[day] = total;
        Topusdata[day] = topus;
        withdrawRoi[day] = roi;
        refrealWithdraw[day] = referral;
      }
    );

    return res.json({
      status: 200,
      error: false,
      Stakeswyz,
      Stakestusdt,
      Stakeusdt,
      Totalamount,
      Topusdata,
      withdrawRoi,
      refrealWithdraw,
    });
  } catch (error) {
    console.error("Error calculating data:", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.post("/dashborad-month",verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = moment.tz(startDate, "Asia/Kolkata").toDate();
    const end = moment.tz(endDate, "Asia/Kolkata").toDate();

    const monthUser = await stakeRegister.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const monthlyDepositewys = await stake2.aggregate([
      {
        $match: {
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const monthlyDepositestudt = await stake2.aggregate([
      {
        $match: {
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const firstProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "10" }, { ratio: 10 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const secondProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "20" }, { ratio: 20 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const thirdProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "30" }, { ratio: 30 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const fourthProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "40" }, { ratio: 40 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const fifthProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "50" }, { ratio: 50 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const sixProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 15,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const sevenProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 20,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const eightProtocol = await stake2.aggregate([
      {
        $match: {
          ratio: 25,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const referralmonthWithdraw = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "referral",
          isapprove: true,
          timestamp: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const roimonthWithdraw = await WithdrawalModel.aggregate([
      {
        $match: {
          wallet_type: "roi",
          isapprove: true,
          timestamp: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const topupmonth = await topup2.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const monthRucrrer = await recurrtransfer.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
   
    const firstWyzToady = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 10 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.1] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const secondWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 20 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.2] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const thirdWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 30 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.3] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);
    const fourthWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 40 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.4] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const fifthWyzToday = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: 50 }],
          token: "WYZ-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.5] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const sixthWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 15,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: {
                $divide: [{ $multiply: ["$amount", 0.15] }, "$wyz_rate"],
              },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const sevenWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 20,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: { $divide: [{ $multiply: ["$amount", 0.2] }, "$wyz_rate"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);

    const eigthWyzToday = await stake2.aggregate([
      {
        $match: {
          ratio: 25,
          token: "sUSDT-stUSDT",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          toalWYZ: {
            $cond: {
              if: { $gt: ["$wyz_rate", 0] },
              then: {
                $divide: [{ $multiply: ["$amount", 0.25] }, "$wyz_rate"],
              },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$toalWYZ" },
        },
      },
    ]);
    const monthPool = await poolincometransfer.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: "$amount" },
        },
      },
    ]);
 
    return res.json({
      totaluser: monthUser,
      totalwyz:
        monthlyDepositewys.length > 0 ? monthlyDepositewys[0]?.total : 0,
      usdttotal:
        monthlyDepositestudt.length > 0 ? monthlyDepositestudt[0]?.total : 0,
      firstdata: firstProtocol.length > 0 ? firstProtocol[0]?.total : 0,
      seconddata: secondProtocol.length > 0 ? secondProtocol[0]?.total : 0,
      thirddata: thirdProtocol.length > 0 ? thirdProtocol[0]?.total : 0,
      fourthdata: fourthProtocol.length > 0 ? fourthProtocol[0]?.total : 0,
      fifthdata: fifthProtocol.length > 0 ? fifthProtocol[0]?.total : 0,
      sixdata: sixProtocol.length > 0 ? sixProtocol[0]?.total : 0,
      sevendata: sevenProtocol.length > 0 ? sevenProtocol[0]?.total : 0,
      eightdata: eightProtocol.length > 0 ? eightProtocol[0]?.total : 0,
      refrealMonth:
        referralmonthWithdraw.length > 0 ? referralmonthWithdraw[0]?.total : 0,
      roiMonth: roimonthWithdraw.length > 0 ? roimonthWithdraw[0].total : 0,
      topup: topupmonth.length > 0 ? topupmonth[0]?.total : 0,
      monthReccur: monthRucrrer.length > 0 ? monthRucrrer[0]?.total : 0,
      todayFirstWyz: firstWyzToady.length > 0 ? firstWyzToady[0]?.total : 0,
      todaySecondtWyz: secondWyzToday.length > 0 ? secondWyzToday[0]?.total : 0,
      todayThirdtWyz: thirdWyzToday.length > 0 ? thirdWyzToday[0]?.total : 0,
      todayFourthtWyz: fourthWyzToday.length > 0 ? fourthWyzToday[0]?.total : 0,
      todayFifthtWyz: fifthWyzToday.length > 0 ? fifthWyzToday[0]?.total : 0,
      todaySixthWyz: sixthWyzToday.length > 0 ? sixthWyzToday[0]?.total : 0,
      todaySeventhWyz: sevenWyzToday.length > 0 ? sevenWyzToday[0]?.total : 0,
      todayEigthWyz: eigthWyzToday.length > 0 ? eigthWyzToday[0]?.total : 0,
      todayPool:monthPool.length>0?monthPool[0]?.total:0
    });
  } catch (err) {
    console.log("Error In Dashborad-month()", err);
  }
});

module.exports = router;
