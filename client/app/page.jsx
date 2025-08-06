"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  Zap, 
  Shield, 
  Image as ImageIcon, 
  Users, 
  Smartphone, 
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Star,
  Rocket,
  Play,
  NotebookPen,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function page() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Scroll reveal animation
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 100;
        
        if (revealTop < windowHeight - revealPoint) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div  className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-electric-blue rounded-full opacity-20 floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-neon-green rounded-full opacity-20 floating-element" style={{ animationDelay: "-2s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-accent-orange rounded-full opacity-20 floating-element" style={{ animationDelay: "-4s" }}></div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="text-gradient">Connect.</span><br />
              <span className="text-gradient">Chat.</span><br />
              <span className="text-gradient">Collaborate.</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-80 leading-relaxed">
              Experience the future of team communication with our powerful GraphQL-driven chat platform. 
              Real-time messaging, beautiful design, enterprise security.
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/signup">
              <Button 
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-green text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                <Rocket className="mr-2" />
                Get Started
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-4 border-2 border-electric-blue text-electric-blue rounded-full font-semibold text-lg hover:bg-electric-blue hover:text-white transition-all duration-300"
            >
              <Play className="mr-2" />
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-sm opacity-60 mb-4">Trusted by 50,000+ teams worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-40">
              <div className="text-2xl font-bold">Microsoft</div>
              <div className="text-2xl font-bold">Slack</div>
              <div className="text-2xl font-bold">Discord</div>
              <div className="text-2xl font-bold">Zoom</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Powerful Features
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              Everything you need for seamless team communication, packed in a beautiful interface
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Zap,
                title: "Real-Time Messaging",
                description: "Lightning-fast message delivery with GraphQL subscriptions. Experience instant communication with zero lag.",
                gradient: "from-electric-blue to-neon-green",
                rotation: ""
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "End-to-end encryption, SSO integration, and compliance with industry standards for peace of mind.",
                gradient: "from-neon-green to-accent-orange",
                rotation: "rotate-2"
              },
              {
                icon: ImageIcon,
                title: "Media Sharing",
                description: "Share files, images, and videos with drag-and-drop simplicity. Advanced media preview and organization.",
                gradient: "from-accent-orange to-electric-blue",
                rotation: "-rotate-1"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Channels, threads, mentions, and reactions. Everything needed for effective team coordination.",
                gradient: "from-electric-blue to-accent-orange",
                rotation: ""
              },
              {
                icon: Smartphone,
                title: "Cross-Platform",
                description: "Native apps for iOS, Android, Web, and Desktop. Sync seamlessly across all your devices.",
                gradient: "from-neon-green to-electric-blue",
                rotation: "rotate-1"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Insights",
                description: "Detailed analytics on team communication patterns and productivity metrics for better decision making.",
                gradient: "from-accent-orange to-neon-green",
                rotation: "-rotate-2"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`scroll-reveal card-hover p-8 rounded-3xl glassmorphism ${feature.rotation}`}
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="opacity-80 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-neon-green/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              See what our users are saying about their ChatLink experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Tech Lead @ StartupCorp",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                content: "ChatLink revolutionized our team communication. The real-time features and beautiful interface make collaboration effortless."
              },
              {
                name: "Sarah Johnson",
                role: "Design Director @ Creative Co",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                content: "The best chat app we've used. Intuitive design, powerful features, and amazing performance. Our team productivity has increased significantly."
              },
              {
                name: "Michael Rodriguez",
                role: "CEO @ TechVentures",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                content: "Enterprise-grade security with consumer-grade simplicity. ChatLink delivers exactly what modern teams need to stay connected."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="scroll-reveal card-hover p-8 rounded-3xl glassmorphism"
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="opacity-70">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-current" size={16} />
                    ))}
                  </div>
                </div>
                <p className="opacity-80 leading-relaxed">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="scroll-reveal bg-gradient-to-r from-electric-blue to-neon-green p-1 rounded-3xl">
            <div className="bg-background rounded-3xl p-12 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Team collaboration and communication" 
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
                    Stay Updated
                  </h2>
                  <p className="text-lg opacity-80 mb-8 leading-relaxed">
                    Get the latest ChatLink updates, feature releases, and exclusive early access to new capabilities.
                  </p>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input 
                        type="email" 
                        placeholder="Enter your email address"
                        className="px-6 py-4 rounded-2xl border-2 border-transparent bg-card focus:border-electric-blue text-lg"
                      />
                      <Mail className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-40" />
                    </div>
                    <Button className="w-full px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-green text-white rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0">
                      <NotebookPen className="mr-2" />
                      Subscribe Now
                    </Button>
                    <p className="text-sm opacity-60 text-center">
                      No spam, unsubscribe anytime. We respect your privacy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Get in Touch
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              Have questions? Our team is here to help you get started with ChatLink
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="scroll-reveal">
              <Card className="p-8 rounded-3xl glassmorphism border-0">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        type="text" 
                        placeholder="First Name"
                        className="px-6 py-4 rounded-2xl border-2 border-transparent bg-card focus:border-electric-blue"
                      />
                      <Input 
                        type="text" 
                        placeholder="Last Name"
                        className="px-6 py-4 rounded-2xl border-2 border-transparent bg-card focus:border-electric-blue"
                      />
                    </div>
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      className="px-6 py-4 rounded-2xl border-2 border-transparent bg-card focus:border-electric-blue"
                    />
                    <Textarea 
                      placeholder="Your Message"
                      rows={5}
                      className="px-6 py-4 rounded-2xl border-2 border-transparent bg-card focus:border-electric-blue resize-none"
                    />
                    <Button className="w-full px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-green text-white rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0">
                      <NotebookPen className="mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Info */}
            <div className="scroll-reveal space-y-8">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  details: ["support@chatlink.app", "hello@chatlink.app"],
                  gradient: "from-electric-blue to-neon-green"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  details: ["+1 (555) 123-4567", "+91 98765 43210"],
                  gradient: "from-neon-green to-accent-orange"
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  details: ["San Francisco, CA", "Bangalore, India"],
                  gradient: "from-accent-orange to-electric-blue"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-3xl glassmorphism card-hover"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center`}>
                      <item.icon className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                      {item.details.map((detail, i) => (
                        <p key={i} className="opacity-80">{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-dark-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-neon-green/10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
                  <Users className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient">ChatLink</h3>
              </div>
              <p className="text-lg opacity-80 mb-6 leading-relaxed max-w-md">
                Revolutionizing team communication with GraphQL-powered real-time messaging, 
                beautiful design, and enterprise-grade security.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Github, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-electric-blue transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Products */}
            <div>
              <h4 className="font-bold text-xl mb-6">Product</h4>
              <ul className="space-y-3">
                {["Features", "Integrations", "Pricing", "API Docs", "Mobile Apps"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="opacity-80 hover:opacity-100 hover:text-electric-blue transition-all duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-bold text-xl mb-6">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Blog", "Careers", "Press Kit", "Contact"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="opacity-80 hover:opacity-100 hover:text-electric-blue transition-all duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="opacity-60">© 2025 ChatLink. All rights reserved.</p>
              <div className="flex space-x-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="opacity-60 hover:opacity-100 hover:text-electric-blue transition-all duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
