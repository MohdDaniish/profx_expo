const express = require("express");
const routerr = express.Router();
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const { getAllUsers } = require("./test");
const withdraw = require("./model/withdraw");
const signup = require("./model/signup");

const withdraws = require("./model/withdraw");
const crypto = require("crypto");
const Web3 = require("web3");
const abi = require("./contract_abi.json");
const User = require("./model/User");
const admin_login = require("./model/admin_login");
// const LevelIncome = require("./model/levelincome");
// const DividentIncome = require("./model/dividentincome");
// const SponsorIncome = require("./model/sponsorincome");
// const ClubIncome = require("./model/clubincome");
// const PackageBuy = require("./model/PackageBuy");
// const AsyncLock = require("async-lock");
const WithdrawalModel = require("./model/withdraw");
const transfer = require("./model/transfer");
const stake2 = require("./model/stake");
const stakedirect = require("./model/stakedirects");
const registration = require("./model/registration");
// const Sell = require("./model/sell");
// const lock = new AsyncLock();

require("dotenv").config();

// const Stake2 = mongoose.model("Stake2", {});

routerr.get("/data", getAllUsers);

routerr.get("/check", async (req, res) => {
  try {
    const result = await getAllUsers();
    return res.json({
      data: result,
    });
  } catch (e) {
    console.log(e, "errorin check api");
    return res.json({
      data: [],
    });
  }
});

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

const ABI = abi;
const contract = new web3.eth.Contract(ABI, process.env.MAIN_CONTRACT);

