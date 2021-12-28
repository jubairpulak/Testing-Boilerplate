"use strict"

const bcryptjs = require("bcryptjs")
const { slugify } = require("jslugify")
const comparePass = async (storepass, inputpass) =>
  await bcryptjs.compare(inputpass, storepass)

class AuthService {
  constructor(Model) {
    this.Model = Model
  }

  async SignUp(DatafromBody) {
    const {
      first_Name,
      last_Name,
      password,
      email,
      phone_Number,
      father_Name,
      mother_Name,
      address,
    } = DatafromBody
    const CheckIsEmailExist = await this.Model.findOne({
      "contract_Info.email": email,
    }).lean()
    const CheckIsPhoneExist = await this.Model.findOne({
      "contract_Info.phone_Number": phone_Number,
    }).lean()
    if (CheckIsEmailExist) {
      return {
        ErrorMessage: "Email has already been used",
        code: 403,
        error: true,
      }
    } else if (CheckIsPhoneExist) {
      return {
        ErrorMessage: "Phone Number has already been used",
        code: 403,
        error: true,
      }
    } else {
      const createUser = await this.Model.create({
        first_Name,
        last_Name,
        password: await bcryptjs.hash(password, 12),
        contract_Info: {
          email,
          phone_Number,
        },
        parents_Info: {
          father_Name,
          mother_Name,
        },
        address,
      })
      return {
        error: false,
        data: {
          userid: createUser._id,
        },
      }
    }
  }

  //login user
  async Login(DatafromBody) {
    const { email, password } = DatafromBody
    console.log("data of email and pass", email, password)
    const findemail = await this.Model.findOne({
      email,
    })
      .select("+password")
      .lean()
    if (!findemail) {
      return {
        notfoundmessage: "Email not found",
        code: 404,
        error: true,
      }
    }
    console.log("hello user data", findemail)
    const passwordgenerate = await comparePass(findemail.password, password)
    if (!passwordgenerate) {
      return {
        notfoundmessage: "Invalid Password",
        code: 404,
        error: true,
      }
    }
    const checkActive = await this.Model.findById({ _id: findemail._id })
      .where({ active: true })
      .lean()
    if (!checkActive) {
      return {
        notfoundmessage: "Account is deactivated",
        code: 403,
        error: true,
      }
    }
    return {
      error: false,
      data: findemail,
    }
  }

  async findMe(userid) {
    return await this.Model.findById({ _id: userid }).lean()
  }

  async findUserWithRole(userid, role, variablename) {
    let data = variablename

    const findUser = await this.Model.findById({ _id: userid }).lean()
    const v1 = findUser[data]
    console.log(v1)
    return !role.includes(findUser.role) ? false : true
  }
  async getAllData() {
    return await this.Model.find({}).lean()
  }

  async checkCurrentPassword(userid, currentPassword) {
    const findUser = await this.Model.findById({ _id: userid })
      .select("+password")
      .lean()
    const passwordCheck = await comparePass(findUser.password, currentPassword)
    if (!passwordCheck) {
      return {
        notfoundmessage: "Invalid Password",
        code: 404,
        error: true,
      }
    }
    return ""
  }

  async updateInfo(userid, updateobjectdata) {
    const updatedata = await this.Model.findByIdAndUpdate(
      { _id: userid },
      updateobjectdata,
      {
        new: true,
        runValidators: true,
      }
    )
    console.log("log data", updatedata)
    return updatedata
  }

  async updateRole(userid) {
    const updateUserActiveRole = await this.Model.findByIdAndUpdate(
      { _id: userid },
      { $set: { active: false } }
    )

    if (!updateUserActiveRole) console.log("No, something wrong")

    return "Account has been deactivated successfully"
  }

  async updateRequest(email) {
    // const updateUserActiveRole = await this.Model.findOne({"contract_Info"})
    const updateUserActiveRole = await this.Model.findOneAndUpdate(
      { "contract_Info.email": email },
      { request: "active" },
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updateUserActiveRole) console.log("Account has not been updated")
    return "Account has been Updated"
  }

  async isEmailExist(email) {
    const findEmail = await this.Model.findOne({ email })
    if (!findEmail || findEmail == undefined || findEmail == null) {
      return {
        error: false,
      }
    } else {
      return {
        message: "Email is already existed",
        error: true,
        code: "403",
      }
    }
  }
  async isUserExist(email) {
    const findEmail = await this.Model.findOne({ email })
    if (!findEmail || findEmail == undefined || findEmail == null) {
      return {
        error: false,
      }
    } else {
      return {
        user: findEmail,
        error: true,
        code: "403",
      }
    }
  }
  async isPhoneExist(phoneNumber) {
    const findPhone = await this.Model.findOne({ phoneNumber }).lean()
    if (!findPhone || findPhone == undefined || findPhone == null) {
      return {
        error: false,
      }
    } else {
      return {
        message: "Phone Number is already existed",
        error: true,
        code: "403",
      }
    }
  }

  async createData(objdata) {}

  async getAll(role) {
    return this.Model.find({ role }).lean()
  }

  async isDataFindById(id) {
    const data = await this.Model.findById(id)
    console.log("data error", data)
    if (data < 1) {
      return {
        error: false,
      }
    } else {
      console.log("hello data", data.length)
      return {
        error: true,
        data,
      }
    }
  }
  async isDataExist(obj) {
    console.log("from 229 line0", obj)
    const data = await this.Model.findOne(obj)
    if (data < 1) {
      return {
        error: false,
      }
    } else {
      console.log("hello data", data)
      return {
        error: true,
        data,
      }
    }
  }

  async makeSlugify(obj) {
    return slugify(obj, true, "-")
  }

  async sendBulkData(obj) {
    const data = await this.Model.insertMany(obj)
    if (!data) {
      return {
        status: "fail",
        error: true,
        message: "Data is not inserted",
      }
    } else {
      return {
        status: "success",
        error: false,
        message: "Data has been inserted",
      }
    }
  }

  async getProductAndMarketData(obj) {
    console.log("obj data here mongodb auth", obj)
    return this.Model.find(obj)
      .populate({
        path: "techDetails",
        populate: {
          path: "techInfo",
          populate: {
            path: "tech",
            select: "techName _id",
          },
        },
      })
      .populate({ path: "regionInfo", select: "regionName _id" })
  }
}

module.exports = AuthService
