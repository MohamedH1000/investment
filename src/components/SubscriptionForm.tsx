
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionFormProps {
  onSuccess: (subscriberId: string, paymentMethod: string) => void;
}

const SubscriptionForm = ({ onSuccess }: SubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    promotionalConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (paymentMethod: 'stripe' | 'paypal') => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insert subscriber data
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          promotional_consent: formData.promotionalConsent,
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (subscriberError) {
        console.error('Error inserting subscriber:', subscriberError);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حفظ بياناتك. يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
        return;
      }

      // Send notification email to owner
      const { error: emailError } = await supabase.functions.invoke('send-owner-notification', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          promotionalConsent: formData.promotionalConsent,
          paymentMethod: paymentMethod,
          subscriberId: subscriber.id,
        }
      });

      if (emailError) {
        console.error('Error sending owner notification:', emailError);
      }

      onSuccess(subscriber.id, paymentMethod);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[#2C3E50]">
          معلومات الاشتراك
        </CardTitle>
        <CardDescription className="text-center">
          يرجى ملء بياناتك قبل المتابعة للدفع
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">الاسم الأول *</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="أدخل اسمك الأول"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">اسم العائلة *</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="أدخل اسم عائلتك"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="promotionalConsent"
            checked={formData.promotionalConsent}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, promotionalConsent: checked as boolean })
            }
          />
          <Label htmlFor="promotionalConsent" className="text-sm">
            أوافق على تلقي رسائل بريد إلكتروني ترويجية وتحديثات حول الدورات والعروض الخاصة
          </Label>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={() => handleSubmit('stripe')}
            disabled={isLoading}
            className="w-full bg-[#F39C12] hover:bg-[#e67e22] text-white"
          >
            {isLoading ? "جارٍ المعالجة..." : "الدفع عبر Stripe"}
          </Button>
          
          <Button
            onClick={() => handleSubmit('paypal')}
            disabled={isLoading}
            variant="outline"
            className="w-full border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
          >
            {isLoading ? "جارٍ المعالجة..." : "الدفع عبر PayPal"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionForm;
