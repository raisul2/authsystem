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
import { login, logout, updateUser } from "../redux/authslice";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "email must be valid email",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

const Login = () => {
  // ...

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const LOGIN_USER = gql`
    mutation ($loginInput: LoginInput!) {
      loginUser(loginInput: $loginInput) {
        username
        id
        email
        token
      }
    }
  `;

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { loginUser: userData } }) {
      dispatch(login(userData));
      navigate("/");
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    loginUser({
      variables: { loginInput: values },
    });

    // console.log(values);
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

          <Button type="submit">Login</Button>
        </form>
      </Form>
      <p className="capitalize ">
        if you dob't have an account?
        <Link className="text-blue-400" to="/signup">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
