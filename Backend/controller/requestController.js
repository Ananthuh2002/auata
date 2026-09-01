import Request from "../schema/request.js";
export const request = async (req, res) => {
  try {
    const { employeeID, name, date, bill_no, amount, remark, total, net_payable } = req.body;
    if (!employeeID || !date || !bill_no || !amount || !remark || total === undefined || net_payable === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const request = await Request.create({
      employeeID,
      name,
      date, 
      bill_no,
      amount,
      remark,
      total,
      net_payable,
    });
    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const Id = req.query.employeeID;
    const filter = Id ? { employeeID: Id } : {};
    const requests = await Request.find(filter);
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const request = await Request.findByIdAndUpdate(id, { status: status });
    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
