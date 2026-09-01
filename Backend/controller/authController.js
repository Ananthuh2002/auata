import User from "../schema/user.js";

export const Login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Employee ID and password are required",
        });
    }

    // TODO: Add DB user lookup here
    console.log("Login attempt:", employeeId);

    const user = await User.findOne({ employeeID: employeeId });
    console.log("user", user);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: user,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
