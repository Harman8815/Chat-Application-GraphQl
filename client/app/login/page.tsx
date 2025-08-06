"use client";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading }] = useMutation(LOGIN);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      localStorage.setItem("token", data.login.token);
      router.push("/room");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-electric-blue rounded-full opacity-10 floating-element"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-neon-green rounded-full opacity-10 floating-element"
          style={{ animationDelay: "-3s" }}
        ></div>

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glassmorphism border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-br from-electric-blue to-neon-green rounded-2xl flex items-center justify-center mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Lock className="text-white text-2xl" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-gradient">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-lg opacity-80">
                Sign in to your ChatLink account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 py-3 rounded-xl border-2 border-transparent bg-card focus:border-electric-blue transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 py-3 rounded-xl border-2 border-transparent bg-card focus:border-electric-blue transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-gray-300 text-electric-blue focus:ring-electric-blue"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password">
                    <Button
                      variant="link"
                      className="text-electric-blue hover:text-neon-green p-0 h-auto"
                    >
                      Forgot password?
                    </Button>
                  </Link>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-electric-blue to-neon-green text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 border-0 disabled:opacity-50"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                    {!loading && <ArrowRight className="ml-2" size={18} />}
                  </Button>
                </motion.div>
              </form>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted-foreground">
                  Don’t have an account?{" "}
                  <Link href="/signup">
                    <Button
                      variant="link"
                      className="text-electric-blue hover:text-neon-green p-0 h-auto font-semibold"
                    >
                      Sign up for free
                    </Button>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
