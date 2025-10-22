export interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  buttonIndex: number;
  image?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  questions: Question[];
}

export const categories: Category[] = [
  {
    id: 1,
    name: "الكويت",
    description: "أسئلة عن دولة الكويت",
    image: "https://i.postimg.cc/7LPp1J1x/kuwait.webp",
    questions: []
  },
  {
    id: 2,
    name: "معلومات عامة",
    description: "أسئلة متنوعة في مجالات مختلفة",
    image: "https://i.postimg.cc/QCCsqHcZ/general.webp",
    questions: []
  },
  {
    id: 3,
    name: "تاريخ",
    description: "أسئلة عن التاريخ العربي والإسلامي",
    image: "https://i.postimg.cc/d3wpsYQK/history.webp",
    questions: []
  },
  {
    id: 4,
    name: "جغرافيا",
    description: "أسئلة عن الجغرافيا العالمية",
    image: "https://i.postimg.cc/Jn1GDhxF/geography.webp",
    questions: []
  },
  {
    id: 5,
    name: "أعلام دول",
    description: "أسئلة عن أعلام الدول",
    image: "https://i.postimg.cc/5tZ70WJq/flagicon.webp",
    questions: []
  },
  {
    id: 6,
    name: "شعارات",
    description: "أسئلة عن شعارات الشركات والعلامات التجارية",
    image: "https://i.postimg.cc/RZPvRHhg/brands.webp",
    questions: []
  },
  {
    id: 7,
    name: "منتجات كويتية",
    description: "أسئلة عن المنتجات والعلامات التجارية الكويتية",
    image: "https://i.postimg.cc/8zXKXVK4/kuwaitproducts.webp",
    questions: []
  },
  {
    id: 8,
    name: "إسلامي",
    description: "أسئلة عن الدين الإسلامي",
    image: "https://i.postimg.cc/T1LTkFdg/islamic.webp",
    questions: []
  },
  {
    id: 9,
    name: "القرآن",
    description: "أسئلة عن القرآن الكريم",
    image: "https://i.postimg.cc/qRHXDRZM/quran.webp",
    questions: []
  },
  {
    id: 10,
    name: "دول وعواصم",
    description: "أسئلة عن دول العالم وعواصمها",
    image: "https://i.postimg.cc/QdP7nxJ4/capitals.webp",
    questions: []
  },
  {
    id: 11,
    name: "الدوري الكويتي",
    description: "أسئلة عن الدوري الكويتي لكرة القدم",
    image: "https://i.postimg.cc/8PJxwJ3H/kpl.webp",
    questions: []
  },
  {
    id: 12,
    name: "شعارات كروية",
    description: "أسئلة عن شعارات الأندية الرياضية",
    image: "https://i.postimg.cc/RVxm0xh7/clublogos.webp",
    questions: []
  },
  {
    id: 13,
    name: "العاب الفيديو",
    description: "أسئلة عن ألعاب الفيديو",
    image: "https://i.postimg.cc/QdZj5W2M/videogames.webp",
    questions: []
  },
  {
    id: 14,
    name: "كرة قدم عالمية",
    description: "أسئلة عن كرة القدم العالمية",
    image: "https://i.postimg.cc/ZRwzdKPx/worldfootball.webp",
    questions: []
  },
  {
    id: 15,
    name: "كأس الخليج",
    description: "أسئلة عن بطولة كأس الخليج العربي",
    image: "https://i.postimg.cc/GpVm8XTy/gulfcup.webp",
    questions: []
  },
  {
    id: 16,
    name: "فورتنايت",
    description: "أسئلة عن لعبة فورتنايت",
    image: "https://i.postimg.cc/KvdVb7Rw/fortnite.webp",
    questions: []
  },
  {
    id: 17,
    name: "فيفا 25",
    description: "أسئلة عن لعبة فيفا 25",
    image: "https://i.postimg.cc/MpQCfPCz/fifa25.webp",
    questions: []
  },
  {
    id: 18,
    name: "باب الحارة",
    description: "أسئلة عن مسلسل باب الحارة",
    image: "https://i.postimg.cc/bJ9xj7wv/bab7arah.webp",
    questions: []
  },
  {
    id: 19,
    name: "ميك اب",
    description: "أسئلة عن عالم المكياج ومستحضرات التجميل",
    image: "https://i.postimg.cc/jqFVf2Tt/makeup.webp",
    questions: []
  },
  {
    id: 20,
    name: "مبتعثين امريكا",
    description: "أسئلة عن الدراسة والحياة في الولايات المتحدة",
    image: "https://i.postimg.cc/pXJ6Zdbm/usdkwt.webp",
    questions: []
  },
  {
    id: 21,
    name: "مبتعثين بريطانيا",
    description: "أسئلة عن الدراسة والحياة في المملكة المتحدة",
    image: "https://i.postimg.cc/JzmtfP2T/ukkwt.webp",
    questions: []
  },
  {
    id: 22,
    name: "السعودية",
    description: "أسئلة عن المملكة العربية السعودية وتاريخها",
    image: "https://i.postimg.cc/VNJwptmG/ksa.webp",
    questions: []
  },
  {
    id: 23,
    name: "قطر",
    description: "أسئلة عن دولة قطر",
    image: "https://i.postimg.cc/T29sjwXp/qtr.webp",
    questions: []
  },
  {
    id: 24,
    name: "أهل البر",
    description: "أسئلة عن التخييم في البر",
    image: "https://i.postimg.cc/NFz7NZ4P/brcamp.webp",
    questions: []
  },
  {
    id: 25,
    name: "بنات وبس",
    description: "أسئلة متنوعة تهم البنات في مختلف المجالات",
    image: "https://i.postimg.cc/fbs0CHMj/girls.webp",
    questions: []
  },
  {
    id: 26,
    name: "أغاني",
    description: "أسئلة عن الأغاني والفنانين وتاريخ الموسيقى",
    image: "https://i.postimg.cc/h4d884QV/psongs.webp",
    questions: []
  },
  {
    id: 2,
    name: "تاريخ",
    description: "أسئلة عن تاريخ العالم وتاريخ الحضارات",
    image: "https://i.postimg.cc/yxjR3cMX/history.webp",
    questions: [
      {
        id: 1,
        text: "متى بدأت الحرب العالمية الأولى؟",
        correctAnswer: "1914",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو مكتشف أمريكا؟",
        correctAnswer: "كريستوفر كولومبوس",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "في أي غزوة نزل الملائكة؟",
        correctAnswer: "غزوة بدر",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "من هو مؤسس الدولة العباسية؟",
        correctAnswer: "أبو العباس السفاح",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "متى تم توحيد المملكة العربية السعودية؟",
        correctAnswer: "1932",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "من هو القائد الذي فتح مصر؟",
        correctAnswer: "عمرو بن العاص",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 1,
    name: "التاريخ الإسلامي",
    description: "أسئلة عن التاريخ الإسلامي",
    image: "/images/islamic-history.jpg",
    questions: [
      {
        id: 1,
        text: "متى كانت غزوة بدر؟",
        correctAnswer: "17 رمضان من السنة الثانية للهجرة",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو أول من أسلم من الصبيان؟",
        correctAnswer: "علي بن أبي طالب رضي الله عنه",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي المعركة التي قُتل فيها حمزة بن عبد المطلب رضي الله عنه؟",
        correctAnswer: "معركة أُحد",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "كم استمرت الخلافة الراشدة؟",
        correctAnswer: "30 عاماً",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هي السنة التي سميت بعام الحزن؟ ولماذا؟",
        correctAnswer: "العام العاشر من البعثة، لوفاة أبي طالب وخديجة رضي الله عنها",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "من هو القائد المسلم الذي فتح الأندلس؟",
        correctAnswer: "طارق بن زياد",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 2,
    name: "معلومات عامة",
    description: "أسئلة عامة",
    image: "/images/general-knowledge.jpg",
    questions: [
      {
        id: 1,
        text: "ما هو أكبر محيط في العالم؟",
        correctAnswer: "المحيط الهادئ",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "كم عدد القارات في العالم؟",
        correctAnswer: "7 قارات",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي أكبر صحراء في العالم؟",
        correctAnswer: "الصحراء الكبرى",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هو أطول نهر في العالم؟",
        correctAnswer: "نهر النيل",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هي أكبر دولة في العالم من حيث المساحة؟",
        correctAnswer: "روسيا",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "كم عدد العظام في جسم الإنسان؟",
        correctAnswer: "206 عظمة",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 3,
    name: "الكويت",
    description: "أسئلة عن الكويت",
    image: "/images/kuwait.jpg",
    questions: [
      {
        id: 1,
        text: "متى حصلت الكويت على استقلالها؟",
        correctAnswer: "19 يونيو 1961",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هو أشهر برج في الكويت؟",
        correctAnswer: "Kuwait Towers",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "في أي سنة تم اكتشاف النفط في الكويت؟",
        correctAnswer: "1979",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هو ارتفاع برج الكويت؟",
        correctAnswer: "187 متر",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هو أشهر مسجد في الكويت؟",
        correctAnswer: "مسجد ابن بحر",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "في أي سنة تم تأسيس الكويت؟",
        correctAnswer: "1920",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 4,
    name: "إسلامي",
    description: "أسئلة عن الإسلام وتراثه",
    image: "https://i.postimg.cc/pTqVDCdT/islamicicon.webp",
    questions: [
      {
        id: 1,
        text: "كم عدد أركان الإسلام؟",
        correctAnswer: "5",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو أول من أسلم من الصبيان؟",
        correctAnswer: "علي بن أبي طالب",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "في أي غزوة نزل الملائكة؟",
        correctAnswer: "غزوة بدر",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "كم عدد أبواب الجنة؟",
        correctAnswer: "8",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "من هو آخر الأنبياء؟",
        correctAnswer: "محمد صلى الله عليه وسلم",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "كم سنة استغرق نزول القرآن الكريم؟",
        correctAnswer: "23 سنة",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 5,
    name: "أعلام",
    description: "أسئلة عن أعلام",
    image: "/images/famous-people.jpg",
    questions: [
      {
        id: 1,
        text: "من هو المؤرخ العربي الشهير؟",
        correctAnswer: "عبد الرحمن بن خلدون",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو عالم الرياضيات والفلك الشهير؟",
        correctAnswer: "الخوارزمي",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "من هو عالم الطب الشهير؟",
        correctAnswer: "ابن النفيس",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "من هو المؤرخ والفيلسوف الشهير؟",
        correctAnswer: "ابن خلدون",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "من هو عالم الفيزياء الشهير؟",
        correctAnswer: "ابن الهيثم",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "من هو عالم الكيمياء الشهير؟",
        correctAnswer: "أبو بكر الرازي",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 6,
    name: "شعارات",
    description: "أسئلة عن شعارات الشركات والمؤسسات",
    image: "https://i.postimg.cc/FzSQqtcC/bdgeega.png",
    questions: [
      {
        id: 1,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "شركة المشروعات السياحية",
        points: 300,
        image: "https://www.tec.com.kw/assets/img/menu-bg-monogram.svg",
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "كي دي كاو",
        points: 300,
        image: "https://i.postimg.cc/c4BtcyrX/kdcow.png",
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "عصير الضاحية",
        points: 500,
        image: "https://i.postimg.cc/02scQsTf/dahya.png",
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "Trolley",
        points: 500,
        image: "https://i.postimg.cc/vTNqpDzM/trolley.png",
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "صحيفة الرأي",
        points: 700,
        image: "https://assets.misbar.com/logos/2024-12/f0fc94ace23331de7996e9eb57b57bc64402d566.jpg",
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما اسم الشركة صاحبة هذا الشعار؟",
        correctAnswer: "محطة وقود ألفا",
        points: 700,
        image: "https://i.postimg.cc/wvGxbcSB/alfa.webp",
        buttonIndex: 5
      }
    ]
  },
  {
    id: 7,
    name: "أمثال كويتية",
    description: "أسئلة عن أمثال كويتية",
    image: "/images/kuwaiti-proverbs.jpg",
    questions: [
      {
        id: 1,
        text: "ما هو معنى المثل 'أشكالها تقع'؟",
        correctAnswer: "أشكالها تقع",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هو معنى المثل 'من لا يقدر قيمة الشيء يضيعه'؟",
        correctAnswer: "من لا يقدر قيمة الشيء يضيعه",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هو معنى المثل 'جاب الغنيمة'؟",
        correctAnswer: "جاب الغنيمة",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هو معنى المثل 'كل شخص له موطنه'؟",
        correctAnswer: "كل شخص له موطنه",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هو معنى المثل 'يتحمل نقره'؟",
        correctAnswer: "يتحمل نقره",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هو معنى المثل 'التمسك بالأرض والوطن'؟",
        correctAnswer: "التمسك بالأرض والوطن",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 8,
    name: "معلومات عامة",
    description: "أسئلة عامة عن مختلف المجالات",
    image: "https://i.postimg.cc/W1T2fxJ3/m3lomaticon.webp",
    questions: [
      {
        id: 1,
        text: "كم عدد أيام السنة الكبيسة؟",
        correctAnswer: "366 يوم",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هو أكبر محيط في العالم؟",
        correctAnswer: "المحيط الهادئ",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي عاصمة اليابان؟",
        correctAnswer: "طوكيو",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "كم عدد العظام في جسم الإنسان؟",
        correctAnswer: "206",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "من هو مخترع المصباح الكهربائي؟",
        correctAnswer: "توماس إديسون",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هو أكبر كوكب في المجموعة الشمسية؟",
        correctAnswer: "المشتري",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 9,
    name: "سيارات",
    description: "أسئلة عن سيارات",
    image: "/images/cars.jpg",
    questions: [
      {
        id: 1,
        text: "ما هي أول سيارة تم اختراعها؟",
        correctAnswer: "مرسيدس بنز باتنت موتورفاجن",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هي أسرع سيارة في العالم؟",
        correctAnswer: "بوغاتي شيرون سوبر سبورت 300+",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "في أي سنة تم إنتاج أول سيارة من نوع Ferrari؟",
        correctAnswer: "1947",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هي أغلى سيارة في العالم؟",
        correctAnswer: "رولز رويس بوت تيل",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "من هو مخترع أول سيارة؟",
        correctAnswer: "كارل بنز",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "في أي سنة تم إنتاج أول سيارة من نوع Porsche؟",
        correctAnswer: "1963",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 10,
    name: "تاريخ",
    description: "أسئلة عن تاريخ العالم وتاريخ الحضارات",
    image: "https://i.postimg.cc/yxjR3cMX/history.webp",
    questions: [
      {
        id: 1,
        text: "متى بدأت الحرب العالمية الأولى؟",
        correctAnswer: "1914",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو مكتشف أمريكا؟",
        correctAnswer: "كريستوفر كولومبوس",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "في أي غزوة نزل الملائكة؟",
        correctAnswer: "غزوة بدر",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "من هو مؤسس الدولة العباسية؟",
        correctAnswer: "أبو العباس السفاح",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "متى تم توحيد المملكة العربية السعودية؟",
        correctAnswer: "1932",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "من هو القائد الذي فتح مصر؟",
        correctAnswer: "عمرو بن العاص",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 11,
    name: "القرآن",
    description: "أسئلة عن القرآن الكريم وتفسيره",
    image: "https://i.postimg.cc/pTqVDCdT/islamicicon.webp",
    questions: [
      {
        id: 1,
        text: "ما هي أطول سورة في القرآن الكريم؟",
        correctAnswer: "سورة البقرة",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هي أقصر سورة في القرآن الكريم؟",
        correctAnswer: "سورة الكوثر",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "كم عدد سور القرآن الكريم؟",
        correctAnswer: "114",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هي السورة التي تسمى قلب القرآن؟",
        correctAnswer: "سورة يس",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هي السورة التي نزلت كاملة؟",
        correctAnswer: "سورة الفاتحة",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هي السورة التي ذكرت فيها البسملة مرتين؟",
        correctAnswer: "سورة النمل",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 12,
    name: "سيارات",
    description: "أسئلة عن السيارات والشركات المصنعة",
    image: "https://i.postimg.cc/ZY6n78Dw/caricon.webp",
    questions: [
      {
        id: 1,
        text: "ما هي أسرع سيارة في العالم؟",
        correctAnswer: "بوغاتي شيرون",
        points: 300,
        image: "https://img.freepik.com/free-vector/blue-sports-car-isolated_1017-30784.jpg",
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هي أول سيارة تم تصنيعها في العالم؟",
        correctAnswer: "بنز باتنت موتورفاجن",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي الشركة المصنعة لسيارة لامبورغيني؟",
        correctAnswer: "فولكس فاجن",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هو لون أول سيارة فيراري؟",
        correctAnswer: "أحمر",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "في أي دولة نشأت شركة هيونداي؟",
        correctAnswer: "كوريا الجنوبية",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هو أول موديل أنتجته شركة تويوتا؟",
        correctAnswer: "تويوتا AA",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 13,
    name: "امثلة والغاز",
    description: "أسئلة عن الأمثال الشعبية والغاز",
    image: "https://i.postimg.cc/VL61vFsN/l8z.webp",
    questions: [
      {
        id: 1,
        text: "اكمل المثل: الطيور على اشكالها...",
        correctAnswer: "تقع",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
        correctAnswer: "الحفرة",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "اكمل المثل: اللي ما يعرف الصقر...",
        correctAnswer: "يشويه",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هو الشيء الذي يرتفع إلى أعلى عندما يمتلئ بالماء؟",
        correctAnswer: "الإسفنج",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "اكمل المثل الكويتي: اللي ما يطيع...",
        correctAnswer: "يضيع",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هو الشيء الذي كلما طال قصر؟",
        correctAnswer: "العمر",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 14,
    name: "مسيرة لاعب",
    description: "أسئلة عن مسيرة اللاعبين في كرة القدم",
    image: "https://i.postimg.cc/Bn98ZhP9/footballplayericon.webp",
    questions: [
      {
        id: 1,
        text: "في أي نادي بدأ كريستيانو رونالدو مسيرته؟",
        correctAnswer: "سبورتنغ لشبونة",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "مع أي نادي حقق ميسي أول كرة ذهبية؟",
        correctAnswer: "برشلونة",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "كم عدد الكرات الذهبية التي حصل عليها زين الدين زيدان؟",
        correctAnswer: "1",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "في أي نادي اعتزل بيليه؟",
        correctAnswer: "نيويورك كوزموس",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "مع أي منتخب لعب جورج وياه؟",
        correctAnswer: "ليبيريا",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "في أي نادي بدأ محمد صلاح مسيرته الاحترافية؟",
        correctAnswer: "المقاولون العرب",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 15,
    name: "رقم اللعب",
    description: "أسئلة عن أرقام اللاعبين في كرة القدم",
    image: "https://i.postimg.cc/Bn98ZhP9/footballplayericon.webp",
    questions: [
      {
        id: 1,
        text: "من هو صاحب الرقم 7 الشهير في مانشستر يونايتد قبل رونالدو؟",
        correctAnswer: "ديفيد بيكهام",
        points: 300,
        image: "https://img.freepik.com/free-vector/number-7-sports-jersey-style_1017-30228.jpg",
        buttonIndex: 0
      },
      {
        id: 2,
        text: "من هو صاحب الرقم 10 في برشلونة بعد ميسي؟",
        correctAnswer: "أنسو فاتي",
        points: 300,
        image: "https://img.freepik.com/free-vector/number-10-sports-jersey-style_1017-30231.jpg",
        buttonIndex: 1
      },
      {
        id: 3,
        text: "من هو صاحب الرقم 9 الأسطوري في المنتخب البرازيلي؟",
        correctAnswer: "رونالدو",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "من هو آخر لاعب ارتدى الرقم 25 في ليفربول؟",
        correctAnswer: "بيبي ريينا",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "من هو صاحب الرقم 14 الشهير في أرسنال؟",
        correctAnswer: "تييري هنري",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "من هو صاحب الرقم 8 في ريال مدريد بعد كاكا؟",
        correctAnswer: "توني كروس",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 16,
    name: "منتجات كويتية",
    description: "أسئلة عن المنتجات والمشروبات الكويتية",
    image: "https://i.postimg.cc/rwNpVqLx/mntjat.webp",
    questions: [
      {
        id: 1,
        text: "ما هو أشهر منتج ألبان كويتي؟",
        correctAnswer: "كي دي دي",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هي أقدم شركة مياه كويتية؟",
        correctAnswer: "كاظمة",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي أشهر شركة حلويات كويتية؟",
        correctAnswer: "الأمريكانا",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هي أشهر شركة معجنات كويتية؟",
        correctAnswer: "البيت الكويتي",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هو أشهر مصنع شوكولاتة كويتي؟",
        correctAnswer: "بيت الشوكولاتة",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هي أول شركة مثلجات كويتية؟",
        correctAnswer: "الكويتية للمثلجات",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 17,
    name: "دول وعواصم",
    description: "أسئلة عن الدول وعواصمها",
    image: "https://i.postimg.cc/6qxs4Gr3/publicinfo.webp",
    questions: [
      {
        id: 1,
        text: "ما هي عاصمة المغرب؟",
        correctAnswer: "الرباط",
        points: 300,
        buttonIndex: 0
      },
      {
        id: 2,
        text: "ما هي عاصمة عمان؟",
        correctAnswer: "مسقط",
        points: 300,
        buttonIndex: 1
      },
      {
        id: 3,
        text: "ما هي عاصمة البحرين؟",
        correctAnswer: "المنامة",
        points: 500,
        buttonIndex: 2
      },
      {
        id: 4,
        text: "ما هي عاصمة السودان؟",
        correctAnswer: "الخرطوم",
        points: 500,
        buttonIndex: 3
      },
      {
        id: 5,
        text: "ما هي عاصمة موريتانيا؟",
        correctAnswer: "نواكشوط",
        points: 700,
        buttonIndex: 4
      },
      {
        id: 6,
        text: "ما هي عاصمة جيبوتي؟",
        correctAnswer: "جيبوتي",
        points: 700,
        buttonIndex: 5
      }
    ]
  },
  {
    id: 10,
    name: "مسيرة لاعب",
    description: "أسئلة عن مسيرة اللاعبين في كرة القدم",
    image: "https://i.postimg.cc/Bn98ZhP9/footballplayericon.webp",
    questions: []
  },
  {
    id: 11,
    name: "رقم اللعب",
    description: "أسئلة عن أرقام اللاعبين في كرة القدم",
    image: "https://i.postimg.cc/Bn98ZhP9/footballplayericon.webp",
    questions: []
  },
  {
    id: 12,
    name: "سيارات",
    description: "أسئلة عن السيارات والشركات المصنعة",
    image: "https://i.postimg.cc/ZY6n78Dw/caricon.webp",
    questions: []
  },
  {
    id: 13,
    name: "امثلة والغاز",
    description: "أسئلة عن الأمثال الشعبية والغاز",
    image: "https://i.postimg.cc/VL61vFsN/l8z.webp",
    questions: []
  },
  {
    id: 14,
    name: "الدوري الكويتي",
    description: "أسئلة عن الدوري الكويتي لكرة القدم",
    image: "https://i.postimg.cc/htZXhjRk/qadisa.webp",
    questions: []
  },
  {
    id: 15,
    name: "شعارات كروية",
    description: "أسئلة عن شعارات الأندية الكروية",
    image: "https://i.postimg.cc/gkJJYC2T/footballclub.webp",
    questions: []
  },
  {
    id: 16,
    name: "العاب الفيديو",
    description: "أسئلة عن ألعاب الفيديو وأبطالها",
    image: "https://i.postimg.cc/TP9M5Pkq/vgamesicon.webp",
    questions: []
  },
  {
    id: 17,
    name: "كرة قدم عالمية",
    description: "أسئلة عن كرة القدم العالمية",
    image: "https://i.postimg.cc/15ZkB6Lc/interfootball.webp",
    questions: []
  },
  {
    id: 18,
    name: "كأس الخليج",
    description: "أسئلة عن كأس الخليج لكرة القدم",
    image: "https://i.postimg.cc/rwXWMzcQ/gulfcup.webp",
    questions: []
  },
  {
    id: 19,
    name: "أعلام دول",
    description: "أسئلة عن أعلام الدول",
    image: "https://i.postimg.cc/5tZ70WJq/flagicon.webp",
    questions: []
  },
  {
    id: 20,
    name: "فورتنايت",
    description: "أسئلة عن لعبة فورتنايت",
    image: "https://i.postimg.cc/KvdVb7Rw/fortnite.webp",
    questions: []
  },
  {
    id: 21,
    name: "فيفا 25",
    description: "أسئلة عن لعبة فيفا 25",
    image: "https://i.postimg.cc/MpQCfPCz/fifa25.webp",
    questions: []
  },
  {
    id: 22,
    name: "باب الحارة",
    description: "أسئلة عن مسلسل باب الحارة",
    image: "https://i.postimg.cc/bJ9xj7wv/bab7arah.webp",
    questions: []
  },
  {
    id: 23,
    name: "ميك اب",
    description: "أسئلة عن عالم المكياج ومستحضرات التجميل",
    image: "https://i.postimg.cc/jqFVf2Tt/makeup.webp",
    questions: []
  },
  {
    id: 24,
    name: "مبتعثين امريكا",
    description: "أسئلة عن الدراسة والحياة في الولايات المتحدة",
    image: "https://i.postimg.cc/pXJ6Zdbm/usdkwt.webp",
    questions: []
  },
  {
    id: 25,
    name: "مبتعثين بريطانيا",
    description: "أسئلة عن الدراسة والحياة في المملكة المتحدة",
    image: "https://i.postimg.cc/JzmtfP2T/ukkwt.webp",
    questions: []
  },
  {
    id: 26,
    name: "السعودية",
    description: "أسئلة عن المملكة العربية السعودية وتاريخها",
    image: "https://i.postimg.cc/VNJwptmG/ksa.webp",
    questions: []
  },
  {
    id: 27,
    name: "قطر",
    description: "أسئلة عن دولة قطر",
    image: "https://i.postimg.cc/T29sjwXp/qtr.webp",
    questions: []
  },
  {
    id: 28,
    name: "أهل البر",
    description: "أسئلة عن التخييم في البر",
    image: "https://i.postimg.cc/NFz7NZ4P/brcamp.webp",
    questions: []
  },
  {
    id: 29,
    name: "بنات وبس",
    description: "أسئلة متنوعة تهم البنات في مختلف المجالات",
    image: "https://i.postimg.cc/fbs0CHMj/girls.webp",
    questions: []
  },
  {
    id: 30,
    name: "أغاني",
    description: "أسئلة عن الأغاني والفنانين وتاريخ الموسيقى",
    image: "https://i.postimg.cc/h4d884QV/psongs.webp",
    questions: []
  }
];
