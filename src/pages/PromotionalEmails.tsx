import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Users, Send, LogOut, Eye, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PromotionalEmails = () => {
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });
  const [subscribers, setSubscribers] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    consentedSubscribers: 0,
  });
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Rich text editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background'
  ];

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
      fetchEmailHistory();
    }
  }, [isAuthenticated]);

  const checkAdminAuth = () => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Session expires after 24 hours
      if (hoursSinceLogin < 24) {
        setIsAuthenticated(true);
        setAdminUser(session);
      } else {
        localStorage.removeItem('adminSession');
        navigate('/admin-login');
      }
    } else {
      navigate('/admin-login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate('/admin-login');
  };

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
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-promotional-email', {
        body: {
          subject: emailData.subject,
          content: emailData.content,
        }
      });

      if (emailError) {
        throw emailError;
      }

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">
              إدارة الرسائل الترويجية
            </h1>
            <p className="text-lg text-gray-600">
              إرسال رسائل ترويجية للمشتركين الموافقين
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              مرحباً، {adminUser?.username}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
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
          {/* Enhanced Email Composer */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>إنشاء رسالة ترويجية جديدة</CardTitle>
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
                <Label>محتوى الرسالة</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      المحرر المتقدم
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      معاينة
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      HTML
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="space-y-2">
                    <div className="border rounded-md" style={{ direction: 'ltr' }}>
                      <ReactQuill
                        theme="snow"
                        value={emailData.content}
                        onChange={(content) => setEmailData({ ...emailData, content })}
                        modules={modules}
                        formats={formats}
                        style={{ minHeight: '200px' }}
                        placeholder="أدخل محتوى الرسالة هنا..."
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      يمكنك استخدام <code>{'{{firstName}}'}</code> لإدراج اسم المشترك
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="space-y-2">
                    <div 
                      className="border rounded-md p-4 min-h-[200px] bg-white"
                      dangerouslySetInnerHTML={{ 
                        __html: emailData.content.replace('{{firstName}}', 'أحمد (مثال)') 
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="html" className="space-y-2">
                    <textarea
                      className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                      value={emailData.content}
                      onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                      placeholder="أدخل كود HTML هنا..."
                    />
                  </TabsContent>
                </Tabs>
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
                  <TableHead>معاينة المحتوى</TableHead>
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Show content preview in a dialog or modal
                          const preview = window.open('', '_blank');
                          if (preview) {
                            preview.document.write(`
                              <html dir="rtl">
                                <head>
                                  <title>معاينة الرسالة: ${email.subject}</title>
                                  <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    h1 { color: #2C3E50; }
                                  </style>
                                </head>
                                <body>
                                  <h1>${email.subject}</h1>
                                  <div>${email.content}</div>
                                </body>
                              </html>
                            `);
                            preview.document.close();
                          }
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