routerr.get("/userDetailsbyWallet", async (req, res) => {
  const { userId } = req.query;
  try {
    // Find user details from registration schema by userId
    const userDetails = await registration.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "registrations",
          localField: "referral",
          foreignField: "user",
          as: "referrerDetails",
        },
      },

      {
        $project: {
          user: 1,
          referral: 1,
          package: 1,
          userId: 1,
          referrerId: 1,
          timestamp: 1,
          uId: 1,
          referrer: 1,
          createdAt: 1,
          referrerUserId: { $arrayElemAt: ["$referrerDetails.user", 0] },
        },
      },
    ]);
    console.log(userDetails);
    const directMembers = await registration.countDocuments({
      referrer: userId,
    });

    // downteam
    const downline = [];
    const stack = [userId];

    while (stack.length) {
      const currentUserId = stack.pop();
      const directMembers = await registration.find({
        referrer: currentUserId,
      });

      for (const member of directMembers) {
        downline.push(member);
        stack.push(member.user);
      }
    }

    const teamcount = downline.length;
    // downteam

    if (userDetails.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    // const walletAddress = userDetails[0].user;

    // const totalIncome = userDetails[0].totalIncome;

    // const stake_amount = userDetails[0].stake_amount;

    // // console.log("totalIncome ",totalIncome)
    // // console.log("stake_amount ",stake_amount)
    // let isallow = true;
    // if(stake_amount > 0){
    // const percentreceived = (totalIncome/stake_amount)*100;
    // //console.log("percentreceived ",percentreceived)
    // if(percentreceived < 50){
    //   isallow = false;
    // }
    // }

    // // today income
    // //const todayinc = await todayincome(userId)
    // // today income

    // // direct income
    const sponsorincome = await SponsorIncome.aggregate([
      {
        $match: { receiver: userId } // Match the specific receiver
      },
      {
        $group: {
          _id: "$receiver",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

   const directinco = sponsorincome.length > 0 ? sponsorincome[0].totalIncome : 0;
    // // direct income

    // level income
    const levincome = await LevelIncome.aggregate([
      {
        $match: { receiver: userId } // Match the specific receiver
      },
      {
        $group: {
          _id: "$receiver",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

    const leveincome = levincome.length > 0 ? levincome[0].totalIncome : 0;
    // level income

    // divident income
    const divres = await DividentIncome.aggregate([
      {
        $match: { user: userId } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

    const dividentinco = divres.length > 0 ? divres[0].totalIncome : 0;
    // divident income

    // club income
    const clubres = await ClubIncome.aggregate([
      {
        $match: { user: userId } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

     // total deposit
     const buypolres = await PackageBuy.aggregate([
      {
        $match: { user: userId } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$polamount" } // Sum the income field
        }
      }
    ]);

    const totaldeposit = buypolres.length > 0 ? buypolres[0].totalIncome : 0;
    //club income

    res.status(200).send({
      userDetails: userDetails[0],
      directteam: directMembers,
      allteam: teamcount,
      sponsorinc : directinco,
      levelinc : leveincome,
      dividentinc : dividentinco,
      clubinc : clubincome,
      totdeposit : (totaldeposit * 73) / 100
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

routerr.get("/getDirectTeam", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    // Get direct referrals
    const directReferrals = await User.find({ referral: userId })
      .select("-password -_id")
      .sort({ createdAt: -1 });

    // Use $graphLookup to get entire downline
    const result = await User.aggregate([
      { $match: { userId } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$userId",
          connectFromField: "userId",
          connectToField: "referral",
          as: "downline",
          maxDepth: 16,
          depthField: "level",
        },
      },
      {
        $project: {
          _id: 0,
          downline: {
            userId: 1,
            name: 1,
            email: 1,
            mobile: 1,
            createdAt: 1,
            referral: 1,
            level: 1,
            address: 1,
          },
        },
      },
    ]);

    const downline = result[0]?.downline || [];

    // Calculate level count
    const levelCount = {};
    downline.forEach((u) => {
      const level = u.level + 1; // level starts from 0 in graphLookup
      levelCount[level] = (levelCount[level] || 0) + 1;
      u.level = level;
    });

    const maxLevel = Math.max(...Object.keys(levelCount).map(Number), 0);

    return res.status(200).json({
      success: true,
      direct: directReferrals,
      totalDirect: directReferrals.length,
      totalDownline: downline.length,
      maxLevel,
      levelCount,
      downline,
    });
  } catch (err) {
    console.error("Error in getDirectTeam:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const generateUniqueUserId = async () => {
  while (true) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const userId = `PFX${randomNum}`;
    const exists = await User.findOne({ userId });
    if (!exists) return userId;
  }
};
// Assuming you have imported User model and express already
routerr.get("/userDetailsbyId", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId (wallet address) is required" });
    }

    const userDetails = await User.findOne({ userId });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    let wallet_balance = 0;
    const walletdetail = await registration.findOne({ user : userDetails.address });

    if(walletdetail){
      wallet_balance = walletdetail.wallet_income
    }

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // // direct income
    const sponsorincome = await SponsorIncome.aggregate([
      {
        $match: { receiver: userDetails.address } // Match the specific receiver
      },
      {
        $group: {
          _id: "$receiver",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

   const directinco = sponsorincome.length > 0 ? sponsorincome[0].totalIncome : 0;
    // // direct income

    // level income
    const levincome = await LevelIncome.aggregate([
      {
        $match: { receiver: userDetails.address } // Match the specific receiver
      },
      {
        $group: {
          _id: "$receiver",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

    const leveincome = levincome.length > 0 ? levincome[0].totalIncome : 0;
    // level income

    // divident income
    const divres = await DividentIncome.aggregate([
      {
        $match: { user: userDetails.address } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

    const dividentinco = divres.length > 0 ? divres[0].totalIncome : 0;
    // divident income

    // club income
    const clubres = await ClubIncome.aggregate([
      {
        $match: { user: userDetails.address } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$amount" } // Sum the income field
        }
      }
    ]);

    const clubinco = clubres.length > 0 ? clubres[0].totalIncome : 0;

     // total deposit
     const buypolres = await PackageBuy.aggregate([
      {
        $match: { user: userDetails.address } // Match the specific receiver
      },
      {
        $group: {
          _id: "$user",
          totalIncome: { $sum: "$polamount" } // Sum the income field
        }
      }
    ]);

    const totaldeposit = buypolres.length > 0 ? buypolres[0].totalIncome : 0;
    //club income

         // total sell
         const sellres = await Sell.aggregate([
          {
            $match: { user: userDetails.address } // Match the specific receiver
          },
          {
            $group: {
              _id: "$user",
              totalIncome: { $sum: "$maticAmt" } // Sum the income field
            }
          }
        ]);
    
        const totalSell = sellres.length > 0 ? sellres[0].totalIncome : 0;

    res.status(200).json({ 
      userDetails, 
      sponsorinc : directinco,
      levelinc : leveincome,
      dividentinc : dividentinco,
      clubinc : clubinco,
      totdeposit : totaldeposit,
      totalsell : totalSell,
      totalIncome : directinco + leveincome + dividentinco + clubinco,
      walletBalance : wallet_balance 
      })
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

routerr.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, referral } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email && !mobile) {
      return res
        .status(400)
        .json({ error: "Either email or mobile number is required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    let validReferral = null;
    if (referral) {
      const referredUser = await User.findOne({ userId: referral });
      if (!referredUser) {
        return res.status(400).json({ error: "Invalid referral ID" });
      }
      validReferral = referral;
    }

    const userId = await generateUniqueUserId();

    const newUser = new User({
      name,
      userId,
      email,
      mobile,
      password,
      referralId: validReferral || "PFX55004",
    });

    const isdoon = await newUser.save();

    if(isdoon){
      const regis = new registration({
        userId : userId,
        uId : 0,
        user : isdoon.address,
        referrerId : validReferral || "PFX55004",
        rId : 0,
        referrer : validReferral || "PFX55004",
        name : name || null,
        email : email || null,
        mobile : mobile || null,
        txHash : "0x0",
        block : 0,
        timestamp : 0
      })
  
      await regis.save()
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
routerr.put("/updateWallet", async (req, res) => {
  try {
    const { address, userId } = req.body;
    console.log(req.body);
    if (!address || !userId) {
      return res
        .status(400)
        .json({ message: "addres and userId are required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: { address: address } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Wallet address updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating wallet address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

routerr.post("/loginn", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

routerr.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    // Find user by email or mobile
    const userr = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!userr || userr.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Fetch registration data by userId (assuming both schemas share userId)
    const registrationn = await registration.findOne({ userId: user.userId });

    let user = userr.toObject();

    if (registrationn) {
      const regData = registrationn.toObject();

      // Merge registration fields into user, but skip fields with same name
      Object.keys(regData).forEach((key) => {
        if (!user.hasOwnProperty(key)) {
          user[key] = regData[key];
        }
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

routerr.post("/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        error: true,
        status: 400,
        message: "Email and password are required",
      });
    }
    const user = await admin_login.findOne({ email });
    if (!user) {
      return res.json({
        error: true,
        status: 400,
        message: "Email ID not found",
      });
    }

    if (user.password !== password) {
      return res.json({
        error: true,
        status: 400,
        message: "Password incorrect",
      });
    }

    return res.json({
      user,
      status: 200,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.json({
      error: true,
      status: 500,
      message: error.message,
    });
  }
});

routerr.get("/adminGetAllUser", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("Error in /adminGetAllUser:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const pinataApiKey = "90c3dcb52b5499f32502";
const pinataSecretApiKey =
  "147215c197cd2b4e2bdf58df958f7259fb56dc3f7e34605fc5de522d1d43c00e";

const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    console.log("first one", data.IpfsHash, "::::");
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.log("uploadToIPFS", error);
  }
};

const uploadMetadataToIPFS = async (imageHash) => {
  try {
    const metadata = {
      name: title,
      description: description,
      image: imageHash,
    };
    console.log(metadata, "metadata");
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", blob, "metadata.json");
    const { data } = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    console.log("second one ", data.IpfsHash, "::::");

    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.log("uploadMetadataToIPFS", error);
  }
};

const handleMintNFT = async () => {
  if (!selectedFile || !title || !description) {
    toast.error("Please fill all fields and select a file!");
    return;
  }
  try {
    console.log(selectedFile, title, description);
    const imageHash = await uploadToIPFS(selectedFile);
    console.log(imageHash, "imagasHash aftewr firesat step");
    const metadataURI = await uploadMetadataToIPFS(imageHash);
    console.log(title, "::::", description, imageHash, metadataURI);
    return metadataURI;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const nftCreate = async () => {
  setIsLoading(true);
  try {
    if (!address) {
      setIsLoading(false);
      toast.error("Please connect your wallet");
      return;
    }
    if (isLoading == true) {
      setIsLoading(false);
      return toast.error("Your request is pending");
    }
    if (!title || !description || !selectedFile || !nftPrice) {
      setIsLoading(false);
      return toast.error("Please fill all fields and select a file!");
    }
    const userBalance = await fetchUserTokenBalance(address);
    if (userBalance < totalNFTAmount) {
      setIsLoading(false);
      return toast.error(
        `You need to have at least ${totalNFTAmount} USDT to register`
      );
    }
    const iphashRes = await handleMintNFT();
    const totalAmount = Number(nftPrice) + 0.2 * Number(nftPrice);
    if (iphashRes) {
      const res = await createNftVrsFn(
        address,
        Number(nftPrice),
        title,
        description,
        iphashRes,
        totalAmount
      );
      // console.log(res, res.data.message, "VRS response");
      if (res.success) {
        const tokenApp = await tokenApp1(totalAmount);
        if (tokenApp) {
          const nft = createNFTFn(
            res.vrs.title,
            res.vrs.description,
            res.vrs.metadataURI,
            res.vrs.initialPrice,
            res.vrs.totalAmount,
            res.vrs.signature.v,
            res.vrs.signature.r,
            res.vrs.signature.s
          );
          await toast.promise(nft, {
            loading: "Nft creation in process",
            success: "Nft created successfully",
            error: "error in nft creation",
          });
          setIsLoading(false);
          setSelectedFile("");
          setNftPrice("");
          setTitle("");
          setDescription("");
          setPreview(CyberDoberman);
          setTimeout(() => {}, 2000);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(res.data.message);
        return;
      }
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

routerr.post("/withdrawincome", async (req, res) => {
  const { walletAddress } = req.body;
  console.log(walletAddress, "walletAddress");

  if (!walletAddress) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  //const lowerCaseAddress = walletAddress.toLowerCase();
  const lowerCaseAddress = walletAddress;

  console.log("wall addr ",lowerCaseAddress)

  try {
    // Locking the walletAddress to prevent concurrent modifications
    await lock.acquire(lowerCaseAddress, async () => {
      const fData = await registration.findOne({ user: lowerCaseAddress });
      console.log(fData, "fData:::");
      if (!fData) {
        res.status(200).json({
          status: 200,
          message: "User Not Found",
        });
      }

      let amount = fData.wallet_income;

      if (amount < 1) {
        res.status(200).json({
          status: 200,
          message: "Insufficient Wallet Balance minimum is $1",
        });
      }

      amount = amount * 0.8;

      const currentTime = new Date();

      // Add 3 minutes (3 * 60 * 1000 milliseconds)
      const threeMinutesLater = new Date(currentTime.getTime() + 3 * 60 * 1000);

      // Convert to timestamp in milliseconds
      const timestampInMilliseconds = threeMinutesLater.getTime();
      
      // Generate hash and process withdrawal

      const amountBN = web3.utils.toWei(amount.toString(), "ether");

      console.log("amountBN ",amountBN)

      // usdt to pol

      // const amountInPOL = await convertUSDTToPOL(amount);
      const amountInPOL = await convertUSDTToPOL(amount);

      const randomHash = await contract.methods
        .getWithdrawHash(walletAddress, amountBN, timestampInMilliseconds)
        .call();
      
      const vrsSign = await processWithdrawal(walletAddress, randomHash, amount);

      return res.status(200).json({
        success: true,
        message: "Withdrawal Request Processed Successfully",
        vrsSign,
        deadline : timestampInMilliseconds,
        amountInPOL : amountInPOL
      });
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error("Withdrawal error:", error.stack || error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

routerr.get('/level-income', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await LevelIncome.countDocuments({ receiver : user });

    const records = await LevelIncome.find({ receiver : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching level income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get('/sponsor-income', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await SponsorIncome.countDocuments({ receiver : user });

    const records = await SponsorIncome.find({ receiver : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching sponsor income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get('/dividend-income', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) return res.status(400).json({ error: 'User ID is required' });

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DividentIncome.find({ user }).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      DividentIncome.countDocuments({ user }),
    ]);

    return res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data,
    });
  } catch (error) {
    console.error('Error fetching dividend income:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

routerr.get('/sponsor-income', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await SponsorIncome.countDocuments({ receiver : user });

    const records = await SponsorIncome.find({ receiver : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching level income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get('/buy-history', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await PackageBuy.countDocuments({ user : user });

    const records = await PackageBuy.find({ user : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching buy history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get('/sell-history', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Sell.countDocuments({ user : user });

    const records = await Sell.find({ user : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching sell history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get('/withdraw-history', async (req, res) => {
  try {
    const { user, page = 1, limit = 10 } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await WithdrawalModel.countDocuments({ user : user });

    const records = await WithdrawalModel.find({ user : user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Error fetching withdraw history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

routerr.get ('/dashboard', async (req, res)=>{
  try {
    const { user } = req.query;

    if (!user) {
      return res
        .status(400)
        .json({ message: "wallet address is required" });
    }

    const userDetails = await registration.findOne({ user });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

routerr.post("/withdrawWeekly", async (req, res) => {
  let { walletAddress, amount } = req.body;
  console.log(walletAddress, "walletAddress");

  if (!walletAddress || !amount) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  //const lowerCaseAddress = walletAddress.toLowerCase();
  const lowerCaseAddress = walletAddress;

  console.log("wall addr ",lowerCaseAddress)

  try {
    // Locking the walletAddress to prevent concurrent modifications
    await lock.acquire(lowerCaseAddress, async () => {
      const fData = await registration.findOne({ user: lowerCaseAddress });
      console.log(fData, "fData:::");
      if (!fData) {
        res.status(200).json({
          status: 200,
          message: "User Not Found",
        });
      }

      let wall_income = fData.wallet_income;

      if (amount < 10) {
        res.status(200).json({
          status: 200,
          message: "Minimum Withdrawal is 10 POL",
        });
      }

      if (wall_income < amount) {
        res.status(200).json({
          status: 200,
          message: "Insufficient Wallet Balance",
        });
      }

      amount = amount * 0.90;

      const currentTime = new Date();

      // Add 3 minutes (3 * 60 * 1000 milliseconds)
      const threeMinutesLater = new Date(currentTime.getTime() + 3 * 60 * 1000);

      // Convert to timestamp in milliseconds
      const timestampInMilliseconds = threeMinutesLater.getTime();
      
      // Generate hash and process withdrawal

      const amountBN = web3.utils.toWei(amount.toString(), "ether");

      console.log("amountBN ",amountBN)

      // usdt to pol

      //const amountInPOL = await convertUSDTToPOL(amount);
      const amountInPOL = amount * 1e18;

      const randomHash = await contract.methods
        .getWithdrawHash(walletAddress, amountBN, timestampInMilliseconds)
        .call();
      
      const vrsSign = await processWithdrawal(walletAddress, randomHash, amount);

      return res.status(200).json({
        success: true,
        message: "Withdrawal Request Processed Successfully",
        vrsSign,
        deadline : timestampInMilliseconds,
        amountInPOL : amountInPOL
      });
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error("Withdrawal error:", error.stack || error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

async function processWithdrawal(userAddress, hash, amount) {
 

  try {
    const lastWithdrawFund = await WithdrawalModel.findOne({ user:userAddress}).sort({ _id: -1 });
    console.log(lastWithdrawFund,"lastWithdrawFund::::")
    let prevNonce = 0;
    if (!lastWithdrawFund) {
      prevNonce = -1;
    } else {
      prevNonce = lastWithdrawFund.nonce;
    }

    const currNonce = await contract.methods.nonce(userAddress).call();
    console.log(currNonce, "currNonce:::,", prevNonce, "currNonce:::111,", Number(currNonce))
    if (prevNonce + 1 !== Number(currNonce)) {
      throw new Error("Invalid withdrawal request!");
    }
    const vrsSign = await giveVrsForWithdrawLpc(
      userAddress,
      hash,
      Number(currNonce),
      web3.utils.toWei(amount.toString(), "ether")
    );

    return vrsSign;
  } catch (error) {
    console.error("Error in processWithdrawal:", error);
    throw error;
  }
}

function giveVrsForWithdrawLpc(user, hash, nonce, amount) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        user,
        amount,
      };

      const account = web3.eth.accounts.privateKeyToAccount(process.env.Operator_Wallet);
 
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;

      const signature = await web3.eth.sign(hash, account.address);

      const vrsValue = parseSignature(signature)
      data["signature"] = vrsValue;
      resolve({ ...data, amount });

      console.log(data, "data::::")
    } catch (error) {
      console.error("Error in signing the message:", error);
      reject(error);
    }
  });
}

function parseSignature(signature) {
  
  const sigParams = signature.substr(2);
  const v = "0x" + sigParams.substr(64 * 2, 2);
  const r = "0x" + sigParams.substr(0, 64);
  const s = "0x" + sigParams.substr(64, 64);
 
  return { v, r, s };
}

routerr.get('/random-number', (req, res) => {
  // Generate a buffer of 50 bytes (to ensure at least 100 digits when converted)
  const buffer = crypto.randomBytes(50);
  // Convert to a large number and take first 100 digits
  const largeNumber = BigInt('0x' + buffer.toString('hex')).toString();
  // Ensure exactly 100 digits by padding or trimming
  let randomNumber = largeNumber.padStart(100, '0').slice(0, 100);
  
  res.json({
      randomNumber: randomNumber
  });
});

routerr.post("/transfer", async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    if (senderId === receiverId) {
      return res.json({ success: false, msg: "Sender and Receiver cannot be same" });
    }

    if (Number(amount) < 50) {
      return res.json({ success: false, msg: "Minimum transfer amount is 50" });
    }

    // Deduct from sender only if balance >= amount
    const senderUpdate = await registration.findOneAndUpdate(
      { userId: senderId, topup_amount: { $gte: amount } }, // condition
      { $inc: { topup_amount: -amount } }, // deduct
      { new: true }
    );

    if (!senderUpdate) {
      return res.json({ success: false, msg: "Insufficient balance or invalid sender" });
    }

    // Credit receiver
    const receiverUpdate = await registration.findOneAndUpdate(
      { userId: receiverId },
      { $inc: { topup_amount: Number(amount) } },
      { new: true }
    );

    if (!receiverUpdate) {
      // rollback sender deduction if receiver not found
      await registration.findOneAndUpdate(
        { userId: senderId },
        { $inc: { topup_amount: Number(amount) } }
      );
      return res.json({ success: false, msg: "Invalid receiver" });
    }

    // Save transfer record
    const transferRecord = await transfer.create({
      senderId,
      receiverId,
      amount,
      createdAt: new Date(),
    })
    // const transferRecord = new transfer({ senderId, receiverId, amount });
    // await transferRecord.save();

    return res.json({ success: true, msg: "Transfer successful", transfer: transferRecord });
  } catch (err) {
    console.error("Transfer Error:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

routerr.post("/stake", async (req, res) => {
  try {
    const { userId, planId, amount } = req.body;
    if (!userId || !planId || !amount) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, msg: "Invalid staking amount" });
    }

      // ✅ Minimum staking amounts for each plan
      const minAmounts = {
        1: 50,
        2: 500,
        3: 2500,
        4: 5000,
        5: 10000,
      };
  
      if (!minAmounts[planId]) {
        return res.status(400).json({ success: false, msg: "Invalid plan selected" });
      }
  
      if (amount < minAmounts[planId]) {
        return res.status(400).json({
          success: false,
          msg: `Minimum stake amount for this plan is ${minAmounts[planId]}`,
        });
      }

    // Deduct from user only if topup_amount >= amount
    const user = await registration.findOneAndUpdate(
      { userId, topup_amount: { $gte: amount } }, // condition
      { $inc: { topup_amount: -amount } },        // deduct amount
      { new: true }
    );

    if (!user) {
      return res.json({ success: false, msg: "Insufficient balance or invalid user" });
    }

    // Calculate ROI, package name, lockin days
    const result = calculateIncomeAndPackage(amount, planId);
    const perday = result.perDayIncome;
    const lockin = result.lockinDays;

    // Create stake record
    const newStake = await stake2.create({
      userId: userId,
      amount: amount,
      perdayroi: perday,
      plan: planId,
      planname: result.packageName,
      plantype: planId,
      stakeType: "manual", // since it's API now (not from contract)
      lockindays: lockin,
      createdAt: new Date(),
    });

    if(newStake){

      await registration.updateOne(
        { userId: userId },
        { $inc: { stake_amount: Number(amount) } }
      );

      const refdet = await registration.findOne({ userId : userId },{referrerId:1 })
      const refId = refdet.referrerId

      const pil = await stakedirect.findOne({ userId: userId, referrerId : refId })
      if(!pil){
        await registration.updateOne(
         { userId: refId },
         { $inc: { directStakeCount: 1 } }
       );
       await stakedirect.create({
         userId : userId,
         referrerId : refId
       })
      }
    }

    return res.json({ success: true, msg: "Stake created successfully", stake: newStake });
  } catch (err) {
    console.error("Stake Error:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

function calculateIncomeAndPackage(investment, planId) {
  let monthlyRate, packageName, lockinDays;

  if (planId == 1) {
    monthlyRate = 0.10; packageName = "Precious Metals"; lockinDays = 90;
  } else if (planId == 2) {
    monthlyRate = 0.15; packageName = "Real Estate"; lockinDays = 180;
  } else if (planId == 3) {
    monthlyRate = 0.20; packageName = "US Stocks"; lockinDays = 360;
  } else if (planId == 4) {
    monthlyRate = 0.24; packageName = "Forex Market"; lockinDays = 720;
  } else if (planId == 5) {
    monthlyRate = 0.30; packageName = "Digital Assets"; lockinDays = 1080;
  } else {
    throw new Error("Invalid planId provided");
  }

  const perDayIncome = (investment * monthlyRate) / 30;

  return {
    perDayIncome: perDayIncome.toFixed(2),
    packageName,
    lockinDays
  };
}

module.exports = routerr;
