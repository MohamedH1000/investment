import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Video,
  Play,
} from "lucide-react";
import SubscriptionForm from "@/components/SubscriptionForm";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscriptionSuccess = (subscriberId: string, paymentMethod: string) => {
    // Redirect to appropriate payment page based on method
    if (paymentMethod === 'stripe') {
      window.open("https://buy.stripe.com/cNifZgbBz9Hoetr8Jhfbq04", "_blank");
    } else if (paymentMethod === 'paypal') {
      window.open("https://www.paypal.com/ncp/payment/9B5QFENVS29PW", "_blank");
    }
    
    // Hide the form after successful submission
    setShowSubscriptionForm(false);
  };

  const handlePaymentClick = () => {
    setShowSubscriptionForm(true);
  };

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "تدريب عملي أسبوعي مباشر",
      description: "جلسة أسبوعية لمدة شهر",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "فيديوهات مسجلة",
      description: "قصيرة ومركزة لتشاهدها وقتما تشاء",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "أدوات تحليل احترافية",
      description: "مستعملة من كبار المستثمرين",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "خطة استثمارية مخصصة",
      description: "مصممة خصيصاً لك حسب أهدافك",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "مجتمع مغلق ومميز",
      description: "متابعة وإجابة على أسئلتك",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "شهادة شكر وتقدير",
      description: "تثبت اجتيازك لمستوى متقدم",
    },
  ];

  const targetAudience = [
    "لم تستثمر من قبل وتخشى أن تخطئ",
    "بدأت الاستثمار لكنك تشعر بالحيرة والارتباك",
    "تريد بناء خطة مالية ذكية تستمر على المدى الطويل",
    "لا تملك الوقت لمراقبة السوق بشكل يومي",
    "ترغب في فهم أدوات التحليل المالي وتقييم الشركات بنفسك",
  ];

  const testimonials = [
    {
      name: "محمد.س – السعودية",
      text: "كنت خائف من الاستثمار، لكن بعد هذا البرنامج، امتلكت أول سهم وأنا واثق ومتحمس.",
    },
    {
      name: "لينا.ك – السويد",
      text: "أكتر شي حبيته هو كيف البرنامج بيخليك تفكر كمستثمر حقيقي، مش بس متلقي للمعلومة.",
    },
  ];

  const faqs = [
    {
      question: "هل أحتاج خلفية مالية أو خبرة؟",
      answer: "لا. البرنامج مصمم للمبتدئين تماماً.",
    },
    {
      question: "هل سأحصل على دعم بعد انتهاء الدورة؟",
      answer: "نعم، تحصل على دخول دائم لمجتمع مغلق فيه متابعة مستمرة.",
    },
    {
      question: "ما هي سياسة الاسترداد؟",
      answer:
        "لضمان الجودة يمكن طلب استرداد المبلغ أول ٧ أيام من بدء البرنامج بحال عدم الرضا",
    },
  ];
  const videoUrls = [
    "https://wvkdgbletxpjgqlowyjw.supabase.co/storage/v1/object/sign/investment/vedios/WhatsApp%20Video%202025-05-28%20at%2018.08.21_331d3dda.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2Q2OTQ4NDFjLTA4ZTMtNGViNC1hMzk3LWIwODdjY2I2ZGQxNSJ9.eyJ1cmwiOiJpbnZlc3RtZW50L3ZlZGlvcy9XaGF0c0FwcCBWaWRlbyAyMDI1LTA1LTI4IGF0IDE4LjA4LjIxXzMzMWQzZGRhLm1wNCIsImlhdCI6MTc0ODQ2ODAzOCwiZXhwIjo0MzQwNDY4MDM4fQ.SV-twryJUsOax0qzRGnnZ4-ROYQIjbftAtvcjza2iho",
    "https://wvkdgbletxpjgqlowyjw.supabase.co/storage/v1/object/sign/investment/vedios/WhatsApp%20Video%202025-05-28%20at%2018.09.14_ee9e9977.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2Q2OTQ4NDFjLTA4ZTMtNGViNC1hMzk3LWIwODdjY2I2ZGQxNSJ9.eyJ1cmwiOiJpbnZlc3RtZW50L3ZlZGlvcy9XaGF0c0FwcCBWaWRlbyAyMDI1LTA1LTI4IGF0IDE4LjA5LjE0X2VlOWU5OTc3Lm1wNCIsImlhdCI6MTc0ODQ2ODA1NCwiZXhwIjo0MzQwNDY4MDU0fQ.vypTsAWFPA4A1nOBp2PWSVilT6W9G4WNzjJbq0dZ2xA",
    "https://wvkdgbletxpjgqlowyjw.supabase.co/storage/v1/object/sign/investment/vedios/WhatsApp%20Video%202025-05-28%20at%2018.09.40_c3765000.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2Q2OTQ4NDFjLTA4ZTMtNGViNC1hMzk3LWIwODdjY2I2ZGQxNSJ9.eyJ1cmwiOiJpbnZlc3RtZW50L3ZlZGlvcy9XaGF0c0FwcCBWaWRlbyAyMDI1LTA1LTI4IGF0IDE4LjA5LjQwX2MzNzY1MDAwLm1wNCIsImlhdCI6MTc0ODQ2ODA2NCwiZXhwIjo0MzQwNDY4MDY0fQ.xSwNgQoUW0g4p7sEydCSxbjyaihpjtENcaozDBJyoBE",
    "https://raniminvesting.com/wp-content/uploads/2025/01/WhatsApp-Video-2025-01-06-at-11.49.31_f5787cf5.mp4",
  ];

  if (showSubscriptionForm) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <button
              onClick={() => setShowSubscriptionForm(false)}
              className="text-[#2C3E50] hover:text-[#F39C12] mb-4"
            >
              ← العودة للصفحة الرئيسية
            </button>
          </div>
          <SubscriptionForm onSuccess={handleSubscriptionSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-right" dir="rtl">
      {/* Hero Section */}
      <section className="bg-[#BAB86C] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight">
                هل حان الوقت لتتوقف عن مراقبة السوق… وتبدأ ببناء ثروتك بثقة؟
              </h1>
              <p className="text-xl text-[#333333] leading-relaxed">
                برنامج تدريبي عملي – يقودك من مبتدئ خائف… إلى مستثمر ذكي وواعٍ.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={handlePaymentClick}
                  className="bg-[#F39C12] hover:bg-[#e67e22] text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  احجز مقعدك الآن
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/02d81fa5-6fac-4f0d-83d7-827f32183855.png"
                alt="Investment Success"
                className="w-full h-auto rounded-lg shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Hook Section */}
      <section className="bg-[#F7F7F7] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#333333] mb-8">
              دعنا نكون صادقين…
            </h2>
            <div className="text-lg text-[#333333] leading-relaxed space-y-4">
              <p>
                كم مرة شعرت أن الاستثمار في الأسهم أمر معقد، محفوف بالمخاطر،
                ومخصص فقط لـ "الخبراء"؟
              </p>
              <p>وكم مرة راقبت السوق، وقلت في نفسك:</p>
              <div className="bg-white p-6 rounded-lg shadow-md my-8">
                <div className="space-y-2 text-[#2C3E50] font-medium">
                  <p>"ياليتني دخلت من قبل…"</p>
                  <p>"بس هلأ الوقت مو مناسب"</p>
                  <p>"شو لو خسرت؟"</p>
                </div>
              </div>
              <div className="text-xl font-bold text-[#27AE60]">
                <p>الحقيقة؟</p>
                <p>الزمن لا ينتظر أحد.</p>
                <p>والمال لا يحترم من لا يحسن إدارته.</p>
              </div>
              <p className="text-xl text-[#F39C12] font-bold">
                👣 ماذا لو أخبرتك أن هناك طريقة لفهم الاستثمار من جذوره؟
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Title */}
      <section className="bg-[#1A237E] py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white leading-tight">
            أهلاً بك في البرنامج التدريبي للاستثمار طويل الأمد:
          </h2>
          <p className="text-xl text-white mt-6 opacity-90">
            البرنامج الذي لا يُعلّمك فقط كيف تستثمر… بل يغيّر طريقتك في التفكير
            بالمال بالكامل.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#f7f7f7] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2C3E50] text-center mb-12">
            ما الذي ستحصل عليه داخل البرنامج؟
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-[#9dc5e2] hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 text-[#27AE60] group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-[#2C3E50] text-lg">
                    ✅ {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#333333] text-center">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-8">
                لمن هذا البرنامج؟
              </h2>
              <p className="text-lg text-[#333333] mb-6">
                هذا البرنامج مناسب لك إذا كنت:
              </p>
              <div className="space-y-4">
                {targetAudience.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-6 h-6 text-[#27AE60] flex-shrink-0 mt-1" />
                    <p className="text-[#333333]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/8f699177-c1cf-466f-af24-da7579ed1c28.png"
                alt="Team Collaboration"
                className="w-full h-auto rounded-lg shadow-xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="bg-[#ECF0F1] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💡</div>
            <h2 className="text-3xl font-bold text-[#1A237E] mb-6">
              لماذا هذا البرنامج مختلف؟
            </h2>
            <div className="space-y-4 text-lg text-[#333333] leading-relaxed">
              <p className="font-bold">أنا لا أعلّمك من الكتب.</p>
              <p>
                أنا أشاركك خلاصة سنوات من التجربة، الخسارات، الأرباح، والنجاحات…
              </p>
              <p className="font-bold text-[#2C3E50]">
                هذا ليس برنامجاً نظرياً.
              </p>
              <p>
                بل نظام عملي متكامل مبني على استراتيجيات استثمار عالمية – مثل
                التي يتبعها وارن بافت وجاك بوجل – ومطوّع ليناسب واقعنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
                قصتي مع الاستثمار – لماذا أنشأت هذا البرنامج؟
              </h2>
              <div className="bg-[#F7F7F7] p-6 rounded-lg border-r-4 border-[#27AE60]">
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  كنت شابة طموحة لدي عقبات مالية وأحلام كبيرة اعتبرها شبه
                  مستحيلة..
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  لكن حين فهمت قواعد المال… تغير كل شيء.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  اليوم، أمتلك أصولًا تدرّ عليّ دخلاً سلبياً، وأساعد مئات
                  الأشخاص على الخروج من دوامة الديون إلى طريق الحرية المالية.
                  أساعد أهلي وعائلتي وأقدم الإلهام لجميع من حولي ✨
                </p>
                <p className="text-lg font-bold text-[#27AE60]">
                  وهذا البرنامج هو طريقتي لمشاركة هذا الطريق معك.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/bf6934e5-4689-4221-99c8-a311ddb78e36.png"
                alt="Success Story"
                className="w-full h-auto rounded-lg shadow-xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-[#1A237E] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-3xl font-bold text-[#1A237E] mb-6">
              هل أنت مستعد لتستثمر في حريتك المالية؟
            </h2>
            <h2 className="text-3xl font-bold text-[#F39C12] mb-6">
              استثمار واحد، يغيّر طريقة تعاملك مع المال إلى الأبد
            </h2>
            <div className="space-y-6">
              <div className="text-2xl text-[#333333] max-md:hidden">
                💰 السعر الكامل للبرنامج:
                <span className="text-4xl font-bold text-[#27AE60] mx-2">
                  888 دولار
                </span>
              </div>
              <div className="text-2xl text-[#333333] md:hidden">
                💰 السعر:
                <span className="text-4xl font-bold text-[#27AE60] mx-2">
                  888 دولار
                </span>
              </div>
              <div className="text-lg text-[#333333]">
                🎁 احجز الآن لتحصل على:
              </div>
              <ul className="text-right space-y-2 text-[#333333] max-w-md mx-auto">
                <li>• دخول مؤكد للبرنامج (المقاعد محدودة جدًا)</li>
                <li>• كتّيب مجاني لوضع خطة مالية متكاملة</li>
              </ul>
              <div className="flex gap-4 justify-center flex-wrap mt-8">
                <Button
                  onClick={handlePaymentClick}
                  className="bg-[#F39C12] hover:bg-[#e67e22] text-white px-12 py-6 text-xl rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  احجز الآن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-[#F7F7F7] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2C3E50] text-center mb-12">
            آراء العملاء
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Empty video placeholder blocks */}
            {videoUrls.map((url, index) => (
              <Card
                key={index}
                className="bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-50 transition-colors">
                    <div className="text-center text-gray-500 w-full">
                      <video
                        src={url}
                        controls
                        className="w-full h-[200px] object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Text Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <p className="text-[#333333] text-lg mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <p className="text-[#27AE60] font-bold">
                    — {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F39C12] py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            الفرص لا تتكرر… ولا تنتظر.
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            إذا كنت مستعداً لتأخذ أول خطوة نحو حرية مالية حقيقية – فهذا هو وقتك.
          </p>
          <div className="text-3xl mb-6">👇👇👇</div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={handlePaymentClick}
              className="bg-white text-[#F39C12] hover:bg-gray-100 px-12 py-6 text-xl rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg font-bold"
            >
              🔶 احجز مقعدك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-6 rounded-lg border-r-4 border-red-500">
            <div className="text-2xl mb-2">🚨</div>
            <p className="text-[#333333] font-bold">
              المقاعد محدودة لضمان التفاعل والمتابعة الشخصية لكل مشترك.
            </p>
            <p className="text-[#333333]">
              عند اكتمال العدد، سيتم إغلاق التسجيل فوراً.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2C3E50] text-center mb-12">
            الأسئلة الشائعة
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#F7F7F7] rounded-lg px-6 border-none"
              >
                <AccordionTrigger className="text-[#2C3E50] font-bold text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#333333] text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#27AE60] py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            ابدأ رحلتك نحو الحرية المالية اليوم
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={handlePaymentClick}
              className="bg-[#F39C12] hover:bg-[#e67e22] text-white px-12 py-6 text-xl rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              احجز الآن
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
