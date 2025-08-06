"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutation";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useAuth(); // ✅ Added setUser from context

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const [signup, { loading }] = useMutation(SIGNUP);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await signup({
        variables: {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
      });

      if (data?.signup?.token && data?.signup?.user) {
        // Save token
        localStorage.setItem("token", data.signup.token);

        // ✅ Save user in context
        setUser(data.signup.user);

        // ✅ Navigate
        router.push("/dashboard");

        toast({
          title: "Signup successful!",
          description: `Welcome ${data.signup.user.username || "User"}!`,
          // variant: "success",
        });
      } else {
        throw new Error("Invalid signup response from server");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="absolute top-32 right-10 w-28 h-28 bg-neon-green rounded-full opacity-10 floating-element"></div>
        <div
          className="absolute bottom-32 left-10 w-20 h-20 bg-accent-orange rounded-full opacity-10 floating-element"
          style={{ animationDelay: "-2s" }}
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
                className="mx-auto w-16 h-16 bg-gradient-to-br from-neon-green to-electric-blue rounded-2xl flex items-center justify-center mb-4"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <User className="text-white text-2xl" />
              </motion.div>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@example.com"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="********"
                      className="pl-8 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <ArrowRight className="w-4 h-4 animate-spin" />
                    </motion.span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Sign up
                    </>
                  )}
                </Button>

                {/* Link to login */}
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
