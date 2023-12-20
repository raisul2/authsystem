import Msg from "../../models/Msg.js";
import { authContext } from "../../utils/check_auth.js";

export const msgResolvers = {
  Query: {
    async getMsgs() {
      try {
        const message = await Msg.find().sort({ createdAt: -1 });
        if (!message) {
          throw new Error("msg not exist");
        }

        let msglist = [];

        for (let i = 0; i < message.length; i++) {
          msglist.push({ message: message[i].msg });
        }

        return msglist;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createMsg(_, { msg }, context) {
      const user = authContext(context);
      if (msg.trim() === "") {
        throw new Error("msg must not be empty");
      }

      const newMsg = new Msg({
        msg,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const message = await newMsg.save();
      // console.log(message);
      return {
        message: message.msg,
      };
    },
  },
};
