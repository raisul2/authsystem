import { Schema, model } from "mongoose";

const msgSchema = new Schema({
  msg: String,
  username: String,
  createdAt: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const Msg = model("Msg", msgSchema);

export default Msg;
