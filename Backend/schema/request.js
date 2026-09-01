import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  employeeID: {
    type: String,
        required: true
  },
  date: {
    type: Date,
        required: true
  },
  bill_no: {
    type: String,
        required: true
  },
  amount: {
    type: Number,
        required: true
  },
  remark: {
    type: String,
        required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    total: {
        type: Number,
        required: true
    },
    net_payable: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        default: ""
    }
})

const Request = mongoose.model("advance_form", requestSchema);
export default Request;
