
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Users, Send } from "lucide-react";

const PromotionalEmails = () => {
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });
  const [subscribers, setSubscribers] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    consentedSubscribers: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
    fetchEmailHistory();
  }, []);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return;
    }

    setSubscribers(data || []);
    setStats({
      totalSubscribers: data?.length || 0,
      consentedSubscribers: data?.filter(sub => sub.promotional_consent)?.length || 0,
    });
  };

  const fetchEmailHistory = async () => {
    const { data, error } = await supabase
      .from('promotional_emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email history:', error);
      return;
    }

    setEmailHistory(data || []);
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.content) {
      toast({
        title: "خطأ",
        description: "يرجى ملء موضوع الرسالة والمحتوى",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send promotional email
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-promotional-email', {
        body: {
          subject: emailData.subject,
          content: emailData.content,
        }
      });

      if (emailError) {
        throw emailError;
      }

      // Record the email in database
      const { error: recordError } = await supabase
        .from('promotional_emails')
        .insert({
          subject: emailData.subject,
          content: emailData.content,
          sent_to_count: stats.consentedSubscribers,
        });

      if (recordError) {
        console.error('Error recording email:', recordError);
      }

      toast({
        title: "تم الإرسال بنجاح",
        description: `تم إرسال الرسالة إلى ${stats.consentedSubscribers} مشترك`,
      });

      setEmailData({ subject: "", content: "" });
      fetchEmailHistory();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">
            إدارة الرسائل الترويجية
          </h1>
          <p className="text-lg text-gray-600">
            إرسال رسائل ترويجية للمشتركين الموافقين
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المشتركين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">موافقين على الرسائل</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#27AE60]">{stats.consentedSubscribers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رسائل مرسلة</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emailHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Send Email Form */}
          <Card>
            <CardHeader>
              <CardTitle>إرسال رسالة ترويجية جديدة</CardTitle>
              <CardDescription>
                ستُرسل هذه الرسالة إلى {stats.consentedSubscribers} مشترك موافق فقط
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">موضوع الرسالة</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="أدخل موضوع الرسالة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">محتوى الرسالة</Label>
                <Textarea
                  id="content"
                  value={emailData.content}
                  onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                  placeholder="أدخل محتوى الرسالة..."
                  rows={6}
                />
              </div>

              <Button
                onClick={handleSendEmail}
                disabled={isLoading || stats.consentedSubscribers === 0}
                className="w-full bg-[#27AE60] hover:bg-[#229954]"
              >
                {isLoading ? "جارٍ الإرسال..." : `إرسال إلى ${stats.consentedSubscribers} مشترك`}
              </Button>
            </CardContent>
          </Card>

          {/* Subscribers List */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المشتركين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الموافقة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber: any) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          {subscriber.first_name} {subscriber.last_name}
                        </TableCell>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={subscriber.promotional_consent ? "default" : "secondary"}
                            className={subscriber.promotional_consent ? "bg-[#27AE60]" : ""}
                          >
                            {subscriber.promotional_consent ? "موافق" : "غير موافق"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email History */}
        <Card>
          <CardHeader>
            <CardTitle>تاريخ الرسائل المرسلة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>عدد المستلمين</TableHead>
                  <TableHead>تاريخ الإرسال</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailHistory.map((email: any) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.subject}</TableCell>
                    <TableCell>{email.sent_to_count}</TableCell>
                    <TableCell>
                      {new Date(email.created_at).toLocaleDateString('ar-EG')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionalEmails;
