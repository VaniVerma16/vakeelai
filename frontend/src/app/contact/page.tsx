"use client";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, User, MessageSquare, Send } from "lucide-react";

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." })
    .optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ContactFormSchema>) => {
    try {
      // Use environment variables for your EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      // Send the email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        data,
        publicKey
      );
      console.log("Email sent successfully:", response.status, response.text);

      // Set submission state
      setSubmissionDetails({
        name: data.name,
        email: data.email,
      });
      setIsSubmitted(true);

      toast.success(`Thank you ${data.name}, your message has been sent!`, {
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });

      form.reset();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email. Please try again later.");
    }
  };

  // If submitted, show confirmation
  if (isSubmitted && submissionDetails) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left Side: Contact Us Heading */}
          <div className="space-y-8 pr-0 md:pr-12 max-w-xl pt-30">
            <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
              Message Sent
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Thank you, {submissionDetails.name}! We have received your message
              at {submissionDetails.email}.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSubmissionDetails(null);
              }}
              className="mt-4"
            >
              Send Another Message
            </Button>
          </div>

          {/* Right Side: Original Contact Info */}
          <div>
            <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
              <CardHeader className="space-y-2 text-center pb-8 pt-8">
                <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                  Confirmation Details
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-muted-foreground font-medium">
                  Your message has been successfully submitted.
                </CardDescription>
              </CardHeader>
              <Separator className="mb-8" />
              <CardContent className="px-6 md:px-8">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Name:</p>
                    <p>{submissionDetails.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{submissionDetails.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Original form rendering
  return (
    <div className="container mx-auto py-16 px-4 md:px-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Side: Contact Us Heading */}
        <div className="space-y-8 pr-0 md:pr-12 max-w-xl pt-30">
          <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            We are available for questions, feedback, or collaboration
            opportunities. Let us know how we can help you achieve your goals!
          </p>
          <div className="space-y-6 text-muted-foreground pt-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <span className="text-lg font-medium">vakeel.ai@gmail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <span className="text-lg font-medium">+91 --</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div>
          <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
            <CardHeader className="space-y-2 text-center pb-8 pt-8">
              <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                Get in Touch
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-muted-foreground font-medium">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </CardDescription>
            </CardHeader>
            <Separator className="mb-8" />
            <CardContent className="px-6 md:px-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-base">
                            Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Your Name"
                                className="pl-11 py-6 text-base bg-background/50 border-slate-200 dark:border-slate-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-base">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Your Email"
                                className="pl-11 py-6 text-base bg-background/50 border-slate-200 dark:border-slate-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold text-base">
                          Subject (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is this regarding?"
                            className="py-6 text-base bg-background/50 border-slate-200 dark:border-slate-700 rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-muted-foreground font-medium">
                          Help us categorize your message.
                        </FormDescription>
                        <FormMessage className="font-medium" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold text-base">
                          Message
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Textarea
                              placeholder="Your Message"
                              className="pl-11 min-h-40 text-base bg-background/50 border-slate-200 dark:border-slate-700 rounded-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-medium" />
                      </FormItem>
                    )}
                  />
                  <div className="pt-3">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg transition-all rounded-lg"
                    >
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground border-t pt-6 pb-8 px-8 mt-4">
              <p className="text-base font-medium">
                We respect your privacy and will never share your information.
              </p>
              <p className="text-base font-medium">
                Typically, we respond within 24-48 business hours.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
