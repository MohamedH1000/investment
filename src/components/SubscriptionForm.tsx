
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Building2 } from "lucide-react";

interface SubscriptionFormProps {
  onSuccess: (subscriberId: string, paymentMethod: string) => void;
}

const SubscriptionForm = ({ onSuccess }: SubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    promotionalConsent: false,
    paymentMethod: "stripe",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Check if subscriber exists and update, or insert new subscriber
      const { data: existingSubscriber } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', formData.email)
        .single();

      let subscriberId;

      if (existingSubscriber) {
        // Update existing subscriber
        const { data: updatedSubscriber, error: updateError } = await supabase
          .from('subscribers')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            promotional_consent: formData.promotionalConsent,
            payment_method: formData.paymentMethod,
            updated_at: new Date().toISOString(),
          })
          .eq('email', formData.email)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        subscriberId = updatedSubscriber.id;
        console.log('Updated existing subscriber:', subscriberId);
      } else {
        // Insert new subscriber
        const { data: newSubscriber, error: insertError } = await supabase
          .from('subscribers')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            promotional_consent: formData.promotionalConsent,
            payment_method: formData.paymentMethod,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        subscriberId = newSubscriber.id;
        console.log('Created new subscriber:', subscriberId);
      }

      // Send owner notification
      const { error: notificationError } = await supabase.functions.invoke('send-owner-notification', {
        body: {
          subscriberDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            promotionalConsent: formData.promotionalConsent,
            paymentMethod: formData.paymentMethod,
            subscriberId: subscriberId,
            timestamp: new Date().toISOString(),
          }
        }
      });

      if (notificationError) {
        console.error('Error sending owner notification:', notificationError);
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: "سيتم توجيهك إلى صفحة الدفع",
      });

      // Call the success callback with subscriber ID and payment method
      onSuccess(subscriberId, formData.paymentMethod);

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#2C3E50]">
          تسجيل الاشتراك
        </CardTitle>
        <CardDescription>
          يرجى ملء بياناتك للمتابعة إلى الدفع
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="lastName">الاسم الأخير *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="أدخل اسمك الأخير"
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

          <div className="space-y-4">
            <Label>طريقة الدفع *</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-5 h-5 text-[#635BFF]" />
                  الدفع بالبطاقة الائتمانية (Stripe)
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="w-5 h-5 text-[#0070BA]" />
                  الدفع عبر PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-start space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="promotionalConsent"
              checked={formData.promotionalConsent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, promotionalConsent: !!checked })
              }
              className="mt-1"
            />
            <Label htmlFor="promotionalConsent" className="text-sm leading-relaxed cursor-pointer">
              <span className="font-medium text-[#2C3E50]">موافقة على تلقي الرسائل الترويجية</span>
              <br />
              <span className="text-gray-600">
                أوافق على تلقي رسائل إلكترونية ترويجية وتحديثات حول البرنامج التدريبي والعروض الخاصة. 
                يمكنني إلغاء الاشتراك في أي وقت.
              </span>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F39C12] hover:bg-[#e67e22] text-white py-6 text-lg"
          >
            {isLoading ? "جارٍ التسجيل..." : "المتابعة إلى الدفع"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionForm;
