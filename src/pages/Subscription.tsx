import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .update({
          promotional_consent: true,
        })
        .eq("email", email);
      toast({
        title: "تم الاشتراك!",
        description: `تم الاشتراك بالبريد الإلكتروني ${email}`,
        variant: "default",
      });
    } catch (error) {
      console.log("error", error);
    }

    setEmail("");
  };

  const handleUnsubscribe = async () => {
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .update({
          promotional_consent: false,
        })
        .eq("email", email);
      toast({
        title: "تم إلغاء الاشتراك!",
        description: `تم إلغاء الاشتراك للبريد الإلكتروني ${email}`,
        variant: "destructive",
      });
      setEmail("");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-12"
    >
      <h1 className="text-3xl font-bold mb-2 text-gray-800">البريد الترويجي</h1>
      <p className="mb-6 text-gray-500 text-center">
        اشترك ليصلك أحدث العروض والتحديثات. يمكنك إلغاء الاشتراك في أي وقت.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubscribe();
        }}
        className="w-full flex flex-col gap-4"
      >
        <Input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <Button type="submit" className="w-full">
            اشتراك
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleUnsubscribe}
            disabled={!email}
          >
            إلغاء الاشتراك
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Subscription;
