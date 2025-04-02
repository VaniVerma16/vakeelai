"use client"

import React from 'react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"
import { ChevronRight, Info, ArrowUpRight, Lock, Shield, Clock } from "lucide-react"

// Metadata is now exported from metadata.ts

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 md:px-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/privacy">Privacy Policy</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <div className="lg:w-1/4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#introduction" className="text-muted-foreground hover:text-primary flex items-center">
                    Introduction <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#collection" className="text-muted-foreground hover:text-primary flex items-center">
                    Information We Collect <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#usage" className="text-muted-foreground hover:text-primary flex items-center">
                    How We Use Your Information <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="text-muted-foreground hover:text-primary flex items-center">
                    Data Security <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#sharing" className="text-muted-foreground hover:text-primary flex items-center">
                    Sharing Your Information <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#rights" className="text-muted-foreground hover:text-primary flex items-center">
                    Your Rights <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="text-muted-foreground hover:text-primary flex items-center">
                    Cookies and Tracking <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#children" className="text-muted-foreground hover:text-primary flex items-center">
                    Children&apos;s Privacy <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#changes" className="text-muted-foreground hover:text-primary flex items-center">
                    Changes to Policy <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-muted-foreground hover:text-primary flex items-center">
                    Contact Us <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <Card>
            <CardHeader className="space-y-1 pb-8">
              <Badge variant="outline" className="w-fit mb-2">Last updated: March 27, 2025</Badge>
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <CardDescription className="text-lg">
                How we protect and manage your data at Vakeel.ai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <section id="introduction">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Introduction</h2>
                </div>
                <p className="text-muted-foreground">
                  At Vakeel.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you use our AI-powered legal contract services. Please read this 
                  privacy policy carefully. By accessing or using our service, you acknowledge that you have read and 
                  understood this policy.
                </p>
              </section>
              
              <Separator />

              {/* Information We Collect */}
              <section id="collection">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Information We Collect</h2>
                </div>
                
                <Tabs defaultValue="personal" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="contract">Contract Data</TabsTrigger>
                    <TabsTrigger value="usage">Usage Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal" className="p-4 border rounded-md mt-2">
                    <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                    <p className="text-muted-foreground">
                      We may collect personal information that you voluntarily provide when using our service, including 
                      but not limited to your name, email address, company information, and payment details.
                    </p>
                  </TabsContent>
                  <TabsContent value="contract" className="p-4 border rounded-md mt-2">
                    <h3 className="text-lg font-medium mb-2">Contract Data</h3>
                    <p className="text-muted-foreground">
                      Our service processes legal contracts and documents that you upload or create. This may include 
                      sensitive business information, legal terms, and other content contained in your documents.
                    </p>
                  </TabsContent>
                  <TabsContent value="usage" className="p-4 border rounded-md mt-2">
                    <h3 className="text-lg font-medium mb-2">Usage Data</h3>
                    <p className="text-muted-foreground">
                      We collect information on how you interact with our service, including access times, pages viewed, 
                      features used, and other diagnostic data that helps us improve our platform.
                    </p>
                  </TabsContent>
                </Tabs>
              </section>
              
              <Separator />

              {/* How We Use Your Information */}
              <section id="usage">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                </div>
                
                <Alert className="mb-4 bg-primary/5">
                  <AlertTitle className="text-primary">Your data powers our service</AlertTitle>
                  <AlertDescription>
                    We use your information responsibly to provide and improve our services.
                  </AlertDescription>
                </Alert>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Service Provision</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">We use your information to:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Provide and maintain our Service</li>
                        <li>Process and analyze your legal documents</li>
                        <li>Detect, prevent, and address technical issues</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Service Improvement</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">Your data helps us improve:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Our AI models and service offerings</li>
                        <li>User experience and interface design</li>
                        <li>Overall system performance and reliability</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Communications</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">We may contact you regarding:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Service updates and new features</li>
                        <li>Responses to your inquiries and support requests</li>
                        <li>Security and privacy notifications</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Legal Compliance</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        We may use your information to comply with applicable laws, regulations, and legal processes, 
                        including responding to lawful requests from public authorities.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
              
              <Separator />
                  {/* Sharing Your Information */}
