const express = require("express");
const router = express.Router();
const registration = require("../model/registration");
const stake2 = require("../model/stake");
const dailyroi = require("../model/dailyroi");
const WithdrawalModel = require("../model/withdraw");
const stakeRegister = require("../model/stakeregister");
const levelStake = require("../model/levelStake");
const topup2 = require("../model/topup");
const apprveWithdraw = require("../model/apprveWithdraw");
const moment = require("moment-timezone");
const { verifyToken } = require("../Middleware/jwtToken");
const stakeReward = require("../model/stakingReward");
const stakePool = require("../model/stakepool");
const recurrtransfer = require("../model/recurrtransfer");
const poolincometransfer = require("../model/poolincometransfer");
const updateWithdraw = require("../model/updateWithdraw");

const limit = 100;

router.get("/deposite", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "joinedData.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCount = await stake2.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ]);

    const data = await stake2.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { "joinedData.name": { $regex: searchQuery, $options: "i" } },
            { user: { $regex: searchQuery, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          user: 1,
          timestamp: 1,
          amount: 1,
          token: 1,
          ratio: 1,
          txHash: 1,
          createdAt: 1,
          wyz_rate: 1,
          Name: "$joinedData.name",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.json({
      error: true,
      status: 500,
      message: error.message,
    });
  }
});

