export const allCategories = [
  {
    id: 1,
    name: 'الكويت',
    icon: 'https://api.iconify.design/flag:kw-4x3.svg',
    image: 'https://images.unsplash.com/photo-1577717707588-58e57e217e5f?w=800&q=80',
    questions: [
      {
        id: 'kuwait-1',
        text: 'متى استقلت دولة الكويت؟',
        points: 200,
        options: ['1961', '1962', '1963', '1965'],
        correctAnswer: 0
      },
      {
        id: 'kuwait-2',
        text: 'من هو أول أمير للكويت؟',
        points: 200,
        options: ['صباح الأول', 'عبدالله الأول', 'جابر الأول', 'سالم الأول'],
        correctAnswer: 0
      },
      {
        id: 'kuwait-3',
        text: 'كم يبلغ عدد المحافظات في الكويت؟',
        points: 400,
        options: ['4', '5', '6', '7'],
        correctAnswer: 2
      },
      {
        id: 'kuwait-4',
        text: 'في أي عام تم افتتاح أبراج الكويت؟',
        points: 400,
        options: ['1975', '1977', '1979', '1981'],
        correctAnswer: 2
      },
      {
        id: 'kuwait-5',
        text: 'ما هو الاسم القديم لجزيرة فيلكا؟',
        points: 600,
        options: ['إيكاروس', 'ديلمون', 'تايلوس', 'أرادوس'],
        correctAnswer: 0
      },
      {
        id: 'kuwait-6',
        text: 'متى تم افتتاح المسجد الكبير؟',
        points: 600,
        options: ['1986', '1988', '1990', '1992'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    name: 'مجلس الأمة',
    icon: 'https://api.iconify.design/material-symbols:gavel.svg',
    image: 'https://images.unsplash.com/photo-1453945619913-79ec89a82465?w=800&q=80',
    questions: [
      {
        id: 'parliament-1',
        text: 'متى تأسس مجلس الأمة الكويتي؟',
        points: 200,
        options: ['1961', '1962', '1963', '1964'],
        correctAnswer: 1
      },
      {
        id: 'parliament-2',
        text: 'كم عدد أعضاء مجلس الأمة؟',
        points: 200,
        options: ['40', '45', '50', '55'],
        correctAnswer: 2
      },
      {
        id: 'parliament-3',
        text: 'كم مدة الفصل التشريعي؟',
        points: 400,
        options: ['3 سنوات', '4 سنوات', '5 سنوات', '6 سنوات'],
        correctAnswer: 1
      },
      {
        id: 'parliament-4',
        text: 'في أي سنة تم منح المرأة الكويتية حق الترشح والانتخاب؟',
        points: 400,
        options: ['2003', '2004', '2005', '2006'],
        correctAnswer: 2
      },
      {
        id: 'parliament-5',
        text: 'كم عدد الدوائر الانتخابية في الكويت؟',
        points: 600,
        options: ['3', '4', '5', '6'],
        correctAnswer: 2
      },
      {
        id: 'parliament-6',
        text: 'متى عقدت أول جلسة لمجلس الأمة؟',
        points: 600,
        options: ['يناير 1963', 'يناير 1964', 'يناير 1965', 'يناير 1966'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 3,
    name: 'إسلامي',
    icon: 'https://api.iconify.design/mdi:mosque.svg',
    image: 'https://images.unsplash.com/photo-1564769625392-651b89c75a5e?w=800&q=80',
    questions: [
      {
        id: 'islamic-1',
        text: 'كم عدد أركان الإسلام؟',
        points: 200,
        options: ['3', '4', '5', '6'],
        correctAnswer: 2
      },
      {
        id: 'islamic-2',
        text: 'من هو أول من أسلم من الرجال؟',
        points: 200,
        options: ['أبو بكر', 'علي', 'عثمان', 'عمر'],
        correctAnswer: 1
      },
      {
        id: 'islamic-3',
        text: 'كم عدد السور المكية في القرآن الكريم؟',
        points: 400,
        options: ['86', '87', '88', '89'],
        correctAnswer: 0
      },
      {
        id: 'islamic-4',
        text: 'في أي غزوة نزل الملائكة؟',
        points: 400,
        options: ['أحد', 'بدر', 'حنين', 'الخندق'],
        correctAnswer: 1
      },
      {
        id: 'islamic-5',
        text: 'كم عدد الصحابة الذين شهدوا بيعة العقبة الثانية؟',
        points: 600,
        options: ['70', '73', '75', '77'],
        correctAnswer: 1
      },
      {
        id: 'islamic-6',
        text: 'ما هي أول سورة نزلت كاملة؟',
        points: 600,
        options: ['الفاتحة', 'المدثر', 'المسد', 'الكوثر'],
        correctAnswer: 0
      }
    ]
  },
  // Continue with more categories...
  {
    id: 15,
    name: 'Prison Break',
    icon: 'https://api.iconify.design/mdi:prison.svg',
    image: 'https://images.unsplash.com/photo-1584650589355-e891bacc1ecd?w=800&q=80',
    questions: [
      {
        id: 'pb-1',
        text: 'ما اسم السجن الذي سجن فيه مايكل سكوفيلد؟',
        points: 200,
        options: ['Fox River', 'Sona', 'Ogygia', 'Miami-Dade'],
        correctAnswer: 0
      },
      {
        id: 'pb-2',
        text: 'ما هو رقم زنزانة مايكل سكوفيلد؟',
        points: 200,
        options: ['40', '42', '44', '46'],
        correctAnswer: 0
      },
      {
        id: 'pb-3',
        text: 'ما اسم الشركة التي تورطت في قضية لينكولن بيروز؟',
        points: 400,
        options: ['The Company', 'Poseidon', '21 Void', 'Black Book'],
        correctAnswer: 0
      },
      {
        id: 'pb-4',
        text: 'ما هو اسم ابن سارة تانكريدي ومايكل سكوفيلد؟',
        points: 400,
        options: ['Mike', 'Lincoln', 'Michael', 'LJ'],
        correctAnswer: 0
      },
      {
        id: 'pb-5',
        text: 'في أي موسم ظهرت سجن سونا؟',
        points: 600,
        options: ['الأول', 'الثاني', 'الثالث', 'الرابع'],
        correctAnswer: 2
      },
      {
        id: 'pb-6',
        text: 'ما هو الوشم الذي كان يحمله مايكل سكوفيلد؟',
        points: 600,
        options: ['خريطة السجن', 'رموز المفاتيح', 'مخطط الهروب', 'كل ما سبق'],
        correctAnswer: 3
      }
    ]
  }
];