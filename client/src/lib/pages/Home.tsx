import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authslice";
import { gql, useMutation, useQuery } from "@apollo/client";

const formSchema = z.object({
  msg: z.string().min(2, {
    message: "you must be give atlest 2 char",
  }),
});

const Home = () => {
  // ...

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      msg: "",
    },
  });

  const dispatch = useDispatch();

  const CREATE_MSG = gql`
    mutation ($msg: String!) {
      createMsg(msg: $msg) {
        message
      }
    }
  `;

  const GET_MSG = gql`
    {
      getMsgs {
        message
      }
    }
  `;

  const [createMessage] = useMutation(CREATE_MSG, {
    update(proxy, result) {
      const olddata = proxy.readQuery({
        query: GET_MSG,
      });

      let newMsg = [...olddata.getMsgs];
      proxy.writeQuery({
        query: GET_MSG,
        data: {
          getMsgs: {
            newMsg,
          },
        },
      });
    },
  });

  const { loading, data } = useQuery(GET_MSG);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);

    createMessage({
      variables: { msg: values.msg },
    });
  }

  if (loading) {
    return <h1>loading...</h1>;
  }

  return (
    <div className="flex-col my-6  gap-4 flex justify-center items-center m-auto">
      <Button onClick={() => dispatch(logout())}>logout</Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[320px] "
        >
          <FormField
            control={form.control}
            name="msg"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Create msg" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Careate msg</Button>
        </form>
      </Form>

      <div className="flex  p-5 mt-4  flex-col gap-4 justify-center items-start">
        {data.getMsgs &&
          data.getMsgs.map((m, index) => (
            <p
              className="flex px-4 py-2 capitalize bg-green-300 border-green-700 text-green-700 rounded-md border-2"
              key={index}
            >
              {m.message}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Home;