router.get("/withdraw-referal", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;
    const limit = pageSize;
    const searchQuery = req.query.search ? req.query.search.trim() : "";
    const payment = req.query.paymentMethod
      ? req.query.paymentMethod.trim()
      : "";

    let paymentFilter = {};
    if (payment) {
      paymentFilter.payment_method = payment;
    }

    let filter = {
      ...paymentFilter,
    };
    if (searchQuery) {
      filter.$or = [
        { user: { $regex: searchQuery, $options: "i" } },
        { "joinedData.name": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalCountPipeline = [
      {
        $match: {
          wallet_type: "referral",
          isapprove: false,
          isreject: false,
          ...paymentFilter,
        },
      },
      {
        $lookup: {
          from: "signup",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$wallet_add", "$$userId"] },
              },
            },
          ],
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await WithdrawalModel.aggregate(
      totalCountPipeline
    );
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $match: {
          wallet_type: "referral",
          isapprove: false,
          isreject: false,
          ...paymentFilter,
        },
      },
      {
        $lookup: {
          from: "signup",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$wallet_add", "$$userId"] },
              },
            },
          ],
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $project: {
          _id: 1,
          user: 1,
          withdrawAmount: 1,
          wallet_type: 1,
          recurr_status: 1,
          createdAt: 1,
          payment_method: 1,
          recurr_status: 1,
          isapprove: 1,
          isreject: 1,
          trxnHash: 1,
          isfailed: 1,
          Name: "$joinedData.name",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await WithdrawalModel.aggregate(dataPipeline);
    //console.log("data :: ",data)
    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.log("Error In Withdraw Roi", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/withdraw-roi", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;
    const limit = pageSize;
    const searchQuery = req.query.search ? req.query.search.trim() : "";
    const payment = req.query.paymentMethod
      ? req.query.paymentMethod.trim()
      : "";

    let paymentFilter = {};
    if (payment) {
      paymentFilter.payment_method = payment;
    }

    let filter = {
      ...paymentFilter,
    };
    if (searchQuery) {
      filter.$or = [
        { user: { $regex: searchQuery, $options: "i" } },
        { "joinedData.name": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalCountPipeline = [
      {
        $match: {
          wallet_type: "roi",
          isapprove: false,
          isreject: false,
          ...paymentFilter,
        },
      },
      {
        $lookup: {
          from: "signup",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$wallet_add", "$$userId"] },
              },
            },
          ],
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await WithdrawalModel.aggregate(
      totalCountPipeline
    );
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $match: {
          wallet_type: "roi",
          isapprove: false,
          isreject: false,
          ...paymentFilter,
        },
      },
      {
        $lookup: {
          from: "signup",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$wallet_add", "$$userId"] },
              },
            },
          ],
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $project: {
          _id: 1,
          user: 1,
          withdrawAmount: 1,
          wallet_type: 1,
          recurr_status: 1,
          createdAt: 1,
          payment_method: 1,
          recurr_status: 1,
          isapprove: 1,
          isreject: 1,
          trxnHash: 1,
          isfailed: 1,
          Name: "$joinedData.name",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await WithdrawalModel.aggregate(dataPipeline);
    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.log("Error In Withdraw Roi", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/depoesite-user", verifyToken, async (req, res) => {
  try {
    const user = req.query.user;
    const page = parseInt(req.query.page) || 1;

    const totalUser = await stake2.find({ user: user }).countDocuments();
    const data = await stake2
      .find({ user: user })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      status: 200,
      data,
      totalUser,
    });
  } catch (error) {
    console.log("Error In depoesite-user", error);
  }
});

router.get("/withdraw-user", verifyToken, async (req, res) => {
  try {
    const user = req.query.user;
    const page = parseInt(req.query.page) || 1;

    const totalUser = await WithdrawalModel.find({
      user: user,
    }).countDocuments();
    const data = await WithdrawalModel.find({ user: user })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      status: 200,
      data,
      totalUser,
    });
  } catch (error) {
    console.log("Error In Withdraw-user", error);
  }
});

router.get("/all-data", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || "";
  const limit = 100;
  const skip = (page - 1) * limit;

  let filter = {};
  if (searchQuery) {
    filter = {
      $or: [
        { user: { $regex: searchQuery, $options: "i" } },
        { userId: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }
  try {
    const totalUsers = await stakeRegister.countDocuments();

    const data = await registration.aggregate([
      {
        $match: filter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $lookup: {
          from: "stakeregisters",
          localField: "user",
          foreignField: "user",
          as: "stakeregisters_data",
        },
      },
      {
        $unwind: {
          path: "$stakeregisters_data",
        },
      },
      {
        $lookup: {
          from: "signup",
          localField: "stakeregisters_data.user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: {
          path: "$signup_data",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "stake2",
          let: { user: "$user" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$user"] } } },
            { $project: { token: 1, ratio: 1, amount: 1, wyz_rate: 1 } },
            { $sort: { _id: 1 } },
            { $limit: 1 },
          ],
          as: "additional_data",
        },
      },
      {
        $unwind: {
          path: "$additional_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          userId: 1,
          referrerId: 1,
          name: "$signup_data.name",
          phone: "$signup_data.phone",
          level: 1,
          position: 1,
          directStakeCount: 1,
          directStakeCount: "$directStakeCount",
          stakedirectbusiness: "$directplusteambiz",
          staketeambusiness: "$staketeambusiness",
          user: "$stakeregisters_data.user",
          stake_amount: "$stakeregisters_data.stake_amount",
          topup_amount: "$stakeregisters_data.topup_amount",
          createdAt: "$stakeregisters_data.createdAt",
          rank: "$stakeregisters_data.rank",
          rankbonus: "$stakeregisters_data.rankbonus",
          poolIncome: "$stakeregisters_data.poolIncome",
          poolbonus: "$stakeregisters_data.poolbonus",
          token: "$additional_data.token",
          ratio: "$additional_data.ratio",
          amount: "$additional_data.amount",
          wyz_rate: "$additional_data.wyz_rate",
        },
      },
    ]);

    return res.json({
      status: 200,
      data,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

router.post("/withdraw-block", verifyToken, async (req, res) => {
  try {
    const { user, status } = req.body;
    console.log(user, status);
    const User = await stakeRegister.find({
      user: user,
    });

    if (!User) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    if (status == 1) {
      const result = await stakeRegister.updateOne(
        { user: user },
        { $set: { withdraw_status: status } }
      );

      return res.json({
        status: 200,
        message: "Withdraw blocked successfully",
      });
    } else if (status == 0) {
      const result = await stakeRegister.updateOne(
        { user: user },
        { $set: { withdraw_status: status } }
      );
      return res.json({
        status: 200,
        message: "Withdraw Unblock successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went Wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/block-list", verifyToken, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let search = req.query.search || "";

    let filter = {};
    if (search) {
      filter = {
        $or: [{ user: { $regex: search, $options: "i" } }],
      };
    }
    const totalUser = await stakeRegister
      .find({ withdraw_status: 1, ...filter })
      .countDocuments();
    const data = await stakeRegister.aggregate([
      {
        $match: {
          withdraw_status: 1,
          ...filter,
        },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: "$signup_data",
      },
      {
        $project: {
          _id: 0,
          name: "$signup_data.name",
          userId: "$signup_data.userId",
          user: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: (page - 1) * 100,
      },
      {
        $limit: 100,
      },
    ]);

    return res.json({
      status: 200,
      data,
      totalUser,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/commission-user", verifyToken, async (req, res) => {
  let user = req.query.user;
  try {
    const requireobject = {
      _id: 0,
      user: 1,
      totalWithdraw: 1,
      lapseIncome: 1,
      referalIncome: 1,
      levelIncome: 1,
      recurrIncome: 1,
      rankbonus: 1,
      rankboosterlevel: 1,
      topup_amount: 1,
      totalIncome: 1,
      wallet_rewards: 1,
      referalIncome: 1,
      totalIncome: 1,
      wallet_roi: 1,
      wallet_recurr: 1,
      poolbonus: 1,
      roi_withdraw: 1,
      openlevel: 1,
      poolIncome: 1,
    };

    const allTeamMembers = await findAllDescendants(user);

    const result = await stake2.aggregate([
      { $match: { user: { $in: allTeamMembers } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    // const teamBussines = result.length > 0 ? result[0].totalAmount : 0;

    const users = await stakeRegister.findOne({ user: user }, requireobject);
    const records = await registration
      .find({ referrer: user })
      .sort({ directplusteambiz: -1 })
      .exec();

    let seventyPercentOfHighest = 0;
    if (records.length > 0) {
      const highestValue = records[0].directplusteambiz;
      seventyPercentOfHighest = highestValue;
    }
    let thirtyPercentOfRemainingSum = 0;
    if (records.length > 1) {
      const remainingSum = records
        .slice(1)
        .reduce((acc, record) => acc + record.directplusteambiz, 0);
      thirtyPercentOfRemainingSum = remainingSum;
    }

    const teamBuss = await registration.find(
      { user, user },
      { _id: 0, staketeambusiness: 1 }
    );
    const teamBussines = teamBuss[0]?.staketeambusiness;

    if (!users) {
      return res.json({
        status: 400,
        error: true,
        message: "No User Found",
      });
    }
    return res.json({
      error: false,
      status: 200,
      data: {
        users,
        teamBussines,
        seventyPercentOfHighest,
        thirtyPercentOfRemainingSum,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/protocol-details", verifyToken, async (req, res) => {
  try {
    const firstProtocol = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "10" }, { ratio: 10 }],
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

    const secondProtocol = await stake2.aggregate([
      {
        $match: { $or: [{ ratio: "20" }, { ratio: 20 }], token: "WYZ-stUSDT" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const thirdProtocol = await stake2.aggregate([
      {
        $match: { $or: [{ ratio: "30" }, { ratio: 30 }], token: "WYZ-stUSDT" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const fourthProtocol = await stake2.aggregate([
      {
        $match: { $or: [{ ratio: "40" }, { ratio: 40 }], token: "WYZ-stUSDT" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const fifthProtocol = await stake2.aggregate([
      {
        $match: { $or: [{ ratio: "50" }, { ratio: 50 }], token: "WYZ-stUSDT" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const sixProtocol = await stake2.aggregate([
      { $match: { ratio: 15, token: "sUSDT-stUSDT" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const sevenProtocol = await stake2.aggregate([
      { $match: { ratio: 20, token: "sUSDT-stUSDT" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const eightProtocol = await stake2.aggregate([
      { $match: { ratio: 25, token: "sUSDT-stUSDT" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const firstWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "10" }, { ratio: 10 }],
          token: "WYZ-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const secondWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "20" }, { ratio: 20 }],
          token: "WYZ-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const thirdWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "30" }, { ratio: 30 }],
          token: "WYZ-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const fouthWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "40" }, { ratio: 40 }],
          token: "WYZ-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const fifthWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "50" }, { ratio: 50 }],
          token: "WYZ-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const sixthWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "15" }, { ratio: 15 }],
          token: "sUSDT-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const sevenWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "20" }, { ratio: 20 }],
          token: "sUSDT-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);

    const eigthWyzTotal = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "25" }, { ratio: 25 }],
          token: "sUSDT-stUSDT",
        },
      },
      {
        $addFields: {
          withdrawAmount: {
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
          totalWithdrawAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const firstdata = firstProtocol[0]?.total;
    const seconddata = secondProtocol[0]?.total;
    const thirddata = thirdProtocol[0]?.total;
    const fourthdata = fourthProtocol[0]?.total;
    const fifthdata = fifthProtocol[0]?.total;
    const sixdata = sixProtocol[0]?.total;
    const sevendata = sevenProtocol[0]?.total;
    const eightdata = eightProtocol[0]?.total;
    return res.json({
      error: false,
      status: 200,
      data: {
        firstdata,
        seconddata,
        thirddata,
        fourthdata,
        fifthdata,
        sixdata,
        sevendata,
        eightdata,
        totalWyzFirst:
          firstWyzTotal.length > 0 ? firstWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzSecond:
          secondWyzTotal.length > 0
            ? secondWyzTotal[0]?.totalWithdrawAmount
            : 0,
        totalWyzThird:
          thirdWyzTotal.length > 0 ? thirdWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzFourth:
          fouthWyzTotal.length > 0 ? fouthWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzFifth:
          fifthWyzTotal.length > 0 ? fifthWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzSixth:
          sixthWyzTotal.length > 0 ? sixthWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzSeven:
          sevenWyzTotal.length > 0 ? sevenWyzTotal[0]?.totalWithdrawAmount : 0,
        totalWyzEight:
          eigthWyzTotal.length > 0 ? eigthWyzTotal[0]?.totalWithdrawAmount : 0,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/protocol-data", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const token = req.query.token;
    const ratio = req.query.ratio;
    const ratioParam = ratio;
    const Ratio = Number(ratioParam);
    const result = await stake2.aggregate([
      {
        $match: {
          token: token,
          $or: [{ ratio: ratio }, { ratio: Ratio }],
        },
      },
      {
        $count: "totalUser",
      },
    ]);
    const totalUser = result[0]?.totalUser;

    const protocol = await stake2.aggregate([
      {
        $match: {
          token: token,
          $or: [{ ratio: ratio }, { ratio: Ratio }],
        },
      },
      {
        $lookup: {
          from: "registration",
          localField: "user",
          foreignField: "user",
          as: "registration_data",
        },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup",
        },
      },
      {
        $unwind: {
          path: "$registration_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$signup",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          token: 1,
          ratio: 1,
          user: 1,
          amount: 1,
          createdAt: 1,
          txHash: 1,
          userId: "$registration_data.userId",
          referrerId: "$registration_data.referrerId",
          name: "$signup.name",
          phone: "$signup.phone",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return res.json({
      status: 200,
      protocol,
      totalUser,
    });
  } catch (error) {
    return res.json("Error occurred while fetching protocol data", error);
  }
});

router.get("/topup-data", verifyToken, async (req, res) => {
  try {
    const searchQuery = req.query.search ? req.query.search.trim() : "";
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "signup.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCountPipeline = [
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await topup2.aggregate(totalCountPipeline);
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const data = await topup2.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup",
        },
      },
      {
        $unwind: {
          path: "$signup",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          user: 1,
          amount: 1,
          txHash: 1,
          plan: 1,
          createdAt: 1,
          name: "$signup.name",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return res.json({
      status: 200,
      data,
      totalCount,
    });
  } catch (error) {
    console.log(error);
  }
});

async function getTotalTeam(user, page, limit, sortField1, sortField2, search) {
  try {
    if (user) {
      let skip = (page - 1) * limit;
      let filterStages = [];
      if (search) {
        filterStages.push({
          $match: {
            $or: [
              { "children.userId": { $regex: search, $options: "i" } },
              { "userDetails.name": { $regex: search, $options: "i" } },
              { "children.user": { $regex: search, $options: "i" } },
            ],
          },
        });
      }
      let total = await registration.aggregate([
        { $match: { user: user } },
        {
          $graphLookup: {
            from: "registration",
            startWith: "$user",
            connectFromField: "user",
            connectToField: "referrer",
            maxDepth: 19,
            depthField: "level",
            as: "children",
          },
        },
        { $unwind: "$children" },
        ...filterStages,
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);

      let total_team = await registration.aggregate([
        { $match: { user: user } },
        {
          $graphLookup: {
            from: "registration",
            startWith: "$user",
            connectFromField: "user",
            connectToField: "referrer",
            maxDepth: 19,
            depthField: "level",
            as: "children",
          },
        },
        { $unwind: "$children" },
        ...filterStages,
        {
          $group: {
            _id: "$children._id",
            userId: { $first: "$children.userId" },
            user: { $first: "$children.user" },
            rank: { $first: "$children.rank" },
            teamBusiness: { $first: "$children.teamBusiness" },
            directCount: { $first: "$children.directCount" },
            teamCount: { $first: "$children.teamCount" },
            wysStaked: { $first: "$children.wysStaked" },
            timestamp: { $first: "$children.timestamp" },
            directplusteambiz: { $first: "$children.directplusteambiz" },
            staketeambusiness: { $first: "$children.staketeambusiness" },
            level: { $first: { $add: ["$children.level", 1] } },
          },
        },
        { $sort: { [sortField1]: 1, [sortField2]: -1, level: 1 } },

        { $skip: Number(skip) },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: "signup",
            localField: "user",
            foreignField: "wallet_add",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            phone: "$userDetails.phone",
            name: "$userDetails.name",
          },
        },
        {
          $lookup: {
            from: "registration",
            localField: "user",
            foreignField: "user",
            as: "user_Details",
          },
        },
        {
          $unwind: {
            path: "$user_Details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stakeregisters",
            localField: "user",
            foreignField: "user",
            as: "stakeregisters_data",
          },
        },
        {
          $unwind: {
            path: "$stakeregisters_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "topup2",
            let: { user_var: "$user" },
            pipeline: [
              { $match: { $expr: { $eq: ["$user", "$$user_var"] } } },
              { $project: { amount: 1 } },
              { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
            ],
            as: "topup2_data",
          },
        },
        {
          $lookup: {
            from: "stake2",
            let: { user_var: "$user" },
            pipeline: [
              { $match: { $expr: { $eq: ["$user", "$$user_var"] } } },
              { $project: { token: 1, ratio: 1, amount: 1 } },
              { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
            ],
            as: "staking2_data",
          },
        },
        {
          $lookup: {
            from: "stake2",
            let: { user_var: "$user" },
            pipeline: [
              { $match: { $expr: { $eq: ["$user", "$$user_var"] } } },
              { $project: { token: 1, ratio: 1, amount: 1, wyz_rate: 1 } },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
            ],
            as: "staking2_latest",
          },
        },
        {
          $unwind: {
            path: "$topup2_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$staking2_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$staking2_latest",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $addFields: {
            referrerId: "$user_Details.referrerId",
            wysStaked: "$user_Details.wysStaked",
            teamBusiness: "$user_Details.staketeambusiness",
            txHash: "$user_Details.txHash",
            teamBusiness20level: "$user_Details.teamBusiness20level",
            stakeamount: "$stakeregisters_data.stake_amount",
            totalStak: "$stakeregisters_data.topup_amount",
            topup: "$topup2_data.totalAmount",
            stakingAmount: "$staking2_data.totalAmount",
            rankdata: "$stakeregisters_data.rank",
            token: "$staking2_latest.token",
            ratio: "$staking2_latest.ratio",
            wyz_rate: "$staking2_latest.wyz_rate",
            amountfirst: "$staking2_latest.amount",
          },
        },
        {
          $project: {
            userDetails: 0,
            user_Details: 0,
            stakeregisters_data: 0,
            topup2_data: 0,
            staking2_data: 0,
            staking2_latest: 0,
          },
        },
      ]);
      if (total_team) {
        return { totalTeam: total_team, totalTeamCount: total[0]?.count };
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("Error in getTeamList", error, user, page, limit);
    return false;
  }
}

async function findAllDescendants(referrer) {
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

router.get("/team-list", async (req, res) => {
  let user = req.query.user;
  let page = req.query.page;
  let limit = req.query.limit;
  const search = req.query.search ? req.query.search.trim() : "";
  let sortField1 = req.query.sortField1;
  let sortField2 = req.query.sortField2;
  try {
    let { totalTeamCount, totalTeam } = await getTotalTeam(
      user,
      page,
      limit,
      sortField1,
      sortField2,
      search
    );
    return res.json({
      status: 200,
      user: user,
      data: totalTeam,
      totalDataCount: totalTeamCount,
      page: page,
      limit: limit,
    });
  } catch (e) {
    console.log("Error in Team List", e);
    return res.json({
      status: 500,
      message: "Some thing went Wrong !",
    });
  }
});

router.post("/approve-withdraw", verifyToken, async (req, res) => {
  const { user, txHash, id } = req.body;
  const timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  try {
    const result = await WithdrawalModel.updateMany(
      { _id: { $in: id } },
      { $set: { isapprove: true, trxnHash: txHash, timestamp: timestamp } }
    );
    if (result) {
      return res.json({
        status: 200,
        message: "Withdraw Approved Successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went wrong !",
      });
    }
  } catch (error) {
    console.log("Error in approve withdraw", error);
  }
});

router.post("/reject-withdraw", verifyToken, async (req, res) => {
  const { user, amount, id } = req.body;

  try {
    const users = await WithdrawalModel.updateOne(
      { _id: id },
      { $set: { isreject: true } }
    );

    if (users) {
      const walletUpdate = await stakeRegister.updateOne(
        { user: user },
        { $inc: { wallet_referral: amount, totalWithdraw: -amount } }
      );
      console.log("reject-withdraw api", walletUpdate);
      return res.json({
        status: 200,
        message: "Withdraw Rejected Successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went wrong !",
      });
    }
  } catch (error) {
    console.log("Error in reject withdraw", error);
    return res.json({
      status: 500,
      message: "Internel Error !",
    });
  }
});

router.post("/failed-withdraw", verifyToken, async (req, res) => {
  const { id } = req.body;

  try {
    const users = await WithdrawalModel.updateMany(
      { _id: { $in: id } },
      { $set: { isfailed: true } }
    );

    if (users) {
      return res.json({
        status: 200,
        // message: "Withdraw Rejected Successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went wrong !",
      });
    }
  } catch (error) {
    console.log("Error in reject withdraw", error);
    return res.json({
      status: 500,
      message: "Internel Error !",
    });
  }
});

router.post("/update-withdraw", verifyToken, async (req, res) => {
  const { txHash, id } = req.body;
  const timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  try {
    const result = await WithdrawalModel.updateMany(
      { _id: { $in: id } },
      { $set: { isapprove: true, trxnHash: txHash, timestamp: timestamp } }
    );
    if (result) {
      return res.json({
        status: 200,
        message: "Withdraw Update Successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went wrong !",
      });
    }
  } catch (error) {
    console.log("Error in approve withdraw", error);
  }
});

router.post("/reject-roi-withdraw", async (req, res) => {
  const { user, amount, id } = req.body;
  try {
    const users = await WithdrawalModel.updateOne(
      { _id: id },
      { $set: { isreject: true } }
    );

    const currentDate = new Date();
    if (users) {
      const walletUpdate = await stakeRegister.updateOne(
        { user: user },
        {
          $inc: {
            wallet_roi: amount,
            totalWithdraw: -amount,
            roi_withdraw: -amount,
          },
          $set: { withdraw_endate: currentDate },
        }
      );

      return res.json({
        status: 200,
        message: "Withdraw Rejected Successfully",
      });
    } else {
      return res.json({
        status: 400,
        message: "Something went wrong !",
      });
    }
  } catch (error) {
    console.log("Error in reject withdraw", error);
    return res.json({
      status: 500,
      message: "Internel Error !",
    });
  }
});

router.get("/approved-withdraw", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "joinedData.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCountPipeline = [
      {
        $match: { wallet_type: "referral", isapprove: true, isreject: false },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await WithdrawalModel.aggregate(
      totalCountPipeline
    );
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $match: { wallet_type: "referral", isapprove: true, isreject: false },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          withdrawAmount: { $first: "$withdrawAmount" },
          wallet_type: { $first: "$wallet_type" },
          recurr_status: { $first: "$recurr_status" },
          createdAt: { $first: "$createdAt" },
          payment_method: { $first: "$payment_method" },
          isapprove: { $first: "$isapprove" },
          isreject: { $first: "$isreject" },
          trxnHash: { $first: "$trxnHash" },
          timestamp: { $first: "$timestamp" },
          Name: { $first: "$joinedData.name" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await WithdrawalModel.aggregate(dataPipeline);

    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.log("Error In Withdraw Roi", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});
router.get("/reject-withdraw", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "joinedData.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCountPipeline = [
      {
        $match: { isapprove: false, isreject: true },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await WithdrawalModel.aggregate(
      totalCountPipeline
    );
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $match: { isapprove: false, isreject: true },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $project: {
          _id: 1,
          user: 1,
          withdrawAmount: 1,
          wallet_type: 1,
          recurr_status: 1,
          createdAt: 1,
          payment_method: 1,
          recurr_status: 1,
          isapprove: 1,
          isreject: 1,
          trxnHash: 1,
          Name: "$joinedData.name",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await WithdrawalModel.aggregate(dataPipeline);

    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.log("Error In Withdraw Roi", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/top-twenty", verifyToken, async (req, res) => {
  try {
    const limitdata = 50;
    const data = await stakeRegister.aggregate([
      {
        $lookup: {
          from: "registration",
          localField: "user",
          foreignField: "user",
          as: "registration_data",
        },
      },
      {
        $lookup: {
          from: "signup",
          localField: "registration_data.user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: {
          path: "$registration_data",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$signup_data",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 0,
          stake_amount: 1,
          user: 1,
          topup_amount: 1,
          phone: "$signup_data.phone",
          name: "$signup_data.name",
          userId: "$registration_data.userId",
          referrerId: "$registration_data.referrerId",
          teamBussines: "$registration_data.staketeambusiness",
          createdAt: 1,
        },
      },
      {
        $sort: { teamBussines: -1 },
      },
      {
        $limit: limitdata,
      },
    ]);

    return res.json({
      status: 200,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

async function getOfferData(user, startDate, endDate) {
  try {
    if (!user) return false;

    const start = moment(startDate).utc().toDate();
    const end = moment(endDate).utc().toDate();

    const [recentStakes, topup, withdraw] = await Promise.all([
      stake2.find({ createdAt: { $gte: start, $lte: end } }).select("user"),
      topup2.find({ createdAt: { $gte: start, $lte: end } }).select("user"),
      WithdrawalModel.find({ createdAt: { $gte: start, $lte: end } }).select(
        "user"
      ),
    ]);

    const recentStake2Users = recentStakes.map((stake) => stake.user);
    const topupdata = topup.map((stake) => stake.user);
    const totalWithdraw = withdraw.map((stake) => stake.user);

    const [total_team, topupTeam, total_withdraw] = await Promise.all([
      registration.aggregate([
        { $match: { user: user } },
        {
          $graphLookup: {
            from: "registration",
            startWith: "$user",
            connectFromField: "user",
            connectToField: "referrer",
            maxDepth: 40,
            depthField: "level",
            as: "children",
          },
        },
        { $unwind: "$children" },
        { $match: { "children.user": { $in: recentStake2Users } } },
        {
          $lookup: {
            from: "stake2",
            localField: "children.user",
            foreignField: "user",
            as: "stake2_data",
          },
        },
        { $unwind: "$stake2_data" },
        { $match: { "stake2_data.createdAt": { $gte: start, $lte: end } } },
        {
          $group: {
            _id: 0,
            stakes: {
              $push: {
                amount: "$stake2_data.amount",
                ratio: "$stake2_data.ratio",
                token: "$stake2_data.token",
                wyz_rate: "$stake2_data.wyz_rate",
              },
            },
          },
        },
      ]),
      registration.aggregate([
        { $match: { user: user } },
        {
          $graphLookup: {
            from: "registration",
            startWith: "$user",
            connectFromField: "user",
            connectToField: "referrer",
            maxDepth: 40,
            depthField: "level",
            as: "children",
          },
        },
        { $unwind: "$children" },
        { $match: { "children.user": { $in: topupdata } } },
        {
          $lookup: {
            from: "topup2",
            localField: "children.user",
            foreignField: "user",
            as: "topup_data",
          },
        },
        { $unwind: "$topup_data" },
        { $match: { "topup_data.createdAt": { $gte: start, $lte: end } } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$topup_data.amount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: 1,
          },
        },
      ]),
      registration.aggregate([
        { $match: { user: user } },
        {
          $graphLookup: {
            from: "registration",
            startWith: "$user",
            connectFromField: "user",
            connectToField: "referrer",
            maxDepth: 40,
            depthField: "level",
            as: "children",
          },
        },
        { $unwind: "$children" },
        {
          $lookup: {
            from: "withdrawals",
            localField: "children.user",
            foreignField: "user",
            as: "withdrawals_data",
          },
        },
        {
          $unwind: {
            path: "$withdrawals_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { "children.user": { $in: totalWithdraw } } },
        {
          $match: { "withdrawals_data.timestamp": { $gte: start, $lte: end } },
        },
        { $match: { "withdrawals_data.isapprove": true } },
        {
          $group: {
            _id: 0,
            totalAmount: { $sum: "$withdrawals_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: { $ifNull: ["$totalAmount", 0] },
          },
        },
      ]),
    ]);

    const teamTopupAmount = topupTeam[0]?.totalAmount || 0;
    const totalWithdrawdata = total_withdraw[0]?.totalAmount || 0;

    return {
      totalTeam: total_team,
      topupTeam,
      teamTopupAmount,
      totalWithdrawdata,
    };
  } catch (error) {
    console.error("Error in getOfferData", error);
    return false;
  }
}

function processStakeData(data) {
  const allStakes = data.map((item) => item.stakes).flat();
  const filteredStakes = allStakes.filter((stake) => {
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

  const totalAmount = filteredStakes.reduce(
    (total, stake) => total + stake.amount,
    0
  );

  const ratioMultiplier = {
    10: 0.1,
    20: 0.2,
    30: 0.3,
    40: 0.4,
    50: 0.5,
  };

  const totalWYZByProtocol = filteredStakes.reduce((acc, stake) => {
    if (stake.token == "WYZ-stUSDT") {
      const ratio = ratioMultiplier[stake.ratio];
      if (!ratio) return acc;

      let factor = ratio;

      const partialValue = (stake.amount * factor) / stake?.wyz_rate;
      if (!acc[stake.ratio]) {
        acc[stake.ratio] = 0;
      }

      acc[stake.ratio] += partialValue;
    }
    return acc;
  }, {});

  const toalwyz = filteredStakes.reduce((acc, stake) => {
    if (stake.ratio == "10" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.1) / stake?.wyz_rate;
    if (stake.ratio == "20" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.2) / stake?.wyz_rate;
    if (stake.ratio == "30" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.3) / stake?.wyz_rate;
    if (stake.ratio == "40" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.4) / stake?.wyz_rate;
    if (stake.ratio == "50" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.5) / stake?.wyz_rate;
    if (stake.ratio == "15" && stake.token == "WYZ-stUSDT")
      return acc + (stake.amount * 0.15) / stake?.wyz_rate;
    if (stake.ratio == "20" && stake.token == "sUSDT-stUSDT")
      return acc + (stake.amount * 0.2) / stake?.wyz_rate;
    if (stake.ratio == "25" && stake.token == "sUSDT-stUSDT")
      return acc + (stake.amount * 0.25) / stake?.wyz_rate;
    return acc;
  }, 0);

  const toalstusdt = filteredStakes.reduce((acc, stake) => {
    if (stake.ratio == "10" && stake.token == "WYZ-stUSDT")
      return acc + stake.amount * 0.9;
    if (stake.ratio == "20" && stake.token == "WYZ-stUSDT")
      return acc + stake.amount * 0.8;
    if (stake.ratio == "20" && stake.token == "WYZ-stUSDT")
      return acc + stake.amount * 0.7;
    if (stake.ratio == "40" && stake.token == "WYZ-stUSDT")
      return acc + stake.amount * 0.6;
    if (stake.ratio == "50" && stake.token == "WYZ-stUSDT")
      return acc + stake.amount * 0.5;
    if (stake.ratio == "15" && stake.token == "sUSDT-stUSDT")
      return acc + stake.amount * 0.85;
    if (stake.ratio == "20" && stake.token == "sUSDT-stUSDT")
      return acc + stake.amount * 0.8;
    if (stake.ratio == "25" && stake.token == "sUSDT-stUSDT")
      return acc + stake.amount * 0.75;
    return acc;
  }, 0);

  const ratioMultiplierstusdt = {
    10: 0.9,
    20: 0.8,
    30: 0.7,
    40: 0.6,
    50: 0.5,
  };
  const totalstudtProtocol = filteredStakes.reduce((acc, stake) => {
    if (stake.token == "WYZ-stUSDT") {
      const ratio = ratioMultiplierstusdt[stake.ratio];
      if (!ratio) return acc;

      let factor = ratio;

      const partialValue = stake.amount * factor;

      if (!acc[stake.ratio]) {
        acc[stake.ratio] = 0;
      }

      acc[stake.ratio] += partialValue;
    }
    return acc;
  }, {});

  const ratiusdtWYZ = {
    15: 0.15,
    20: 0.2,
    25: 0.25,
  };

  const totalWYSusdt = filteredStakes.reduce((acc, stake) => {
    if (
      stake.token !== "sUSDT-stUSDT" ||
      !(stake.ratio == "15" || stake.ratio == "20" || stake.ratio == "25")
    ) {
      return acc;
    }

    const ratio = ratiusdtWYZ[stake.ratio];
    if (!ratio) return acc;

    const partialValue = (stake.amount * ratio) / stake?.wyz_rate;

    if (!acc[stake.ratio]) {
      acc[stake.ratio] = 0;
    }

    acc[stake.ratio] += partialValue;

    return acc;
  }, {});

  const ratiusdt = {
    15: 0.85,
    20: 0.8,
    25: 0.75,
  };

  const totalStudtUSDT = filteredStakes.reduce((acc, stake) => {
    if (
      stake.token !== "sUSDT-stUSDT" ||
      !(stake.ratio == "15" || stake.ratio == "20" || stake.ratio == "25")
    ) {
      return acc;
    }

    const ratio = ratiusdt[stake.ratio];
    if (!ratio) return acc;

    const partialValue = stake.amount * ratio;

    if (!acc[stake.ratio]) {
      acc[stake.ratio] = 0;
    }

    acc[stake.ratio] += partialValue;

    return acc;
  }, {});
  const totalByProtocol = filteredStakes.reduce((acc, stake) => {
    if (!acc[stake.token]) {
      acc[stake.token] = {};
    }
    if (!acc[stake.token][stake.ratio]) {
      acc[stake.token][stake.ratio] = 0;
    }
    acc[stake.token][stake.ratio] += stake.amount;
    return acc;
  }, {});

  return {
    totalstudtProtocol,
    totalWYZByProtocol,
    toalwyz,
    totalWYSusdt,
    totalStudtUSDT,
    totalAmount,
    toalstusdt,
    totalByProtocol,
  };
}

router.post("/team-data", async (req, res) => {
  const { user, startDate, endDate } = req.body;
  try {
    const users = await registration.findOne(
      { user: user },
      { userId: 1, _id: 0 }
    );

    let { totalTeam, teamTopupAmount, totalWithdrawdata } = await getOfferData(
      user,
      startDate,
      endDate
    );

    let {
      toalstusdt,
      toalwyz,
      totalAmount,
      totalstudtProtocol,
      totalWYZByProtocol,
      totalWYSusdt,
      totalStudtUSDT,
      totalByProtocol,
    } = processStakeData(totalTeam);

    const start = moment(startDate).utc().toDate();
    const end = moment(endDate).utc().toDate();

    const totalWithdraw = await WithdrawalModel.aggregate([
      {
        $match: {
          user: user,
          isapprove: true,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$withdrawAmount" },
        },
      },
    ]);
    const totalWithdrawAmount =
      (totalWithdraw.length > 0 ? totalWithdraw[0].totalAmount : 0) * 0.95;
    const totaldeposite = await stake2.aggregate([
      {
        $match: {
          user: user,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totaldepositeAmount =
      totaldeposite.length > 0 ? totaldeposite[0].totalAmount : 0;

    const totaltopup = await topup2.aggregate([
      {
        $match: {
          user: user,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalTopupAmount =
      totaltopup.length > 0 ? totaltopup[0].totalAmount : 0;

    return res.json({
      status: 200,
      toalstusdt,
      toalwyz,
      totalAmount,
      totalstudtProtocol,
      totalWYZByProtocol,
      totalWithdrawAmount,
      totaldepositeAmount,
      totalTopupAmount,
      teamTopupAmount,
      totalStudtUSDT,
      totalWYSusdt,
      totalByProtocol,
      totalWithdrawdata,
      data: users?.userId,
    });
  } catch (e) {
    console.log("Error in Team List", e);
    return res.json({
      status: 500,
      message: "Some thing went Wrong !",
    });
  }
});

router.get("/fifty-fifty", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "joinedData.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCount = await stake2.aggregate([
      { $match: { regBy: "Admin" } },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },

      { $match: filter },
      { $count: "totalCount" },
    ]);

    const data = await stake2.aggregate([
      { $match: { regBy: "Admin" } },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "stakeregisters",
          localField: "user",
          foreignField: "user",
          as: "stakeregisters_data",
        },
      },
      {
        $unwind: {
          path: "$stakeregisters_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "registration",
          localField: "user",
          foreignField: "user",
          as: "registration_data",
        },
      },
      {
        $unwind: {
          path: "$registration_data",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: {
          $or: [
            { "joinedData.name": { $regex: searchQuery, $options: "i" } },
            { user: { $regex: searchQuery, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          user: 1,
          amount: 1,
          token: 1,
          ratio: 1,
          txHash: 1,
          createdAt: 1,
          Name: "$joinedData.name",
          totalWithdraw: "$stakeregisters_data.totalWithdraw",
          teamBusiness: "$registration_data.staketeambusiness",
          directplusteambiz: "$registration_data.directplusteambiz",
        },
      },
      { $sort: { timestamp: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.json({
      error: true,
      status: 500,
      message: error.message,
    });
  }
});

router.get("/withdraw-data-protocol", async (req, res) => {
  try {
    const data = await stake2.aggregate([
      {
        $match: {
          $or: [{ ratio: "10", ratio: 10 }],
        },
      },
      {
        $project: {
          _id: 0,
          user: 1,
        },
      },
      {
        $lookup: "",
      },
    ]);
    return res.json({
      status: 200,
      data,
    });
  } catch (error) {
    console.log(error, "Error In withdraw-data-protocol ");
  }
});

router.post("/pool-achivers", async (req, res) => {
  try {
    const rank = req.query.rank;
    const totaluser = await stakeReward.find({ rank: rank }).countDocuments();
    const data = await stakeReward.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: "$signup_data",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$signup_data.userId",
          latestData: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$latestData",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$signup_data.name",
          referrerId: "$signup_data.referrerId",
          userId: "$signup_data.userId",
          user: 1,
          amount: 1,
          directteam: 1,
          directbusiness: 1,
          teamsize: 1,
          targetbusiness: 1,
          seventy: 1,
          thirty: 1,
          rank: 1,
          rankno: 1,
          send_status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          rank: rank,
        },
      },
    ]);

    return res.json({
      status: 200,
      data,
      totaluser,
    });
  } catch (error) {
    console.log(error, "Error In pool-achivers");
  }
});

router.get("/withdraw-info", verifyToken, async (req, res) => {
  {
    try {
      const firstdata = await stake2.aggregate([
        {
          $match: {
            token: "WYZ-stUSDT",
            $or: [{ ratio: "10" }, { ratio: 10 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const secondData = await stake2.aggregate([
        {
          $match: {
            token: "WYZ-stUSDT",
            $or: [{ ratio: "20" }, { ratio: 20 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const thirdData = await stake2.aggregate([
        {
          $match: {
            token: "WYZ-stUSDT",
            $or: [{ ratio: "30" }, { ratio: 30 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const fouthData = await stake2.aggregate([
        {
          $match: {
            token: "WYZ-stUSDT",
            $or: [{ ratio: "40" }, { ratio: 40 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const fifthData = await stake2.aggregate([
        {
          $match: {
            token: "WYZ-stUSDT",
            $or: [{ ratio: "50" }, { ratio: 50 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const sixData = await stake2.aggregate([
        {
          $match: {
            token: "sUSDT-stUSDT",
            $or: [{ ratio: "15" }, { ratio: 15 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const sevenData = await stake2.aggregate([
        {
          $match: {
            token: "sUSDT-stUSDT",
            $or: [{ ratio: "20" }, { ratio: 20 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const eightData = await stake2.aggregate([
        {
          $match: {
            token: "sUSDT-stUSDT",
            $or: [{ ratio: "25" }, { ratio: 25 }],
          },
        },

        {
          $lookup: {
            from: "withdrawals",
            localField: "user",
            foreignField: "user",
            as: "lookupResult_data",
          },
        },
        {
          $unwind: "$lookupResult_data",
        },
        {
          $match: {
            "lookupResult_data.isapprove": true,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountCount: { $sum: "$lookupResult_data.withdrawAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmountCount: 1,
          },
        },
      ]);
      const firstProtocol = firstdata[0]?.totalAmountCount;
      const secondProtocol = secondData[0]?.totalAmountCount;
      const thirdProtocol = thirdData[0]?.totalAmountCount;
      const fourthProtocol = fouthData[0]?.totalAmountCount;
      const fifthProtocol = fifthData[0]?.totalAmountCount;
      const sithProtocol = sixData[0]?.totalAmountCount;
      const sevenProtocol = sevenData[0]?.totalAmountCount;
      const eightProtocol = eightData[0]?.totalAmountCount;
      return res.json({
        status: 200,
        firstProtocol,
        secondProtocol,
        thirdProtocol,
        fourthProtocol,
        fifthProtocol,
        sithProtocol,
        sevenProtocol,
        eightProtocol,
      });
    } catch (error) {
      console.log(error, "Error In withdraw-info");
    }
  }
});

router.post("/pool-data", verifyToken, async (req, res) => {
  try {
    const pool = parseInt(req.query.pool) || 50000;
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const skip = (page - 1) * limit;
    const totaluser = await stakePool.find({ pool: pool }).countDocuments();

    const data = await stakePool.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$user",
          latestPool: { $first: "$pool" },
          user: { $first: "$user" },
          seventy: { $first: "$seventy" },
          thirty: { $first: "$thirty" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $match: {
          latestPool: pool,
        },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: "$signup_data",
      },
      {
        $project: {
          _id: 0,
          user: 1,
          name: "$signup_data.name",
          phone: "$signup_data.phone",
          referrerId: "$signup_data.referrerId",
          userId: "$signup_data.userId",
          seventy: 1,
          thirty: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return res.json({
      status: 200,
      data,
      totaluser,
    });
  } catch (error) {
    console.log(error, "Error In Pool Data");
  }
});

router.get("/roi-approve", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "joinedData.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCountPipeline = [
      { $match: { wallet_type: "roi", isapprove: true, isreject: false } },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await WithdrawalModel.aggregate(
      totalCountPipeline
    );
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      { $match: { wallet_type: "roi", isapprove: true, isreject: false } },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          withdrawAmount: { $first: "$withdrawAmount" },
          wallet_type: { $first: "$wallet_type" },
          recurr_status: { $first: "$recurr_status" },
          createdAt: { $first: "$createdAt" },
          payment_method: { $first: "$payment_method" },
          isapprove: { $first: "$isapprove" },
          isreject: { $first: "$isreject" },
          trxnHash: { $first: "$trxnHash" },
          timestamp: { $first: "$timestamp" },
          Name: { $first: "$joinedData.name" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await WithdrawalModel.aggregate(dataPipeline);

    return res.json({
      status: 200,
      error: false,
      data,
      totalCount,
    });
  } catch (error) {
    console.log("Error In Withdraw Roi", error);
    return res.status(500).json({
      status: 500,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/complete-3x", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const searchQuery = req.query.search ? req.query.search.trim() : "";
    const applyEqualFilter = req.query.status == "true";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "signup_data.name": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCountPipeline = [
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      { $unwind: { path: "$signup_data", preserveNullAndEmptyArrays: true } },
      { $match: filter },
    ];

    if (applyEqualFilter) {
      totalCountPipeline.push({
        $match: {
          $and: [
            { $expr: { $eq: ["$totalIncome", "$return"] } },
            { totalIncome: { $gt: 0 } },
          ],
        },
      });
    } else {
      totalCountPipeline.push({
        $match: {
          $expr: { $ne: ["$totalIncome", "$return"] },
        },
      });
    }

    totalCountPipeline.push({ $count: "totalCount" });

    const totalCountResult = await stakeRegister.aggregate(totalCountPipeline);
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $lookup: {
          from: "registration",
          localField: "user",
          foreignField: "user",
          as: "regestation_data",
        },
      },
      { $unwind: { path: "$signup_data", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$regestation_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: filter },
    ];

    if (applyEqualFilter) {
      dataPipeline.push({
        $match: {
          $and: [
            { $expr: { $eq: ["$totalIncome", "$return"] } },
            { totalIncome: { $gt: 0 } },
          ],
        },
      });
    } else {
      dataPipeline.push({
        $match: {
          $expr: { $ne: ["$totalIncome", "$return"] },
        },
      });
    }

    dataPipeline.push(
      {
        $project: {
          _id: 0,
          name: "$signup_data.name",
          user: 1,
          return: 1,
          topup_amount: 1,
          totalIncome: 1,
          totalWithdraw: 1,
          rank: 1,
          teamBusiness: "$regestation_data.staketeambusiness",
          rankbonus: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    const data = await stakeRegister.aggregate(dataPipeline);

    return res.json({
      status: 200,
      data,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/ruccring-income", verifyToken, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 100;

    let searchQuery = req.query.search ? req.query.search.trim() : "";

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { user: { $regex: searchQuery, $options: "i" } },
          { "signup_data.name": { $regex: searchQuery, $options: "i" } },
          { "signup_data.userId": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }
    const totalCountPipeline = [
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_record",
        },
      },
      { $unwind: { path: "$signup_record", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $count: "totalCount" },
    ];

    const totalCountResult = await recurrtransfer.aggregate(totalCountPipeline);
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    const dataPipeline = [
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      { $unwind: { path: "$signup_data", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $project: {
          _id: 0,
          name: "$signup_data.name",
          userId: "$signup_data.userId",
          user: 1,
          amount: 1,
          totalIncome: 1,
          recurrBalance: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const data = await recurrtransfer.aggregate(dataPipeline);

    const csvData = await recurrtransfer.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      { $unwind: { path: "$signup_data", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      {
        $project: {
          _id: 0,
          name: "$signup_data.name",
          userId: "$signup_data.userId",
          user: 1,
          amount: 1,
          totalIncome: 1,
          recurrBalance: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    const modifiedData = csvData.map((item) => {
      const { name, userId, user, amount, createdAt } = item;
      const Timestamp = moment(createdAt).format("DD-MM-YYYY HH:mm");
      return {
        name,
        userId,
        user,
        amount: amount.toFixed(2),
        createdAt: Timestamp,
      };
    });

    return res.json({
      status: 200,
      totalCount,
      data,
      modifiedData,
    });
  } catch (error) {
    console.log(error, "Ruccring Income");
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

router.get("/approved-withdraw-csv", verifyToken, async (req, res) => {
  try {
    const data = await WithdrawalModel.aggregate([
      {
        $match: { wallet_type: "referral", isapprove: true, isreject: false },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          withdrawAmount: { $first: "$withdrawAmount" },
          wallet_type: { $first: "$wallet_type" },
          recurr_status: { $first: "$recurr_status" },
          createdAt: { $first: "$createdAt" },
          payment_method: { $first: "$payment_method" },
          isapprove: { $first: "$isapprove" },
          isreject: { $first: "$isreject" },
          trxnHash: { $first: "$trxnHash" },
          timestamp: { $first: "$timestamp" },
          Name: { $first: "$joinedData.name" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const ModifiedData = data.map((item) => {
      const {
        Name,
        user,
        withdrawAmount,
        wallet_type,
        createdAt,
        payment_method,
        trxnHash,
        timestamp,
      } = item;
      const RequestTime = moment(createdAt)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY HH:mm");
      const ApproveTime = timestamp
        ? moment(timestamp).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm")
        : "N/A";
      return {
        name: Name,
        user: user,
        amount: (withdrawAmount * 0.95).toFixed(2),
        fess: (withdrawAmount * 0.05).toFixed(2),
        total: withdrawAmount.toFixed(2),
        type: wallet_type,
        method: payment_method,
        trxnHash: trxnHash,
        Request: RequestTime,
        ApproveTime: ApproveTime,
      };
    });
    return res.json({
      status: 200,
      ModifiedData,
      data,
    });
  } catch (err) {
    console.log(err, "approved-withdraw-csv");
  }
});
router.get("/approved-roi-csv", verifyToken, async (req, res) => {
  try {
    const data = await WithdrawalModel.aggregate([
      {
        $match: { wallet_type: "roi", isapprove: true, isreject: false },
      },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          withdrawAmount: { $first: "$withdrawAmount" },
          wallet_type: { $first: "$wallet_type" },
          recurr_status: { $first: "$recurr_status" },
          createdAt: { $first: "$createdAt" },
          payment_method: { $first: "$payment_method" },
          isapprove: { $first: "$isapprove" },
          isreject: { $first: "$isreject" },
          trxnHash: { $first: "$trxnHash" },
          timestamp: { $first: "$timestamp" },
          Name: { $first: "$joinedData.name" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    const ModifiedData = data.map((item) => {
      const {
        Name,
        user,
        withdrawAmount,
        wallet_type,
        createdAt,
        payment_method,
        trxnHash,
        timestamp,
      } = item;
      const RequestTime = moment(createdAt)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY HH:mm");
      const ApproveTime = timestamp
        ? moment(timestamp).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm")
        : "N/A";
      return {
        name: Name,
        user: user,
        amount: (withdrawAmount * 0.95).toFixed(2),
        fess: (withdrawAmount * 0.05).toFixed(2),
        total: withdrawAmount.toFixed(2),
        type: wallet_type,
        method: payment_method,
        trxnHash: trxnHash,
        Request: RequestTime,
        ApproveTime: ApproveTime,
      };
    });
    return res.json({
      status: 200,
      ModifiedData,
      data,
    });
  } catch (err) {
    console.log(err, "approved-roi-csv");
  }
});

router.get("/deposite-csv", verifyToken, async (req, res) => {
  try {
    const data = await stake2.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "joinedData",
        },
      },
      { $unwind: { path: "$joinedData", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          user: 1,
          timestamp: 1,
          amount: 1,
          token: 1,
          ratio: 1,
          txHash: 1,
          createdAt: 1,
          wyz_rate: 1,
          Name: "$joinedData.name",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    const ModifiedData = data.map((item) => {
      const { Name, user, amount, ratio, token, txHash, createdAt, wyz_rate } =
        item;
      const Timestamp = moment(createdAt)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY HH:mm");
      const wyz =
        ratio == "10"
          ? ((amount * 0.1) / wyz_rate).toFixed(2)
          : ratio == "20"
          ? ((amount * 0.2) / wyz_rate).toFixed(2)
          : ratio == "30"
          ? ((amount * 0.3) / wyz_rate).toFixed(2)
          : ratio == "40"
          ? ((amount * 0.4) / wyz_rate).toFixed(2)
          : ratio == "50"
          ? ((amount * 0.5) / wyz_rate).toFixed(2)
          : ratio == "15" && token == "sUSDT-stUSDT"
          ? ((amount * 0.15) / wyz_rate).toFixed(2)
          : ratio == "20" && token == "sUSDT-stUSDT"
          ? ((amount * 0.2) / wyz_rate).toFixed(2)
          : ratio == "25" && token == "sUSDT-stUSDT"
          ? ((amount * 0.25) / wyz_rate).toFixed(2)
          : "0.00";

      const stUsdt =
        ratio == "10"
          ? (amount * 0.9).toFixed(2)
          : ratio == "20"
          ? (amount * 0.8).toFixed(2)
          : ratio == "30"
          ? (amount * 0.7).toFixed(2)
          : ratio == "40"
          ? (amount * 0.6).toFixed(2)
          : ratio == "50"
          ? (amount * 0.5).toFixed(2)
          : ratio == "15" && token == "sUSDT-stUSDT"
          ? (amount * 0.85).toFixed(2)
          : ratio == "20" && token == "sUSDT-stUSDT"
          ? (amount * 0.8).toFixed(2)
          : ratio == "25" && token == "sUSDT-stUSDT"
          ? (amount * 0.75).toFixed(2)
          : "0.00";
      return {
        Name: Name,
        user: user,
        wyz: wyz,
        stUsdt: stUsdt,
        total: amount,
        token: token,
        ratio: ratio,
        txHash: txHash,
        createdAt: Timestamp,
      };
    });
    const columns = [
      { label: "Name", key: "Name" },
      { label: "User", key: "user" },
      { label: "WYZ", key: "wyz" },
      { label: "Stusdt", key: "stUsdt" },
      { label: "Total", key: "total" },
      { label: "Token", key: "token" },
      { label: "Ratio", key: "ratio" },
      { label: "Transaction ID", key: "txHash" },
      { label: "Date&Time", key: "createdAt" },
    ];
    return res.json({
      status: 200,
      ModifiedData,
    });
  } catch (err) {
    console.log(err, "deposite-csv");
  }
});

router.get("/pool-withdraw", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = (req.query.search || "").trim();

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { user: { $regex: search, $options: "i" } },
          { "signUp_data.name": { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalUser = await poolincometransfer.find(filter).countDocuments();
    const data = await poolincometransfer.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signUp_data",
        },
      },
      {
        $unwind: "$signUp_data",
      },
      {
        $match: filter,
      },
      {
        $project: {
          _id: 0,
          user: 1,
          amount: 1,
          return: 1,
          totalIncome: 1,
          poolBalance: 1,
          createdAt: 1,
          name: "$signUp_data.name",
          userId: "$signUp_data.userId",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (page - 1) * 100,
      },
      {
        $limit: 100,
      },
    ]);

    return res.json({
      status: 200,
      data,
      totalUser,
    });
  } catch (err) {
    console.log(err, "pool-withdraw");
  }
});

router.post("/update-withdraw-income", verifyToken, async (req, res) => {
  try {
    const { user, amount, wallet_type, action } = req.body;

    if (!action || (action !== "+" && action !== "-")) {
      return res.json({
        status: 400,
        message: "Invalid Action. Use '+' or '-' only.",
      });
    }
    const data = await stakeRegister.find({ user: user });

    if (data.length == 0) {
      return res.json({
        status: 400,
        message: "User Not Found",
      });
    }
    const changeValue = action == "+" ? amount : -amount;

    const updateResult = await stakeRegister.updateOne(
      { user: user },
      { $inc: { [wallet_type]: changeValue } }
    );
    if (updateResult) {
      await updateWithdraw.create({
        user: user,
        amount: amount,
        wallet_type: wallet_type,
        action: action,
      });
      return res.json({
        status: 200,
        message: "Balance updated successfully",
      });
    } else {
      return res.json({
        status: 500,
        message: "Failed to update balance",
      });
    }
  } catch (error) {
    console.log(error, "update-withdraw-income");
  }
});

router.get("/update-income-data", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const totalUser = await updateWithdraw.find({}).countDocuments();
    const data = await updateWithdraw.aggregate([
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "signup_data",
        },
      },
      {
        $unwind: "$signup_data",
      },
      {
        $project: {
          _id: 0,
          user: 1,
          amount: 1,
          wallet_type: 1,
          createdAt: 1,
          action: 1,
          name: "$signup_data.name",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    return res.json({
      status: 200,
      data: data,
      totalUser: totalUser,
    });
  } catch (error) {
    console.log(error, "Error In UpdateIncome");
  }
});

router.get("/complet3x-team", async (req, res) => {
  try {
    const user = req.query.user;
    const page = req.query.page || 1;

    let total = await registration.aggregate([
      { $match: { user: user } },
      {
        $graphLookup: {
          from: "registration",
          startWith: "$user",
          connectFromField: "user",
          connectToField: "referrer",
          maxDepth: 19,
          depthField: "level",
          as: "children",
        },
      },
      { $unwind: "$children" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    let total_team = await registration.aggregate([
      { $match: { user: user } },
      {
        $graphLookup: {
          from: "registration",
          startWith: "$user",
          connectFromField: "user",
          connectToField: "referrer",
          maxDepth: 19,
          depthField: "level",
          as: "children",
        },
      },
      { $unwind: "$children" },
      {
        $group: {
          _id: "$children._id",
          userId: { $first: "$children.userId" },
          user: { $first: "$children.user" },
          createdAt: { $first: "$children.createdAt" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: Number(page - 1) * limit },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "signup",
          localField: "user",
          foreignField: "wallet_add",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          phone: "$userDetails.phone",
          name: "$userDetails.name",
        },
      },
      {
        $lookup: {
          from: "stakeregisters",
          localField: "user",
          foreignField: "user",
          as: "stakeregisters_data",
        },
      },
      {
        $unwind: {
          path: "$stakeregisters_data",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          referrerId: "$user_Details.referrerId",
          stake_amount: "$stakeregisters_data.stake_amount",
          topup_amount: "$stakeregisters_data.topup_amount",
          return: "$stakeregisters_data.return",
          totalIncome: "$stakeregisters_data.totalIncome",
          totalWithdraw: "$stakeregisters_data.totalWithdraw",
        },
      },
      {
        $project: {
          userDetails: 0,
          user_Details: 0,
          stakeregisters_data: 0,
          topup2_data: 0,
          staking2_data: 0,
          staking2_latest: 0,
        },
      },
    ]);

    return res.json({
      status: 200,
      data: total_team,
      totalUser: total.length > 0 ? total[0]?.count : 0,
    });
  } catch (err) {
    console.log(err, "Error In complet3x-team");
  }
});
module.exports = router;