<section id="sharing">
  <div className="flex items-center gap-2 mb-4">
    <Info className="h-5 w-5 text-primary" />
    <h2 className="text-2xl font-semibold">Sharing Your Information</h2>
  </div>
  <Card>
    <CardContent className="pt-6">
      <p className="text-muted-foreground mb-4">
        We do not sell your personal information or document data. We may share information with:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Service providers who assist us in operating our platform</li>
        <li>Legal and regulatory authorities when required by law</li>
        <li>Business partners, with your consent, for specific services you request</li>
      </ul>
    </CardContent>
  </Card>
</section>

<Separator />

{/* Your Rights */}
<section id="rights">
  <div className="flex items-center gap-2 mb-4">
    <Shield className="h-5 w-5 text-primary" />
    <h2 className="text-2xl font-semibold">Your Rights</h2>
  </div>
  
  <Alert className="mb-4 bg-primary/5">
    <AlertTitle className="text-primary">User Privacy Rights</AlertTitle>
    <AlertDescription>
      Depending on your location, you may have rights regarding your personal information.
    </AlertDescription>
  </Alert>
  
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="right-1">
      <AccordionTrigger>Access and Portability</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          You have the right to request a copy of the personal information we hold about you and to receive it in a structured, commonly used format.
        </p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="right-2">
      <AccordionTrigger>Correction and Deletion</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          You can request that we correct inaccurate information or delete your personal data in certain circumstances, such as when it&apos;s no longer needed for the purposes for which it was collected.
        </p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="right-3">
      <AccordionTrigger>Objection and Restriction</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          You have the right to object to the processing of your personal data and to request that we restrict processing in certain circumstances.
        </p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="right-4">
      <AccordionTrigger>Withdraw Consent</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          Where we process your data based on consent, you have the right to withdraw that consent at any time.
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  <p className="text-muted-foreground mt-4">
    To exercise these rights, please contact us using the information provided at the end of this policy.
  </p>
</section>

<Separator />

{/* Cookies and Tracking */}
<section id="cookies">
  <div className="flex items-center gap-2 mb-4">
    <Clock className="h-5 w-5 text-primary" />
    <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
  </div>
  
  <Alert className="mb-4 bg-primary/5">
    <AlertTitle className="text-primary">Cookie Notice</AlertTitle>
    <AlertDescription>
      Our website uses cookies to enhance your browsing experience.
    </AlertDescription>
  </Alert>
  
  <Tabs defaultValue="essential" className="mt-6">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="essential">Essential</TabsTrigger>
      <TabsTrigger value="functional">Functional</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
    </TabsList>
    <TabsContent value="essential" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
      <p className="text-muted-foreground">
        These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.
      </p>
    </TabsContent>
    <TabsContent value="functional" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Functional Cookies</h3>
      <p className="text-muted-foreground">
        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.
      </p>
    </TabsContent>
    <TabsContent value="analytics" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
      <p className="text-muted-foreground">
        These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.
      </p>
    </TabsContent>
  </Tabs>
</section>

<Separator />

{/* Children's Privacy */}
<section id="children">
  <div className="flex items-center gap-2 mb-4">
    <Shield className="h-5 w-5 text-primary" />
    <h2 className="text-2xl font-semibold">Children&apos;s Privacy</h2>
  </div>
  <Card className="bg-primary/5 border-primary/20">
    <CardContent className="pt-6">
      <p className="text-muted-foreground">
        Our Service is not intended for use by children under the age of 18. We do not knowingly collect 
        personal information from children. If you are a parent or guardian and you believe your child has 
        provided us with personal information, please contact us immediately. If we become aware that we 
        have collected personal data from children without verification of parental consent, we take steps 
        to remove that information from our servers.
      </p>
    </CardContent>
  </Card>
</section>

<Separator />

{/* Changes to Policy */}
<section id="changes">
  <div className="flex items-center gap-2 mb-4">
    <Info className="h-5 w-5 text-primary" />
    <h2 className="text-2xl font-semibold">Changes to Policy</h2>
  </div>
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="changes-1">
      <AccordionTrigger>Policy Updates</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
          new Privacy Policy on this page and updating the Last Updated date.
        </p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="changes-2">
      <AccordionTrigger>Notification of Changes</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">
          Significant changes will be communicated to you directly, such as through an email notification. 
          Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</section>

              <section id="contact">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Contact Us</h2>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-medium">Vakeel.ai</p>
                      <p className="text-muted-foreground">Email: privacy@vakeel.ai.com</p>
                      <p className="text-muted-foreground">VIT University, Vellore </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between items-center">
              <Badge variant="outline" className="text-xs">Last Updated: March 27, 2025</Badge>
              <Link href="#" className="text-sm text-primary hover:underline">Back to top</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}