import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { gql, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { login } from "../redux/authslice";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "give atlest 1 char",
  }),
  email: z.string().email({
    message: "email must be valid email",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

const Signup = () => {
  // ...

  const dispatch = useDispatch();
  const naviage = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const REGISTER_USER = gql`
    mutation ($registerINput: RegisterInput) {
      registerUser(registerINput: $registerINput) {
        id
        email
        username
        token
      }
    }
  `;

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { registerUser: userData } }) {
      dispatch(login(userData));
      navigate("/");
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    addUser({
      variables: { registerINput: values },
    });
  }

  if (loading) {
    return <h1>loading....</h1>;
  }

  return (
    <div className="h-[100vh] flex-col gap-4 flex justify-center items-center m-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[320px] "
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>confirmPassword</FormLabel>
                <FormControl>
                  <Input
                    placeholder="confirmPassword"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Signup</Button>
        </form>
      </Form>
      <p className="capitalize ">
        if you already have an account?
        <Link className="text-blue-400" to="/login">
          login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
